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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/login", formData, {
        withCredentials: true,
      });

      setSuccess(res.data.message || "Login successful!");

      // ✅ Role comes from backend response
      const userRole = res.data.role;

      if (userRole === "Customer") {
        navigate("/customer/home");
      } else if (userRole === "Service Provider") {
        navigate("/service/dashboard");
      } else {
        navigate("/"); // fallback
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <h2>Welcome Back 👋</h2>
          <p className="subtitle">Login with your Username or Email</p>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
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

            <div className="input-group">
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

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="footer-text">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>

      {/* ==== Inline CSS ==== */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html, .login-container {
          height: 100vh;
          width: 100%;
          font-family: "Poppins", sans-serif;
          background: linear-gradient(135deg, #d0e2ff, #f8faff);
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .login-card {
          background: #ffffff;
          padding: 2.8rem 2.4rem;
          border-radius: 16px;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);
          width: 370px;
          text-align: center;
          transition: all 0.3s ease;
          animation: fadeIn 0.6s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h2 {
          color: #2b2d42;
          font-size: 1.9rem;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #6c757d;
          font-size: 0.95rem;
          margin-bottom: 1.8rem;
        }

        .input-group {
          margin-bottom: 1.3rem;
          text-align: left;
        }

        label {
          display: block;
          margin-bottom: 0.35rem;
          color: #495057;
          font-weight: 500;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ced4da;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        input:focus {
          border-color: #007bff;
          background: #fff;
          box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
        }

        .login-btn {
          width: 100%;
          padding: 0.85rem;
          background: #007bff;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: 0.3s ease;
        }

        .login-btn:hover {
          background: #0056b3;
        }

        .error, .success {
          padding: 0.7rem;
          border-radius: 8px;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .error {
          background: #ffe5e5;
          color: #d9534f;
        }

        .success {
          background: #e6ffea;
          color: #28a745;
        }

        .footer-text {
          margin-top: 1.4rem;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .footer-text a {
          color: #007bff;
          text-decoration: none;
          font-weight: 600;
        }

        .footer-text a:hover {
          text-decoration: underline;
        }

        @media (max-width: 450px) {
          .login-card {
            width: 90%;
            padding: 2rem;
          }
        }
      `}</style>
    </>
  );
}
