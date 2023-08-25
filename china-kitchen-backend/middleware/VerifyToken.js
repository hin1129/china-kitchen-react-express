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
    const token = request.headers.authorization;

    if (!token) {
        return response.status(403).json({ message: 'Access denied. Token missing.' });
    }

    jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET_KEY, (error, decoded) => {
        if (error) { return response.status(403).json({ message: 'Invalid token' }); }

        request.user = decoded;
        next(); // move to next middleware
    });
};