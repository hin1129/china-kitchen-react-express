import express from 'express'
export const router = express.Router()
import User from '../models/user.model.js'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import sendVerificationEmail from '../utils/sendVerificationEmail.js'

dotenv.config()

router.post('/signup', [
    body('fullName').escape().notEmpty().withMessage('fullName is required'),
    body('username')
        .escape()
        .notEmpty().withMessage('username is required')
        .isLength({ min: 3, max: 20 }).withMessage('username must be between 3 and 20 characters'),
    body('email').isEmail().withMessage('invalid email').normalizeEmail(),
    body('password')
        .notEmpty().withMessage('password is required')
        .isLength({ min: 8, max: 20 }).withMessage('password must be between 8 and 20 characters')
        .matches(/\d/).withMessage('password must contain at least 1 number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('password must contain at least 1 symbol')
], async (request, response) => {
    // debugging
    console.log(' Incoming signup request:');
    console.log(request.body);
    // debugging

    const errors = validationResult(request)
    if (!errors.isEmpty) {
        console.log('Validation errors:', errors.array()); // Add this line

        return (response.status(400).json({ errors: errors.array() }))
    }

    const fullName = request.body.fullName;
    const username = request.body.username;
    const email = request.body.email;
    const password = request.body.password;

    try {
        const isEmailExist = await User.findOne({ email });
        const isUsernameExist = await User.findOne({ username });

        console.log('Checking if email or username exists...'); // Add this line

        if (isEmailExist) {
            return response.status(400).json({ error: 'Email already exists' });
        }

        if (isUsernameExist) {
            return response.status(400).json({ error: 'Username already exists' });
        }

        // apply hash
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(' Hashed password:', hashedPassword); // Add this line


        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
            isEmailVerified: false
        });

        // token for verification
        const verificationToken = jwt.sign(
            { userID: newUser._id },
            process.env.EMAIL_VERIFICATION_SECRET_KEY,
            { expiresIn: '1h' }, // 1h
            // { expiresIn: '10' }, // 10secs
        );

        console.log(' Verification Token:', verificationToken); // Add this line


        // assign to user property
        newUser.emailVerificationToken = verificationToken;
        await newUser.save();

        sendVerificationEmail(email, verificationToken)
        response.json('user account added');
    }


    // // debugging- before
    // catch (error) {
    //     response.status(400).json('error: ' + error);
    // }

    // debugging
    catch (error) {
        console.log(' Signup error:', error); // Add this line
        response.status(400).json('error: ' + error);
    }
});