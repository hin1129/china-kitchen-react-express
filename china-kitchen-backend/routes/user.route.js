import express, { response } from 'express'
export const router = express.Router()
import User from '../models/user.model.js'
import Comment from '../models/comment.model.js';
import { verifyToken } from '../middleware/VerifyToken.js';

router.get('/profile', verifyToken, async (request, response) => {
    try {
        const user = await User.findById(request.user.userId).select('fullName username address phoneNumber')

        if (!user) {
            return response.status(404).json({ message: 'user not found' });
        }

        response.json(user)
    }
    catch (error) {
        response.status(500).json({ error: "failed to fetch profile" })
    }
})

router.put('/profile', verifyToken, async (request, response) => {
    try {

        const existingUser = await User.findById(request.user.userId)

        if (!existingUser) {
            return (response.status(404).json({ message: "user not found" }))
        }

        const oldUsername = existingUser.username
        const newUsername = request.body.username

        const updatedUser = await User.findByIdAndUpdate(
            request.user.userId,
            request.body,
            { new: true, runValidators: true }
        );



        if (oldUsername !== newUsername) {
            await Comment.updateMany(
                { username: oldUsername },
                { $set: { username: newUsername } }
            )

            await Comment.updateMany(
                { "replyComments.replyUsername": oldUsername },
                { $set: { "replyComments.$[ele].replyUsername": newUsername } },
                { arrayFilters: [{ "ele.replyUsername": oldUsername }] }
            )
        }


        response.json({ message: 'Profile updated', userData: updatedUser });
    }
    catch (error) {
        response.status(500).json({ message: 'Failed to update profile', error });
    }
});
