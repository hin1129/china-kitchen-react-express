import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
    {
        // new
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            default: null
        },
        username: {
            type: String, required: true
        },
        commentDescription: {
            type: String, required: true
        },
        date: {
            type: Date, required: true
        },
        replyComments: [{
            // new
            replyUserId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                default: null
            },
            replyUsername: String,
            replyCommentDescription: String,
            replyDate: Date,
        }]
    },
    { timestamps: true, }
);

const CommentDB = mongoose.model(`comment`, commentSchema);
export default CommentDB;