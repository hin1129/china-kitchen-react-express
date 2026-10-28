import express from 'express';
import Order from '../models/order.model.js';
import Menu from '../models/menu.model.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { requireAdmin } from '../middleware/RequireAdmin.js';

export const router = express.Router();

router.get('/admin/orders', verifyToken, requireAdmin, async (request, response) => {
    try {
        const orders = await Order.find({ paymentStatus: 'paid' })
            .populate('userId', 'fullName username email phoneNumber')
            .sort({ createdAt: -1 });

        return response.json(orders);
    }
    catch (error) {
        console.error('Admin orders error:', error.message);
        return response.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// No admin route is allowed to mark payment as paid.
// Stripe webhook is the only authority for paymentStatus.

router.put('/admin/menu/:itemId/stock', verifyToken, requireAdmin, async (request, response) => {
    try {
        const { inStock } = request.body;
        if (typeof inStock !== 'boolean') {
            return response.status(400).json({ message: 'inStock must be true or false' });
        }

        const itemId = String(request.params.itemId);
        if (itemId.length > 100) {
            return response.status(400).json({ message: 'Invalid menu item' });
        }

        const menu = await Menu.findOne();
        if (!menu) return response.status(404).json({ message: 'Menu not found' });

        let foundItem = null;

        for (const category of menu.categories || []) {
            const item = category.items?.find(dish => String(dish.id) === itemId);
            if (item) {
                item.inStock = inStock;
                foundItem = item;
                break;
            }
        }

        if (!foundItem) {
            foundItem = menu.setMeals?.find(dish => String(dish.id) === itemId);
            if (foundItem) foundItem.inStock = inStock;
        }

        if (!foundItem) {
            foundItem = menu.mixAndMatch?.find(dish => String(dish.id) === itemId);
            if (foundItem) foundItem.inStock = inStock;
        }

        if (!foundItem) return response.status(404).json({ message: 'Menu item not found' });

        await menu.save();
        return response.json({ message: 'Stock updated', item: foundItem });
    }
    catch (error) {
        console.error('Admin stock update error:', error.message);
        return response.status(500).json({ message: 'Failed to update stock' });
    }
});

export default router;
