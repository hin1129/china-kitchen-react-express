import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Comment = ({ commentListProps, onEdit, onDelete, onReply, logInState }) => {
    // retrieve data from comment-list
    const myUsername = commentListProps.username;
    const myCommentDescription = commentListProps.commentDescription;
    const myDate = new Date(commentListProps.date)
    const myID = commentListProps._id
    // reply comments 
    // const seeCommentListProps = commentListProps
    const myReplyCommentsArray = commentListProps.replyComments

    // expand, edit, cancel
    const [isExpanded, setIsExpanded] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editedComment, setEditedComment] = useState(myCommentDescription)

    // replies
    const [isReplying, setIsReplying] = useState(false)
    const [replyComment, setReplyComment] = useState('')
    const [seeReplyComments, setSeeReplyComments] = useState(false)

    // user state
    const loggedInUsername = localStorage.getItem('Username')
    const isCurrentUser = myUsername === loggedInUsername

    const editCommentPutRequest = async () => {
        try {
            const trimmedEditedComment = editedComment.trim();
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('Token')}`,
                }
            };
            const response = await axios.put(`http://localhost:8000/comment/${myID}`, {
                // for backend validation
                username: myUsername,
                commentDescription: editedComment,
                date: myDate.toISOString()
            }, config)
            setIsEditing(false) // back to non-editable
            console.log(`comment edited: ${response}`)
            console.log(`comment id edited: ${myID}`)
            console.log(`comment edited: ${editedComment}`)
            // notify parent component about edited comment
            onEdit({
                ...commentListProps, // copy existing properties
                // commentDescription: editedComment // update description
                commentDescription: trimmedEditedComment,
            })
            setIsExpanded(false); // back to non-expanded
        }
        catch (error) {
            alert(`Comment - PutRequest error`)
            console.log(error);
        }
    }

    const deleteCommentDeleteRequest = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('Token')}`,
                }
            };
            // delete comment by its ID
            const response = await axios.delete(`http://localhost:8000/comment`,
                { data: { id: myID }, headers: config.headers }
            );
            // notify parent component about deletion
            onDelete(myID);
            console.log(`comment id deleted: ${myID}`)
        }
        catch (error) {
            alert(`Comment - DeleteRequest error`)
            console.log(error);
        }
    };

    // reply to comment
    const replyCommentPostRequest = async () => {
        try {
            if (replyComment.trim() !== '') {
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('Token')}`,
                    }
                };
                const response = await axios.post(
                    `http://localhost:8000/comment/${myID}/reply`,
                    {
                        username: loggedInUsername,
                        replyDescription: replyComment,
                        date: new Date().toISOString(),
                    },
                    config
                );
                // add new reply to comment's replyComments array
                onReply(myID, response.data);
                setReplyComment('');
                setIsExpanded(false) // back to non-editable
                window.location.reload()
            }
        } catch (error) {
            alert('Comment - PostRequest error, error adding reply');
            console.log(error);
        }
    }

    // group 1
    const handleReplyClick = () => {
        setIsReplying(true)
    }

    const handleCancelReplyComment = () => {
        setIsReplying(false)
        setReplyComment('');
    }

    const handleExpandClick = () => {
        setIsExpanded(!isExpanded)
        setIsEditing(false)
    }

    const handleCancelExpandClick = () => {
        setIsExpanded(false)
    }

    const handleEditComment = () => {
        setIsExpanded(true);
        setIsEditing(true);
    }

    const handleCancelEditComment = () => {
        setIsExpanded(false);
        setIsEditing(false);
        setEditedComment(myCommentDescription);
    }

    // group 2 - like/dislike
    const handleReplyCommentsClick = () => { setSeeReplyComments(true) }

    const handleCancelReplyCommentsClick = () => { setSeeReplyComments(false) }

    const myRepliedComments = (replyCommentsArray) => {
        if (replyCommentsArray && replyCommentsArray.length > 0) {
            return (
                <div>
                    <h4>Replies:</h4>
                    {/* <ul> */}
                    {replyCommentsArray.map((currentReplyCommentsArray, index) => (
                        <p key={currentReplyCommentsArray._id}>
                            {currentReplyCommentsArray.username}<br />
                            {currentReplyCommentsArray.replyDescription}<br />
                            {currentReplyCommentsArray.date}<br />
                        </p>
                    ))}
                    {/* </ul> */}
                </div>
            );
        }
        else { return null; }
    }

    return (
        <div >
            <br />

            <div className='comment-table'>
                {/* origin comments */}
                {myID}<br />
                {myUsername}<br />
                {myCommentDescription}<br />
                {myDate.toLocaleString()}<br />

                {/* see replies */}
                {seeReplyComments ? (
                    <>
                        <button onClick={handleCancelReplyCommentsClick}>cancel see replies</button>
                        {myRepliedComments(myReplyCommentsArray)}
                    </>
                ) : (
                    <>

                        {myRepliedComments(myReplyCommentsArray) && (
                            <>
                                <button onClick={handleReplyCommentsClick} >see replies</button>
                                <br />
                            </>
                        )}
                    </>
                )}
                {/* <button onClick={handleReplyCommentsClick} disabled={!myRepliedComments(myReplyCommentsArray)}>see replies</button> */}

                {/* expand option */}
                {isExpanded ? (
                    // expand - true
                    <>
                        {isEditing && logInState ? (
                            // edit = true
                            <>
                                <textarea
                                    value={editedComment}
                                    onChange={(event) => setEditedComment(event.target.value)}
                                /><br />
                                <button onClick={editCommentPutRequest} disabled={!editedComment.trim()}>Save edit</button>
                                <button onClick={handleCancelEditComment}>Cancel edit</button>
                            </>
                        ) : (
                            // edit = false 
                            <>
                                {isReplying && logInState ? (
                                    // replying = true
                                    <>
                                        <textarea
                                            value={replyComment}
                                            onChange={(event) => setReplyComment(event.target.value)}
                                        /><br />
                                        <button onClick={replyCommentPostRequest} disabled={!replyComment.trim()}>Save reply</button>
                                        <button onClick={handleCancelReplyComment}>Cancel reply</button>
                                    </>
                                ) : (
                                    // replying = false
                                    <>
                                        {logInState && (
                                            <>
                                                <button onClick={handleReplyClick}>Reply</button><br />
                                            </>
                                        )}
                                        {/* <button onClick={handleReplyClick}>Reply</button><br /> */}
                                        {logInState && isCurrentUser && (
                                            <>
                                                <button onClick={handleEditComment}>Edit</button><br />
                                                <button onClick={deleteCommentDeleteRequest}>Delete</button><br />
                                                <button onClick={handleCancelExpandClick}>Cancel</button><br />
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    // expand = false
                    <>
                        {logInState && (
                            // <button onClick={handleExpandClick}>Expand</button>
                            <button onClick={handleExpandClick} class="btn btn-link btn-sm px-3" data-ripple-color="dark">
                                Expand
                                <i class="fas fa-times"></i>
                            </button>
                        )}
                    </>
                )}
                {/* end of isExpanded check */}
            </div>

        </div >
    )
}

export default Comment