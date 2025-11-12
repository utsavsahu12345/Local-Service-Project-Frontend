import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const url = import.meta.env.VITE_SERVER_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post(`${url}/user/login`, formData, {
        withCredentials: true,
      });

      setSuccess(res.data.message || "Login successful!");
      const userRole = res.data.role;

      if (userRole === "Admin") navigate("/admin/dashboard");
      else if (userRole === "Customer") navigate("/customer/home");
      else if (userRole === "Service Provider") navigate("/service/dashboard");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="loginWrapper">
        <div className="loginGlassCard">
          <h2 className="loginTitle">Welcome Back 👋</h2>
          <p className="loginSubtitle">Login with your username or email</p>

          {error && <p className="loginError">{error}</p>}
          {success && <p className="loginSuccess">{success}</p>}

          <form onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label>Username or Email</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username or email"
                required
              />
            </div>

            <div className="inputGroup">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="loginBtn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="footerText">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>

      {/* ==== Premium Glassmorphic CSS ==== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html {
          height: 100%;
          font-family: 'Inter', sans-serif;
          background: #0f172a;
        }

        .loginWrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #2e026d, #15162c);
          padding: 20px;
        }

        .loginGlassCard {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
          width: 100%;
          max-width: 400px;
          padding: 2.5rem 2rem;
          color: #f8fafc;
          animation: fadeIn 0.7s ease-in-out;
          text-align: center;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .loginTitle {
          font-size: 2rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .loginSubtitle {
          color: #cbd5e1;
          font-size: 0.95rem;
          margin-bottom: 2rem;
        }

        .inputGroup {
          text-align: left;
          margin-bottom: 1.3rem;
        }

        label {
          display: block;
          margin-bottom: 0.4rem;
          color: #e2e8f0;
          font-weight: 500;
          font-size: 0.95rem;
        }

        input {
          width: 100%;
          padding: 0.75rem 0.9rem;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.07);
          color: #f1f5f9;
          font-size: 1rem;
          transition: 0.3s ease;
        }

        input::placeholder {
          color: #94a3b8;
        }

        input:focus {
          border-color: #818cf8;
          background: rgba(255, 255, 255, 0.15);
          outline: none;
        }

        .loginBtn {
          width: 100%;
          padding: 0.9rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
        }

        .loginBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.45);
        }

        .loginBtn:disabled {
          background: #475569;
          cursor: not-allowed;
        }

        .loginError, .loginSuccess {
          padding: 0.7rem;
          border-radius: 10px;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .loginError {
          background: rgba(255, 100, 100, 0.15);
          color: #fca5a5;
          border: 1px solid rgba(255, 100, 100, 0.3);
        }

        .loginSuccess {
          background: rgba(34, 197, 94, 0.15);
          color: #86efac;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .footerText {
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: #a5b4fc;
        }

        .footerText a {
          color: #fff;
          text-decoration: underline;
          font-weight: 600;
        }

        @media (max-width: 480px) {
          .loginGlassCard {
            padding: 2rem 1.4rem;
          }
          .loginTitle {
            font-size: 1.7rem;
          }
        }
      `}</style>
    </>
  );
}
