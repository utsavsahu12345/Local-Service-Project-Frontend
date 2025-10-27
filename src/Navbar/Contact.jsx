import React from "react";
import "./Contact.css";
import ContactHero from "../assets/ContactHero.png";
import ContactAbout from "../assets/ContactAbout.jpg";

function Contact() {
  return (
    <div className="app-container">
      {/* 1. Hero Section */}
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${ContactHero})` }}
      >
        <div className="hero-overlay">
          <h1 className="hero-title">Your Home, Our Expertise</h1>
          <p className="hero-subtitle">
            Reliable and professional home services tailored to your needs.
          </p>
          <button className="hero-button">Get a Free Quote</button>
        </div>
      </div>

      {/* 2. About Us Section */}
      <div className="about-us-section">
        <div className="about-content">
          <h2 className="about-title">About Us</h2>
          <p className="about-text">
            At <strong>HandyHome</strong>, we're dedicated to providing
            top-notch home services with a personal touch. Our team of skilled
            professionals is committed to ensuring your home is in the best
            hands. We pride ourselves on our reliability, quality workmanship,
            and customer satisfaction.
          </p>
          <a href="#" className="learn-more-link">
            Learn More
          </a>
        </div>
        <div className="about-image-container">
          <img
            src={ContactAbout}
            alt="HandyHome Team"
            className="about-image"
          />
        </div>
      </div>
      <div className="contact-page">
        {/* Why Choose Us */}
        <section className="choose-section">
          <h2>Why Choose Us</h2>
          <div className="choose-cards">
            <div className="choose-card">
              <span>💰</span>
              <p>Affordable</p>
            </div>
            <div className="choose-card">
              <span>⚙️</span>
              <p>Certified Professionals</p>
            </div>
            <div className="choose-card">
              <span>⏱️</span>
              <p>Quick Response</p>
            </div>
            <div className="choose-card">
              <span>👍</span>
              <p>Satisfaction Guaranteed</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <h2>Testimonials</h2>
          <div className="testimonials">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <img src="https://i.pravatar.cc/40?img=1" alt="user1" />
                <div>
                  <h4>Sophia Carter</h4>
                  <p>2023-08-15</p>
                </div>
              </div>
              <p className="stars">⭐⭐⭐⭐⭐</p>
              <p>
                "HandyHome did an amazing job with our plumbing repair. They
                were quick, efficient, and very professional. Highly recommend!"
              </p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <img src="https://i.pravatar.cc/40?img=2" alt="user2" />
                <div>
                  <h4>Ethan Bennett</h4>
                  <p>2023-07-22</p>
                </div>
              </div>
              <p className="stars">⭐⭐⭐⭐☆</p>
              <p>
                "The electrical work was done well, but there was a slight delay
                in scheduling. Overall, satisfied with the service."
              </p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <img src="https://i.pravatar.cc/40?img=3" alt="user3" />
                <div>
                  <h4>Olivia Hayes</h4>
                  <p>2023-06-10</p>
                </div>
              </div>
              <p className="stars">⭐⭐⭐⭐⭐</p>
              <p>
                "Excellent service! The team was punctual, friendly, and did a
                fantastic job with our home cleaning. Will definitely use them
                again."
              </p>
            </div>
          </div>
        </section>

        {/* Contact Us */}
        <section className="contact-section">
          <div className="contact-info">
            <h3>Contact Us</h3>
            <p>
              Get in touch with us for any inquiries or to schedule a service.
              We’re here to help!
            </p>
            <ul>
              <li><i class="fa-solid fa-phone"></i> (+91) 9343533040</li>
              <li><i class="fa-solid fa-envelope"></i> UtsavSahu12345@gmail.com</li>
              <li><i class="fa-solid fa-location-dot"></i> Harda, Madhya Pradesh, India</li>
            </ul>
          </div>

          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="4" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </section>

        {/* Footer */}
        <footer className="contact-footer">
          <div>© 2025 Local Service. All rights reserved.</div>
          <div className="footer-a">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Contact;
