import crypto from "crypto";
import express from "express";
import Stripe from "stripe";
import validator from "validator";

import Order from "../models/order.model.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { buildCheckoutOrder } from "./order.route.js";
import { sendNewOrderEmail } from "../utils/sendNewOrderEmail.js";
import { sendCustomerOrderEmail } from "../utils/sendCustomerOrderEmail.js";
import {
  sendCustomerRefundEmail,
  sendRestaurantRefundEmail,
} from "../utils/sendRefundEmail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const router = express.Router();

const frontendUrl = () => process.env.FRONTEND_URL || "http://localhost:3000";
const hashToken = (token) =>
  crypto
    .createHash("sha256")
    .update(String(token || ""))
    .digest("hex");

const safeCompare = (left, right) => {
  const a = Buffer.from(String(left || ""), "utf8");
  const b = Buffer.from(String(right || ""), "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
};

const getOrderWithToken = async (orderId, rawToken) => {
  if (
    !validator.isMongoId(orderId) ||
    typeof rawToken !== "string" ||
    rawToken.length !== 64
  ) {
    return null;
  }

  const order = await Order.findById(orderId).select("+confirmationTokenHash");
  if (!order) return null;

  const suppliedHash = hashToken(rawToken);
  if (!safeCompare(suppliedHash, order.confirmationTokenHash)) return null;

  return order;
};

const createStripeSession = async (order, rawConfirmationToken) => {
  const successUrl = new URL(`/order-confirmation/${order._id}`, frontendUrl());
  successUrl.searchParams.set("token", rawConfirmationToken);

  const cancelUrl = new URL("/payment-cancelled", frontendUrl());
  cancelUrl.searchParams.set("orderId", order._id.toString());
  cancelUrl.searchParams.set("token", rawConfirmationToken);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: order.customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "gbp",
          unit_amount: Math.round(order.total * 100),
          product_data: {
            name: `China Kitchen order ${order._id}`,
          },
        },
      },
    ],
    metadata: {
      orderId: order._id.toString(),
    },
    payment_intent_data: {
      metadata: {
        orderId: order._id.toString(),
      },
    },
    success_url: successUrl.toString(),
    cancel_url: cancelUrl.toString(),
  });

  order.stripeCheckoutSessionId = session.id;
  await order.save();
  return session;
};

router.post("/checkout/session", verifyToken, async (request, response) => {
  try {
    const { orderDocument, rawConfirmationToken } =
      await buildCheckoutOrder(request);
    const order = await Order.create(orderDocument);

    try {
      const session = await createStripeSession(order, rawConfirmationToken);
      return response.status(201).json({ checkoutUrl: session.url });
    } catch (stripeError) {
      await Order.findByIdAndDelete(order._id);
      throw stripeError;
    }
  } catch (error) {
    console.error("Create checkout session error:", error.message);
    return response.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Unable to start payment",
      code: error.code,
    });
  }
});

router.post("/checkout/retry", async (request, response) => {
  try {
    const { orderId, token } = request.body;
    const order = await getOrderWithToken(orderId, token);

    if (!order || order.paymentStatus !== "not paid") {
      return response
        .status(404)
        .json({ message: "Order is not available for payment" });
    }

    const session = await createStripeSession(order, token);
    return response.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Retry payment error:", error.message);
    return response.status(500).json({ message: "Unable to restart payment" });
  }
});

router.get("/orders/public/:id", async (request, response) => {
  try {
    const order = await getOrderWithToken(
      request.params.id,
      request.query.token,
    );

    if (!order || order.paymentStatus !== "paid") {
      return response.status(404).json({ message: "Paid order not found" });
    }

    order.confirmationTokenHash = undefined;
    return response.json({ order });
  } catch (error) {
    console.error("Public order confirmation error:", error.message);
    return response
      .status(500)
      .json({ message: "Unable to load order confirmation" });
  }
});

const sendRefundNotifications = async (orderId) => {
  const order = await Order.findById(orderId);

  if (
    !order ||
    order.refundedAmount <= 0 ||
    !["partial", "full"].includes(order.refundStatus)
  ) {
    return;
  }

  const restaurantClaimed = await Order.findOneAndUpdate(
    {
      _id: order._id,
      restaurantRefundEmailState: "pending",
    },
    {
      $set: {
        restaurantRefundEmailState: "sending",
      },
    },
    { new: true },
  );

  if (restaurantClaimed) {
    try {
      await sendRestaurantRefundEmail(restaurantClaimed);

      await Order.findByIdAndUpdate(restaurantClaimed._id, {
        $set: {
          restaurantRefundEmailState: "sent",
          restaurantRefundEmailSentAt: new Date(),
        },
      });
    } catch (emailError) {
      console.error("Restaurant refund email failed:", emailError.message);

      await Order.findByIdAndUpdate(restaurantClaimed._id, {
        $set: {
          restaurantRefundEmailState: "pending",
        },
      });
    }
  }

  const customerClaimed = await Order.findOneAndUpdate(
    {
      _id: order._id,
      customerRefundEmailState: "pending",
    },
    {
      $set: {
        customerRefundEmailState: "sending",
      },
    },
    { new: true },
  );

  if (customerClaimed) {
    try {
      await sendCustomerRefundEmail(customerClaimed);

      await Order.findByIdAndUpdate(customerClaimed._id, {
        $set: {
          customerRefundEmailState: "sent",
          customerRefundEmailSentAt: new Date(),
        },
      });
    } catch (emailError) {
      console.error("Customer refund email failed:", emailError.message);

      await Order.findByIdAndUpdate(customerClaimed._id, {
        $set: {
          customerRefundEmailState: "pending",
        },
      });
    }
  }
};

const updateRefundAndNotify = async ({
  paymentIntentId,
  amountRefunded,
  refundId,
}) => {
  if (!paymentIntentId) return;

  const order = await Order.findOne({
    stripePaymentIntentId: paymentIntentId,
    paymentStatus: "paid",
  });

  if (!order) {
    console.error(
      `Refund webhook could not find order for PaymentIntent ${paymentIntentId}`,
    );
    return;
  }

  const refundedAmount = Number((Number(amountRefunded || 0) / 100).toFixed(2));

  const totalPaid = Number(order.total || 0);

  const refundStatus =
    refundedAmount <= 0
      ? "none"
      : refundedAmount >= totalPaid
        ? "full"
        : "partial";

  const previousNotificationAmount = Number(
    order.refundNotificationAmount || 0,
  );

  order.refundStatus = refundStatus;

  order.refundedAmount = refundedAmount;

  order.refundedAt = refundedAmount > 0 ? new Date() : null;

  if (refundId) {
    order.stripeRefundId = refundId;
  }

  // A later partial refund can increase the cumulative refunded amount.
  // Reset the two notification states only when there is a new amount
  // that has not already been notified.
  if (refundedAmount > previousNotificationAmount) {
    order.refundNotificationAmount = refundedAmount;

    order.restaurantRefundEmailState = "pending";

    order.restaurantRefundEmailSentAt = null;

    order.customerRefundEmailState = "pending";

    order.customerRefundEmailSentAt = null;
  }

  await order.save();

  console.log(
    `Refund synced for order ${order._id}: ${refundStatus} £${refundedAmount.toFixed(2)}`,
  );

  if (refundedAmount > previousNotificationAmount) {
    await sendRefundNotifications(order._id);
  }
};

export const stripeWebhookHandler = async (request, response) => {
  const signature = request.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Stripe webhook signature failed:", error.message);
    return response.status(400).send("Invalid webhook signature");
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      if (session.payment_status === "paid") {
        const orderId = session.metadata?.orderId;

        if (validator.isMongoId(orderId)) {
          let order = await Order.findOneAndUpdate(
            {
              _id: orderId,
              paymentStatus: "not paid",
            },
            {
              $set: {
                paymentStatus: "paid",
                stripeCheckoutSessionId: session.id,
                stripePaymentIntentId: String(session.payment_intent || ""),
              },
            },
            { new: true },
          );

          if (!order) order = await Order.findById(orderId);

          if (order && order.paymentStatus === "paid") {
            const claimed = await Order.findOneAndUpdate(
              {
                _id: order._id,
                restaurantEmailState: "pending",
              },
              {
                $set: {
                  restaurantEmailState: "sending",
                },
              },
              { new: true },
            );

            if (claimed) {
              try {
                await sendNewOrderEmail(claimed);
                await Order.findByIdAndUpdate(claimed._id, {
                  $set: {
                    restaurantEmailState: "sent",
                    restaurantEmailSentAt: new Date(),
                  },
                });
              } catch (emailError) {
                console.error(
                  "Restaurant order email failed:",
                  emailError.message,
                );
                await Order.findByIdAndUpdate(claimed._id, {
                  $set: {
                    restaurantEmailState: "pending",
                  },
                });
              }
            }

            const customerClaimed = await Order.findOneAndUpdate(
              {
                _id: order._id,
                customerEmailState: "pending",
              },
              {
                $set: {
                  customerEmailState: "sending",
                },
              },
              { new: true },
            );

            if (customerClaimed) {
              try {
                await sendCustomerOrderEmail(customerClaimed);
                await Order.findByIdAndUpdate(customerClaimed._id, {
                  $set: {
                    customerEmailState: "sent",
                    customerEmailSentAt: new Date(),
                  },
                });
              } catch (emailError) {
                console.error(
                  "Customer order email failed:",
                  emailError.message,
                );
                await Order.findByIdAndUpdate(customerClaimed._id, {
                  $set: {
                    customerEmailState: "pending",
                  },
                });
              }
            }
          }
        }
      }
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object;

      const paymentIntentId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;

      const refunds = charge.refunds?.data || [];

      const latestRefund =
        refunds.length > 0 ? refunds[refunds.length - 1] : null;

      await updateRefundAndNotify({
        paymentIntentId,
        amountRefunded: charge.amount_refunded,
        refundId: latestRefund?.id || "",
      });
    }

    if (event.type === "refund.created" || event.type === "refund.updated") {
      const refund = event.data.object;

      const paymentIntentId =
        typeof refund.payment_intent === "string"
          ? refund.payment_intent
          : refund.payment_intent?.id;

      if (paymentIntentId) {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId,
          {
            expand: ["latest_charge.refunds"],
          },
        );

        const charge = paymentIntent.latest_charge;

        if (charge && typeof charge !== "string") {
          await updateRefundAndNotify({
            paymentIntentId,
            amountRefunded: charge.amount_refunded,
            refundId: refund.id || "",
          });
        }
      }
    }

    // For failed, expired or cancelled Checkout sessions we intentionally do nothing.
    // The order remains "not paid".
    return response.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing error:", error.message);
    return response.status(500).json({ received: false });
  }
};

export default router;
