import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Profile from "../assets/profile.jpg";
import axios from "axios";
import "./CustomerNavbar.css"; // 👈 Add this CSS file for styles

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
        alert("Session expired or not logged in. Please log in again.");
        navigate("/customer/login");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
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
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span style={{ color: "orange" }}>
              <i className="fa-solid fa-screwdriver-wrench"></i>
            </span>{" "}
            ServicePro
          </a>

          {/* Right Side (Profile & Mobile Menu) */}
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
                style={{
                  cursor: "pointer",
                  width: "45px",
                  height: "45px",
                  border: "2px solid #007bff",
                }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {dropdownOpen && user && (
                <div
                  className="position-absolute end-0 mt-2 shadow-lg p-3"
                  style={{
                    width: "320px",
                    zIndex: 1000,
                    borderRadius: "15px",
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="d-flex align-items-center mb-3 border-bottom pb-2">
                    <img
                      src={Profile}
                      alt="avatar"
                      className="rounded-circle me-3"
                      style={{
                        width: "55px",
                        height: "55px",
                        border: "2px solid #007bff",
                      }}
                    />
                    <div>
                      <h6 className="mb-0 text-primary fw-bold">
                        {user.fullName}
                      </h6>
                      <small className="text-muted">{user.role}</small>
                    </div>
                  </div>

                  <div className="px-2">
                    <p className="mb-1">
                      <i className="fa-solid fa-user text-secondary me-2"></i>
                      {user.username}
                    </p>
                    <p className="mb-1">
                      <i className="fa-solid fa-envelope text-secondary me-2"></i>
                      {user.email}
                    </p>
                    <p className="mb-1">
                      <i className="fa-solid fa-venus-mars text-secondary me-2"></i>
                      {user.gender}
                    </p>
                    <p className="mb-1">
                      <i className="fa-solid fa-location-dot text-secondary me-2"></i>
                      {user.location}
                    </p>
                  </div>

                  <button
                    className="btn btn-danger w-100 mt-3"
                    style={{ borderRadius: "10px", transition: "0.3s" }}
                    onClick={handleLogout}
                    onMouseEnter={(e) => (e.target.style.opacity = 0.8)}
                    onMouseLeave={(e) => (e.target.style.opacity = 1)}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Center Navigation Links */}
          <div
            className="collapse navbar-collapse justify-content-center order-lg-2"
            id="navbarNav"
          >
            <ul className="navbar-nav gap-4">
              <li className="nav-item">
                <NavLink
                  to="/customer/home"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/customer/service"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  }
                >
                  Service
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/customer/bookings"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  }
                >
                  Booking
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/customer/about"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  }
                >
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/customer/contact"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  }
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default CustomerNavbar;
