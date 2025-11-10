import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // type: "error" | "success"
  const url = import.meta.env.VITE_SERVER_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    // Clear previous message
    setMessage({ text: "", type: "" });

    if (!username.trim() || !password) {
      setMessage({ text: "Please enter username and password.", type: "error" });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${url}/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: data.message || "Login successful", type: "success" });
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000); // small delay to show success message
      } else {
        setMessage({ text: data.message || "Login failed", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "Server error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div className="login-card shadow-lg p-4 rounded">
        <h2 className="text-center mb-4 fw-bold">🔐 Admin Login</h2>

        {/* -------------------- MESSAGE DISPLAY -------------------- */}
        {message.text && (
          <div
            className={`auth-message ${message.type === "error" ? "error" : "success"}`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter admin username"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
