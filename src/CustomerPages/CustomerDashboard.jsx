import React, { useEffect, useState } from "react";

const CustomerDashboard = () => {
  const [popularServices, setPopularServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch("http://localhost:5000/customer/popular-services", {
    method: "GET",
    credentials: "include", // ✅ Cookie / Token bhejega
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


  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heading}>Welcome back, Utsav 👋</h1>
        <p style={styles.subtext}>
          Explore new services and manage your bookings easily.
        </p>
      </div>

      {/* Feature Cards */}
      <div style={styles.featuresContainer}>
        {featureItems.map((item, index) => (
          <div key={index} style={styles.featureCard}>
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
              <img
                src={`data:${service.image.contentType};base64,${arrayBufferToBase64(
                  service.image.data.data
                )}`}
                alt={service.service}
                style={styles.serviceImage}
              />
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

// Helper: convert image Buffer to base64
const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Feature items for dashboard
const featureItems = [
  {
    icon: "💇",
    title: "Book a New Service",
    text: "Find and schedule your next appointment.",
  },
  {
    icon: "🔍",
    title: "Explore Services",
    text: "Browse through our popular categories.",
  },
  {
    icon: "💬",
    title: "Contact Support",
    text: "Get help and answers to your questions.",
  },
  {
    icon: "🧾",
    title: "View My Bookings",
    text: "Check your upcoming and past appointments.",
  },
];

// Inline Styles
const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f9fbff",
    padding: "40px",
    minHeight: "100vh",
  },
  hero: {
    background: "linear-gradient(90deg, #e0f0ff, #ffffff)",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
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
    transition: "transform 0.3s ease",
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
