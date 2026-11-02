import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = ({ setLogInState, setCurrentUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [twoFactorStep, setTwoFactorStep] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [twoFactorMessage, setTwoFactorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const finishLogin = (userData) => {
    setCurrentUser(userData);
    setLogInState(true);

    const returnTo = location.state?.returnTo || "/";

    navigate(returnTo, {
      replace: true,
    });
  };

  const startTwoFactorSetup = async () => {
    const response = await axios.post(
      "http://localhost:8000/admin/2fa/setup",
      {},
      {
        withCredentials: true,
      },
    );

    setQrCodeDataUrl(response.data.qrCodeDataUrl);

    setTwoFactorStep("setup");
    setTwoFactorMessage(
      "Scan this QR code with your authenticator app, then enter the 6-digit code.",
    );
  };

  const handleSignIn = async (event) => {
    event.preventDefault();

    const validationErrors = {};

    if (!email.trim()) {
      validationErrors.email = "Email is required.";
    }

    if (!password) {
      validationErrors.password = "Password is required.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setTwoFactorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8000/signin",
        {
          email: email.trim(),
          password,
        },
        {
          withCredentials: true,
        },
      );

      const responseData = response.data;

      if (responseData.requiresTwoFactorSetup) {
        await startTwoFactorSetup();
        return;
      }

      if (responseData.requiresTwoFactor) {
        setTwoFactorStep("verify");
        setTwoFactorMessage(
          "Enter the 6-digit code from your authenticator app.",
        );
        return;
      }

      const userData =
        responseData.userData || responseData.user || responseData;

      finishLogin(userData);
    } catch (error) {
      console.error("Sign in failed:", error);

      const message = error.response?.data?.message || "Unable to sign in";

      if (error.response?.status === 403) {
        setErrors({
          email: "",
          password: message,
        });
      } else if (error.response?.status === 401) {
        setErrors({
          email: "",
          password: message,
        });
      } else {
        setErrors({
          email: "",
          password: message,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleTwoFactorSubmit = async (event) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(twoFactorCode.trim())) {
      setErrors({
        twoFactor: "Enter a valid 6-digit code.",
      });

      return;
    }

    setSubmitting(true);
    setErrors({});
    setTwoFactorMessage("");

    try {
      const endpoint =
        twoFactorStep === "setup"
          ? "http://localhost:8000/admin/2fa/setup/verify"
          : "http://localhost:8000/admin/2fa/verify";

      const response = await axios.post(
        endpoint,
        {
          code: twoFactorCode.trim(),
        },
        {
          withCredentials: true,
        },
      );

      finishLogin(response.data.user);
    } catch (error) {
      console.error("2FA failed:", error);

      setErrors({
        twoFactor:
          error.response?.data?.message ||
          "Unable to verify authentication code",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (twoFactorStep) {
    return (
      <main className="auth-page">
        <section className="auth-card auth-card-narrow">
          <div className="auth-heading">
            <p className="eyebrow dark">ADMIN SECURITY</p>
            <h1>Two-factor authentication</h1>
            <p>{twoFactorMessage || "Enter your authenticator code to continue."}</p>
          </div>
          {twoFactorStep === "setup" && qrCodeDataUrl && (
            <div className="two-factor-qr"><img src={qrCodeDataUrl} alt="China Kitchen admin two-factor authentication QR code" /></div>
          )}
          <form onSubmit={handleTwoFactorSubmit} className="auth-form">
            <div className="form-field">
              <label htmlFor="twoFactorCode">6-digit code</label>
              <input id="twoFactorCode" name="twoFactorCode" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength="6" value={twoFactorCode} onChange={(event) => { const value = event.target.value.replace(/\D/g, "").slice(0, 6); setTwoFactorCode(value); setErrors((previous) => ({ ...previous, twoFactor: "" })); }} placeholder="000000" />
              {errors.twoFactor && <div className="form-error" role="alert">{errors.twoFactor}</div>}
            </div>
            <button className="auth-submit" type="submit" disabled={submitting || twoFactorCode.length !== 6}>{submitting ? "Verifying..." : twoFactorStep === "setup" ? "Enable 2FA" : "Verify and sign in"}</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-heading">
          <p className="eyebrow dark">WELCOME BACK</p>
          <h1>Sign in</h1>
          <p>Sign in to continue your order and view your account.</p>
        </div>
        <form onSubmit={handleSignIn} className="auth-form">
          <div className="form-field"><label htmlFor="email">Email address</label><input type="email" name="email" id="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setErrors((previous) => ({ ...previous, email: "" })); }} placeholder="you@example.com" />{errors.email && <div className="form-error" role="alert">{errors.email}</div>}</div>
          <div className="form-field"><label htmlFor="password">Password</label><input type="password" name="password" id="password" autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setErrors((previous) => ({ ...previous, password: "" })); }} placeholder="Enter your password" />{errors.password && <div className="form-error" role="alert">{errors.password}</div>}</div>
          <button className="auth-submit" type="submit" disabled={submitting || !email.trim() || !password}>{submitting ? "Signing in..." : "Sign in"}</button>
        </form>
        <p className="auth-switch">New to China Kitchen? <a href="/signup">Sign up</a></p>
      </section>
    </main>
  );
};

export default SignIn;
