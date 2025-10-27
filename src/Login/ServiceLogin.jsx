import React, { useState } from "react";
import axios from "axios";
import "./CustomerService.css";

export default function ServiceLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [signupData, setSignupData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [otpData, setOtpData] = useState({ userId: "", otp: "" });
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
    const url = import.meta.env.VITE_SERVER_URL;

  const handleSignupChange = (e) =>
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleOtpChange = (e) =>
    setOtpData({ ...otpData, [e.target.name]: e.target.value });

  // -------------------- SIGNUP --------------------
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${url}/service/signup`,
        signupData,
        { withCredentials: true } // important for sending/receiving cookies
      );
      alert(res.data.message);
      setOtpData({ ...otpData, userId: res.data.userId });
      setShowOtp(true);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- VERIFY OTP --------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${url}/service/verify-otp`,
        otpData,
        { withCredentials: true } // important for cookie to be set
      );

      alert(res.data.message);

      // ✅ no localStorage needed; cookie handles authentication
      // Redirect to home page
      window.location.href = "/service/dashboard";
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  // -------------------- LOGIN --------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${url}/service/login`,
        loginData,
        { withCredentials: true } // cookie will be set from backend
      );

      alert(res.data.message);

      // ✅ no localStorage needed
      window.location.href = "/service/dashboard";
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">
          {showOtp ? "Verify OTP" : isLogin ? "Login" : "Signup"}
        </h2>

        {showOtp ? (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <label className="auth-label">
              Enter OTP
              <input
                name="otp"
                value={otpData.otp}
                onChange={handleOtpChange}
                className="auth-input"
                placeholder="Enter OTP from email"
              />
            </label>
            <button type="submit" className="auth-button">
              Verify OTP
            </button>
          </form>
        ) : isLogin ? (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <label className="auth-label">
              Username or Email
              <input
                name="username"
                value={loginData.username}
                onChange={handleLoginChange}
                className="auth-input"
                placeholder="Enter username or email"
                autoComplete="username"
              />
            </label>

            <label className="auth-label">
              Password
              <input
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="auth-input"
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </label>

            <button type="submit" className="auth-button">
              Login
            </button>

            <p className="auth-switch-text">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="auth-link-button"
              >
                Signup
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="auth-form">
            <label className="auth-label">
              Full name
              <input
                name="fullName"
                value={signupData.fullName}
                onChange={handleSignupChange}
                className="auth-input"
                placeholder="Your full name"
              />
            </label>

            <label className="auth-label">
              Username
              <input
                name="username"
                value={signupData.username}
                onChange={handleSignupChange}
                className="auth-input"
                placeholder="Choose a username"
              />
            </label>

            <label className="auth-label">
              Email
              <input
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                className="auth-input"
                placeholder="you@example.com"
              />
            </label>

            <label className="auth-label">
              Password
              <input
                name="password"
                type="password"
                value={signupData.password}
                onChange={handleSignupChange}
                className="auth-input"
                placeholder="Choose a password"
              />
            </label>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Sending OTP, please wait..." : "Signup"}
            </button>

            <p className="auth-switch-text">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="auth-link-button"
              >
                Login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
