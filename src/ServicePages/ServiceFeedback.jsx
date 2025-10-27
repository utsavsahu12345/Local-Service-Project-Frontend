import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ServiceFeedback.css"; // CSS file import

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [providerUsername, setProviderUsername] = useState("");
    const url = import.meta.env.VITE_SERVER_URL;

  // Convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Format date as "15 Oct, 2025"
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  // --- Fetch provider username from JWT cookie ---
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

  // --- Fetch feedbacks ---
  useEffect(() => {
    if (!providerUsername) return;

    axios
      .get(`${url}/service/feedback/${providerUsername}`, {
        responseType: "json",
        withCredentials: true,
      })
      .then((res) => {
        const feedbacksWithImages = res.data.map((fb) => {
          let img = null;
          if (fb.image && fb.image.data) {
            const buffer = Uint8Array.from(fb.image.data.data).buffer;
            img = `data:${fb.image.contentType};base64,${arrayBufferToBase64(buffer)}`;
          }
          return { ...fb, image: img };
        });

        setFeedbacks(feedbacksWithImages);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setFeedbacks([]);
        setLoading(false);
      });
  }, [providerUsername]);

  const filteredFeedbacks = Array.isArray(feedbacks)
    ? feedbacks.filter(
        (f) =>
          f.customername.toLowerCase().includes(search.toLowerCase()) ||
          f.service.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  if (loading)
    return (
      <div className="loading-container">
        <p className="loading-text">Loading feedbacks...</p>
      </div>
    );

  if (!filteredFeedbacks.length)
    return (
      <div className="loading-container">
        <p className="loading-text">No feedbacks found 😔</p>
      </div>
    );

  return (
    <div className="feedback-page">
      <h1 className="title">Customer Feedbacks</h1>

      <div className="feedback-grid container">
        {filteredFeedbacks.map((fb, i) => (
          <div key={i} className="feedback-card">
            {fb.image ? (
              <img src={fb.image} alt={fb.customername} className="feedback-img" />
            ) : (
              <div className="feedback-img-placeholder">👤</div>
            )}
            <div className="feedback-content">
              <div className="feedback-header">
                <h2 className="customer-name">{fb.customername}</h2>
                <span className="feedback-date">{formatDate(fb.customerdate)}</span>
              </div>
              <p className="service">{fb.service}</p>
              <p className="feedback-text">" {fb.feedback} "</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackPage;
