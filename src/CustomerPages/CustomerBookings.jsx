import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CustomerBookings.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [customerUsername, setCustomerUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
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
        const res = await axios.get(
          `${url}/customer/book/service/${customerUsername}`
        );
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
    if (!feedback.trim()) return toast.warning("Please write feedback first!");
    try {
      await axios.post(`${url}/customer/book/service/${id}/feedback`, {
        feedback,
      });
      toast.success("Feedback submitted successfully!");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, feedbackStatus: true, feedback } : b
        )
      );
    } catch (err) {
      console.error("Feedback error:", err);
      toast.error("Failed to submit feedback.");
    }
  };

  // ✅ Cancel booking handler
  const handleCancel = async (id) => {
    try {
      await axios.put(`${url}/customer/booking/${id}/cancel`);
      toast.info("Booking cancelled successfully!");
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancel" } : b))
      );
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error("Failed to cancel booking.");
    }
  };

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="bookings-page">
      <ToastContainer position="top-center" theme="colored" />
      <h1 className="bookings-title">My Bookings</h1>

      <div className="bookings-container">
        {bookings.length > 0 ? (
          <div className="bookings-grid">
            {bookings.map((b) => (
              <div key={b._id} className="booking-card">
                <img
                  src={`data:${b.image.contentType};base64,${b.image.data}`}
                  alt={b.service}
                  className="booking-img"
                />

                <div className="booking-info">
                  <p className="booking-date">
                    {new Date(b.customerdate).toDateString()}
                  </p>

                  <div className="booking-header">
                    <h3>{b.service}</h3>
                    <span className={`status ${b.status}`}>{b.status}</span>
                  </div>

                  <p className="provider">
                    Provided by <strong>{b.providername}</strong>
                  </p>
                  <p className="price">
                    ₹{b.visitingPrice} – ₹{b.maxPrice}
                  </p>

                  {b.status === "pending" && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(b._id)}
                    >
                      Cancel Booking
                    </button>
                  )}

                  {b.status === "completed" && !b.feedbackStatus && (
                    <div className="feedback-section">
                      <label>Share your experience</label>
                      <textarea
                        id={`feedback-${b._id}`}
                        placeholder="Write your feedback..."
                      ></textarea>
                      <button
                        className="submit-btn"
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
                    <p className="thank">Thank you for your feedback ❤️</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bookings">
            <h3>No More Bookings</h3>
            <p>
              You have no other bookings right now. Time to schedule something
              great!
            </p>
            <button onClick={() => navigate("/customer/service")}>
              Book a Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerBookings;
