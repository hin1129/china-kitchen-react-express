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
    if (order.fulfilmentType === 'asap') return 'As soon as possible';
    if (!order.requestedTime) return 'Not specified';

    return new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(new Date(order.requestedTime));
};

export const sendCustomerOrderEmail = async order => {
    const itemLines = order.items.map(item => {
        const rice = item.rice ? ` + ${cleanLine(item.rice)}` : '';
        return `${item.quantity} x ${cleanLine(item.name)}${rice} - ${money(item.price * item.quantity)}`;
    });

    const lines = [
        'CHINA KITCHEN',
        '',
        'Thank you for your order.',
        'Your payment has been received and your order is confirmed.',
        '',
        `Order: ${order._id}`,
        `Order type: ${String(order.orderType).toUpperCase()}`,
        `Requested time: ${formatRequestedTime(order)}`,
        'Payment: PAID',
        '',
        'ITEMS',
        ...itemLines,
        '',
        `Food subtotal: ${money(order.subtotal)}`
    ];

    if (order.orderType === 'delivery') {
        lines.push(`Delivery fee: ${money(order.deliveryFee)}`);
    }

    lines.push('', `TOTAL: ${money(order.total)}`);

    if (order.orderType === 'delivery') {
        lines.push(
            '',
            'DELIVERY ADDRESS',
            cleanLine(order.deliveryAddress),
            cleanLine(order.deliveryPostcode)
        );
    }

    if (order.allergyInformation) {
        lines.push(
            '',
            'ALLERGY INFORMATION',
            cleanLine(order.allergyInformation)
        );
    }

    if (order.specialRequests) {
        lines.push(
            '',
            'SPECIAL REQUESTS',
            cleanLine(order.specialRequests)
        );
    }

    lines.push(
        '',
        'Thank you for ordering from China Kitchen.'
    );

    await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: order.customerEmail,
        subject: `China Kitchen order confirmation - ${order._id}`,
        text: lines.join('\n')
    });
};
