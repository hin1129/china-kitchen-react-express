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
    const rawDate = commentListProps.date;
    const parsedDate = rawDate ? new Date(rawDate) : null;
    const hasValidDate = parsedDate && !Number.isNaN(parsedDate.getTime());
    const safeDate = hasValidDate ? parsedDate : null;
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
                    ...(safeDate ? { date: safeDate.toISOString() } : {}),
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
        <article className="review-card">
            <header className="review-card-header">
                <div className="review-avatar" aria-hidden="true">{(myUsername || 'C').charAt(0).toUpperCase()}</div>
                <div>
                    <h2>{myUsername || 'Customer'}</h2>
                    {safeDate && (
                        <time dateTime={safeDate.toISOString()}>
                            {safeDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                    )}
                </div>
            </header>
            <p className="review-text">{myCommentDescription}</p>

            {isExpanded && isEditing && logInState && (
              <div className="review-editor"><textarea value={editedComment} onChange={(event) => setEditedComment(event.target.value)} rows="4" /><div className="review-actions"><button onClick={editCommentPutRequest} disabled={!editedComment.trim()}>Save edit</button><button className="quiet-button" onClick={() => { setIsEditing(false); setIsExpanded(false); setEditedComment(myCommentDescription); }}>Cancel</button></div></div>
            )}
            {isExpanded && isReplying && logInState && !isEditing && (
              <div className="review-editor"><textarea value={replyComment} onChange={(event) => setReplyComment(event.target.value)} rows="3" placeholder="Write a reply…" /><div className="review-actions"><button onClick={replyCommentPostRequest} disabled={!replyComment.trim()}>Post reply</button><button className="quiet-button" onClick={() => { setIsReplying(false); setReplyComment(''); }}>Cancel</button></div></div>
            )}
            {logInState && !isEditing && !isReplying && (
              <div className="review-actions">
                <button className="quiet-button" onClick={() => { setIsExpanded(true); setIsReplying(true); }}>Reply</button>
                {canManage && <><button className="quiet-button" onClick={() => { setIsExpanded(true); setIsEditing(true); }}>Edit</button><button className="quiet-button danger-button" onClick={deleteCommentDeleteRequest}>Delete</button></>}
              </div>
            )}
            {myReplyCommentsArray.length > 0 && <div className="review-replies"><button className="reply-toggle" onClick={() => setSeeReplyComments(!seeReplyComments)}>{seeReplyComments ? 'Hide replies' : `View replies (${myReplyCommentsArray.length})`}</button>{seeReplyComments && <div className="reply-list">{myReplyCommentsArray.map((reply) => <div className="reply-card" key={reply._id}><strong>{reply.replyUsername}</strong><p>{reply.replyCommentDescription}</p><small>{reply.replyDate && !Number.isNaN(new Date(reply.replyDate).getTime()) ? new Date(reply.replyDate).toLocaleDateString() : ''}</small></div>)}</div>}</div>}
        </article>
    );
};

export default Comment;
