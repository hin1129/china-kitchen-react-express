import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const money = value => `£${Number(value || 0).toFixed(2)}`;

const cleanLine = value =>
    String(value || '')
        .replace(/[\r\n]+/g, ' ')
        .trim();

const refundDescription = order =>
    order.refundStatus === 'full'
        ? 'FULL REFUND'
        : 'PARTIAL REFUND';

const buildRefundLines = order => [
    refundDescription(order),
    '',
    `Order: ${order._id}`,
    `Customer: ${cleanLine(order.customerFullName)}`,
    `Original order total: ${money(order.total)}`,
    `Total refunded: ${money(order.refundedAmount)}`,
    `Refund status: ${String(order.refundStatus).toUpperCase()}`,
    '',
    'The refund has been recorded against this order.'
];

export const sendCustomerRefundEmail = async order => {
    await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: order.customerEmail,
        subject: `China Kitchen refund - order ${order._id} - ${money(order.refundedAmount)}`,
        text: [
            `Hi ${cleanLine(order.customerFullName)},`,
            '',
            'Your refund has been processed.',
            '',
            ...buildRefundLines(order),
            '',
            'Depending on your bank, it may take some time for the refund to appear on your account.',
            '',
            'China Kitchen'
        ].join('\n')
    });
};

export const sendRestaurantRefundEmail = async order => {
    const restaurantEmail = process.env.RESTAURANT_ORDER_EMAIL;

    if (!restaurantEmail) {
        throw new Error('RESTAURANT_ORDER_EMAIL is not configured');
    }

    await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: restaurantEmail,
        subject: `REFUND ${order._id} - ${String(order.refundStatus).toUpperCase()} - ${money(order.refundedAmount)}`,
        text: [
            'ORDER REFUND UPDATE',
            '',
            ...buildRefundLines(order),
            '',
            `Customer email: ${cleanLine(order.customerEmail)}`,
            `Customer phone: ${cleanLine(order.customerPhoneNumber)}`
        ].join('\n')
    });
};
