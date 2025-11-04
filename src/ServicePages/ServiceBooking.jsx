import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ServiceBooking.css";
import Book from "../assets/Book.png";

// ================= OTP Modal =================
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
        onVerified();
        onClose();
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
    <div className="otpModalOverlay">
      <div className="otpModal">
        <h3>Enter OTP</h3>
        <p className="otpEmail">Sent to: {email}</p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
        />

        {error && <p className="errorText">{error}</p>}

        <div className="otpButtons">
          <button onClick={handleVerify} disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
          <button onClick={onClose} className="cancelBtn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= MAIN COMPONENT =================
const ServiceBooking = () => {
  const url = import.meta.env.VITE_SERVER_URL;
  const [bookings, setBookings] = useState([]);
  const [otpBooking, setOtpBooking] = useState(null);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [providerUsername, setProviderUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/me`, { withCredentials: true });
        setProviderUsername(res.data?.payload?.username || "");
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [url]);

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
      }
    };
    fetchBookings();
  }, [providerUsername, url]);

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
    } finally {
      setSendingOTP(false);
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

  const toBase64 = (buffer) => {
    if (!buffer) return "";
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  };

  const formatDateAndTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bookingPage">
      <h2 className="pageTitle">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="noBookings">
          <img src={Book} alt="No Bookings" />
          <h3>No Bookings Yet 🛋️</h3>
          <p>You don’t have any bookings at the moment.</p>
        </div>
      ) : (
        <div className="cardGrid">
          {bookings.map((b) => (
            <div className="bookingCard" key={b._id}>
              <div className="cardHeader">
                <div className="avatar">
                  {b.image?.data ? (
                    <img
                      src={`data:${b.image.contentType};base64,${toBase64(
                        b.image.data.data
                      )}`}
                      alt="Profile"
                    />
                  ) : (
                    <div className="avatarPlaceholder">
                      {b.customername?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="customerName">{b.customername}</h3>
                  <p className="serviceText">{b.service}</p>
                </div>
              </div>

              <div className="cardBody">
                <p>
                  <i class="fa-solid fa-calendar"></i>{" "}
                  {formatDateAndTime(b.customerdate)}
                </p>
                <p>
                  <i class="fa-solid fa-location-dot"></i> {b.customeraddress}
                </p>
                <p>
                  <i class="fa-solid fa-phone"></i> {b.customerphone}
                </p>
                <p className="desc" title={b.customerdescription}>
                  “{b.customerdescription || "No description provided."}”
                </p>
                <p className="feedback" title={b.feedback}>
                  💬 {b.feedback || "No feedback yet."}
                </p>
              </div>

              <div className="cardFooter">
                {b.status === "pending" && (
                  <>
                    <button
                      className="btn reject"
                      onClick={() => updateStatus(b._id, "rejected")}
                    >
                      Reject
                    </button>
                    <button
                      className="btn confirm"
                      onClick={() => updateStatus(b._id, "confirm")}
                    >
                      Confirm
                    </button>
                  </>
                )}

                {b.status === "confirm" && (
                  <button
                    className="btn complete"
                    onClick={() => markCompletedWithOTP(b)}
                  >
                    {sendingOTP ? "Sending OTP..." : "Mark as Completed"}
                  </button>
                )}

                {["completed", "rejected", "cancel"].includes(b.status) && (
                  <button className={`btn status ${b.status}`} disabled>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
