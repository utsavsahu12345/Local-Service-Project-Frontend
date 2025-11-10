import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const [popularServices, setPopularServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/customer/popular-services", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setPopularServices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching services:", err);
        setPopularServices([]);
        setLoading(false);
      });
  }, []);

  // ✅ Handle feature card click
  const handleFeatureClick = (title) => {
    if (title === "About Us") {
      navigate("/customer/about");
    }
    if (title === "Contact Support") {
      navigate("/customer/contact");
    }
    if (title === "Explore Services") {
      navigate("/customer/service");
    }
    if (title === "View My Bookings") {
      navigate("/customer/bookings");
    }
  };

  return (
    <div className="container" style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heading}>Welcome Back 👋</h1>
        <p style={styles.subtext}>
          Discover top-rated services and book your next appointment in seconds.
        </p>
      </div>

      {/* Feature Cards */}
      <div style={styles.featuresContainer}>
        {featureItems.map((item, index) => (
          <div
            key={index}
            style={styles.featureCard}
            onClick={() => handleFeatureClick(item.title)}
          >
            <div style={styles.icon}>{item.icon}</div>
            <h3 style={styles.featureTitle}>{item.title}</h3>
            <p style={styles.featureText}>{item.text}</p>
          </div>
        ))}
      </div>

      {/* Popular Services Section */}
      <h2 style={styles.sectionTitle}>Popular Services</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={styles.servicesGrid}>
          {popularServices.map((service) => (
            <div key={service._id} style={styles.serviceCard}>
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.service}
                  style={styles.serviceImage}
                />
              ) : (
                <div
                  style={{
                    ...styles.serviceImage,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <span style={{ color: "#888" }}>No Image</span>
                </div>
              )}

              <div style={styles.serviceInfo}>
                <h3 style={styles.serviceName}>{service.service}</h3>
                <p style={styles.serviceDesc}>{service.description}</p>
                <p style={styles.servicePrice}>
                  ₹{service.visitingPrice} - ₹{service.maxPrice}
                </p>
                <button style={styles.bookButton}>Book Now</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Offer Banner */}
      <div style={styles.offerBanner}>
        <div>
          <h3>🎉 Get 20% off on your first booking!</h3>
          <p>
            Use code <b>WELCOME20</b> at checkout.
          </p>
        </div>
        <button style={styles.offerButton}>Book a Service</button>
      </div>
    </div>
  );
};

// ✅ Updated Feature items (Replaced “Book a New Service” → “About Us”)
const featureItems = [
  {
    icon: "🔍",
    title: "Explore Services",
    text: "Browse through our popular categories.",
  },
  {
    icon: "🧾",
    title: "View My Bookings",
    text: "Check your upcoming and past appointments.",
  },
  {
    icon: "💬",
    title: "Contact Support",
    text: "Get help and answers to your questions.",
  },
  {
    icon: "ℹ️",
    title: "About Us",
    text: "Learn more about who we are and what we do.",
  },
];

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f9fbff",
    marginTop: "20px",
    minHeight: "100vh",
  },
  hero: {
    background: "linear-gradient(90deg, #e0f0ff, #ffffff)",
    padding: "40px",
    borderRadius: "16px",
    marginBottom: "30px",
  },
  heading: {
    fontSize: "2.2rem",
    fontWeight: "600",
    color: "#333",
  },
  subtext: {
    color: "#666",
    marginTop: "10px",
    fontSize: "1rem",
  },
  featuresContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },
  featureCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "25px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  icon: {
    fontSize: "2rem",
    marginBottom: "10px",
  },
  featureTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#333",
  },
  featureText: {
    color: "#777",
    fontSize: "0.9rem",
  },
  sectionTitle: {
    marginTop: "50px",
    fontSize: "1.6rem",
    fontWeight: "600",
    color: "#333",
  },
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
    marginTop: "20px",
  },
  serviceCard: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  serviceImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
  serviceInfo: {
    padding: "15px",
  },
  serviceName: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "5px",
  },
  serviceDesc: {
    color: "#777",
    fontSize: "0.9rem",
    marginBottom: "10px",
  },
  servicePrice: {
    color: "#222",
    fontWeight: "600",
    marginBottom: "10px",
  },
  bookButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 15px",
    cursor: "pointer",
  },
  offerBanner: {
    background: "#e0f2ff",
    marginTop: "50px",
    borderRadius: "12px",
    padding: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  offerButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 15px",
    cursor: "pointer",
  },
};

export default CustomerDashboard;
