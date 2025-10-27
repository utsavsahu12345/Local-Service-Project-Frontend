import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CustomerPages/CustomerFeedback.css";

const FeedbackPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [customerUsername, setCustomerUsername] = useState("");
  const url = import.meta.env.VITE_SERVER_URL;

  // ✅ Fetch user from JWT cookie
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/me`, {
          withCredentials: true,
        });
        setCustomerUsername(res.data.payload.username);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // ✅ Fetch completed bookings
  useEffect(() => {
    if (!customerUsername) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${url}/feedback/?customerusername=${customerUsername}&status=completed`,
          { withCredentials: true }
        );
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [customerUsername]);

  // Submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      alert("Please write your feedback before submitting.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${url}/feedback/submit/`,
        {
          bookingId: selectedBooking._id,
          feedbackText,
        },
        { withCredentials: true }
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBooking._id ? { ...b, feedbackStatus: true } : b
        )
      );

      setSuccessMsg("Thank you for your feedback! 🌟");
      setFeedbackText("");
      setSelectedBooking(null);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Something went wrong while submitting feedback.");
    } finally {
      setLoading(false);
    }
  };

  // Convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="feedbackWrapper">
      <h2 className="pageTitle">Give Feedback on Past Bookings</h2>
      <p className="pageSubtitle">
        We value your feedback. Please share your experience with our service providers.
      </p>

      {bookings.length === 0 ? (
        <p className="noFeedbackText">No completed bookings available.</p>
      ) : (
        <div className="feedbackGrid">
          {bookings.map((booking) => {
            const imageSrc = `data:${booking.image.contentType};base64,${arrayBufferToBase64(
              booking.image.data.data
            )}`;
            return (
              <div key={booking._id} className="feedbackCard">
                <img src={imageSrc} alt="provider" className="providerImg" />
                <div className="cardContent">
                  <div className="cardHeader">
                    <h3>{booking.providername}</h3>
                    <span className="priceTag">₹{booking.visitingPrice}</span>
                  </div>

                  <p className="serviceText">{booking.service}</p>

                  <div className="detailRow">{formatDate(booking.customerdate)}</div>
                  <div className="detailRow">{booking.providerlocation}</div>

                  <button
                    className="feedbackBtn"
                    onClick={() => setSelectedBooking(booking)}
                    disabled={booking.feedbackStatus}
                  >
                    {booking.feedbackStatus ? "Feedback Submitted ✅" : "Give Feedback"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedBooking && (
        <div className="modalOverlay">
          <div className="modalBox">
            <h5 className="modalTitle">
              Feedback for {selectedBooking.providername}
            </h5>
            <textarea
              className="textarea"
              placeholder="Write your experience here..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />

            <div className="modalActions">
              <button
                className="modalBtn cancelBtn"
                onClick={() => setSelectedBooking(null)}
              >
                Cancel
              </button>
              <button
                className="modalBtn submitBtn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>

            {successMsg && <div className="successMsg">{successMsg}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
