import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Profile from "../assets/profile.jpg";

const ServiceNavbar = () => {
  const navigate = useNavigate();
    const url = import.meta.env.VITE_SERVER_URL;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch user from cookie
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/me`, {
          withCredentials: true,
        });
        setUser(res.data.payload);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        alert("Session expired or not logged in. Please log in again.");
        navigate("/service/login");
      }
    };
    fetchUser();
  }, [navigate]);

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

  // Logout (clear cookie on server if needed)
  const handleLogout = async () => {
    try {
      await axios.post(`${url}/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout error:", err);
    }
    navigate("/", { replace: true });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          {/* Left: Logo */}
          <a
            className="navbar-brand fw-bold text-primary"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}
          >
            <span style={{ color: "orange" }}>
              <i className="fa-solid fa-screwdriver-wrench"></i>
            </span>{" "}
            ServicePro
          </a>

          {/* Right */}
          <div className="d-flex align-items-center ms-auto order-lg-3">
            {/* Toggle (mobile) */}
            <button className="navbar-toggler me-2 d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
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
                    <p className="mb-1">
                      <strong className="text-secondary">Username:</strong> {user.username || "-"}
                    </p>
                    <p className="mb-1">
                      <strong className="text-secondary">Email:</strong> {user.email || "-"}
                    </p>
                  </div>
                  <button className="btn btn-danger btn-sm w-100 mt-2" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="collapse navbar-collapse justify-content-center order-lg-2" id="navbarNav">
            <ul className="navbar-nav gap-4">
              <li className="nav-item">
                <Link to="/service/dashboard" className="nav-link">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/service/add" className="nav-link">Add</Link>
              </li>
              <li className="nav-item">
                <Link to="/service/booking" className="nav-link">Booking</Link>
              </li>
              <li className="nav-item">
                <Link to="/service/feedback" className="nav-link">Feedback</Link>
              </li>
              <li className="nav-item">
                <Link to="/service/about" className="nav-link">About</Link>
              </li>
              <li className="nav-item">
                <Link to="/service/contact" className="nav-link">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default ServiceNavbar;
