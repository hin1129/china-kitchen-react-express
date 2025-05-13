import express from 'express'
export const router = express.Router()
import User from '../models/user.model.js'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

router.post('/signin', [
    body('email').isEmail().withMessage('invalid email format').normalizeEmail(),
    body('password').notEmpty().withMessage('password is required'),
], (request, response) => {
    const errors = validationResult(request)
    console.log("VALIDATION ERRORS", errors.array()) // Debugging: Check validation errors
    console.log("SIGNIN REQUEST BODY", request.body) // Debugging: Log incoming request body

    if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array()); // <-- ADD THIS, debugging

        return (response.status(400).json({
            message: "Validation failed. Please check your input.",
            errors: errors.array()
        }))
    }

    const email = request.body.email;
    const password = request.body.password;
    const username = request.body.username;

    // check if email exists in database
    User.findOne({ email })
        // if email exists
        .then(async (user) => {

            // If user does not exist, return a meaningful error message
            if (!user) {
                return response.status(404).send({
                    message: "No user found with this email address. Please check your email or sign up.",
                });
            }

            // check if email is verified
            if (!user.isEmailVerified) {
                return response.status(400).send(
                    { message: "email not verified", }
                );
            }

            // compare password entered to hashed password
            bcrypt.compare(password, user.password)
                // check passwords
                .then((passwordCheck) => {

                    console.log('Password comparison result:', passwordCheck); // Log result of password comparison for debugging

                    // check if passwords match
                    if (!passwordCheck) {
                        return response.status(400).send({
                            message: "Passwords does not match",
                            error: error.message,
                        });
                    }

                    // create token with user id and email
                    const token = jwt.sign(
                        { userId: user._id, userEmail: user.email, },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: "1h" }
                        // { expiresIn: "5s" }
                    );

                    response.header('Authorization', `Bearer ${token}`)

                    response.cookie('Token', token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        path: '/',
                        // expires: new Date(Date.now() + 60 * 60 * 1000)
                        // expires: new Date(Date.now() + 10 * 1000)
                    })

                    // successful, response.data array in browser console
                    response.status(200).send({
                        message: "login successful",
                        // email: user.email, // not used
                        username: user.username, // used in localStorage (edit/delete)
                        token
                    });
                })
                // if password not match
                .catch((error) => {
                    console.error("Error comparing password:", error); // for debugging

                    response.status(500).send({
                        message: "passwords not match", // server error during password comparison
                        error: error.message,
                    });
                });
        })

        // if email not exist
        // .catch((error) => {
        //     response.status(404).send({
        //         message: "email not exist",
        //         error
        //     });
        // });
        .catch((error) => {
            // Handle database errors or other issues related to the user query
            console.error("Error finding user:", error);
            response.status(500).send({
                message: "Server error. Could not process the request. Please try again later.",
                error: error.message,
            });
        });
});





// router.post('/signin', [
//     body('email').isEmail().withMessage('invalid email').normalizeEmail(),
//     body('password').notEmpty().withMessage('password is required'),
// ], async (request, response) => {
//     const errors = validationResult(request);
//     console.log("VALIDATION ERRORS", errors.array());
//     console.log("SIGNIN REQUEST BODY", request.body);

//     if (!errors.isEmpty()) {
//         return response.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = request.body;

//     try {
//         const user = await User.findOne({ email });

//         if (!user) {
//             return response.status(404).send({ message: "email not exist" });
//         }

//         if (!user.isEmailVerified) {
//             return response.status(400).send({ message: "email not verified" });
//         }

//         const passwordCheck = await bcrypt.compare(password, user.password);
//         console.log('Password comparison result:', passwordCheck);

//         if (!passwordCheck) {
//             return response.status(400).send({ message: "passwords do not match" });
//         }

//         const token = jwt.sign(
//             { userId: user._id, userEmail: user.email },
//             process.env.JWT_SECRET_KEY,
//             { expiresIn: "1h" }
//         );

//         response.header('Authorization', `Bearer ${token}`);
//         response.cookie('Token', token, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'strict',
//             path: '/'
//         });

//         return response.status(200).send({
//             message: "login successful",
//             username: user.username,
//             token
//         });

//     } catch (error) {
//         console.error("Signin error:", error);
//         return response.status(500).send({ message: "Server error", error });
//     }
// });
