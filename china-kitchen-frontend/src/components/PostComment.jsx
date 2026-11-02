import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostComment = () => {
    const [commentDescription, setCommentDescription] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const trimmedDescription = commentDescription.trim();
        if (!trimmedDescription) return;
        setError(''); setSubmitting(true);
        try {
            await axios.post('http://localhost:8000/postcomment', { commentDescription: trimmedDescription, date: new Date().toISOString() }, { withCredentials: true });
            navigate('/commentlist');
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Failed to post review');
        } finally { setSubmitting(false); }
    };
    return (
      <main className="form-page review-form-page">
        <section className="form-card review-form-card">
          <p className="eyebrow dark">CUSTOMER REVIEW</p><h1>Leave a review</h1>
          <p className="form-intro">Share your experience with China Kitchen. Your username is shown publicly instead of your full name.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="commentDescription">Your review</label>
            <textarea id="commentDescription" name="commentDescription" rows="6" maxLength="1000" placeholder="Write your review…" value={commentDescription} onChange={(e) => setCommentDescription(e.target.value)} />
            <div className="review-form-meta"><span>{commentDescription.length}/1000</span></div>
            {error && <div className="form-error" role="alert">{error}</div>}
            <div className="form-actions"><button className="form-submit" type="submit" disabled={!commentDescription.trim() || submitting}>{submitting ? 'Posting…' : 'Post review'}</button><Link to="/commentlist" className="form-secondary">Cancel</Link></div>
          </form>
        </section>
      </main>
    );
};
export default PostComment;
