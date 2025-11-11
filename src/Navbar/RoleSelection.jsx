import React, { useRef } from "react";
import "../Navbar/RoleSelection.css";
import { Link } from "react-router-dom";

const Icon = ({ children }) => <div className="iconplaceholder">{children}</div>;
const Star = () => <span style={{ color: "#ffc107" }}>★</span>;

const App = () => {
  const roleRef = useRef(null);

  const handleScrollToRoles = () => {
    roleRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const popularServices = [
    { icon: "🧹", title: "Cleaning", description: "Keep your home sparkling clean." },
    { icon: "💧", title: "Plumbing", description: "Fix leaks and clogs with ease." },
    { icon: "🎨", title: "Painting", description: "Refresh your space with a new coat." },
    { icon: "⚡", title: "Electrician", description: "Safe and reliable electrical services." },
    { icon: "🌿", title: "Gardening", description: "Transform your outdoor space." },
  ];

  const howItWorks = [
    { number: 1, title: "Choose Your Service", description: "Select from a wide range of home services." },
    { number: 2, title: "Select a Provider", description: "Browse profiles, ratings, and reviews to find the perfect fit." },
    { number: 3, title: "Sit Back & Relax", description: "A verified professional will arrive to get the job done." },
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
          <h1>Find Trusted Local Experts Near You</h1>
          <p className="herosubtitle">
            We connect you with the best local professionals for any job, big or small.
          </p>
          <button onClick={handleScrollToRoles}>Get Started</button>
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
                    {[...Array(t.rating)].map((_, j) => <Star key={j} />)}
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
        <button className="btnprimary">Get Started</button>
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
