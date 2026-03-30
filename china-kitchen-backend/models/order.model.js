import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
        {
            dishId: String,
            name: String,
            riceOptions: { type: String, default: null },
            price: Number,
            quantity: Number
        }
    ],
    total: Number,
    createdAt: { type: Date, default: Date.now },

    orderType: { type: String, enum: ["collection", "delivery"], required: true },
    deliveryAddress: { type: String, default: "" },
    deliveryPostcode: { type: String, default: "" },
    deliveryFee: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 }
});

const OrderDB = mongoose.model('Order', orderSchema);
export default OrderDB