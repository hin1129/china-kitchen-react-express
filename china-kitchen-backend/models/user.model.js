// import mongoose from 'mongoose'
// import validator from 'validator';

// const userSchema = new mongoose.Schema({
//     fullName: {
//         type: String,
//         required: true
//     },
//     username: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         validate: {
//             validator: (value) => validator.isEmail(value),
//             message: 'invalid email'
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     isEmailVerified: {
//         type: Boolean,
//         default: false
//     },
//     emailVerificationToken: String,
//     address: { type: String },
//     phoneNumber: { type: Number },
//     postcode: { type: String },
// });

// const UserDB = mongoose.model(`user`, userSchema);
// export default UserDB;



import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 254,
        validate: {
            validator: value => validator.isEmail(value),
            message: 'Invalid email'
        }
    },

    password: {
        type: String,
        required: true
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    emailVerificationToken: String,

    phoneNumber: {
        type: String,
        default: '',
        trim: true,
        maxlength: 30
    },

    addressLine1: {
        type: String,
        default: '',
        trim: true,
        maxlength: 120
    },

    addressLine2: {
        type: String,
        default: '',
        trim: true,
        maxlength: 120
    },

    city: {
        type: String,
        default: '',
        trim: true,
        maxlength: 100
    },

    postcode: {
        type: String,
        default: '',
        trim: true,
        maxlength: 12
    },

    deliveryLongitude: {
        type: Number,
        default: null
    },

    deliveryLatitude: {
        type: Number,
        default: null
    },

    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    }
});

const User = mongoose.model('user', userSchema);
export default User;
