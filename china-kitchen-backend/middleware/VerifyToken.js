import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (request, response, next) => {
    // const tokenHeader = request.headers['authorization'];
    // const token = tokenHeader.split(' ')[1]
    // jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
    //     request.user = user;
    //     next()
    // })

    // JWT stored in localStorage
    // const token = request.headers.authorization;
    // if (!token) {
    //     return response.status(403).json({ message: 'Access denied. Token missing.' });
    // }
    // jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET_KEY, (error, decoded) => {
    //     if (error) { return response.status(403).json({ message: 'Invalid token' }); }
    //     request.user = decoded;
    //     next(); // move to next middleware
    // });

    // const token = request.cookies.authToken;
    const token = request.cookies?.token;

    if (!token) {
        return response.status(401).json({
            message: 'Authentication required', code: 'NOT_AUTHENTICATED'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        request.user = decoded;
        next();

    }
    catch (error) {
        return response.status(401).json({
            message: 'Session expired or invalid',
            code: 'INVALID_SESSION'
        });
    }
};

export const optionalVerifyToken = (request, response, next) => {
    const token = request.cookies?.token;
    // Guest
    if (!token) {
        request.user = null;
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        request.user = decoded;
        return next();
    }
    catch (error) {
        // Invalid/expired cookie should NOT
        // prevent somebody using guest checkout.
        request.user = null;
        response.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
        return next();
    }
};