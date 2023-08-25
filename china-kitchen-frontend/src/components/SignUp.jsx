import React, { useState } from 'react'
import axios from 'axios'
import { isEmail } from 'validator'
import { Link } from 'react-router-dom'

const SignUp = () => {
    const [fullName, setFullName] = useState(``)
    const [username, setUsername] = useState(``)
    const [email, setEmail] = useState(``)
    const [password, setPassword] = useState(``)
    const [errors, setErrors] = useState({})
    const [verificationLink, setVerificationLink] = useState(``)

    const restrictedWords = ['admin', 'root', 'guest', 'test'];

    const submitSignUpPostRequest = async (user) => {
        try {
            const response = await axios.post(`http://localhost:8000/signup`, user);
            return (response.data);
        }
        catch (error) {
            alert(`SignUp - PostRequest`)
            // error responses from server
            const errorResponse = error.response.data;
            if (errorResponse.error === 'Email already exists') {
                setErrors({ ...errors, email: errorResponse.error });
            }
            else if (errorResponse.error === 'Username already exists') {
                setErrors({ ...errors, username: errorResponse.error });
            }
        }
    }

    // handle form data
    const handleSignUp = async (event) => {
        event.preventDefault();

        const trimmedFullName = fullName.trim();
        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        // validation
        const validationErrors = {}

        const fullNameIsRestrictedWord = restrictedWords.some(word => fullName.toLowerCase().includes(word.toLowerCase()));
        if (!fullName) {
            validationErrors.fullName = "Full name is empty"
        }
        else if (fullNameIsRestrictedWord) {
            validationErrors.fullName = "full name contains restricted words"
        }

        const usernameIsRestrictedWord = restrictedWords.some((word) => username.toLowerCase().includes(word.toLowerCase()))
        if (username.length < 3 || username.length > 20) {
            validationErrors.username = "Username must be between 3-20 characters"
        }
        else if (usernameIsRestrictedWord) {
            validationErrors.username = "username contains restricted words"
        }

        if (!isEmail(email)) {
            validationErrors.email = "Not a valid email"
        }

        if (password.length < 6 || password.length > 40) {
            validationErrors.password = "Password must be between 6-40 characters";
        }
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]/.test(password)) {
            validationErrors.password = "Password must include at least 1 upper case letter, 1 lower case letter, 1 number, and 1 symbol";
        }

        setErrors(validationErrors)

        // return errors if true
        if (Object.keys(validationErrors).length > 0) { return }

        // reset previous validation errors
        setErrors({})

        // pass object to post request
        const createSignUpObject = {
            fullName: trimmedFullName,
            username: trimmedUsername,
            email: trimmedEmail,
            password: trimmedPassword
        }
        const signUpResponse = await submitSignUpPostRequest(createSignUpObject); // email verification
        console.log(createSignUpObject)
        alert("Sign Up form submitted")

        // email verification
        if (signUpResponse) {
            const verificationToken = signUpResponse.verificationToken;
            const verificationLink = `emailverification/${verificationToken}`;
            setVerificationLink(verificationLink);
        }
    }

    // clear errors when inputs change
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        setErrors({ ...errors, username: '' });
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setErrors({ ...errors, email: '' });
    };

    return (
        <div>
            <br />SignUp

            <form onSubmit={handleSignUp}>
                <label htmlFor="fullName">full name:</label>
                <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={fullName}
                    onChange={event => setFullName(event.target.value)}
                />
                <br />
                {errors.fullName && <div role="alert">{errors.fullName}</div>}

                <label htmlFor="username">username:</label>
                <input
                    type="username"
                    name="username"
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                />
                <br />
                {errors.username && <div role="alert">{errors.username}</div>}

                <label htmlFor="email">email:</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                />
                <br />
                {errors.email && <div role="alert">{errors.email}</div>}

                <label htmlFor="password">password:</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                />
                {errors.password && <div role="alert">{errors.password}</div>}

                <br />
                <input
                    type="submit"
                    value="sign up"
                    disabled={
                        !fullName.trim() ||
                        !username.trim() ||
                        !email.trim() ||
                        !password.trim()
                    }
                />
            </form>

            {/* display email verification result */}
            <br />
            {verificationLink && (
                <div>
                    <p>Signup successful, check your email to verify the account</p>
                    {/* <p>
                            click <Link to={verificationLink}>here</Link> to verity your email
                        </p> */}
                </div>
            )}
        </div>
    )
}

export default SignUp