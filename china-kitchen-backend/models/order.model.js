import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
        {
            id: String,
            name: String,
            riceOptions: { type: String, default: undefined },
            price: Number,
            quantity: Number
        }
    ],
    total: Number,
    createdAt: { type: Date, default: Date.now }
});

const OrderDB = mongoose.model('Order', orderSchema);
export default OrderDB