import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
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
        replyUsername: String,
        replyCommentDescription: String,
        replyDate: Date,
    }]
}, { timestamps: true, }
);

const CommentDB = mongoose.model(`comment`, commentSchema);
export default CommentDB;