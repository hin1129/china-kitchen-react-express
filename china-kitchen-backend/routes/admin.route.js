import express from "express";
import Order from "../models/order.model.js";
import Menu from "../models/menu.model.js";
import AdminAuditLog from "../models/adminAuditLog.model.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { requireAdmin } from "../middleware/RequireAdmin.js";

export const router = express.Router();

const findMenuItem = (menu, itemId) => {
  for (const category of menu.categories || []) {
    const item = category.items?.find((dish) => String(dish.id) === itemId);
    if (item) return item;
  }

  const setMeal = menu.setMeals?.find((dish) => String(dish.id) === itemId);
  if (setMeal) return setMeal;

  return menu.mixAndMatch?.find((dish) => String(dish.id) === itemId) || null;
};

const getItemId = (request, response) => {
  const itemId = String(request.params.itemId || "").trim();
  if (!itemId || itemId.length > 100) {
    response.status(400).json({ message: "Invalid menu item" });
    return null;
  }
  return itemId;
};

router.get(
  "/admin/orders",
  verifyToken,
  requireAdmin,
  async (request, response) => {
    try {
      const orders = await Order.find({ paymentStatus: "paid" })
        .populate("userId", "fullName username email phoneNumber")
        .sort({ createdAt: -1 });

      return response.json(orders);
    } catch (error) {
      console.error("Admin orders error:", error.message);
      return response.status(500).json({ message: "Failed to fetch orders" });
    }
  },
);

// No admin route is allowed to mark payment as paid.
// Stripe webhook is the only authority for paymentStatus.

router.put(
  "/admin/menu/:itemId/stock",
  verifyToken,
  requireAdmin,
  async (request, response) => {
    try {
      const allowedFields = Object.keys(request.body || {});
      if (allowedFields.length !== 1 || allowedFields[0] !== "inStock") {
        return response
          .status(400)
          .json({ message: "Only inStock can be updated" });
      }

      const { inStock } = request.body;
      if (typeof inStock !== "boolean") {
        return response
          .status(400)
          .json({ message: "inStock must be true or false" });
      }

      const itemId = getItemId(request, response);
      if (!itemId) return;

      const menu = await Menu.findOne();
      if (!menu)
        return response.status(404).json({ message: "Menu not found" });

      const foundItem = findMenuItem(menu, itemId);
      if (!foundItem)
        return response.status(404).json({ message: "Menu item not found" });

      const oldValue = foundItem.inStock;
      if (oldValue === inStock) {
        return response.json({
          message: "Stock is already up to date",
          item: foundItem,
        });
      }

      foundItem.inStock = inStock;
      await menu.save();

      try {
        await AdminAuditLog.create({
          adminUserId: request.currentUser._id,
          action: "MENU_STOCK_CHANGED",
          itemId: String(foundItem.id),
          itemName: foundItem.name,
          oldValue,
          newValue: inStock,
        });
      } catch (auditError) {
        console.error("Admin audit log error:", auditError.message);
      }

      return response.json({ message: "Stock updated", item: foundItem });
    } catch (error) {
      console.error("Admin stock update error:", error.message);
      return response.status(500).json({ message: "Failed to update stock" });
    }
  },
);

router.put(
  "/admin/menu/:itemId/price",
  verifyToken,
  requireAdmin,
  async (request, response) => {
    try {
      const allowedFields = Object.keys(request.body || {});
      if (allowedFields.length !== 1 || allowedFields[0] !== "price") {
        return response
          .status(400)
          .json({ message: "Only price can be updated" });
      }

      const { price } = request.body;
      if (
        typeof price !== "number" ||
        !Number.isFinite(price) ||
        price <= 0 ||
        price > 500
      ) {
        return response.status(400).json({
          message:
            "Price must be a number greater than £0 and no more than £500",
        });
      }

      const roundedPrice = Math.round(price * 100) / 100;
      const itemId = getItemId(request, response);
      if (!itemId) return;

      const menu = await Menu.findOne();
      if (!menu)
        return response.status(404).json({ message: "Menu not found" });

      const foundItem = findMenuItem(menu, itemId);
      if (!foundItem)
        return response.status(404).json({ message: "Menu item not found" });

      const oldValue = Number(foundItem.price);
      if (oldValue === roundedPrice) {
        return response.json({
          message: "Price is already up to date",
          item: foundItem,
        });
      }

      foundItem.price = roundedPrice;
      await menu.save();

      try {
        await AdminAuditLog.create({
          adminUserId: request.currentUser._id,
          action: "MENU_PRICE_CHANGED",
          itemId: String(foundItem.id),
          itemName: foundItem.name,
          oldValue,
          newValue: roundedPrice,
        });
      } catch (auditError) {
        console.error("Admin audit log error:", auditError.message);
      }

      return response.json({ message: "Price updated", item: foundItem });
    } catch (error) {
      console.error("Admin price update error:", error.message);
      return response.status(500).json({ message: "Failed to update price" });
    }
  },
);

export default router;
