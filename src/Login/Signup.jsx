import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function SignupOtpPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = signup, 2 = otp verify
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
      const res = await axios.post(`${url}/signup`, formData);
      setUserId(res.data.userId);
      setUserRole(formData.role);
      setMessage("OTP sent to your email!");
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
      const res = await axios.post("http://localhost:5000/signup/verify-otp", {
        userId,
        otp,
      });
      setMessage(res.data.message);
      alert("Email verified successfully!");

      // ✅ Redirect based on role
      if (userRole === "Customer") {
        navigate("/customer/home");
      } else if (userRole === "Service Provider") {
        navigate("/service/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <style>{`
        .signupContainer {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc, #e0f2fe);
          font-family: 'Poppins', sans-serif;
        }

        .signupBox {
          background-color: #fff;
          padding: 2rem 2.5rem;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .titleText {
          font-size: 1.8rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 1.5rem;
        }

        .signupForm, .otpForm {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        input, select {
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        input:focus, select:focus {
          border-color: #007bff;
          outline: none;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
        }

        button {
          background-color: #007bff;
          color: white;
          padding: 10px;
          font-size: 15px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #0056b3;
        }

        button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
        }

        .messageText {
          color: #555;
          font-size: 14px;
          text-align: center;
        }

        @media (max-width: 480px) {
          .signupBox {
            padding: 1.5rem;
          }
          .titleText {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="signupContainer">
        {step === 1 ? (
          <div className="signupBox">
            <h2 className="titleText">Signup</h2>
            <form onSubmit={handleSignup} className="signupForm">
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

              {message && <p className="messageText">{message}</p>}
              <button type="submit" disabled={loading}>
                {loading ? "Sending OTP..." : "Sign Up"}
              </button>
             <p className="footerText">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        ) : (
          <div className="signupBox">
            <h2 className="titleText">Verify OTP</h2>
            <form onSubmit={handleVerifyOtp} className="otpForm">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              {message && <p className="messageText">{message}</p>}
              <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignupOtpPage;
