import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Book from "../assets/Book.png";
import axios from "axios";
import "./CustomerBookings.css";

const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = buffer.data ? new Uint8Array(buffer.data) : new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return window.btoa(binary);
};

// ✅ Status Tag Component
const StatusTag = ({ status }) => {
  const lower = status.toLowerCase();
  let backgroundColor = "";
  let color = "#fff";

  switch (lower) {
    case "pending":
      backgroundColor = "#ffc107";
      color = "#212529";
      break;
    case "accepted":
      backgroundColor = "#28a745";
      break;
    case "rejected":
      backgroundColor = "#dc3545";
      break;
    case "cancel":
      backgroundColor = "#6c757d";
      break;
    default:
      backgroundColor = "#6c757d";
  }

  return (
    <span className="status-tag" style={{ backgroundColor, color }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [customerUsername, setCustomerUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_SERVER_URL;

  // ✅ Fetch username
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/me`, { withCredentials: true });
        setCustomerUsername(res.data.payload.username);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user.");
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ Fetch bookings
  useEffect(() => {
    if (!customerUsername) return;
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${url}/customer/bookings?customerusername=${customerUsername}`
        );
        setBookings(res.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch bookings.");
        setLoading(false);
      }
    };
    fetchBookings();
  }, [customerUsername]);

  // ✅ Cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.put(
        `${url}/customer/booking/cancel/${bookingId}/status`,
        { status: "cancel" },
        { withCredentials: true }
      );

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "cancel" } : b))
      );

      alert("Booking cancelled successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking.");
    }
  };

  // ✅ Convert image
  const getImageSource = (image) => {
    if (!image) return null;
    if (image.url) return image.url;
    if (image.data?.data)
      return `data:${image.contentType};base64,${arrayBufferToBase64(image.data)}`;
    return null;
  };

  // ✅ Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "long",
    });
  };

  if (loading) return <div className="loading">Loading bookings...</div>;
  if (error) return <div className="error-text">{error}</div>;

  if (!loading && bookings.length === 0)
    return (
      <div className="no-bookings-container">
        <img src={Book} alt="Clipboard" className="clipboard-image" />
        <h2 className="no-bookings-title">You have no bookings yet 🛋️</h2>
        <p className="no-bookings-message">
          It looks like you haven't made any bookings yet. Start exploring our
          services and book your first one today!
        </p>
        <button
          className="book-service-button"
          onClick={() => navigate("/customer/home")}
        >
          Book a Service
        </button>
      </div>
    );

  return (
    <div className="bookingscontainer">
      <h2>My Bookings</h2>
      <div className="bookingslist">
        {bookings.map((booking) => (
          <div key={booking._id} className="bookingcard">
            {/* 🖼 Image */}
            <div className="bookingimage">
              {getImageSource(booking.image) && (
                <img src={getImageSource(booking.image)} alt={booking.service} />
              )}
            </div>

            {/* 📄 Details */}
            <div className="bookingdetails">
              <div className="bookingheader">
                <h3>{booking.service}</h3>
                <StatusTag status={booking.status} />
              </div>

              <p>
                <strong>Provider:</strong> {booking.providername}
              </p>
              <p>
                <strong>Service Date:</strong> {formatDate(booking.customerdate)}
              </p>
              <p className="description">
                <strong>Description:</strong> {booking.providerdescription}
              </p>

              <div className="bookingactions">
                <button
                  className="btn-view"
                  onClick={() =>
                    navigate("/customer/booking/details", {
                      state: { service: booking },
                    })
                  }
                >
                  View Details
                </button>

                {(booking.status.toLowerCase() === "pending" ||
                  booking.status.toLowerCase() === "accepted") && (
                  <button
                    className="btn-cancel"
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerBookings;
