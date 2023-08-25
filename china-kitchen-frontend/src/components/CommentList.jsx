import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Comment from './Comment'

const CommentList = ({ logInState }) => {
    const [commentList, setCommentList] = useState([])

    const getCommentListGetRequest = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/`)
            setCommentList(response.data)
            console.log(response.data)
        }
        catch (error) {
            alert(`CommentList - GetRequest error`)
            console.dir(error)
        }
    }

    // rerun server if login state changes (hide expand button)
    useEffect(() => {
        getCommentListGetRequest()
    }, [logInState])
    // useEffect(() => {
    //     getCommentListGetRequest()
    // }, [commentList])

    // edit comment
    const handleEditComment = (editedComment) => {
        setCommentList((previousComments) => {
            // iterate existing array and update the edited comment
            return previousComments.map(
                (comment) => comment._id === editedComment._id ? editedComment : comment
            );
        });
    };

    // delete comment
    const handleDeleteComment = (deleteCommentID) => {
        // previous state value of comment list
        setCommentList((previousComments) => {
            // iterate existing array, skip deleteCommentID, create array
            return previousComments.filter(
                (comment) => comment._id !== deleteCommentID
            );
        })
    }

    // reply to comment
    const handleReplyComment = (replyCommentID, newReply) => {
        setCommentList((previousComments) => {
            return previousComments.map((comment) => {
                if (comment._id === replyCommentID) {
                    // Update comment model's replyComments array with new reply
                    const updatedReplies = [...comment.replyComments, newReply];
                    return { ...comment, replyComments: updatedReplies };
                }
                return comment;
            });
        });
    };

    // pass data to comment component
    const allComments = commentList.map(
        currentComment => {
            return (
                <Comment
                    commentListProps={currentComment}
                    key={currentComment._id}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                    onReply={handleReplyComment}
                    logInState={logInState}
                />
            )
        }
    )

    return (
        <div>
            {allComments}
        </div>
    )
}

export default CommentList