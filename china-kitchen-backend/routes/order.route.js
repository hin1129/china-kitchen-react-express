import express from 'express'
export const router = express.Router()
import Order from '../models/order.model.js'
import { verifyToken } from '../middleware/VerifyToken.js';

router.post('/order', verifyToken, async (request, response) => {
    console.log("🔹 /order hit");
    console.log("Headers:", request.headers.authorization);
    console.log("Body:", request.body);

    try {
        const { items, total } = request.body;

        const newOrder = new Order({
            userId: request.user.id,
            items,
            total
        });

        await newOrder.save();
        response.status(201).json({ message: 'Order submitted successfully' });
    }
    catch (error) {
        console.error('Order failed:', error);
        response.status(500).json({ error: 'Order submission failed' });
    }
});
