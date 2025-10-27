import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2>BrandName</h2>
          {/* 2-line tagline */}
          <p className="footer-tagline">
            We deliver the quality you deserve
            <br />
            and the reliability you can trust.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h5>Quick Links</h5>
          <ul>
            <li>
              <Link to="/service/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/service/add">Service</Link>
            </li>
            <li>
              <Link to="/service/bookings">Booking</Link>
            </li>
            <li>
              <Link to="/service/about">About</Link>
            </li>
            <li>
              <Link to="/service/contact">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h5>Contact Info</h5>
          <p>
            <i className="fa-solid fa-phone"></i> +91 9343533040
          </p>
          <p>
            <i className="fa-solid fa-envelope"></i> UtsavSahu12345@Gmail.Com
          </p>
          <p>
            <i className="fa-solid fa-location-dot"></i> Harda, Madhya Pradesh,
            12345
          </p>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h5>Follow Us</h5>
          <div className="social-icons" aria-hidden="true">
            <a
              href="https://utsavsahu12345.github.io/Portfolio/"
              target="_blank"
              rel="noopener noreferrer">
              <i className="fa-solid fa-globe"></i>
            </a>
            <a
              href="https://www.instagram.com/u_t_s_a_v_s_a_h_u?igsh=cjV5OW81eGZldjFp"
              target="_blank"
              rel="noopener noreferrer">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a
              href="https://github.com/utsavsahu12345"
              target="_blank"
              rel="noopener noreferrer">
              <i className="fa-brands fa-github"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/utsavsahu"
              target="_blank"
              rel="noopener noreferrer">
              <i className="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 BrandName. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
