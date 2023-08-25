import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const EmailVerification = () => {
    const { token } = useParams()
    const [emailVerificationStatus, setEmailVerificationStatus] = useState('')

    useEffect(() => {
        axios.get(`http://localhost:8000/emailverification/${token}`)
            .then(response => {
                setEmailVerificationStatus('Email verification successful')
            })
            .catch((error) => {
                setEmailVerificationStatus('Invalid or expired token')
            })
    }, [token])

    return (
        <div>
            <br />
            <h2>Email Verification</h2>
            <p>{emailVerificationStatus}</p>
        </div>
    )
}

export default EmailVerification