// import express from 'express'
// export const router = express.Router()
// import User from '../models/user.model.js'
// import { body, validationResult } from 'express-validator'
// import bcrypt from 'bcryptjs'
// import dotenv from 'dotenv'
// import jwt from 'jsonwebtoken'
// import sendVerificationEmail from '../utils/sendVerificationEmail.js'

// dotenv.config()

// router.post('/signup', [
//     body('fullName').escape().notEmpty().withMessage('fullName is required'),
//     body('username')
//         .escape()
//         .notEmpty().withMessage('username is required')
//         .isLength({ min: 3, max: 20 }).withMessage('username must be between 3 and 20 characters'),
//     body('email').isEmail().withMessage('invalid email').normalizeEmail(),
//     body('password')
//         .notEmpty().withMessage('password is required')
//         .isLength({ min: 8, max: 20 }).withMessage('password must be between 8 and 20 characters')
//         .matches(/\d/).withMessage('password must contain at least 1 number')
//         .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('password must contain at least 1 symbol')
// ], async (request, response) => {
//     // debugging
//     console.log(' Incoming signup request:');
//     // console.log(request.body);
//     // debugging

//     const errors = validationResult(request)
//     if (!errors.isEmpty()) {
//         console.log('Validation errors:', errors.array()); // Add this line

//         return (response.status(400).json({ errors: errors.array() }))
//     }

//     const fullName = request.body.fullName;
//     const username = request.body.username;
//     const email = request.body.email;
//     const password = request.body.password;

//     try {
//         const isEmailExist = await User.findOne({ email });
//         const isUsernameExist = await User.findOne({ username });

//         console.log('Checking if email or username exists...'); // Add this line

//         if (isEmailExist) {
//             return response.status(400).json({ error: 'Email already exists' });
//         }

//         if (isUsernameExist) {
//             return response.status(400).json({ error: 'Username already exists' });
//         }

//         // apply hash
//         const hashedPassword = await bcrypt.hash(password, 10);
//         // console.log(' Hashed password:', hashedPassword);


//         const newUser = new User({
//             fullName,
//             username,
//             email,
//             password: hashedPassword,
//             isEmailVerified: false
//         });

//         // token for verification
//         const verificationToken = jwt.sign(
//             { userID: newUser._id },
//             process.env.EMAIL_VERIFICATION_SECRET_KEY,
//             { expiresIn: '1h' }, // 1h
//             // { expiresIn: '10' }, // 10secs
//         );

//         // console.log(' Verification Token:', verificationToken);


//         // assign to user property
//         newUser.emailVerificationToken = verificationToken;
//         await newUser.save();

//         await sendVerificationEmail(email, verificationToken)
//         response.json('user account added');
//     }

//     // debugging
//     catch (error) {
//         console.log(' Signup error:', error); // Add this line
//         response.status(400).json('error: ' + error);
//     }
// });

import express
    from 'express';

export const router =
    express.Router();

import User
    from '../models/user.model.js';

import {
    body,
    validationResult
} from 'express-validator';

import bcrypt
    from 'bcryptjs';

import dotenv
    from 'dotenv';

import jwt
    from 'jsonwebtoken';

import sendVerificationEmail
    from '../utils/sendVerificationEmail.js';


dotenv.config();


// =============================
// SIGN UP
// =============================
router.post(
    '/signup',

    [
        body('fullName')
            .trim()
            .escape()
            .notEmpty()
            .withMessage(
                'Full name is required'
            ),

        body('username')
            .trim()
            .escape()
            .notEmpty()
            .withMessage(
                'Username is required'
            )
            .isLength({
                min:
                    3,

                max:
                    20
            })
            .withMessage(
                'Username must be between 3 and 20 characters'
            ),

        body('email')
            .isEmail()
            .withMessage(
                'Invalid email'
            )
            .normalizeEmail(),

        body('password')
            .notEmpty()
            .withMessage(
                'Password is required'
            )
            .isLength({
                min:
                    8,

                max:
                    20
            })
            .withMessage(
                'Password must be between 8 and 20 characters'
            )
            .matches(
                /\d/
            )
            .withMessage(
                'Password must contain at least 1 number'
            )
            .matches(
                /[!@#$%^&*(),.?":{}|<>]/
            )
            .withMessage(
                'Password must contain at least 1 symbol'
            )
    ],

    async (
        request,
        response
    ) => {

        // =============================
        // VALIDATION
        // =============================
        const errors =
            validationResult(
                request
            );


        if (
            !errors.isEmpty()
        ) {

            return response
                .status(400)
                .json({
                    errors:
                        errors.array()
                });

        }


        const {
            fullName,
            username,
            email,
            password
        } =
            request.body;


        try {

            // =============================
            // CHECK EXISTING EMAIL
            // =============================
            const isEmailExist =
                await User.findOne({
                    email
                });


            if (
                isEmailExist
            ) {

                return response
                    .status(400)
                    .json({
                        message:
                            'Email already exists'
                    });

            }


            // =============================
            // CHECK EXISTING USERNAME
            // =============================
            const isUsernameExist =
                await User.findOne({
                    username
                });


            if (
                isUsernameExist
            ) {

                return response
                    .status(400)
                    .json({
                        message:
                            'Username already exists'
                    });

            }


            // =============================
            // HASH PASSWORD
            // =============================
            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            // =============================
            // CREATE USER
            // =============================
            const newUser =
                new User({

                    fullName,

                    username,

                    email,

                    password:
                        hashedPassword,

                    isEmailVerified:
                        false

                });


            // =============================
            // VERIFICATION TOKEN
            // =============================
            const verificationToken =
                jwt.sign(

                    {
                        userID:
                            newUser._id
                    },

                    process.env
                        .EMAIL_VERIFICATION_SECRET_KEY,

                    {
                        expiresIn:
                            '1h'
                    }

                );


            newUser.emailVerificationToken =
                verificationToken;


            // =============================
            // SAVE USER
            // =============================
            await newUser.save();


            // =============================
            // SEND VERIFICATION EMAIL
            // =============================
            try {

                await sendVerificationEmail(
                    email,
                    verificationToken
                );

            }

            catch (emailError) {

                console.error(
                    'Verification email failed:',
                    emailError
                );


                // Account was only just created.
                // Remove it so the user can
                // retry signup.
                await User.findByIdAndDelete(
                    newUser._id
                );


                return response
                    .status(500)
                    .json({

                        message:
                            'Could not send verification email. Please try again.'

                    });

            }


            // =============================
            // SUCCESS
            // =============================
            return response
                .status(201)
                .json({

                    message:
                        'User account created. Please verify your email.'

                });

        }

        catch (error) {

            console.error(
                'Signup error:',
                error
            );


            return response
                .status(500)
                .json({

                    message:
                        'Failed to create account'

                });

        }

    }
);