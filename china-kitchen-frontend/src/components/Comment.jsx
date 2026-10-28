// import React, { useEffect, useState } from 'react'
// import axios from 'axios';

// const Comment = ({ commentListProps, onEdit, onDelete, onReply, logInState }) => {
//     // retrieve data from comment-list
//     const myUsername = commentListProps.username;
//     const myCommentDescription = commentListProps.commentDescription;
//     const myDate = new Date(commentListProps.date)
//     const myID = commentListProps._id
//     // reply comments
//     // const seeCommentListProps = commentListProps
//     const myReplyCommentsArray = commentListProps.replyComments

//     // expand, edit, cancel
//     const [isExpanded, setIsExpanded] = useState(false)
//     const [isEditing, setIsEditing] = useState(false)
//     const [editedComment, setEditedComment] = useState(myCommentDescription)

//     // replies
//     const [isReplying, setIsReplying] = useState(false)
//     const [replyComment, setReplyComment] = useState('')
//     const [seeReplyComments, setSeeReplyComments] = useState(false)

//     // user state
//     const loggedInUsername = localStorage.getItem('Username')
//     const isCurrentUser = myUsername === loggedInUsername

//     const editCommentPutRequest = async () => {
//         try {
//             const trimmedEditedComment = editedComment.trim();
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('Token')}`,
//                 }
//             };
//             const response = await axios.put(`http://localhost:8000/comment/${myID}`, {
//                 // for backend validation
//                 username: myUsername,
//                 commentDescription: editedComment,
//                 date: myDate.toISOString()
//             }, config)
//             setIsEditing(false) // back to non-editable
//             console.log(`comment edited: ${response}`)
//             console.log(`comment id edited: ${myID}`)
//             console.log(`comment edited: ${editedComment}`)
//             // notify parent component about edited comment
//             onEdit({
//                 ...commentListProps, // copy existing properties
//                 // commentDescription: editedComment // update description
//                 commentDescription: trimmedEditedComment,
//             })
//             setIsExpanded(false); // back to non-expanded
//         }
//         catch (error) {
//             alert(`Comment - PutRequest error`)
//             console.log(error);
//         }
//     }

//     const deleteCommentDeleteRequest = async () => {
//         try {
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('Token')}`,
//                 }
//             };
//             // delete comment by its ID
//             const response = await axios.delete(`http://localhost:8000/comment`,
//                 { data: { id: myID }, headers: config.headers }
//             );
//             // notify parent component about deletion
//             onDelete(myID);
//             console.log(`comment id deleted: ${myID}`)
//             console.log(`comment deleted: ${response}`)
//         }
//         catch (error) {
//             alert(`Comment - DeleteRequest error`)
//             console.log(error);
//         }
//     };

//     // reply to comment
//     const replyCommentPostRequest = async () => {
//         try {
//             if (replyComment.trim() !== '') {
//                 const config = {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem('Token')}`,
//                     }
//                 };
//                 const response = await axios.post(
//                     `http://localhost:8000/comment/${myID}/reply`,
//                     {
//                         replyUsername: loggedInUsername,
//                         replyCommentDescription: replyComment,
//                         replyDate: new Date().toISOString(),
//                     },
//                     config
//                 );
//                 // add new reply to comment's replyComments array
//                 onReply(myID, response.data);
//                 setReplyComment('');
//                 setIsExpanded(false) // back to non-editable
//                 window.location.reload() // reload current page
//             }
//         } catch (error) {
//             alert('Comment - PostRequest error, error adding reply');
//             console.log(error);
//         }
//     }

//     // expand, edit, cancel
//     const handleReplyClick = () => {
//         setIsReplying(true)
//     }

//     const handleCancelReplyComment = () => {
//         setIsReplying(false)
//         setReplyComment('');
//     }

//     const handleExpandClick = () => {
//         setIsExpanded(!isExpanded)
//         setIsEditing(false)
//     }

//     const handleCancelExpandClick = () => {
//         setIsExpanded(false)
//     }

//     const handleEditComment = () => {
//         setIsExpanded(true);
//         setIsEditing(true);
//     }

//     const handleCancelEditComment = () => {
//         setIsExpanded(false);
//         setIsEditing(false);
//         setEditedComment(myCommentDescription);
//     }

//     // replies (like/dislike)
//     const handleReplyCommentsClick = () => { setSeeReplyComments(true) }

//     const handleCancelReplyCommentsClick = () => { setSeeReplyComments(false) }

//     const myRepliedComments = (replyCommentsArray) => {
//         if (replyCommentsArray && replyCommentsArray.length > 0) {
//             return (
//                 <>
//                     <h4>Replies:</h4>
//                     {/* <ul> */}
//                     {replyCommentsArray.map((currentReplyCommentsArray) => (
//                         <p key={currentReplyCommentsArray._id}>
//                             {currentReplyCommentsArray.replyUsername}<br />
//                             {currentReplyCommentsArray.replyCommentDescription}<br />
//                             {currentReplyCommentsArray.replyDate}<br />
//                         </p>
//                     ))}
//                     {/* </ul> */}
//                 </>
//             );
//         }
//         else { return null; }
//     }

//     return (
//         <div >
//             <br />

//             <div className='comment-table' >
//                 {/* origin comments */}
//                 {myUsername}<br />
//                 {myCommentDescription}<br />
//                 {myDate.toLocaleString()}<br />


//                 {/* expand option */}
//                 {isExpanded ? (
//                     // isExpanded - true
//                     <>
//                         {isEditing && logInState ? (
//                             // isEditing = true
//                             <>
//                                 <textarea
//                                     value={editedComment}
//                                     onChange={(event) => setEditedComment(event.target.value)}
//                                 /><br />
//                                 <button onClick={editCommentPutRequest} disabled={!editedComment.trim()}>Save edit</button>
//                                 <button onClick={handleCancelEditComment}>Cancel edit</button>
//                             </>
//                         ) : (
//                             // isEditing = false
//                             <>
//                                 {isReplying && logInState ? (
//                                     // isReplying = true
//                                     <>
//                                         <textarea
//                                             value={replyComment}
//                                             onChange={(event) => setReplyComment(event.target.value)}
//                                         /><br />
//                                         <button onClick={replyCommentPostRequest} disabled={!replyComment.trim()}>Save reply</button>
//                                         <button onClick={handleCancelReplyComment}>Cancel reply</button>
//                                     </>
//                                 ) : (
//                                     // isReplying = false
//                                     <>
//                                         {logInState && (
//                                             <>
//                                                 <button onClick={handleReplyClick}>Reply</button><br />
//                                             </>
//                                         )}
//                                         {logInState && isCurrentUser && (
//                                             <>
//                                                 <button onClick={handleEditComment}>Edit</button><br />
//                                                 <button onClick={deleteCommentDeleteRequest}>Delete</button><br />
//                                                 <button onClick={handleCancelExpandClick}>Cancel</button><br />
//                                             </>
//                                         )}
//                                     </>
//                                 )}
//                             </>
//                         )}
//                     </>
//                 ) : (
//                     // isExpanded = false
//                     <>
//                         {logInState && (
//                             <button onClick={handleExpandClick} className="btn btn-link btn-sm px-3" data-ripple-color="dark">
//                                 Expand
//                                 {/* <i className="fas fa-times"></i> */}
//                             </button>
//                         )}
//                     </>
//                 )}
//                 {/* end of isExpanded check */}
//                 <br />
//             </div>


//             {/* see replies */}
//             {seeReplyComments ? (
//                 // seeReplyComments - true
//                 <>
//                     <button onClick={handleCancelReplyCommentsClick}>cancel see replies</button>
//                     {myRepliedComments(myReplyCommentsArray)}
//                 </>
//             ) : (
//                 // seeReplyComments - false
//                 <>
//                     {myRepliedComments(myReplyCommentsArray) && (
//                         <>
//                             <button onClick={handleReplyCommentsClick} >see replies</button>
//                             <br />
//                         </>
//                     )}
//                 </>
//             )}

//         </div >
//     )
// }

// export default Comment

import React, { useState } from 'react';
import axios from 'axios';

const Comment = ({
    commentListProps,
    onEdit,
    onDelete,
    onReply,
    logInState,
    currentUser,
}) => {
    const myUsername = commentListProps.username;
    const myCommentDescription = commentListProps.commentDescription;
    const myDate = new Date(commentListProps.date);
    const myID = commentListProps._id;
    const myReplyCommentsArray = commentListProps.replyComments || [];

    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(myCommentDescription);
    const [isReplying, setIsReplying] = useState(false);
    const [replyComment, setReplyComment] = useState('');
    const [seeReplyComments, setSeeReplyComments] = useState(false);

    const currentUserId = currentUser?._id || currentUser?.userId;
    const commentUserId = commentListProps.userId?._id || commentListProps.userId;

    const isCurrentUser =
        Boolean(currentUserId) &&
        Boolean(commentUserId) &&
        String(currentUserId) === String(commentUserId);

    const canManage = isCurrentUser || currentUser?.role === 'admin';

    const editCommentPutRequest = async () => {
        const trimmedEditedComment = editedComment.trim();

        if (!trimmedEditedComment) {
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8000/comment/${myID}`,
                {
                    commentDescription: trimmedEditedComment,
                    date: myDate.toISOString(),
                },
                {
                    withCredentials: true,
                }
            );

            setIsEditing(false);
            setIsExpanded(false);

            onEdit({
                ...commentListProps,
                ...(response.data?.comment || {}),
                commentDescription: trimmedEditedComment,
            });
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to edit comment');
        }
    };

    const deleteCommentDeleteRequest = async () => {
        try {
            await axios.delete('http://localhost:8000/comment', {
                data: { id: myID },
                withCredentials: true,
            });

            onDelete(myID);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to delete comment');
        }
    };

    const replyCommentPostRequest = async () => {
        const trimmedReply = replyComment.trim();

        if (!trimmedReply) {
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8000/comment/${myID}/reply`,
                {
                    replyCommentDescription: trimmedReply,
                    replyDate: new Date().toISOString(),
                },
                {
                    withCredentials: true,
                }
            );

            const newReply = response.data.reply || response.data;
            onReply(myID, newReply);
            setReplyComment('');
            setIsReplying(false);
            setIsExpanded(false);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to add reply');
        }
    };

    return (
        <div>
            <br />

            <div className="comment-table">
                {myUsername}<br />
                {myCommentDescription}<br />
                {myDate.toLocaleString()}<br />

                {isExpanded ? (
                    <>
                        {isEditing && logInState ? (
                            <>
                                <textarea
                                    value={editedComment}
                                    onChange={(event) => setEditedComment(event.target.value)}
                                />
                                <br />
                                <button
                                    onClick={editCommentPutRequest}
                                    disabled={!editedComment.trim()}
                                >
                                    Save edit
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setIsExpanded(false);
                                        setEditedComment(myCommentDescription);
                                    }}
                                >
                                    Cancel edit
                                </button>
                            </>
                        ) : (
                            <>
                                {isReplying && logInState ? (
                                    <>
                                        <textarea
                                            value={replyComment}
                                            onChange={(event) => setReplyComment(event.target.value)}
                                        />
                                        <br />
                                        <button
                                            onClick={replyCommentPostRequest}
                                            disabled={!replyComment.trim()}
                                        >
                                            Save reply
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsReplying(false);
                                                setReplyComment('');
                                            }}
                                        >
                                            Cancel reply
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {logInState && (
                                            <button onClick={() => setIsReplying(true)}>Reply</button>
                                        )}

                                        {logInState && canManage && (
                                            <>
                                                <br />
                                                <button
                                                    onClick={() => {
                                                        setIsExpanded(true);
                                                        setIsEditing(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <br />
                                                <button onClick={deleteCommentDeleteRequest}>Delete</button>
                                            </>
                                        )}

                                        <br />
                                        <button onClick={() => setIsExpanded(false)}>Cancel</button>
                                    </>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    logInState && (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="btn btn-link btn-sm px-3"
                            data-ripple-color="dark"
                        >
                            Expand
                        </button>
                    )
                )}

                <br />
            </div>

            {myReplyCommentsArray.length > 0 && (
                <>
                    {seeReplyComments ? (
                        <>
                            <button onClick={() => setSeeReplyComments(false)}>
                                Hide replies
                            </button>
                            <h4>Replies:</h4>
                            {myReplyCommentsArray.map((reply) => (
                                <p key={reply._id}>
                                    {reply.replyUsername}<br />
                                    {reply.replyCommentDescription}<br />
                                    {reply.replyDate}<br />
                                </p>
                            ))}
                        </>
                    ) : (
                        <button onClick={() => setSeeReplyComments(true)}>
                            See replies
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default Comment;
