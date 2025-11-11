import { Link, Outlet } from "react-router-dom";
import "./RoleNavbar.css";

export default function RoleNavbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
        <div className="container">
          {/* Brand - left */}
          <Link
            className="navbar-brand fw-bold text-primary"
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span style={{ color: "orange" }}>
              <i class="fa-solid fa-screwdriver-wrench"></i>
            </span>{" "}
            ServicePro
          </Link>

          {/* Toggler for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible area */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {/* LEFT-aligned nav items */}
            <ul className="navbar-nav ms-auto mb-2 gap-3">
              <li className="nav-item">
                <Link
                  to="/about"
                  className="nav-link"
                  style={{ textDecoration: "none" }}
                >
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/contact"
                  className="nav-link"
                  style={{ textDecoration: "none" }}
                >
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="btn"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      backgroundColor: "#007bff",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      marginRight: "10px",
                      fontWeight: "600",
                    }}>
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      backgroundColor: "#007bff",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontWeight: "600",
                    }}
                  >
                    Sign Up
                  </Link>
                </li>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
