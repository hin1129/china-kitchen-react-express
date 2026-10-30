import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = ({ setLogInState, setCurrentUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const [twoFactorStep, setTwoFactorStep] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    const [twoFactorMessage, setTwoFactorMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const finishLogin = (userData) => {
        setCurrentUser(userData);
        setLogInState(true);

        const returnTo =
            location.state?.returnTo || '/';

        navigate(returnTo, {
            replace: true
        });
    };

    const startTwoFactorSetup = async () => {
        const response = await axios.post(
            'http://localhost:8000/admin/2fa/setup',
            {},
            {
                withCredentials: true
            }
        );

        setQrCodeDataUrl(
            response.data.qrCodeDataUrl
        );

        setTwoFactorStep('setup');
        setTwoFactorMessage(
            'Scan this QR code with your authenticator app, then enter the 6-digit code.'
        );
    };

    const handleSignIn = async (event) => {
        event.preventDefault();

        const validationErrors = {};

        if (!email.trim()) {
            validationErrors.email =
                'Email is required.';
        }

        if (!password) {
            validationErrors.password =
                'Password is required.';
        }

        setErrors(validationErrors);

        if (
            Object.keys(validationErrors).length > 0
        ) {
            return;
        }

        setSubmitting(true);
        setTwoFactorMessage('');

        try {
            const response = await axios.post(
                'http://localhost:8000/signin',
                {
                    email: email.trim(),
                    password,
                },
                {
                    withCredentials: true,
                }
            );

            const responseData = response.data;

            if (
                responseData.requiresTwoFactorSetup
            ) {
                await startTwoFactorSetup();
                return;
            }

            if (
                responseData.requiresTwoFactor
            ) {
                setTwoFactorStep('verify');
                setTwoFactorMessage(
                    'Enter the 6-digit code from your authenticator app.'
                );
                return;
            }

            const userData =
                responseData.userData ||
                responseData.user ||
                responseData;

            finishLogin(userData);
        }
        catch (error) {
            console.error(
                'Sign in failed:',
                error
            );

            const message =
                error.response?.data?.message ||
                'Unable to sign in';

            if (
                error.response?.status === 403
            ) {
                setErrors({
                    email: '',
                    password: message,
                });
            }
            else if (
                error.response?.status === 401
            ) {
                setErrors({
                    email: '',
                    password: message,
                });
            }
            else {
                setErrors({
                    email: '',
                    password: message,
                });
            }
        }
        finally {
            setSubmitting(false);
        }
    };

    const handleTwoFactorSubmit =
        async (event) => {
            event.preventDefault();

            if (
                !/^\d{6}$/.test(
                    twoFactorCode.trim()
                )
            ) {
                setErrors({
                    twoFactor:
                        'Enter a valid 6-digit code.'
                });

                return;
            }

            setSubmitting(true);
            setErrors({});
            setTwoFactorMessage('');

            try {
                const endpoint =
                    twoFactorStep === 'setup'
                        ? 'http://localhost:8000/admin/2fa/setup/verify'
                        : 'http://localhost:8000/admin/2fa/verify';

                const response =
                    await axios.post(
                        endpoint,
                        {
                            code:
                                twoFactorCode.trim()
                        },
                        {
                            withCredentials:
                                true
                        }
                    );

                finishLogin(
                    response.data.user
                );
            }
            catch (error) {
                console.error(
                    '2FA failed:',
                    error
                );

                setErrors({
                    twoFactor:
                        error.response?.data?.message ||
                        'Unable to verify authentication code'
                });
            }
            finally {
                setSubmitting(false);
            }
        };

    if (twoFactorStep) {
        return (
            <div>
                <br />
                <h2>
                    Admin Two-Factor Authentication
                </h2>

                {twoFactorStep === 'setup' &&
                    qrCodeDataUrl && (
                        <div>
                            <p>
                                Scan this QR code with
                                your authenticator app.
                            </p>

                            <img
                                src={qrCodeDataUrl}
                                alt="China Kitchen admin two-factor authentication QR code"
                                style={{
                                    width: '220px',
                                    height: '220px'
                                }}
                            />
                        </div>
                    )}

                {twoFactorMessage && (
                    <p>{twoFactorMessage}</p>
                )}

                <form
                    onSubmit={
                        handleTwoFactorSubmit
                    }
                >
                    <label htmlFor="twoFactorCode">
                        6-digit code:
                    </label>

                    <input
                        id="twoFactorCode"
                        name="twoFactorCode"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength="6"
                        value={twoFactorCode}
                        onChange={(event) => {
                            const value =
                                event.target.value
                                    .replace(/\D/g, '')
                                    .slice(0, 6);

                            setTwoFactorCode(value);

                            setErrors(
                                previous => ({
                                    ...previous,
                                    twoFactor: ''
                                })
                            );
                        }}
                    />

                    {errors.twoFactor && (
                        <div role="alert">
                            {errors.twoFactor}
                        </div>
                    )}

                    <br />

                    <input
                        type="submit"
                        value={
                            submitting
                                ? 'Verifying...'
                                : twoFactorStep === 'setup'
                                    ? 'Enable 2FA'
                                    : 'Verify and sign in'
                        }
                        disabled={
                            submitting ||
                            twoFactorCode.length !== 6
                        }
                    />
                </form>
            </div>
        );
    }

    return (
        <div>
            <br />
            <h2>Sign In</h2>

            <form onSubmit={handleSignIn}>
                <label htmlFor="email">
                    Email:
                </label>

                <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(event) => {
                        setEmail(
                            event.target.value
                        );

                        setErrors(
                            previous => ({
                                ...previous,
                                email: ''
                            })
                        );
                    }}
                />

                {errors.email && (
                    <div role="alert">
                        {errors.email}
                    </div>
                )}

                <br />

                <label htmlFor="password">
                    Password:
                </label>

                <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(event) => {
                        setPassword(
                            event.target.value
                        );

                        setErrors(
                            previous => ({
                                ...previous,
                                password: ''
                            })
                        );
                    }}
                />

                {errors.password && (
                    <div role="alert">
                        {errors.password}
                    </div>
                )}

                <br />

                <input
                    type="submit"
                    value={
                        submitting
                            ? 'Signing in...'
                            : 'Sign in'
                    }
                    disabled={
                        submitting ||
                        !email.trim() ||
                        !password
                    }
                />
            </form>
        </div>
    );
};

export default SignIn;
