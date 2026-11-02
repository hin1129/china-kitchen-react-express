import React, { useState } from 'react';
import axios from 'axios';
import { isEmail } from 'validator';

const SignUp = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const restrictedWords = ['admin', 'administrator', 'moderator'];

    const handleSignUp = async (event) => {
        event.preventDefault();

        const trimmedFullName = fullName.trim();
        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        const validationErrors = {};

        if (trimmedFullName.length < 2 || trimmedFullName.length > 50) {
            validationErrors.fullName = 'Full name must be between 2-50 characters';
        }

        if (
            restrictedWords.some((word) =>
                trimmedFullName.toLowerCase().includes(word.toLowerCase())
            )
        ) {
            validationErrors.fullName = 'Full name contains restricted words';
        }

        if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
            validationErrors.username = 'Username must be between 3-20 characters';
        } else if (
            restrictedWords.some((word) =>
                trimmedUsername.toLowerCase().includes(word.toLowerCase())
            )
        ) {
            validationErrors.username = 'Username contains restricted words';
        }

        if (!isEmail(trimmedEmail)) {
            validationErrors.email = 'Not a valid email';
        }

        if (password.length < 8 || password.length > 40) {
            validationErrors.password = 'Password must be between 8-40 characters';
        } else if (
            !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]/.test(
                password
            )
        ) {
            validationErrors.password =
                'Password must include at least 1 upper case letter, 1 lower case letter, 1 number, and 1 symbol';
        }

        setErrors(validationErrors);
        setMessage('');

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            const response = await axios.post('http://localhost:8000/signup', {
                fullName: trimmedFullName,
                username: trimmedUsername,
                email: trimmedEmail,
                password,
            });

            setMessage(
                response.data?.message ||
                'Signup successful. Check your email to verify the account.'
            );

            setFullName('');
            setUsername('');
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error(error);

            const backendErrors = error.response?.data?.errors;

            if (backendErrors) {
                setErrors(backendErrors);
            }

            setMessage(
                error.response?.data?.message ||
                'Unable to create account'
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-card signup-card">
                <div className="auth-heading">
                    <p className="eyebrow dark">CREATE YOUR ACCOUNT</p>
                    <h1>Sign up</h1>
                    <p>Create an account to order for collection or delivery and keep your order history together.</p>
                </div>

                <form onSubmit={handleSignUp} className="auth-form">
                    <div className="form-field">
                        <label htmlFor="fullName">Full name</label>
                        <input type="text" name="fullName" id="fullName" autoComplete="name" value={fullName}
                            onChange={(event) => { setFullName(event.target.value); setErrors((previous) => ({ ...previous, fullName: '' })); }}
                            placeholder="Your full name" />
                        {errors.fullName && <div className="form-error" role="alert">{errors.fullName}</div>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username" autoComplete="username" value={username}
                            onChange={(event) => { setUsername(event.target.value); setErrors((previous) => ({ ...previous, username: '' })); }}
                            placeholder="Choose a username" />
                        {errors.username && <div className="form-error" role="alert">{errors.username}</div>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="email">Email address</label>
                        <input type="email" name="email" id="email" autoComplete="email" value={email}
                            onChange={(event) => { setEmail(event.target.value); setErrors((previous) => ({ ...previous, email: '' })); }}
                            placeholder="you@example.com" />
                        {errors.email && <div className="form-error" role="alert">{errors.email}</div>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" autoComplete="new-password" value={password}
                            onChange={(event) => { setPassword(event.target.value); setErrors((previous) => ({ ...previous, password: '' })); }}
                            placeholder="8–40 characters" />
                        {errors.password && <div className="form-error" role="alert">{errors.password}</div>}
                        <small className="field-hint">Use upper and lower case letters, a number and a symbol.</small>
                    </div>

                    <button className="auth-submit" type="submit" disabled={submitting || !fullName.trim() || !username.trim() || !email.trim() || !password}>
                        {submitting ? 'Signing up...' : 'Sign up'}
                    </button>
                </form>

                {message && <div className="auth-message" role="status">{message}</div>}
                <p className="auth-switch">Already have an account? <a href="/signin">Sign in</a></p>
            </section>
        </main>
    );
};

export default SignUp;