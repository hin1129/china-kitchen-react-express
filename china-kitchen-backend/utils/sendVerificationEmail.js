import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

async function sendVerificationEmail(email, token) {
    // create transporter object, using default SMTP transport
    const transporter = nodemailer.createTransport({
        // service: 'Outlook',
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false // <-- This line fixes the self-signed cert issue
        }
    })

    // used to create URL that points to email verification route in app,
    // email sent to user contains this link,
    // when user clicks on it, will redirect to email verification route in app
    const verificationLink = `http://localhost:3000/emailverification/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'china kitchen - verify your email',
        text: `link to verify your email: \n ${verificationLink} `
    };

    await transporter.sendMail(mailOptions);
}

export default sendVerificationEmail