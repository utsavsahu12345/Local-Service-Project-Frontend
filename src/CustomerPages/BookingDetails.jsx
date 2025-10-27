import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingDetails.css";

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { service } = location.state || {};

  const getImageSrc = (img) => {
    if (!img) return "";
    if (img.url) return img.url;
    if (img.data?.data) {
      const base64String = btoa(
        new Uint8Array(img.data.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      return `data:${img.contentType};base64,${base64String}`;
    }
    if (typeof img === "string") return img;

    return "";
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location, service]);

  if (!service) {
    return <p style={{ textAlign: "center", marginTop: 40 }}>No booking details found.</p>;
  }

  const formattedDate = new Date(service.customerdate).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="booking-details-container">
      <div className="details-card">
        {/* Service Section */}
        <div className="service-section">
          <img src={getImageSrc(service.image)} alt="Service" className="service-image" />

          <div className="service-info">
            <h2 className="service-title">{service.service}</h2>
            <p className="service-desc">
              {service.providerdescription ||
                "A high-quality service to make you look your best."}
            </p>

            <p className="provider-line">
              <i className="fa-solid fa-user"></i>{" "}
              <strong>{service.providername}</strong> – {service.experience} years experience
            </p>
            <p className="provider-line">
              <i className="fa-solid fa-phone"></i> {service.providerphone}
            </p>
            <p className="provider-line">
              <i className="fa-solid fa-location-dot"></i> {service.providerlocation}
            </p>

            <div className="price-line">
              Visiting Price: <span className="price-green">₹{service.visitingPrice}</span>
              &nbsp;&nbsp; Max Price: <span className="price-red">₹{service.maxPrice}</span>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* Customer & Booking Section */}
        <div className="customer-section">
          <h3>Customer Booking Details</h3>
          <div className="customer-info">
            <div>
              <p style={{ color: "gray" }}>
                <i className="fa-solid fa-user"></i>
                <strong> Name:</strong> {service.customername}
              </p>
              <p style={{ color: "gray" }}>
                <i className="fa-solid fa-location-dot"></i>
                <strong style={{ color: "gray" }}> Address:</strong> {service.customeraddress}
              </p>
              <p style={{ color: "gray" }}>
                <i className="fa-solid fa-calendar-days"></i>
                <strong style={{ color: "gray" }}> Booking Date:</strong> {formattedDate}
              </p>
            </div>

            <div>
              <p style={{ color: "gray" }}>
                <i className="fa-solid fa-phone"></i>
                <strong style={{ color: "gray" }}> Phone:</strong> {service.customerphone}
              </p>
              <p style={{ color: "gray" }}>
                <strong style={{ color: "gray" }}>Status:</strong>{" "}
                <span className={`status ${service.status}`}>{service.status}</span>
              </p>
            </div>
          </div>

          <div className="notes">
            <p style={{ color: "gray" }}>
              <i className="fa-solid fa-message"></i>
              <strong style={{ color: "gray" }}> Message:</strong>
            </p>
            <p>{service.customerdescription}</p>
          </div>

          {/* Back Button */}
          <button className="back-btn-bottom" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
