import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SelectService = () => {
  const location = useLocation();
  const { service } = location.state || {};
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const url = import.meta.env.VITE_SERVER_URL;

  const [form, setForm] = useState({
    phone: "",
    location: "",
    date: "",
    description: "",
  });

  axios.defaults.withCredentials = true;

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/me`, { withCredentials: true });
        setUser(res.data.payload);
      } catch (err) {
        console.error("Failed to fetch user:", err.response?.data || err);
        toast.error("Please log in again!");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service || !user) return;

    try {
      let base64Image = null;
      if (service.image?.data?.data) {
        const uint8Array = new Uint8Array(service.image.data.data);
        base64Image = btoa(
          uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), "")
        );
      }

      await axios.post(
        `${url}/customer/booking/completed`,
        {
          customerusername: user.username,
          customername: user.fullName || user.name,
          customeremail: user.email,
          customeraddress: form.location,
          customerphone: form.phone,
          customerdescription: form.description,
          customerdate: form.date,
          status: "pending",
          providerusername: service.username,
          providername: service.name,
          providerphone: service.phone,
          service: service.service,
          experience: service.experience,
          providerdescription: service.description,
          providerlocation: service.location,
          visitingPrice: service.visitingPrice,
          maxPrice: service.maxPrice,
          image: base64Image
            ? { data: base64Image, contentType: service.image.contentType }
            : undefined,
        },
        { withCredentials: true }
      );

      toast.success("🎉 Booking confirmed successfully!");
      setForm({ phone: "", location: "", date: "", description: "" });
    } catch (err) {
      console.error("Booking Error:", err.response?.data || err);
      toast.error("❌ Failed to send booking request");
    }
  };

  const getImageSrc = (img) => {
    if (!img || !img.data) return "";
    const base64String = btoa(
      new Uint8Array(img.data.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    return `data:${img.contentType};base64,${base64String}`;
  };

  if (loadingUser) {
    return (
      <div style={{ textAlign: "center", marginTop: 100, fontSize: 18 }}>
        Loading user details...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: 100, fontSize: 18 }}>
        Please log in to continue.
      </div>
    );
  }

  return (
    <div style={{ padding: 16, minHeight: "100vh", background: "#f3f6f9" }}>
      {/* Toast Message Container */}
      <ToastContainer position="top-center" autoClose={2500} />

      <div
        className="booking-card"
        style={{
          maxWidth: 900,
          margin: "40px auto",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          padding: 32,
        }}
      >
        {service ? (
          <div style={{ width: "100%" }}>
            {/* --- Service Info --- */}
            <div
              style={{
                display: "flex",
                gap: 32,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 32,
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
                <h2
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    marginBottom: 8,
                    color: "#222",
                  }}
                >
                  {service.service}
                </h2>
                <div style={{ color: "#555", fontSize: 17, marginBottom: 8 }}>
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
                    👤 {service.name} ({service.experience} years experience)
                  </span>
                </div>
                <div style={{ color: "#666", fontSize: 16, marginBottom: 8 }}>
                   {service.location}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#007bff",
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

            <div
              style={{ borderTop: "1px solid #eee", margin: "32px 0 24px" }}
            />

            {/* --- Customer Form --- */}
            <div
              style={{
                width: "100%",
                maxWidth: 500,
                margin: "0 auto",
                display: "block",
              }}
            >
              <h4
                style={{
                  fontWeight: 700,
                  marginBottom: 18,
                  color: "#333",
                  fontSize: 20,
                }}
              >
                Customer Details
              </h4>
              <form onSubmit={handleSubmit}>
                {["phone", "location", "date"].map((field) => (
                  <div key={field} style={{ marginBottom: 18 }}>
                    <label
                      style={{
                        fontWeight: 500,
                        marginBottom: 6,
                        display: "block",
                        textTransform: "capitalize",
                      }}
                    >
                      {field === "phone"
                        ? "Phone Number"
                        : field === "location"
                        ? "Address Location"
                        : "Date"}
                    </label>
                    <input
                      type={field === "date" ? "date" : "text"}
                      name={field}
                      placeholder={
                        field === "phone"
                          ? "+91 00000 00000"
                          : field === "location"
                          ? "Enter your full address"
                          : ""
                      }
                      required
                      value={form[field]}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        fontSize: 16,
                        transition: "0.3s",
                      }}
                      onFocus={(e) =>
                        (e.target.style.border = "1px solid #007bff")
                      }
                      onBlur={(e) =>
                        (e.target.style.border = "1px solid #ccc")
                      }
                    />
                  </div>
                ))}

                <div style={{ marginBottom: 28 }}>
                  <label
                    style={{
                      fontWeight: 500,
                      marginBottom: 6,
                      display: "block",
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    name="description"
                    placeholder="Enter any details for the service provider"
                    required
                    value={form.description}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      fontSize: 16,
                      minHeight: 80,
                      resize: "vertical",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: "linear-gradient(90deg, #007bff, #00b4d8)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 18,
                    borderRadius: 8,
                    padding: "14px 0",
                    border: "none",
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.background =
                      "linear-gradient(90deg, #0062cc, #0096c7)")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.background =
                      "linear-gradient(90deg, #007bff, #00b4d8)")
                  }
                >
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
            No service selected
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectService;
