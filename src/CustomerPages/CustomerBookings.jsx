import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [customerUsername, setCustomerUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const url = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/me`, { withCredentials: true });
        setCustomerUsername(res.data.payload.username);
      } catch (err) {
        console.error("User fetch error:", err);
        setError("Failed to fetch user.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!customerUsername) return;
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${url}/customer/book/service/${customerUsername}`);
        setBookings(res.data);
      } catch (err) {
        console.error("Booking fetch error:", err);
        setError("Failed to load bookings.");
      }
    };
    fetchBookings();
  }, [customerUsername]);

  // ✅ Feedback submit handler
  const handleFeedback = async (id, feedback) => {
    if (!feedback.trim()) return alert("Please write feedback first!");
    try {
      await axios.post(`${url}/customer/book/service/${id}/feedback`, { feedback });
      alert("Feedback submitted!");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, feedbackStatus: true, feedback } : b
        )
      );
    } catch (err) {
      console.error("Feedback error:", err);
      alert("Failed to submit feedback.");
    }
  };

  // ✅ Cancel booking handler
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.put(`${url}/customer/booking/${id}/cancel`);
      alert("Booking cancelled successfully!");
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancel" } : b))
      );
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel booking.");
    }
  };

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>My Bookings</h1>

      <div style={styles.container}>
        {bookings.length > 0 ? (
          <div style={styles.grid}>
            {bookings.map((b) => (
              <div key={b._id} style={styles.card}>
                <img
                  src={`data:${b.image.contentType};base64,${b.image.data}`}
                  alt={b.service}
                  style={styles.image}
                />

                <div style={styles.info}>
                  <p style={styles.date}>
                    {new Date(b.customerdate).toDateString()}
                  </p>

                  <div style={styles.header}>
                    <h3 style={styles.service}>{b.service}</h3>
                    <span
                      style={{
                        ...styles.status,
                        background:
                          b.status === "completed"
                            ? "#16a34a"
                            : b.status === "pending"
                            ? "#a0aec0"
                            : b.status === "confirmed"
                            ? "#007bff"
                            : "#dc2626",
                      }}
                    >
                      {b.status}
                    </span>
                  </div>

                  <p style={styles.provider}>
                    Provided by <strong>{b.providername}</strong>
                  </p>
                  <p style={styles.price}>
                    ₹{b.visitingPrice} – ₹{b.maxPrice}
                  </p>

                  {/* ✅ Cancel button if pending */}
                  {b.status === "pending" && (
                    <button
                      style={styles.cancelBtn}
                      onClick={() => handleCancel(b._id)}
                    >
                      Cancel Booking
                    </button>
                  )}

                  {/* ✅ Feedback Section */}
                  {b.status === "completed" && !b.feedbackStatus && (
                    <div style={styles.feedbackSection}>
                      <label style={styles.label}>Share your experience</label>
                      <textarea
                        id={`feedback-${b._id}`}
                        placeholder="Write your feedback..."
                        style={styles.textarea}
                      ></textarea>
                      <button
                        style={styles.submitBtn}
                        onClick={() =>
                          handleFeedback(
                            b._id,
                            document.getElementById(`feedback-${b._id}`).value
                          )
                        }
                      >
                        Submit Feedback
                      </button>
                    </div>
                  )}

                  {b.feedbackStatus && (
                    <p style={styles.thank}>Thank you for your feedback ❤️</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noBookings}>
            <div style={styles.noIcon}>📅</div>
            <h3>No More Bookings</h3>
            <p>
              You have no other bookings right now. Time to schedule something
              great!
            </p>
            <button style={styles.bookBtn}>Book a Service</button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    background: "#f5f6f8",
    minHeight: "100vh",
    padding: "2rem 0",
    fontFamily: "Poppins, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 600,
    marginBottom: "1.5rem",
    width: "90%",
    maxWidth: "1200px",
  },
  container: {
    width: "90%",
    maxWidth: "1200px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  info: { padding: "1rem 1.2rem" },
  date: { fontSize: "0.85rem", color: "#555" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  service: {
    fontSize: "1.1rem",
    fontWeight: 600,
    margin: "0.3rem 0",
  },
  status: {
    fontSize: "0.8rem",
    padding: "4px 10px",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: 500,
    textTransform: "capitalize",
  },
  provider: { fontSize: "0.9rem", color: "#444", margin: "0.3rem 0" },
  price: { color: "#111", fontWeight: 600 },
  feedbackSection: {
    marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: { fontSize: "0.9rem", color: "#333" },
  textarea: {
    resize: "none",
    minHeight: "60px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "8px",
    fontSize: "0.9rem",
  },
  submitBtn: {
    alignSelf: "flex-end",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 14px",
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 14px",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: 500,
  },
  thank: { marginTop: "0.5rem", color: "#16a34a", fontWeight: 600 },
  noBookings: {
    background: "#fff",
    borderRadius: "12px",
    textAlign: "center",
    padding: "2rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  noIcon: { fontSize: "2rem", marginBottom: "0.5rem" },
  bookBtn: {
    background: "#007bff",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default CustomerBookings;
