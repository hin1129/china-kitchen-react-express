// import express from 'express'
// export const router = express.Router()
// import Comment from '../models/comment.model.js'
// import { body, validationResult } from 'express-validator'
// import { verifyToken } from '../middleware/VerifyToken.js'

// // commentList component, get comments
// router.get(`/`, (request, response) => {
//     Comment.find()
//         .then((comment) => {
//             const reversedComment = comment.reverse()
//             response.status(200).json(reversedComment);
//         })
//         .catch((error) => { response.status(400).json('error: ' + error) })
// })

// // postComment component, post comment
// router.post('/postcomment', verifyToken, [
//     body('username').notEmpty().trim().escape().withMessage('username is required'),
//     body('commentDescription').notEmpty().trim().escape().withMessage('comment description is required'),
//     body('date')
//         .notEmpty().withMessage('date is required')
//         .isISO8601().withMessage('invalid date format'),
// ], (request, response) => {
//     const errors = validationResult(request)
//     if (!errors.isEmpty()) {
//         return (response.status(400).json({ errors: errors.array() }))
//     }

//     const username = request.body.username;
//     const commentDescription = request.body.commentDescription;
//     const date = request.body.date;

//     const newComment = new Comment({
//         username,
//         commentDescription,
//         date,
//     });

//     newComment.save()
//         .then(() => response.json('comment added'))
//         .catch(error => response.status(400).json('error: ' + error));
// });

// // comment component, delete comment
// router.delete('/comment', verifyToken, [
//     body('id').notEmpty().isMongoId().withMessage('invalid comment id'),
// ], async (request, response) => {
//     const errors = validationResult(request)
//     if (!errors.isEmpty()) {
//         return (response.status(400).json({ errors: errors.array() }))
//     }

//     const commentID = request.body.id

//     try {
//         const deletedComment = await Comment.findByIdAndDelete(commentID)
//         if (!deletedComment) {
//             return (response.status(404).json({ error: "comment not found" }))
//         }
//         response.status(200).json({ message: "comment deleted" })
//     }
//     catch (error) {
//         response.status(400).json({ message: "error deleting comment" })
//     }
// })

// // comment component, edit comment
// router.put('/comment/:id', verifyToken, [
//     body('username').notEmpty().withMessage('username is required'),
//     body('commentDescription').notEmpty().withMessage('description is required'),
//     body('date')
//         .notEmpty().withMessage('date is required')
//         .isISO8601().withMessage('invalid date format'),
// ], async (request, response) => {
//     const errors = validationResult(request)
//     if (!errors.isEmpty()) {
//         return (response.status(400).json({ errors: errors.array() }))
//     }

//     const commentID = request.params.id
//     const { username, commentDescription, date } = request.body

//     try {
//         const updatedComment = await Comment.findByIdAndUpdate(
//             commentID,
//             { username, commentDescription, date },
//             { new: true } // true return updated document; false return original document
//         )

//         if (!updatedComment) {
//             return response.status(404).json({ error: "comment not found in db" })
//         }

//         response.status(200).json(updatedComment)
//     }
//     catch (error) {
//         response.status(400).json({ error: error.message })
//     }
// })

// // comment component, reply comment
// router.post('/comment/:id/reply', verifyToken, [
//     body('replyUsername').notEmpty().trim().escape().withMessage('username is required'),
//     body('replyCommentDescription').notEmpty().trim().escape().withMessage('reply description is required'),
//     body('replyDate')
//         .notEmpty().withMessage('date is required')
//         .isISO8601().withMessage('invalid date format'),
// ], async (request, response) => {
//     const errors = validationResult(request);
//     if (!errors.isEmpty()) {
//         return response.status(400).json({ errors: errors.array() });
//     }

//     const commentID = request.params.id
//     const { replyUsername, replyCommentDescription, replyDate } = request.body

//     try {
//         const updatedComment = await Comment.findByIdAndUpdate(
//             commentID,
//             { $push: { replyComments: { replyUsername, replyCommentDescription, replyDate, } } },
//             { new: true }
//         )
//         if (!updatedComment) {
//             return response.status(404).json({ errors: 'Comment not found in db' })
//         }
//         response.status(200).json(updatedComment);
//     }
//     catch (error) {
//         response.status(400).json({ errors: error.message })
//     }
// })

// 200 = ok
// 201 = created
// 204 = no content
// 400 = bad request
// 401 = Unauthorized
// 403 = Forbidden
// 404 = not found
// 500 = internal server error
// Informational responses(100–199): server has received the request and is continuing to process it.
// Successful responses(200–299): request was successfully received, understood, and processed by the server.
// Redirection messages(300–399): further action needs to be taken to complete the request, such as following a redirection.
// Client error responses(400–499): issue with the client's request, such as a bad URL or insufficient permissions.
// Server error responses(500–599): error on the server's side while processing the request.


import express
    from 'express';

export const router =
    express.Router();

import Comment
    from '../models/comment.model.js';

import User
    from '../models/user.model.js';

import {
    body,
    validationResult
} from 'express-validator';

import {
    verifyToken
} from '../middleware/VerifyToken.js';


// =============================
// GET COMMENTS
// =============================
router.get(
    '/',
    async (
        request,
        response
    ) => {

        try {

            const comments =
                await Comment
                    .find()
                    .sort({
                        createdAt:
                            -1
                    });


            return response
                .status(200)
                .json(
                    comments
                );

        }

        catch (error) {

            console.error(
                'Get comments error:',
                error
            );


            return response
                .status(500)
                .json({
                    message:
                        'Failed to load comments'
                });

        }

    }
);


// =============================
// POST COMMENT
// =============================
router.post(
    '/postcomment',

    verifyToken,

    [
        body(
            'commentDescription'
        )
            .notEmpty()
            .trim()
            .escape()
            .withMessage(
                'Comment description is required'
            ),

        body('date')
            .notEmpty()
            .withMessage(
                'Date is required'
            )
            .isISO8601()
            .withMessage(
                'Invalid date format'
            )
    ],

    async (
        request,
        response
    ) => {

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


        try {

            const user =
                await User.findById(
                    request.user.userId
                );


            if (!user) {

                return response
                    .status(401)
                    .json({
                        message:
                            'User not found'
                    });

            }


            const newComment =
                new Comment({

                    userId:
                        user._id,

                    username:
                        user.username,

                    commentDescription:
                        request.body
                            .commentDescription,

                    date:
                        request.body.date

                });


            await newComment.save();


            return response
                .status(201)
                .json(
                    newComment
                );

        }

        catch (error) {

            console.error(
                'Post comment error:',
                error
            );


            return response
                .status(500)
                .json({
                    message:
                        'Failed to add comment'
                });

        }

    }
);


// =============================
// DELETE COMMENT
// =============================
router.delete(
    '/comment',

    verifyToken,

    [
        body('id')
            .notEmpty()
            .isMongoId()
            .withMessage(
                'Invalid comment id'
            )
    ],

    async (
        request,
        response
    ) => {

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


        try {

            const [
                currentUser,
                comment
            ] =
                await Promise.all([

                    User.findById(
                        request.user.userId
                    ),

                    Comment.findById(
                        request.body.id
                    )

                ]);


            if (!currentUser) {

                return response
                    .status(401)
                    .json({
                        message:
                            'User not found'
                    });

            }


            if (!comment) {

                return response
                    .status(404)
                    .json({
                        message:
                            'Comment not found'
                    });

            }


            const ownsComment =
                comment.userId &&
                comment.userId
                    .toString() ===
                currentUser._id
                    .toString();


            const isAdmin =
                currentUser.role ===
                'admin';


            if (
                !ownsComment &&
                !isAdmin
            ) {

                return response
                    .status(403)
                    .json({
                        message:
                            'You cannot delete this comment'
                    });

            }


            await Comment.findByIdAndDelete(
                comment._id
            );


            return response
                .status(200)
                .json({
                    message:
                        'Comment deleted'
                });

        }

        catch (error) {

            console.error(
                'Delete comment error:',
                error
            );


            return response
                .status(500)
                .json({
                    message:
                        'Error deleting comment'
                });

        }

    }
);


// =============================
// EDIT COMMENT
// =============================
router.put(
    '/comment/:id',

    verifyToken,

    [
        body(
            'commentDescription'
        )
            .notEmpty()
            .trim()
            .escape()
            .withMessage(
                'Description is required'
            ),

        body('date')
            .notEmpty()
            .isISO8601()
            .withMessage(
                'Invalid date format'
            )
    ],

    async (
        request,
        response
    ) => {

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


        try {

            const [
                currentUser,
                comment
            ] =
                await Promise.all([

                    User.findById(
                        request.user.userId
                    ),

                    Comment.findById(
                        request.params.id
                    )

                ]);


            if (!currentUser) {

                return response
                    .status(401)
                    .json({
                        message:
                            'User not found'
                    });

            }


            if (!comment) {

                return response
                    .status(404)
                    .json({
                        message:
                            'Comment not found'
                    });

            }


            const ownsComment =
                comment.userId &&
                comment.userId
                    .toString() ===
                currentUser._id
                    .toString();


            const isAdmin =
                currentUser.role ===
                'admin';


            if (
                !ownsComment &&
                !isAdmin
            ) {

                return response
                    .status(403)
                    .json({
                        message:
                            'You cannot edit this comment'
                    });

            }


            // If owner edits their own comment,
            // update displayed username
            // to their current username.
            //
            // If admin edits another person's
            // comment, keep original author.
            if (ownsComment) {

                comment.username =
                    currentUser.username;

            }


            comment.commentDescription =
                request.body
                    .commentDescription;


            comment.date =
                request.body.date;


            await comment.save();


            return response
                .status(200)
                .json(
                    comment
                );

        }

        catch (error) {

            console.error(
                'Edit comment error:',
                error
            );


            return response
                .status(500)
                .json({
                    message:
                        'Failed to edit comment'
                });

        }

    }
);


// =============================
// REPLY COMMENT
// =============================
router.post(
    '/comment/:id/reply',

    verifyToken,

    [
        body(
            'replyCommentDescription'
        )
            .notEmpty()
            .trim()
            .escape()
            .withMessage(
                'Reply description is required'
            ),

        body('replyDate')
            .notEmpty()
            .isISO8601()
            .withMessage(
                'Invalid date format'
            )
    ],

    async (
        request,
        response
    ) => {

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


        try {

            const user =
                await User.findById(
                    request.user.userId
                );


            if (!user) {

                return response
                    .status(401)
                    .json({
                        message:
                            'User not found'
                    });

            }


            const updatedComment =
                await Comment
                    .findByIdAndUpdate(

                        request.params.id,

                        {
                            $push: {

                                replyComments: {

                                    replyUserId:
                                        user._id,

                                    replyUsername:
                                        user.username,

                                    replyCommentDescription:
                                        request.body
                                            .replyCommentDescription,

                                    replyDate:
                                        request.body
                                            .replyDate

                                }

                            }
                        },

                        {
                            new:
                                true
                        }

                    );


            if (!updatedComment) {

                return response
                    .status(404)
                    .json({
                        message:
                            'Comment not found'
                    });

            }


            return response
                .status(200)
                .json(
                    updatedComment
                );

        }

        catch (error) {

            console.error(
                'Reply comment error:',
                error
            );


            return response
                .status(500)
                .json({
                    message:
                        'Failed to add reply'
                });

        }

    }
);