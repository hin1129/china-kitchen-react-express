import validator from 'validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';

export const validateDeliveryProfile = user => {
    const errors = [];

    if (!user.addressLine1 || user.addressLine1.trim().length < 3) {
        errors.push('A valid delivery address is required');
    }

    if (!user.city || !user.city.trim()) {
        errors.push('City is required');
    }

    if (!user.postcode || !validator.isPostalCode(user.postcode.trim(), 'GB')) {
        errors.push('A valid UK postcode is required');
    }

    const phone = parsePhoneNumberFromString(String(user.phoneNumber || ''), 'GB');
    if (!phone || !phone.isValid()) {
        errors.push('A valid UK phone number is required');
    }

    // Coordinates are intentionally NOT required here.
    // They are obtained/cached later when delivery pricing is needed.
    return {
        valid: errors.length === 0,
        errors
    };
};
