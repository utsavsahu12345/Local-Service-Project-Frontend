import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ServiceBooking.css";
import Book from "../assets/Book.png";

// ================= OTP Modal Component =================
const OTPModal = ({ bookingId, email, onVerified, onClose }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/booking/verify-otp/${bookingId}`,
        { otp }
      );

      if (res.data.success) {
        alert("✅ " + res.data.message);
        onVerified(); // parent ko update karo
        onClose(); // modal band karo
      } else {
        setError(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      setError("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-modal-overlay">
      <div className="otp-modal">
        <h3>Enter OTP</h3>
        <p className="otp-email">Sent to: {email}</p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
        />

        {error && <p className="error-text">{error}</p>}

        <div className="otp-buttons">
          <button onClick={handleVerify} disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= Main Component =================
const ServiceBooking = () => {
  const url = import.meta.env.VITE_SERVER_URL;
  const [bookings, setBookings] = useState([]);
  const [otpBooking, setOtpBooking] = useState(null);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [providerUsername, setProviderUsername] = useState("");

  // --- Fetch provider info ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/me`, { withCredentials: true });
        if (res.data?.payload?.username) {
          setProviderUsername(res.data.payload.username);
        } else {
          console.error("No username found in /me response:", res.data);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [url]);

  // --- Fetch bookings for that provider ---
  useEffect(() => {
    if (!providerUsername) return;
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
    fetchBookings();
  }, [providerUsername, url]);

  // --- Update booking status ---
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${url}/booking/status/${id}`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // --- Send OTP to customer ---
  const markCompletedWithOTP = async (booking) => {
    try {
      setSendingOTP(true);
      const res = await axios.post(`${url}/booking/send-otp/${booking._id}`);
      if (res.data.success) {
        alert("📩 OTP sent successfully to customer email!");
        setOtpBooking(booking);
      } else {
        alert("Failed to send OTP: " + (res.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Server error while sending OTP.");
    } finally {
      setSendingOTP(false);
    }
  };

  // --- After verification ---
  const handleVerified = () => {
    setBookings((prev) =>
      prev.map((b) =>
        b._id === otpBooking._id ? { ...b, status: "completed" } : b
      )
    );
    setOtpBooking(null);
  };

  // --- Helpers ---
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

  // --- Render ---
  return (
    <div className="container">
      <h2 className="my">My Bookings</h2>
      <main className="booking-main-content">
        {bookings.length === 0 ? (
          <div className="no-bookings-container">
            <img src={Book} alt="No Bookings" className="no-bookings-image" />
            <h2 className="no-bookings-title">No Bookings Yet 🛋️</h2>
            <p className="no-bookings-message">
              You don’t have any bookings at the moment.
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
                        alt="Customer"
                        className="customer-profile-img"
                      />
                    ) : (
                      <img
                        src="https://via.placeholder.com/100x100.png?text=User"
                        className="customer-profile-img"
                        alt="User"
                      />
                    )}
                    <div className="details-wrapper">
                      <div className="name-status-row">
                        <p className="customer-name">{b.customername}</p>
                        <span className={`status-badge status-${b.status}`}>
                          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        </span>
                      </div>
                      <p className="contact-info-text mb-1">
                        {b.customerphone}
                      </p>
                      <p className="contact-info-text mb-3">
                        {b.customeraddress}
                      </p>
                      <div className="service-details-section">
                        <h4 className="service-title">Service: {b.service}</h4>
                        <p className="service-description mt-1">
                          {b.customerdescription}
                        </p>
                        <p className="booking-time mt-2">
                          {formatDateAndTime(b.customerdate)}
                        </p>
                        <p className="service-description mt-1">
                          {b.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- Actions --- */}
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
                      {sendingOTP
                        ? "Sending OTP, please wait..."
                        : "Mark Completed"}
                    </button>
                  )}

                  {["completed", "rejected", "cancel"].includes(b.status) && (
                    <button
                      disabled
                      className="action-btn disabled-btn full-width"
                    >
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- OTP Modal --- */}
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
