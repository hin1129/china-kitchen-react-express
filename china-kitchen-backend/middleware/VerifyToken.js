import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const clearAuthCookie = (response) => {
    response.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });
};

export const verifyToken = (request, response, next) => {
    const token = request.cookies?.token;

    if (!token) {
        return response.status(401).json({
            message: 'Authentication required',
            code: 'NOT_AUTHENTICATED'
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        request.user = decoded;
        return next();
    }
    catch (error) {
        clearAuthCookie(response);

        return response.status(401).json({
            message: 'Session expired or invalid',
            code: 'INVALID_SESSION'
        });
    }
};

export const optionalVerifyToken = (
    request,
    response,
    next
) => {
    const token = request.cookies?.token;

    if (!token) {
        request.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        request.user = decoded;
        return next();
    }
    catch (error) {
        request.user = null;
        clearAuthCookie(response);
        return next();
    }
};
