import express from 'express';
import validator from 'validator';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { getPostioAddress } from '../utils/delivery.js';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';
export const router = express.Router();


// =============================
// GET PROFILE
// =============================

router.get(

    '/profile',

    verifyToken,

    async (
        request,
        response
    ) => {

        try {

            const user =
                await User
                    .findById(
                        request.user.userId
                    )
                    .select(
                        '-password'
                    );


            if (
                !user
            ) {

                return response
                    .status(404)
                    .json({

                        message:
                            'User not found'

                    });

            }


            return response
                .status(200)
                .json({

                    userData: {

                        fullName:
                            user.fullName ||
                            '',

                        username:
                            user.username ||
                            '',

                        email:
                            user.email ||
                            '',

                        phoneNumber:
                            user.phoneNumber ||
                            '',

                        addressLine1:
                            user.addressLine1 ||
                            '',

                        addressLine2:
                            user.addressLine2 ||
                            '',

                        city:
                            user.city ||
                            '',

                        postcode:
                            user.postcode ||
                            '',

                        deliveryUdprn:
                            user.deliveryUdprn ||
                            null,

                        deliveryLongitude:
                            user.deliveryLongitude,

                        deliveryLatitude:
                            user.deliveryLatitude

                    }

                });

        }

        catch (error) {

            console.error(
                'Get profile error:',
                error
            );


            return response
                .status(500)
                .json({

                    message:
                        'Failed to load profile'

                });

        }

    }

);


// =============================
// UPDATE PROFILE
// =============================

router.put(

    '/profile',

    verifyToken,

    async (
        request,
        response
    ) => {

        try {

            const user =
                await User.findById(
                    request.user.userId
                );


            if (
                !user
            ) {

                return response
                    .status(404)
                    .json({

                        message:
                            'User not found'

                    });

            }


            const {

                fullName,

                username,

                phoneNumber,

                deliveryAddress

            } =
                request.body;


            // =============================
            // CLEAN BASIC DETAILS
            // =============================

            const cleanFullName = String(fullName || '').trim();

            const cleanUsername = String(username || '').trim();

            const cleanPhoneNumber = String(phoneNumber || '').trim();

            if (!cleanPhoneNumber) {
                return response
                    .status(400)
                    .json({ message: 'Phone number is required' });
            }

            const parsedPhoneNumber = parsePhoneNumberFromString(
                cleanPhoneNumber, 'GB'
            );

            if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
                return response
                    .status(400)
                    .json({ message: 'Please enter a valid UK phone number' });
            }

            // =============================
            // VALIDATE BASIC DETAILS
            // =============================

            if (
                !cleanFullName
            ) {
                return response
                    .status(400)
                    .json({

                        message:
                            'Full name is required'
                    });
            }


            if (
                cleanUsername.length <
                3
            ) {

                return response
                    .status(400)
                    .json({
                        message:
                            'Username must contain at least 3 characters'
                    });

            }


            // =============================
            // CHECK USERNAME DUPLICATE
            // =============================

            const duplicateUsername =
                await User.findOne({

                    username:
                        cleanUsername,

                    _id: {

                        $ne:
                            user._id

                    }

                });


            if (
                duplicateUsername
            ) {

                return response
                    .status(400)
                    .json({

                        message:
                            'Username already exists'

                    });

            }


            const oldUsername =
                user.username;


            // =============================
            // UPDATE PERSONAL DETAILS
            // =============================

            user.fullName =
                cleanFullName;


            user.username =
                cleanUsername;


            user.phoneNumber =
                cleanPhoneNumber;


            // =============================
            // UPDATE DELIVERY ADDRESS
            // =============================

            if (
                deliveryAddress !==
                undefined
            ) {

                // We do NOT trust the address
                // text or coordinates sent by
                // the browser.
                //
                // React sends the UDPRN from
                // the selected Postio address.
                //
                // The backend then asks Postio
                // for the real PAF address and
                // coordinates.

                const udprn = deliveryAddress?.udprn;

                // =============================
                // REQUIRE POSTIO SELECTION
                // =============================

                const selectedUdprn = udprn || user.deliveryUdprn;

                if (!selectedUdprn) {
                    return response
                        .status(400)
                        .json({ message: 'Please select your address from the address search' });
                }

                // =============================
                // VERIFY ADDRESS WITH POSTIO
                // =============================

                const postioAddress = await getPostioAddress(selectedUdprn);

                // =============================
                // EXTRA POSTCODE VALIDATION
                // =============================

                if (
                    !validator.isPostalCode(
                        postioAddress.postcode,
                        'GB'
                    )
                ) {

                    return response
                        .status(400)
                        .json({

                            message:
                                'Postio returned an invalid UK postcode'

                        });

                }


                // =============================
                // SAVE TRUSTED POSTIO ADDRESS
                // =============================

                user.addressLine1 =
                    postioAddress.addressLine1;


                user.addressLine2 =
                    postioAddress.addressLine2;


                user.city =
                    postioAddress.city;


                user.postcode =
                    postioAddress.postcode;


                user.deliveryUdprn =
                    postioAddress.udprn;


                user.deliveryLongitude =
                    postioAddress.longitude;


                user.deliveryLatitude =
                    postioAddress.latitude;

            }


            // =============================
            // SAVE USER
            // =============================

            await user.save();


            // =============================
            // UPDATE COMMENT USERNAME
            // =============================

            if (
                oldUsername !==
                user.username
            ) {

                await Comment.updateMany(

                    {
                        userId:
                            user._id
                    },

                    {
                        $set: {

                            username:
                                user.username

                        }
                    }

                );


                await Comment.updateMany(

                    {
                        'replyComments.replyUserId':
                            user._id
                    },

                    {
                        $set: {

                            'replyComments.$[reply].replyUsername':
                                user.username

                        }
                    },

                    {
                        arrayFilters: [

                            {
                                'reply.replyUserId':
                                    user._id
                            }

                        ]
                    }

                );

            }


            // =============================
            // RESPONSE
            // =============================

            return response
                .status(200)
                .json({

                    message:
                        'Profile updated successfully',

                    userData: {

                        fullName:
                            user.fullName,

                        username:
                            user.username,

                        email:
                            user.email,

                        phoneNumber:
                            user.phoneNumber,

                        addressLine1:
                            user.addressLine1,

                        addressLine2:
                            user.addressLine2,

                        city:
                            user.city,

                        postcode:
                            user.postcode,

                        deliveryUdprn:
                            user.deliveryUdprn ||
                            null,

                        deliveryLongitude:
                            user.deliveryLongitude,

                        deliveryLatitude:
                            user.deliveryLatitude

                    }

                });

        }

        catch (error) {

            console.error(
                'Update profile error:',
                error
            );


            return response
                .status(
                    error.statusCode ||
                    500
                )
                .json({

                    message:
                        error.message ||
                        'Failed to update profile',

                    code:
                        error.code

                });

        }

    }

);


export default router;