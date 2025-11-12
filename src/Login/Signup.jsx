import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function SignupOtpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("");
  const url = import.meta.env.VITE_SERVER_URL;

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    location: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${url}/user/signup`, formData);
      setUserId(res.data.userId);
      setUserRole(formData.role);
      setMessage("✅ OTP sent to your email!");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${url}/user/signup/verify-otp`, { userId, otp });
      setMessage(res.data.message);
      alert("🎉 Email verified successfully!");

      if (userRole === "Customer") navigate("/customer/home");
      else if (userRole === "Service Provider") navigate("/service/dashboard");
      else navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signupWrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background: #0f172a;
        }

        .signupWrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #2e026d, #15162c);
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }

        .glassCard {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(15px);
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 420px;
          padding: 2.8rem 2rem;
          color: #f1f5f9;
          text-align: center;
          animation: fadeIn 0.7s ease-in-out;
        }

        .formTitle {
          font-size: 1.9rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #ffffff;
        }

        .progress {
          font-size: 14px;
          color: #94a3b8;
          margin-bottom: 1.5rem;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        input, select {
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
          color: #e2e8f0;
          font-size: 15px;
          transition: 0.3s;
        }

        input::placeholder {
          color: #cbd5e1;
        }

        input:focus, select:focus {
          border-color: #6366f1;
          background: rgba(255, 255, 255, 0.15);
          outline: none;
        }

        select option {
          color: #111;
        }

        button {
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          color: white;
          padding: 12px;
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
        }

        button:disabled {
          background: #475569;
          cursor: not-allowed;
        }

        .message {
          font-size: 14px;
          color: #cbd5e1;
          margin-top: 6px;
        }

        .linkText {
          margin-top: 1.2rem;
          font-size: 14px;
          color: #a5b4fc;
        }

        .linkText a {
          color: #fff;
          text-decoration: underline;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .glassCard {
            padding: 2rem 1.5rem;
          }
          .formTitle {
            font-size: 1.6rem;
          }
        }
      `}</style>

      {step === 1 ? (
        <div className="glassCard">
          <div className="progress">Step 1 of 2</div>
          <h2 className="formTitle">Create Your Account</h2>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="Customer">Customer</option>
              <option value="Service Provider">Service Provider</option>
            </select>
            {message && <p className="message">{message}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Sending OTP..." : "Sign Up"}
            </button>
            <p className="linkText">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      ) : (
        <div className="glassCard">
          <div className="progress">Step 2 of 2</div>
          <h2 className="formTitle">Verify Your Email</h2>
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            {message && <p className="message">{message}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <p className="linkText">
              Didn’t get OTP?{" "}
              <a href="#" onClick={() => setStep(1)}>
                Resend
              </a>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

export default SignupOtpPage;
