// import React from 'react';
// import AuthService from '../services/auth.service';

// const Profile = () => {
//     // const currentUser = AuthService.getCurrentUser();
//     const currentUser = localStorage.getItem("Username")
//     const fullname = localStorage.getItem("Fullname")

//     localStorage.setItem("user", JSON.stringify({
//         username: "username",
//         fullName: "fullName",
//         address: "address"
//     }));

//     return (
//         <div className="container">
//             {!currentUser ? (
//                 <p>Not logged in</p>
//             ) : (
//                 <>
//                     <header className="jumbotron">
//                         <h3>Profile</h3>
//                         <strong>{currentUser}</strong>
//                         {/* <strong>{fullname}</strong> */}
//                     </header>

//                     <p>No extra details stored.</p>
//                 </>)
//             }
//         </div>
//     );
// };

// export default Profile;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

const Profile = () => {
    const [user, setUser] = useState({
        username: '',
        fullName: '',
        address: '',
        phoneNumber: ''
    });

    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('http://localhost:8000/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` }
            });
            setUser(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('http://localhost:8000/profile', user, {
                headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` }
            });

            const updatedUser = res.data.userData
            setUser(updatedUser)
            localStorage.setItem('Username', updatedUser.username)

            alert(res.data.message);
        } catch (error) {
            console.error(error);
            alert('Failed to update profile');
        }
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="mt-5">
            <h3>Profile</h3>
            <div>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Full Name:</strong> {user.fullName}</p>
                <p><strong>Address:</strong> {user.address || 'Not set'}</p>
                <p><strong>Phone Number:</strong> {user.phoneNumber || 'Not set'}</p>
            </div>


            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" name="fullName" value={user.fullName} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" value={user.username} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" name="address" value={user.address || ''} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" name="phoneNumber" value={user.phoneNumber || ''} onChange={handleChange} />
                </Form.Group>

                <Button type="submit" variant="primary">Update Profile</Button>
            </Form>
        </div>
    );
};

export default Profile;
