import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { service } = location.state || {};

  useEffect(() => {
    console.log("Navigated service data:", service); // ✅ Debug: check what data is coming
    window.scrollTo(0, 0);
  }, [service]);

  const getImageSrc = (img) => {
    if (!img) return "";

    // Agar URL available hai
    if (img.url) return img.url;

    // Agar MongoDB buffer data hai
    if (img.data?.data) {
      const base64String = btoa(
        new Uint8Array(img.data.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      return `data:${img.contentType};base64,${base64String}`;
    }

    return "";
  };

  return (
    <div style={{ padding: 16, minHeight: "100vh", background: "#ededed" }}>
      <div
        style={{
          maxWidth: 900,
          margin: "40px auto",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 16px #0001",
          padding: 32,
        }}
      >
        {service ? (
          <>
            {/* Back Button */}
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
              <button
                style={{
                  padding: "8px 16px",
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#0099ee",
                  background: "transparent",
                  border: "1px solid #0099ee",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
                onClick={() => navigate(-1)} // previous page pe le jaayega
              >
                ← Back
              </button>
            </div>

            {/* Service Info */}
            <div
              style={{
                display: "flex",
                gap: 32,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 32,
                width: "100%",
              }}
            >
              <img
                src={getImageSrc(service.image)}
                alt={service.service}
                style={{
                  width: 180,
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 12,
                  background: "#f5f5f5",
                  boxShadow: "0 2px 8px #0001",
                }}
              />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
                  {service.service}
                </h2>
                <div style={{ color: "#666", fontSize: 17, marginBottom: 8 }}>
                  {service.description}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "#222", fontWeight: 500 }}>
                    <span style={{ fontSize: 18 }}>👤</span> {service.name} (
                    {service.experience} years experience)
                  </span>
                </div>
                <div style={{ color: "#666", fontSize: 16, marginBottom: 8 }}>
                  <i className="fa-solid fa-location-dot"></i> {service.location}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#0099ee",
                    marginBottom: 4,
                  }}
                >
                  ₹{service.visitingPrice}{" "}
                  <span style={{ fontSize: 15, color: "#888", marginLeft: 8 }}>
                    Visiting Price
                  </span>
                  <span style={{ fontSize: 15, color: "#888", marginLeft: 8 }}>
                    Max Price ₹{service.maxPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Book Now Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 30,
                width: "100%",
              }}
            >
              <button
                style={{
                  padding: "12px 24px",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#fff",
                  background: "#0099ee",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigate("/customer/select/service", {
                    state: { service: service },
                  })
                }
              >
                Book Now
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
            No service selected
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDetails;
