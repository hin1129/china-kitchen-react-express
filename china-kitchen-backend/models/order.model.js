// import mongoose from 'mongoose';

// const orderSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     items: [
//         {
//             dishId: String,
//             name: String,
//             riceOptions: { type: String, default: null },
//             price: Number,
//             quantity: Number
//         }
//     ],
//     total: Number,
//     createdAt: { type: Date, default: Date.now },

//     orderType: { type: String, enum: ["collection", "delivery"], required: true },
//     deliveryAddress: { type: String, default: "" },
//     deliveryPostcode: { type: String, default: "" },
//     deliveryFee: { type: Number, default: 0 },
//     subtotal: { type: Number, default: 0 }
// });

// const OrderDB = mongoose.model('Order', orderSchema);
// export default OrderDB



import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
    {
        dishId: { type: String, required: true },
        name: { type: String, required: true },
        rice: { type: String, default: null },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1, max: 50 }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            default: null
        },

        customerFullName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        customerEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 254
        },

        customerPhoneNumber: {
            type: String,
            required: true,
            trim: true,
            maxlength: 30
        },

        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: items => Array.isArray(items) && items.length > 0 && items.length <= 100,
                message: 'Invalid number of order items'
            }
        },

        subtotal: { type: Number, required: true, min: 0 },

        orderType: {
            type: String,
            enum: ['collection', 'delivery'],
            required: true
        },

        fulfilmentType: {
            type: String,
            enum: ['asap', 'scheduled'],
            required: true
        },

        requestedTime: { type: Date, default: null },

        allergyInformation: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ''
        },

        specialRequests: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ''
        },

        deliveryAddress: {
            type: String,
            trim: true,
            maxlength: 300,
            default: ''
        },

        deliveryPostcode: {
            type: String,
            trim: true,
            maxlength: 12,
            default: ''
        },

        deliveryPhoneNumber: {
            type: String,
            trim: true,
            maxlength: 30,
            default: ''
        },

        deliveryLongitude: { type: Number, default: null },
        deliveryLatitude: { type: Number, default: null },
        drivingDistanceMiles: { type: Number, min: 0, default: 0 },
        deliveryFee: { type: Number, min: 0, default: 0 },
        total: { type: Number, required: true, min: 0 },

        paymentStatus: {
            type: String,
            enum: ['not paid', 'paid'],
            default: 'not paid',
            index: true
        },

        paymentMethod: {
            type: String,
            enum: ['stripe'],
            default: 'stripe'
        },

        stripeCheckoutSessionId: { type: String, default: '', index: true },
        stripePaymentIntentId: { type: String, default: '' },

        restaurantEmailState: {
            type: String,
            enum: ['pending', 'sending', 'sent'],
            default: 'pending'
        },

        restaurantEmailSentAt: { type: Date, default: null },

        confirmationTokenHash: {
            type: String,
            required: true,
            select: false
        }
    },
    { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
