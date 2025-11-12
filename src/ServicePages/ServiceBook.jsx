import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ServiceBook.css";

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
        toast.error("Please log in again.");
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
          uint8Array.reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
      }

      await axios.post(
        `${url}/service/booking/completed`,
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

      toast.success("✅ Booking Confirmed Successfully!", { position: "top-center" });
      setForm({ phone: "", location: "", date: "", description: "" });
    } catch (err) {
      console.error("Booking Error:", err.response?.data || err);
      toast.error("❌ Error sending data. Please try again.", { position: "top-center" });
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

  if (loadingUser)
    return (
      <div className="loading-text">Loading user details...</div>
    );

  if (!user)
    return (
      <div className="loading-text">Please log in to continue.</div>
    );

  return (
    <div className="select-service-container">
      <ToastContainer />
      <div className="booking-card">
        {service ? (
          <>
            <div className="service-info">
              <img
                src={getImageSrc(service.image)}
                alt={service.service}
                className="service-img"
              />
              <div className="service-details">
                <h2>{service.service}</h2>
                <p className="service-desc">{service.description}</p>
                <p className="service-provider">
                  👤 {service.name} ({service.experience} years)
                </p>
                <p className="service-loc"> {service.location}</p>
                <p className="service-price">
                  ₹{service.visitingPrice}{" "}
                  <span>Visiting</span> | Max ₹{service.maxPrice}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="customer-form">
              <h4>Customer Details</h4>
              <input
                type="number"
                name="phone"
                placeholder="+91 00000 00000"
                required
                value={form.phone}
                onChange={handleChange}
              />
              <input
                type="text"
                name="location"
                placeholder="Enter your full address"
                required
                value={form.location}
                onChange={handleChange}
              />
              <input
                type="date"
                name="date"
                required
                value={form.date}
                onChange={handleChange}
              />
              <textarea
                name="description"
                placeholder="Any details for the provider..."
                required
                value={form.description}
                onChange={handleChange}
              />
              <button type="submit" className="confirm-btn">
                Confirm Booking
              </button>
            </form>
          </>
        ) : (
          <div className="no-service">No service selected</div>
        )}
      </div>
    </div>
  );
};

export default SelectService;
