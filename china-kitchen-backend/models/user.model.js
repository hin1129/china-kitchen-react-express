import mongoose from 'mongoose'
import validator from 'validator';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: 'invalid email'
        }
    },
    password: {
        type: String,
        required: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String
});

const UserDB = mongoose.model(`user`, userSchema);
export default UserDB;