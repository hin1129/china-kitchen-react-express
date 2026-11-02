import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Comment from './Comment';
import { Link } from 'react-router-dom';

const CommentList = ({ logInState, currentUser }) => {
    const [commentList, setCommentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getCommentListGetRequest = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/');
            setCommentList(response.data);
            setError('');
        } catch (error) {
            console.error(error);
            setError('Reviews could not be loaded. Please try again.');
        } finally { setLoading(false); }
    };

    useEffect(() => { getCommentListGetRequest(); }, [logInState]);
    const handleEditComment = (editedComment) => setCommentList((prev) => prev.map((c) => c._id === editedComment._id ? editedComment : c));
    const handleDeleteComment = (id) => setCommentList((prev) => prev.filter((c) => c._id !== id));
    const handleReplyComment = (id, newReply) => setCommentList((prev) => prev.map((c) => c._id === id ? { ...c, replyComments: [...(c.replyComments || []), newReply] } : c));

    return (
      <main className="content-page reviews-page">
        <section className="page-hero reviews-hero">
          <div><p className="eyebrow dark">CUSTOMER REVIEWS</p><h1>What our customers say</h1><p>Read feedback from China Kitchen customers.</p></div>
          {logInState ? <Link className="primary-cta dark-button" to="/postcomment">Leave a review</Link> : <Link className="primary-cta dark-button" to="/signin">Sign in to review</Link>}
        </section>
        {loading && <div className="review-state">Loading reviews…</div>}
        {error && <div className="review-state error-text">{error}</div>}
        {!loading && !error && commentList.length === 0 && <div className="review-state"><h2>No reviews yet</h2><p>Be the first to leave a review.</p></div>}
        <section className="reviews-list">
          {commentList.map((currentComment) => <Comment commentListProps={currentComment} key={currentComment._id} onEdit={handleEditComment} onDelete={handleDeleteComment} onReply={handleReplyComment} logInState={logInState} currentUser={currentUser} />)}
        </section>
      </main>
    );
};
export default CommentList;
