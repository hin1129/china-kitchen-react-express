// import express from 'express'
// import dotenv from 'dotenv'
// import mongoose from 'mongoose'
// import bodyParser from 'body-parser'
// import cors from 'cors'
// import cookieParser from 'cookie-parser'

// // routes
// import { router as comment } from './routes/comment.route.js'
// import { router as signUp } from './routes/signUp.route.js'
// import { router as signIn } from './routes/signIn.route.js'
// import { router as emailVerification } from './routes/emailVerification.route.js'
// import { router as menu } from './routes/menu.route.js'
// import { router as order } from './routes/order.route.js'
// import { router as user } from './routes/user.route.js'
// import { router as adminRouter } from './routes/admin.route.js';

// // server/env setup
// dotenv.config()
// const app = express();
// const port = process.env.PORT
// const host = process.env.HOST;

// // connect to DB
// const main = async () => {
//     try {
//         console.log(`DB at: ${process.env.DB_URI}`)
//         await mongoose.connect(process.env.DB_URI)
//     }
//     catch (error) { console.log(error) }
// }
// main().catch(error => { console.log(error) })

// // express middleware to enable CORS, deal with CORS issues
// // app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
// }));

// // parse requests of content-type - application/json
// app.use(bodyParser.json());
// // app.use(express.json()); // 

// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser())

// // routes
// app.use(`/`, comment);
// app.use(`/`, signUp);
// app.use(`/`, signIn);
// app.use(`/`, emailVerification);
// app.use(`/`, menu);
// app.use(`/`, order);
// app.use(`/`, user);
// app.use(`/`, adminRouter);

// // run server
// const server = app.listen(port, host, () => {
//     const SERVERHOST = server.address().address;
//     const SERVERPORT = server.address().port;
//     console.log(`Server connection - successful`);
//     console.log(`Server running on http://${SERVERHOST}:${SERVERPORT}`);
// });


// 
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'
// security
import helmet from 'helmet'
import hpp from 'hpp'
import { rateLimit } from 'express-rate-limit'
// routes
import { router as comment } from './routes/comment.route.js'
import { router as signUp } from './routes/signUp.route.js'
import { router as signIn } from './routes/signIn.route.js'
import { router as emailVerification } from './routes/emailVerification.route.js'
import { router as menu } from './routes/menu.route.js'
import { router as order } from './routes/order.route.js'
import { router as user } from './routes/user.route.js'
import { router as adminRouter } from './routes/admin.route.js'
// payment
import { router as payment, stripeWebhookHandler } from './routes/payment.route.js'
// custom security middleware
import { rejectNoSQLInjection, requireTrustedOrigin } from './middleware/security.js'
// postio
import { router as address } from './routes/address.route.js'
// =====================================
// SERVER / ENV SETUP
// =====================================
dotenv.config()
const app = express();
const port = process.env.PORT;
const host = process.env.HOST;
// =====================================
// CONNECT TO DATABASE
// =====================================
const main = async () => {
    try {
        console.log(`DB at: ${process.env.DB_URI}`);
        await mongoose.connect(process.env.DB_URI);
        console.log('Database connection - successful');
    }
    catch (error) {
        console.log('Database connection error:', error);
    }
};

main().catch(error => { console.log(error); });
// =====================================
// BASIC SECURITY
// =====================================

// Remove Express information from headers
app.disable('x-powered-by');

// Adds security-related HTTP headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Protect against HTTP parameter pollution
app.use(hpp());

// =====================================
// CORS
// =====================================
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'OPTIONS'
    ],
    allowedHeaders: ['Content-Type']
}));
// =====================================
// STRIPE WEBHOOK
//
// VERY IMPORTANT:
//
// This MUST be above bodyParser.json().
//
// Stripe verifies the signature using the
// original raw request body.
// =====================================
app.post('/stripe/webhook', express.raw({ type: 'application/json', limit: '1mb' }), stripeWebhookHandler);

// =====================================
// NORMAL BODY PARSING
// =====================================

// JSON body
app.use(bodyParser.json({ limit: '100kb' }));

// URL encoded body
app.use(express.urlencoded({
    extended: true,
    limit: '100kb'
}));

// Cookies
app.use(cookieParser());
// =====================================
// RATE LIMITING
// =====================================

// General website/API protection
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 500,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Too many requests. Please try again later.' }
});

app.use(generalLimiter);
// More strict protection for expensive /
// sensitive payment-related routes
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Too many payment attempts. Please wait and try again.' }
});

app.use(
    [
        '/checkout/session',
        '/checkout/retry',
        '/delivery/quote'
    ],
    paymentLimiter
);

// =====================================
// NOSQL INJECTION PROTECTION
// =====================================
app.use(rejectNoSQLInjection);
// =====================================
// CSRF / CROSS-SITE REQUEST PROTECTION
//
// Only allow POST / PUT / DELETE requests
// coming from your React website.
//
// Stripe webhook is not affected because
// it was mounted ABOVE this middleware.
// =====================================
app.use(requireTrustedOrigin);
// =====================================
// ROUTES
// =====================================
app.use(`/`, comment);
app.use(`/`, signUp);
app.use(`/`, signIn);
app.use(`/`, emailVerification);
app.use(`/`, menu);
app.use(`/`, order);
app.use(`/`, user);
app.use(`/`, adminRouter);
app.use(`/`, payment);
app.use(`/`, address);
// =====================================
// 404
// =====================================
app.use((request, response) => {
    return response.status(404).json({ message: 'Route not found' });
});
// =====================================
// RUN SERVER
// =====================================
const server = app.listen(port, host, () => {
    const SERVERHOST = server.address().address;
    const SERVERPORT = server.address().port;
    console.log(`Server connection - successful`);
    console.log(`Server running on http://${SERVERHOST}:${SERVERPORT}`);
});