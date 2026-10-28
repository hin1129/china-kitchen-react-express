const DANGEROUS_KEY = /(^\$)|\./;

const findDangerousKey = (value, path = 'request') => {
    if (value === null || value === undefined || typeof value !== 'object') return null;

    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i += 1) {
            const result = findDangerousKey(value[i], `${path}[${i}]`);
            if (result) return result;
        }
        return null;
    }

    for (const [key, child] of Object.entries(value)) {
        if (DANGEROUS_KEY.test(key)) return `${path}.${key}`;
        const result = findDangerousKey(child, `${path}.${key}`);
        if (result) return result;
    }

    return null;
};

export const rejectNoSQLInjection = (request, response, next) => {
    if (findDangerousKey(request.body)) {
        return response.status(400).json({ message: 'Invalid request data' });
    }
    next();
};

export const requireTrustedOrigin = (request, response, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return next();

    const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
    const origin = request.get('origin');

    if (!origin || origin !== allowedOrigin) {
        return response.status(403).json({ message: 'Request origin is not allowed' });
    }

    next();
};
