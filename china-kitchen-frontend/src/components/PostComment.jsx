// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios'

// const PostComment = () => {
//     const [commentDescription, setCommentDescription] = useState(``)
//     const navigate = useNavigate();

//     const submitCommentPostRequest = async (comment) => {
//         try {
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('Token')}`,
//                 }
//             };
//             const response = await axios.post(`http://localhost:8000/postcomment`, comment, config);
//             return (response.data);
//         }
//         catch (error) { alert(`PostComment - PostRequest error`) }
//     }

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         // pass object to post request
//         const trimmedDescription = commentDescription.trim();
//         const username = localStorage.getItem("Username")
//         const createCommentObject = {
//             username: username,
//             commentDescription: trimmedDescription,
//             date: new Date().toISOString()
//         }
//         await submitCommentPostRequest(createCommentObject);
//         navigate('/commentlist')
//         console.log(createCommentObject)
//     }

//     return (
//         <form onSubmit={handleSubmit}>
//             <br />

//             <label htmlFor="commentDescription">description:</label>
//             <input
//                 type="text"
//                 placeholder="comment description"
//                 name="commentDescription"
//                 value={commentDescription}
//                 onChange={event => setCommentDescription(event.target.value)}
//             />
//             <br />

//             <input type="submit" value="submit" disabled={!commentDescription.trim()} />
//         </form>
//     )
// }

// export default PostComment

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostComment = () => {
    const [commentDescription, setCommentDescription] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedDescription = commentDescription.trim();

        if (!trimmedDescription) {
            return;
        }

        setError('');

        try {
            await axios.post(
                'http://localhost:8000/postcomment',
                {
                    commentDescription: trimmedDescription,
                    date: new Date().toISOString(),
                },
                {
                    withCredentials: true,
                }
            );

            navigate('/commentlist');
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Failed to post comment');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <br />

            <label htmlFor="commentDescription">Description:</label>
            <input
                type="text"
                placeholder="comment description"
                name="commentDescription"
                value={commentDescription}
                onChange={(event) => setCommentDescription(event.target.value)}
            />

            {error && <div role="alert">{error}</div>}
            <br />

            <input
                type="submit"
                value="submit"
                disabled={!commentDescription.trim()}
            />
        </form>
    );
};

export default PostComment;
