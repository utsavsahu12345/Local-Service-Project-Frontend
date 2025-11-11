import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminNavbar.css";

const TopNavbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const url = import.meta.env.VITE_SERVER_URL;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/me`, {
          withCredentials: true, // ✅ send cookie to verify admin session
        });
        if (res.data.payload.role !== "Admin") {
          navigate("/login");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        alert("Session expired or not logged in. Please log in again.");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate, url]);

  // ✅ Cookie-based logout
  const handleLogout = async () => {
    try {
      await fetch(`${url}/logout`, {
        method: "POST",
        credentials: "include", // 🔑 send cookie
      });
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="top-navbar-layout">
      {/* === Top Navbar === */}
      <nav className="top-navbar">
        <div className="navbar-logo">Admin Panel</div>

        <button className="hamburger-btn" onClick={toggleMenu}>
          ☰
        </button>

        <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/service"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              Services
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/bookings"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              Booking
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/user"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              User
            </NavLink>
          </li>
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* === Main Content === */}
      <div className="top-navbar-content">
        <Outlet />
      </div>
    </div>
  );
};

export default TopNavbar;
