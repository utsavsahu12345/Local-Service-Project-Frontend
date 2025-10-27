import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Profile from "../assets/profile.jpg";
import axios from "axios";

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
    const url = import.meta.env.VITE_SERVER_URL;

  // Fetch user from backend (/me) using JWT cookie
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/me`, {
          withCredentials: true, // ✅ send cookie
        });
        setUser(res.data.payload); // payload contains username, email, fullname, role
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      // Optionally, call backend logout endpoint to clear cookie
      await axios.post(`${url}/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    }
    navigate("/", { replace: true });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <a
            className="navbar-brand fw-bold text-primary"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}
          >
            <span style={{ color: "orange" }}><i className="fa-solid fa-screwdriver-wrench"></i></span> ServicePro
          </a>

          {/* Right (mobile first order) */}
          <div className="d-flex align-items-center ms-auto order-lg-3">
            <button
              className="navbar-toggler me-2 d-lg-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Profile Avatar */}
            <div className="position-relative" ref={dropdownRef}>
              <img
                src={Profile}
                alt="avatar"
                className="rounded-circle"
                style={{ cursor: "pointer", width: "45px", height: "45px", border: "2px solid #007bff" }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {dropdownOpen && user && (
                <div className="position-absolute end-0 mt-2 bg-white shadow p-3 rounded" style={{ width: "300px", zIndex: 1000 }}>
                  <div className="d-flex align-items-center mb-3">
                    <img src={Profile} alt="avatar" className="rounded-circle me-2" style={{ width: "50px", height: "50px" }} />
                    <div>
                      <h6 className="mb-0">{user.fullName || "-"}</h6>
                      <small className="text-muted">{user.role || "-"}</small>
                    </div>
                  </div>
                  <div className="mb-2">
                    <p className="mb-1"><strong className="text-secondary">Username:</strong> {user.username || "-"}</p>
                    <p className="mb-1"><strong className="text-secondary">Email:</strong> {user.email || "-"}</p>
                  </div>
                  <button className="btn btn-danger btn-sm w-100 mt-2" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>

          {/* Center: Navigation links */}
          <div className="collapse navbar-collapse justify-content-center order-lg-2" id="navbarNav">
            <ul className="navbar-nav gap-4">
              <li className="nav-item"><Link to="/customer/home" className="nav-link">Home</Link></li>
              <li className="nav-item"><Link to="/customer/bookings" className="nav-link">Booking</Link></li>
              <li className="nav-item"><Link to="/customer/feedback" className="nav-link">Feedback</Link></li>
              <li className="nav-item"><Link to="/customer/about" className="nav-link">About</Link></li>
              <li className="nav-item"><Link to="/customer/contact" className="nav-link">Contact</Link></li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default CustomerNavbar;
