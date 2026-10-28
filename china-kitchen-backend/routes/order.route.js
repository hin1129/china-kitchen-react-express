import crypto from 'crypto';
import express from 'express';
import validator from 'validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';

import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import { verifyToken, optionalVerifyToken } from '../middleware/VerifyToken.js';
import { calculateServerOrder } from '../utils/orderPricing.js';
import { validateDeliveryProfile } from '../utils/profileValidation.js';
import {
    MINIMUM_DELIVERY_ORDER,
    calculateDeliveryFee,
    geocodeDeliveryAddress,
    getDrivingDistance
} from '../utils/delivery.js';
import { getOrderingInfo, validateRequestedTime } from '../utils/openingHours.js';

export const router = express.Router();

const cleanText = (value, maxLength) => {
    if (value === undefined || value === null) return '';
    if (typeof value !== 'string') {
        const error = new Error('Invalid text value');
        error.statusCode = 400;
        throw error;
    }
    return value.trim().slice(0, maxLength);
};

const buildAddress = ({ addressLine1, addressLine2, city }) =>
    [addressLine1, addressLine2, city]
        .map(value => String(value || '').trim())
        .filter(Boolean)
        .join(', ');

const isValidUKPhone = phoneNumber => {
    const phone = parsePhoneNumberFromString(String(phoneNumber || ''), 'GB');
    return Boolean(phone && phone.isValid());
};

const validateGuestContact = guestDetails => {
    if (!guestDetails || typeof guestDetails !== 'object' || Array.isArray(guestDetails)) {
        return { valid: false, message: 'Please enter your contact details' };
    }

    const fullName = cleanText(guestDetails.fullName, 100);
    const email = cleanText(guestDetails.email, 254).toLowerCase();
    const phoneNumber = cleanText(guestDetails.phoneNumber, 30);

    if (!fullName) return { valid: false, message: 'Full name is required' };
    if (!email || !validator.isEmail(email)) return { valid: false, message: 'A valid email is required' };
    if (!isValidUKPhone(phoneNumber)) return { valid: false, message: 'A valid UK phone number is required' };

    return { valid: true, fullName, email, phoneNumber };
};

const resolveDeliveryLocation = async (user, guestDetails) => {
    if (user) {
        const validation = validateDeliveryProfile(user);
        if (!validation.valid) {
            const error = new Error('Please complete your delivery details');
            error.statusCode = 400;
            error.code = 'DELIVERY_PROFILE_INVALID';
            throw error;
        }

        const address = buildAddress({
            addressLine1: user.addressLine1,
            addressLine2: user.addressLine2,
            city: user.city
        });

        let longitude = user.deliveryLongitude;
        let latitude = user.deliveryLatitude;

        if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
            const coordinates = await geocodeDeliveryAddress(address, user.postcode);
            longitude = coordinates.longitude;
            latitude = coordinates.latitude;
            user.deliveryLongitude = longitude;
            user.deliveryLatitude = latitude;
            await user.save();
        }

        return {
            address: address.slice(0, 300),
            postcode: String(user.postcode || '').trim().toUpperCase(),
            longitude,
            latitude
        };
    }

    const deliveryAddress = guestDetails?.deliveryAddress;
    if (!deliveryAddress || typeof deliveryAddress !== 'object' || Array.isArray(deliveryAddress)) {
        const error = new Error('Please select a delivery address');
        error.statusCode = 400;
        error.code = 'DELIVERY_ADDRESS_REQUIRED';
        throw error;
    }

    const addressLine1 = cleanText(deliveryAddress.addressLine1, 120);
    const addressLine2 = cleanText(deliveryAddress.addressLine2, 120);
    const city = cleanText(deliveryAddress.city, 100);
    const postcode = cleanText(deliveryAddress.postcode, 12).toUpperCase();

    if (!addressLine1 || !city || !validator.isPostalCode(postcode, 'GB')) {
        const error = new Error('Please enter a valid UK delivery address');
        error.statusCode = 400;
        error.code = 'DELIVERY_ADDRESS_REQUIRED';
        throw error;
    }

    const address = buildAddress({ addressLine1, addressLine2, city });
    const coordinates = await geocodeDeliveryAddress(address, postcode);

    return {
        address: address.slice(0, 300),
        postcode,
        longitude: coordinates.longitude,
        latitude: coordinates.latitude
    };
};

export const buildCheckoutOrder = async request => {
    const {
        items,
        orderType,
        guestDetails,
        fulfilmentType,
        requestedTime,
        allergyInformation,
        specialRequests
    } = request.body;

    if (!['collection', 'delivery'].includes(orderType)) {
        const error = new Error('Invalid order type');
        error.statusCode = 400;
        throw error;
    }

    const timeValidation = validateRequestedTime({
        orderType,
        fulfilmentType,
        requestedTime
    });

    if (!timeValidation.valid) {
        const error = new Error(timeValidation.message);
        error.statusCode = 400;
        error.code = 'INVALID_ORDER_TIME';
        throw error;
    }

    const orderData = await calculateServerOrder(items);

    let user = null;
    if (request.user?.userId) {
        user = await User.findById(request.user.userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 401;
            throw error;
        }
    }

    let customerFullName;
    let customerEmail;
    let customerPhoneNumber;

    if (user) {
        customerFullName = cleanText(user.fullName, 100);
        customerEmail = cleanText(user.email, 254).toLowerCase();
        customerPhoneNumber = cleanText(user.phoneNumber, 30);

        if (!customerFullName || !validator.isEmail(customerEmail) || !isValidUKPhone(customerPhoneNumber)) {
            const error = new Error('Please complete your contact details in your profile');
            error.statusCode = 400;
            throw error;
        }
    }
    else {
        const guest = validateGuestContact(guestDetails);
        if (!guest.valid) {
            const error = new Error(guest.message);
            error.statusCode = 400;
            throw error;
        }
        customerFullName = guest.fullName;
        customerEmail = guest.email;
        customerPhoneNumber = guest.phoneNumber;
    }

    let deliveryAddress = '';
    let deliveryPostcode = '';
    let deliveryLongitude = null;
    let deliveryLatitude = null;
    let distanceMiles = 0;
    let deliveryFee = 0;

    if (orderType === 'delivery') {
        if (orderData.subtotal < MINIMUM_DELIVERY_ORDER) {
            const error = new Error(`Minimum delivery order is £${MINIMUM_DELIVERY_ORDER}`);
            error.statusCode = 400;
            error.code = 'DELIVERY_MINIMUM';
            throw error;
        }

        const delivery = await resolveDeliveryLocation(user, guestDetails);
        deliveryAddress = delivery.address;
        deliveryPostcode = delivery.postcode;
        deliveryLongitude = delivery.longitude;
        deliveryLatitude = delivery.latitude;
        distanceMiles = await getDrivingDistance(deliveryLongitude, deliveryLatitude);
        deliveryFee = calculateDeliveryFee(distanceMiles);
    }

    const total = Number((orderData.subtotal + deliveryFee).toFixed(2));

    const rawConfirmationToken = crypto.randomBytes(32).toString('hex');
    const confirmationTokenHash = crypto
        .createHash('sha256')
        .update(rawConfirmationToken)
        .digest('hex');

    return {
        orderDocument: {
            userId: user ? user._id : null,
            customerFullName,
            customerEmail,
            customerPhoneNumber,
            items: orderData.items,
            subtotal: orderData.subtotal,
            orderType,
            fulfilmentType,
            requestedTime: timeValidation.requestedTime,
            allergyInformation: cleanText(allergyInformation, 500),
            specialRequests: cleanText(specialRequests, 500),
            deliveryAddress,
            deliveryPostcode,
            deliveryPhoneNumber: orderType === 'delivery' ? customerPhoneNumber : '',
            deliveryLongitude,
            deliveryLatitude,
            drivingDistanceMiles: distanceMiles,
            deliveryFee,
            total,
            paymentStatus: 'not paid',
            paymentMethod: 'stripe',
            confirmationTokenHash
        },
        rawConfirmationToken
    };
};

router.get('/ordering-info', (request, response) => {
    const { orderType } = request.query;
    if (!['collection', 'delivery'].includes(orderType)) {
        return response.status(400).json({ message: 'Invalid order type' });
    }
    return response.json(getOrderingInfo(orderType));
});

router.post('/delivery/quote', optionalVerifyToken, async (request, response) => {
    try {
        const orderData = await calculateServerOrder(request.body.items);

        if (orderData.subtotal < MINIMUM_DELIVERY_ORDER) {
            return response.status(400).json({
                message: `Minimum delivery order is £${MINIMUM_DELIVERY_ORDER}`,
                code: 'DELIVERY_MINIMUM',
                amountNeeded: Number((MINIMUM_DELIVERY_ORDER - orderData.subtotal).toFixed(2))
            });
        }

        let user = null;
        if (request.user?.userId) user = await User.findById(request.user.userId);

        const delivery = await resolveDeliveryLocation(user, request.body.guestDetails);
        const distanceMiles = await getDrivingDistance(delivery.longitude, delivery.latitude);
        const deliveryFee = calculateDeliveryFee(distanceMiles);

        return response.json({
            subtotal: orderData.subtotal,
            distanceMiles,
            deliveryFee,
            total: Number((orderData.subtotal + deliveryFee).toFixed(2)),
            address: delivery.address,
            postcode: delivery.postcode
        });
    }
    catch (error) {
        console.error('Delivery quote error:', error.message);
        return response.status(error.statusCode || 500).json({
            message: error.message || 'Failed to calculate delivery',
            code: error.code
        });
    }
});

router.get('/orders/my', verifyToken, async (request, response) => {
    try {
        const orders = await Order.find({
            userId: request.user.userId,
            paymentStatus: 'paid'
        }).sort({ createdAt: -1 });

        return response.json({ orders });
    }
    catch (error) {
        console.error('Get my orders error:', error.message);
        return response.status(500).json({ message: 'Failed to retrieve orders' });
    }
});

router.get('/orders/:id', verifyToken, async (request, response) => {
    if (!validator.isMongoId(request.params.id)) {
        return response.status(404).json({ message: 'Order not found' });
    }

    try {
        const order = await Order.findOne({
            _id: request.params.id,
            userId: request.user.userId,
            paymentStatus: 'paid'
        });

        if (!order) return response.status(404).json({ message: 'Order not found' });
        return response.json({ order });
    }
    catch (error) {
        console.error('Get order error:', error.message);
        return response.status(500).json({ message: 'Failed to retrieve order' });
    }
});

export default router;
