import { useNavigate } from "react-router-dom";
import React from "react";
import img1 from "../assets/unnamed.png";
import "../Navbar/RoleSelection.css";

const Icon = ({ children }) => <div className="iconplaceholder">{children}</div>;
const Star = () => <span style={{ color: "#ffc107" }}>★</span>;

const App = () => {
  const navigate = useNavigate();

  const popularServices = [
    { icon: "🧹", title: "Cleaning", description: "Keep your home sparkling clean." },
    { icon: "💧", title: "Plumbing", description: "Fix leaks and clogs with ease." },
    { icon: "🎨", title: "Painting", description: "Refresh your space with a new coat." },
    { icon: "⚡", title: "Electrician", description: "Safe and reliable electrical services." },
    { icon: "🌿", title: "Gardening", description: "Transform your outdoor space." },
  ];

  // ✅ Only 4 Steps Here
  const howItWorks = [
    {
      number: 1,
      title: "Choose Your Service",
      description: "Select from a wide range of home services as per your needs.",
    },
    {
      number: 2,
      title: "Book Instantly",
      description: "Pick your preferred time slot and book your service easily.",
    },
    {
      number: 3,
      title: "Get It Done",
      description: "Our trusted professionals arrive and complete the job efficiently.",
    },
    {
      number: 4,
      title: "Rate & Relax",
      description: "Pay securely and share your feedback after completion.",
    },
  ];

  const testimonials = [
    { name: "Sarah J.", rating: 5, review: "Fantastic service! Highly recommend ServicePro.", avatar: "SJ" },
    { name: "Michael B.", rating: 5, review: "Used ServicePro for house cleaning — excellent job!", avatar: "MB" },
    { name: "Emily K.", rating: 5, review: "Very professional and reliable electrician service.", avatar: "EK" },
  ];

  return (
    <div className="appcontainer">
      {/* --- Header + Hero --- */}
      <header className="mainheader">
        <div className="herosection">
          <div className="hero-text">
            <h1>Find Trusted Local Experts Near You</h1>
            <p>We connect you with the best local professionals for any job, big or small.</p>
            <button onClick={() => navigate("/signup")}>Get Started</button>
          </div>
          <div className="hero-image">
            <img src={img1} alt="Hero" />
          </div>
        </div>
      </header>

      {/* --- Popular Services --- */}
      <section className="section popularservices">
        <h2 className="popular">Popular Services</h2>
        <div className="servicesgrid">
          {popularServices.map((service, i) => (
            <div key={i} className="servicecard">
              <Icon>{service.icon}</Icon>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="section howitworks">
        <h2 className="how">How It Works</h2>
        <div className="stepscontainer">
          {howItWorks.map((step, i) => (
            <div key={i} className="stepcard">
              <div className="stepnumbercircle">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section className="section testimonialssection">
        <h2 className="what">What Our Customers Say</h2>
        <div className="testimonialsgrid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonialcard">
              <div className="customerinfo">
                <div className="avatar">{t.avatar}</div>
                <div>
                  <span className="customername">{t.name}</span>
                  <div className="rating">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="reviewtext">"{t.review}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="section ctasection">
        <h3>Need help with home repairs?</h3>
        <p>Book a trusted expert today!</p>
        <button className="btnprimary" onClick={() => navigate("/signup")}>Get Started</button>
      </section>

      {/* --- Footer --- */}
      <footer className="contact-footer">
        <div>© 2025 Local Service. All rights reserved.</div>
        <div className="footer-a">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
