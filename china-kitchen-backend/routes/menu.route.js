import express from 'express'
export const router = express.Router()
import Menu from '../models/menu.model.js'

router.get(`/takeaway`, async (request, response) => {
    try {
        const menu = await Menu.findOne();
        if (!menu) {
            return response.status(404).json({ message: 'Menu not found' });
        }
        return response.status(200).json(menu);
    }
    catch (error) {
        console.error('Load menu error:', error);
        return response.status(500).json({ message: 'Failed to load menu' });
    }
})