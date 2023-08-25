import React, { useState, useEffect, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie'
import jwt_decode from 'jwt-decode';

const SignIn = ({ setLogInState }) => {
    const [email, setEmail] = useState(``);
    const [password, setPassword] = useState(``);
    // const [errors, setErrors] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState(``);
    const cookies = new Cookies()
    const navigate = useNavigate();

    const submitSignUpPostRequest = async (user) => {
        try {
            const response = await axios.post("http://localhost:8000/signin", (user))
            return (response.data)
        }
        catch (error) {
            alert(`SignIn - handleSignIn`)
            console.log(error)
            throw error
        }
    }

    const handleSignIn = async (event) => {
        event.preventDefault();

        // validation
        const validationErrors = {};
        if (!email) { validationErrors.email = 'Email is required.'; }
        if (!password) { validationErrors.password = 'Password is required.'; }
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) { return; }

        try {
            const trimmedEmail = email.trim();
            const trimmedPassword = password.trim();
            const user = { email: trimmedEmail, password: trimmedPassword }
            const responseData = await submitSignUpPostRequest(user)
            console.log(responseData)

            // // token in header
            // const headerToken = responseData.headers['authorization'].split(' ')[1]
            // const headerToken = responseData.headers.authorization.split(' ')[1]; // Extract the token
            // console.log(`headerToken: ${headerToken}`)
            // token in cookies
            // const cookiesToken = responseData.cookie
            // console.log(cookiesToken)

            // key, value, accessible across all pages of website
            const token = responseData.token;
            const decodedToken = jwt_decode(token);
            const expirationTime = decodedToken.exp * 1000;
            localStorage.setItem('TokenExpiration', expirationTime);
            localStorage.setItem('Token', token)
            localStorage.setItem('LoggedIn', true)
            localStorage.setItem('Username', responseData.username)
            // cookies.set("Token", responseData.token, { path: "/", })
            cookies.set("Token", responseData.token)
            setLogInState(true)
            navigate('/')
            alert(responseData.message)//
        }
        catch (error) {
            alert(`SignIn - handleSignIn`)
            console.log(error)

            if (error?.response?.status === 404) {
                setErrors({ email: 'Email does not exist', password: '' });
            }
            else if (error?.response?.status === 400) {
                setErrors({ ...errors, password: 'Invalid password' });
            }
            else {
                setErrors({ email: '', password: 'An unknown error occurred' });
            }
        }
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
        setErrors({ ...errors, email: '' })
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
        setErrors({ ...errors, password: '' })
    }

    return (
        <div>
            <br />SignIn

            <form onSubmit={handleSignIn}>
                <label htmlFor="email">email:</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                />
                {errors.email && <div role="alert">{errors.email}</div>}
                <br />

                <label htmlFor="password">password:</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                {errors.password && <div role="alert">{errors.password}</div>}
                <br />

                <input
                    type="submit"
                    value="sign in"
                    disabled={!email.trim() || !password.trim()}
                />
            </form>
        </div>
    )
}

export default SignIn