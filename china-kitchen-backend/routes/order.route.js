import express from 'express'
export const router = express.Router()
import Order from '../models/order.model.js'
import { verifyToken } from '../middleware/VerifyToken.js';
import User from '../models/user.model.js';

const allowedDeliveryPostcodePrefixes = ["BN1", "BN2", "BN3"]

const isDeliverablePostcode = (postcode) => {
    if (!postcode) { return false }
    const cleanPostcode = postcode.trim().toUpperCase()

    return (allowedDeliveryPostcodePrefixes.some((prefix) => cleanPostcode.startsWith(prefix)))
}

router.post('/order', verifyToken, async (request, response) => {
    console.log("🔹 /order hit");
    console.log("Headers:", request.headers.authorization);
    console.log("Body:", request.body);

    try {
        const { items, subtotal, orderType } = request.body;

        // basic validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return response.status(400).json({ message: 'No items in order' });
        }

        if (!orderType || !['collection', 'delivery'].includes(orderType)) {
            return response.status(400).json({ message: 'Invalid order type' });
        }

        // find logged in user using token payload
        const user = await User.findById(request.user.userId);

        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        let deliveryFee = 0;
        let deliveryAddress = '';
        let deliveryPostcode = '';

        if (orderType === 'delivery') {
            if (!user.address || !user.postcode) {
                return response.status(400).json({
                    message: 'Delivery requires address and postcode in profile'
                });
            }

            if (!isDeliverablePostcode(user.postcode)) {
                return response.status(400).json({
                    message: 'Delivery is not available for this postcode'
                });
            }

            deliveryFee = 2.5;
            deliveryAddress = user.address;
            deliveryPostcode = user.postcode;
        }

        const safeSubtotal = Number(subtotal);
        const total = Number((safeSubtotal + deliveryFee).toFixed(2));

        const newOrder = new Order({
            userId: request.user.userId,
            items,
            subtotal: safeSubtotal,
            orderType,
            deliveryAddress,
            deliveryPostcode,
            deliveryFee,
            total
        });

        await newOrder.save();

        response.status(201).json({
            message: 'Order submitted successfully',
            order: newOrder
        });
    }
    catch (error) {
        console.error('Order failed:', error);
        response.status(500).json({ error: 'Order submission failed' });
    }
});