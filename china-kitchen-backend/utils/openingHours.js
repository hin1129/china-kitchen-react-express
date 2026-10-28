import { DateTime } from 'luxon';

// Replace these example hours with the real restaurant hours.
// Luxon weekday: 1 Monday ... 7 Sunday.
export const OPENING_HOURS = {
    1: { open: '17:00', close: '23:00' },
    2: { open: '17:00', close: '23:00' },
    3: { open: '17:00', close: '23:00' },
    4: { open: '17:00', close: '23:00' },
    5: { open: '17:00', close: '23:30' },
    6: { open: '17:00', close: '23:30' },
    7: { open: '17:00', close: '23:00' }
};

export const RESTAURANT_TIMEZONE = 'Europe/London';
export const COLLECTION_PREP_MINUTES = 30;
export const DELIVERY_PREP_MINUTES = 45;
export const SLOT_MINUTES = 15;

const atBusinessTime = (day, hhmm) => {
    const [hour, minute] = hhmm.split(':').map(Number);
    return day.startOf('day').set({ hour, minute, second: 0, millisecond: 0 });
};

const roundUpToSlot = dateTime => {
    const remainder = dateTime.minute % SLOT_MINUTES;
    if (remainder === 0 && dateTime.second === 0 && dateTime.millisecond === 0) {
        return dateTime;
    }
    const add = remainder === 0 ? SLOT_MINUTES : SLOT_MINUTES - remainder;
    return dateTime.plus({ minutes: add }).set({ second: 0, millisecond: 0 });
};

export const nowLondon = () => DateTime.now().setZone(RESTAURANT_TIMEZONE);

export const getBusinessHours = (dateTime = nowLondon()) => {
    const hours = OPENING_HOURS[dateTime.weekday];
    if (!hours) return null;
    return {
        open: atBusinessTime(dateTime, hours.open),
        close: atBusinessTime(dateTime, hours.close)
    };
};

export const isRestaurantOpen = (dateTime = nowLondon()) => {
    const hours = getBusinessHours(dateTime);
    return Boolean(hours && dateTime >= hours.open && dateTime < hours.close);
};

export const getPreparationMinutes = orderType =>
    orderType === 'delivery' ? DELIVERY_PREP_MINUTES : COLLECTION_PREP_MINUTES;

export const getAvailableTimeSlots = (orderType, dateTime = nowLondon()) => {
    const hours = getBusinessHours(dateTime);
    if (!hours) return [];

    const prep = getPreparationMinutes(orderType);
    let earliest;

    if (dateTime < hours.open) {
        earliest = hours.open.plus({ minutes: prep });
    }
    else if (dateTime < hours.close) {
        earliest = dateTime.plus({ minutes: prep });
    }
    else {
        return [];
    }

    earliest = roundUpToSlot(earliest);
    const slots = [];
    for (let slot = earliest; slot < hours.close; slot = slot.plus({ minutes: SLOT_MINUTES })) {
        slots.push(slot);
    }
    return slots;
};

export const getOrderingInfo = (orderType, dateTime = nowLondon()) => {
    const hours = getBusinessHours(dateTime);
    return {
        openNow: isRestaurantOpen(dateTime),
        asapAvailable: isRestaurantOpen(dateTime),
        openingHours: hours ? {
            open: hours.open.toFormat('HH:mm'),
            close: hours.close.toFormat('HH:mm')
        } : null,
        timeSlots: getAvailableTimeSlots(orderType, dateTime).map(slot => slot.toISO())
    };
};

export const validateRequestedTime = ({
    orderType,
    fulfilmentType,
    requestedTime,
    dateTime = nowLondon()
}) => {
    if (!['collection', 'delivery'].includes(orderType)) {
        return { valid: false, message: 'Invalid order type' };
    }

    if (!['asap', 'scheduled'].includes(fulfilmentType)) {
        return { valid: false, message: 'Invalid fulfilment type' };
    }

    if (fulfilmentType === 'asap') {
        if (!isRestaurantOpen(dateTime)) {
            return {
                valid: false,
                message: 'The restaurant is currently closed. Please choose a preorder time.'
            };
        }
        return { valid: true, requestedTime: null };
    }

    if (typeof requestedTime !== 'string' || requestedTime.length > 80) {
        return { valid: false, message: 'Please select a valid order time' };
    }

    const requested = DateTime.fromISO(requestedTime, { setZone: true })
        .setZone(RESTAURANT_TIMEZONE);

    if (!requested.isValid) {
        return { valid: false, message: 'Please select a valid order time' };
    }

    const allowed = getAvailableTimeSlots(orderType, dateTime);
    const match = allowed.find(slot => slot.toMillis() === requested.toMillis());

    if (!match) {
        return { valid: false, message: 'The selected order time is no longer available' };
    }

    return { valid: true, requestedTime: match.toJSDate() };
};
