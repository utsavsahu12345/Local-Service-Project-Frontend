import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ServiceBooking.css";
import Book from "../assets/Book.png"; // Empty state image

// --- OTP Modal Component ---
const OTPModal = ({ bookingId, email, onVerified, onClose }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const url = import.meta.env.VITE_SERVER_URL;

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${url}/booking/verify-otp/${bookingId}`,
        { otp }
      );
      if (res.data.success) {
        onVerified();
      } else {
        setError("Incorrect OTP, try again.");
      }
    } catch (err) {
      setError("Error verifying OTP.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "10px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "30px 25px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
          textAlign: "center",
          animation: "fadeInScale 0.3s ease-in-out",
        }}
      >
        <h3 style={{ marginBottom: "20px", fontSize: "1.2rem", color: "#333" }}>
          Enter OTP sent to {email}
        </h3>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          style={{
            width: "100%",
            padding: "12px 15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            marginBottom: "15px",
            fontSize: "1rem",
          }}
        />
        {error && (
          <p style={{ color: "#ff4d4f", marginBottom: "10px", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}
        <button
          onClick={handleVerify}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 0",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            marginBottom: "10px",
            background: "#007bff",
            color: "#fff",
          }}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px 0",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            background: "#ccc",
            color: "#333",
          }}
        >
          Cancel
        </button>
        <style>
          {`
            @keyframes fadeInScale {
              0% { opacity: 0; transform: scale(0.9); }
              100% { opacity: 1; transform: scale(1); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

// --- Main Component ---
const ServiceBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [otpBooking, setOtpBooking] = useState(null);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [providerUsername, setProviderUsername] = useState("");

  // --- Fetch provider info from cookie ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/me`, {
          withCredentials: true,
        });
        setProviderUsername(res.data.payload.username);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        alert("Session expired or not logged in. Please log in again.");
        window.location.href = "/service/login";
      }
    };
    fetchUser();
  }, []);

  // --- Fetch provider bookings ---
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${url}/service/booking/data/${providerUsername}`
        );
        setBookings(res.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      }
    };

    if (providerUsername) fetchBookings();
  }, [providerUsername]);

  // --- Update booking status directly ---
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${url}/booking/status/${id}`, {
        status: newStatus,
      });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // --- Mark completed with OTP ---
  const markCompletedWithOTP = async (booking) => {
    try {
      setSendingOTP(true); // start loading
      await axios.post(
        `${url}/booking/send-otp/${booking._id}`,
        { email: booking.customeremail }
      );
      setOtpBooking(booking); // open modal
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setSendingOTP(false); // stop loading
    }
  };

  const handleVerified = () => {
    setBookings((prev) =>
      prev.map((b) =>
        b._id === otpBooking._id ? { ...b, status: "completed" } : b
      )
    );
    setOtpBooking(null);
  };

  // --- Helper Functions ---
  const toBase64 = (buffer) => {
    if (!buffer) return "";
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  };

  const formatDateAndTime = (isoDate) => {
    const date = new Date(isoDate);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    return `Service Date: ${formattedDate}`;
  };

  return (
    <div className="container">
      <h2 className="my">My Bookings</h2>

      <main className="booking-main-content">
        {bookings.length === 0 ? (
          <div className="no-bookings-container">
            <img src={Book} alt="No Bookings" className="no-bookings-image" />
            <h2 className="no-bookings-title">No Bookings Yet 🛋️</h2>
            <p className="no-bookings-message">
              You don’t have any bookings at the moment. Once customers start
              booking your services, they’ll appear here.
            </p>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((b) => (
              <div key={b._id} className="booking-card">
                <div className="card-content-wrapper">
                  <div className="customer-info-section">
                    {b.image?.data ? (
                      <img
                        src={`data:${b.image.contentType};base64,${toBase64(
                          b.image.data.data
                        )}`}
                        alt={`${b.customername} profile`}
                        className="customer-profile-img"
                      />
                    ) : (
                      <img
                        alt="Customer Profile"
                        className="customer-profile-img"
                        src={
                          b.customerImage ||
                          "https://via.placeholder.com/100x100.png?text=User"
                        }
                      />
                    )}

                    <div className="details-wrapper">
                      <div className="name-status-row">
                        <p className="customer-name">{b.customername}</p>
                        <span className={`status-badge status-${b.status}`}>
                          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        </span>
                      </div>

                      <p className="contact-info-text mb-1">{b.customerphone}</p>
                      <p className="contact-info-text mb-3">{b.customeraddress}</p>

                      <div className="service-details-section">
                        <h4 className="service-title">Service: {b.service}</h4>
                        <p className="service-description mt-1">
                          {b.customerdescription}
                        </p>
                        <p className="booking-time mt-2">{formatDateAndTime(b.customerdate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-actions-footer">
                  {b.status === "pending" && (
                    <>
                      <button
                        className="action-btn confirm-btn"
                        onClick={() => updateStatus(b._id, "confirm")}
                      >
                        Confirm
                      </button>
                      <button
                        className="action-btn reject-btn"
                        onClick={() => updateStatus(b._id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {b.status === "confirm" && (
                    <button
                      className="action-btn complete-btn full-width"
                      onClick={() => markCompletedWithOTP(b)}
                      disabled={sendingOTP}
                    >
                      {sendingOTP ? "Sending OTP, please wait..." : "Mark Completed"}
                    </button>
                  )}

                  {["completed", "rejected", "cancel"].includes(b.status) && (
                    <button disabled className="action-btn disabled-btn full-width">
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* OTP Modal */}
      {otpBooking && (
        <OTPModal
          bookingId={otpBooking._id}
          email={otpBooking.customeremail}
          onVerified={handleVerified}
          onClose={() => setOtpBooking(null)}
        />
      )}
    </div>
  );
};

export default ServiceBooking;
