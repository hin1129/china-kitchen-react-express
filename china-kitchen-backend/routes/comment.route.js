import express, { response } from 'express'
export const router = express.Router()
import { body, validationResult } from 'express-validator'
import Comment from '../models/comment.model.js'
import { verifyToken } from '../middleware/VerifyToken.js'

// commentList component, get comments
router.get(`/`, (request, response) => {
    Comment.find()
        .then((comment) => {
            const reversedComment = comment.reverse()
            response.status(200).json(reversedComment);
        })
        .catch((error) => { response.status(400).json('error: ' + error) })
})

// postComment component, post comment
router.post('/postcomment', verifyToken, [
    body('username').notEmpty().trim().escape().withMessage('username is required'),
    body('commentDescription').notEmpty().trim().escape().withMessage('comment description is required'),
    body('date')
        .notEmpty().withMessage('date is required')
        .isISO8601().withMessage('invalid date format'),
], (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return (response.status(400).json({ errors: errors.array() }))
    }

    const username = request.body.username;
    const commentDescription = request.body.commentDescription;
    const date = request.body.date;

    const newComment = new Comment({
        username,
        commentDescription,
        date,
    });

    newComment.save()
        .then(() => response.json('comment added'))
        .catch(error => response.status(400).json('error: ' + error));
});

// comment component, delete comment
router.delete('/comment', verifyToken, [
    body('id').notEmpty().isMongoId().withMessage('invalid comment id'),
], async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return (response.status(400).json({ errors: errors.array() }))
    }

    const commentID = request.body.id

    try {
        const deletedComment = await Comment.findByIdAndDelete(commentID)
        if (!deletedComment) {
            return (response.status(404).json({ error: "comment not found" }))
        }
        response.status(200).json({ message: "comment deleted" })
    }
    catch (error) {
        response.status(400).json({ message: "error deleting comment" })
    }
})

// comment component, edit comment
router.put('/comment/:id', verifyToken, [
    body('username').notEmpty().withMessage('username is required'),
    body('commentDescription').notEmpty().withMessage('description is required'),
    body('date')
        .notEmpty().withMessage('date is required')
        .isISO8601().withMessage('invalid date format'),
], async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return (response.status(400).json({ errors: errors.array() }))
    }

    const commentID = request.params.id
    const { username, commentDescription, date } = request.body

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            commentID,
            { username, commentDescription, date },
            { new: true } // true return updated document; false return original document
        )

        if (!updatedComment) {
            return response.status(404).json({ error: "comment not found in db" })
        }

        response.status(200).json(updatedComment)
    }
    catch (error) {
        response.status(400).json({ error: error.message })
    }
})

// comment component, reply comment
router.post('/comment/:id/reply', verifyToken, [
    body('username').notEmpty().trim().escape().withMessage('username is required'),
    body('replyDescription').notEmpty().trim().escape().withMessage('reply description is required'),
    body('date')
        .notEmpty().withMessage('date is required')
        .isISO8601().withMessage('invalid date format'),
], async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    const commentID = request.params.id
    const { username, replyDescription, date } = request.body

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            commentID,
            { $push: { replyComments: { username, replyDescription, date, } } },
            { new: true }
        )
        if (!updatedComment) {
            return response.status(404).json({ errors: 'Comment not found in db' })
        }
        response.status(200).json(updatedComment);
    }
    catch (error) {
        response.status(400).json({ errors: error.message })
    }
})

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