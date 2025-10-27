import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

const TopNavbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
    const url = import.meta.env.VITE_SERVER_URL;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // ✅ Cookie-based logout
  const handleLogout = async () => {
    try {
      await fetch(`${url}/logout`, {
        method: "POST",
        credentials: "include", // 🔑 important for HTTP-only cookie
      });

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="top-navbar-layout">
      {/* Top Navbar */}
      <nav className="top-navbar">
        <div className="navbar-logo">Admin Panel</div>

        <button className="hamburger-btn" onClick={toggleMenu}>
          ☰
        </button>

        <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/service">Services</Link>
          </li>
          <li>
            <Link to="/admin/bookings">Booking</Link>
          </li>
          <li>
            <Link to="/admin/user">User</Link>  
          </li>
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="top-navbar-content">
        <Outlet />
      </div>
    </div>
  );
};

export default TopNavbar;
