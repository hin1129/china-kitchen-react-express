// import express from 'express'
// export const router = express.Router()
// import User from '../models/user.model.js'
// import jwt from 'jsonwebtoken'
// import dotenv from 'dotenv'

// dotenv.config()

// router.get('/emailverification/:token', async (request, response) => {
//     const { token } = request.params;

//     try {
//         // decode with secret key
//         const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET_KEY);
//         const userID = decoded.userID
//         // find user
//         const user = await User.findById(userID)
//         if (!user) {
//             return response.status(404).json({ error: 'User not found' });
//         }
//         // mark user as verified
//         user.isEmailVerified = true
//         user.emailVerificationToken = undefined
//         await user.save()

//         response.json({ message: 'Email verification successful' })
//     }
//     catch (error) {
//         response.status(400).json({ error: 'invalid or token expired' })
//     }
// })


import express from 'express';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const router = express.Router();


router.get('/emailverification/:token', async (request, response) => {
    const { token } = request.params;
    try {
        const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET_KEY);
        const user = await User.findById(decoded.userID);
        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        // Already verified.
        if (user.isEmailVerified) {
            return response.status(200).json({ message: 'Email already verified' });
        }

        // Token must match the token
        // currently stored for this user.
        if (!user.emailVerificationToken || user.emailVerificationToken !== token) {
            return response.status(400).json({ message: 'Invalid verification token' });
        }
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        await user.save();

        return response.status(200).json({ message: 'Email verification successful' });
    }

    catch (error) {
        return response.status(400).json({
            message: 'Invalid or expired verification token'
        });
    }
});