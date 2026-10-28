import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const money = value => `£${Number(value || 0).toFixed(2)}`;
const cleanLine = value => String(value || '').replace(/[\r\n]+/g, ' ').trim();

const formatRequestedTime = order => {
    if (order.fulfilmentType === 'asap') return 'AS SOON AS POSSIBLE';
    if (!order.requestedTime) return 'NOT SPECIFIED';

    return new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(new Date(order.requestedTime));
};

export const sendNewOrderEmail = async order => {
    const restaurantEmail = process.env.RESTAURANT_ORDER_EMAIL;
    if (!restaurantEmail) {
        throw new Error('RESTAURANT_ORDER_EMAIL is not configured');
    }

    const itemLines = order.items.map(item =>
        `${item.quantity} x ${cleanLine(item.name)} - ${money(item.price * item.quantity)}`
    );

    const lines = [
        'NEW PAID ONLINE ORDER',
        '',
        `Order: ${order._id}`,
        `Type: ${String(order.orderType).toUpperCase()}`,
        `Requested time: ${formatRequestedTime(order)}`,
        'Payment: PAID',
        '',
        'ITEMS',
        ...itemLines,
        '',
        `Food subtotal: ${money(order.subtotal)}`,
        `Delivery fee: ${money(order.deliveryFee)}`,
        `TOTAL: ${money(order.total)}`,
        '',
        'CUSTOMER',
        cleanLine(order.customerFullName),
        cleanLine(order.customerEmail),
        cleanLine(order.customerPhoneNumber)
    ];

    if (order.orderType === 'delivery') {
        lines.push('', 'DELIVERY ADDRESS', cleanLine(order.deliveryAddress), cleanLine(order.deliveryPostcode));
    }

    lines.push(
        '',
        '*** ALLERGY INFORMATION ***',
        cleanLine(order.allergyInformation || 'None provided'),
        '',
        'SPECIAL REQUESTS',
        cleanLine(order.specialRequests || 'None')
    );

    await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: restaurantEmail,
        subject: `NEW PAID ORDER ${order._id} - ${String(order.orderType).toUpperCase()} - ${money(order.total)}`,
        text: lines.join('\n')
    });
};
