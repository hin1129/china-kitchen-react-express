import express
    from 'express';

import validator
    from 'validator';

import User
    from '../models/user.model.js';

import Comment
    from '../models/comment.model.js';

import {
    verifyToken
} from '../middleware/VerifyToken.js';


export const router =
    express.Router();


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

            const cleanFullName =
                String(
                    fullName ||
                    ''
                ).trim();


            const cleanUsername =
                String(
                    username ||
                    ''
                ).trim();


            const cleanPhoneNumber =
                String(
                    phoneNumber ||
                    ''
                ).trim();


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

                const addressLine1 =
                    String(
                        deliveryAddress
                            ?.addressLine1 ||
                        ''
                    ).trim();


                const addressLine2 =
                    String(
                        deliveryAddress
                            ?.addressLine2 ||
                        ''
                    ).trim();


                const city =
                    String(
                        deliveryAddress
                            ?.city ||
                        ''
                    ).trim();


                const postcode =
                    String(
                        deliveryAddress
                            ?.postcode ||
                        ''
                    )
                        .trim()
                        .toUpperCase();


                // =============================
                // VALIDATE ADDRESS
                // =============================

                if (
                    !addressLine1
                ) {

                    return response
                        .status(400)
                        .json({

                            message:
                                'Address line 1 is required'

                        });

                }


                if (
                    !city
                ) {

                    return response
                        .status(400)
                        .json({

                            message:
                                'City is required'

                        });

                }


                if (
                    !validator.isPostalCode(
                        postcode,
                        'GB'
                    )
                ) {

                    return response
                        .status(400)
                        .json({

                            message:
                                'A valid UK postcode is required'

                        });

                }


                // =============================
                // SAVE STRUCTURED ADDRESS
                // =============================

                user.addressLine1 =
                    addressLine1;


                user.addressLine2 =
                    addressLine2;


                user.city =
                    city;


                user.postcode =
                    postcode;


                // =============================
                // CLEAR OLD ROUTING CACHE
                // =============================
                //
                // If the address changed,
                // existing AWS coordinates
                // should not be reused.

                user.deliveryLongitude =
                    null;


                user.deliveryLatitude =
                    null;

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
                .status(500)
                .json({

                    message:
                        'Failed to update profile'

                });

        }

    }

);


export default router;