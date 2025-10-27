import React, { useEffect, useState } from "react";
import axios from "axios"; // ✅ Missing import
import { useNavigate } from "react-router-dom";
import "./ServiceAdd.css";
import { FaCloudUploadAlt } from "react-icons/fa";
import Footer from "./Footer";

const ServiceAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
    const url = import.meta.env.VITE_SERVER_URL;

  const [form, setForm] = useState({
    username: "",
    name: "",
    phone: "",
    service: "",
    experience: "",
    description: "",
    location: "",
    visitingPrice: "",
    maxPrice: "",
    status: "Active",
    approve: "Pending",
    image: null,
  });

  // ✅ Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/me`, {
          withCredentials: true,
        });
        const user = res.data.payload;
        if (user?.username) {
          setUsername(user.username);
          setForm((prev) => ({ ...prev, username: user.username }));
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        alert("Session expired or not logged in. Please log in again.");
        navigate("/service/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  // ✅ Handle form input
  function handleChange(e) {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else if (name === "description") {
      const words = value.split(/\s+/).filter(Boolean);
      const limitedWords = words.slice(0, 15).join(" ");
      setForm((prev) => ({ ...prev, description: limitedWords }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  // ✅ Submit form
  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitting:", form);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });

      const res = await fetch(`${url}/service/add/frist`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Service added successfully!");
        setForm({
          username,
          name: "",
          phone: "",
          service: "",
          experience: "",
          description: "",
          location: "",
          visitingPrice: "",
          maxPrice: "",
          status: "Active",
          approve: "Pending",
          image: null,
        });
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      alert("Failed to submit service. Try again later.");
    }
  }

  const wordCount = form.description.split(/\s+/).filter(Boolean).length;
  const imageFileName = form.image ? form.image.name : "No file chosen";

  if (loading) return <p>Loading user info...</p>;

  return (
    <>
      <div className="service-add-container">
        <div className="service-add-card">
          <h2>Add Service</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  readOnly
                  className="read-only"
                />
              </div>

              <div className="form-field">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Service</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Service</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Painter">Painter</option>
                  <option value="AC Mechanic">AC Mechanic</option>
                  <option value="Refrigerator Repairer">Refrigerator Repairer</option>
                  <option value="Washing Machine Technician">Washing Machine Technician</option>
                  <option value="RO Service">RO / Water Purifier Service</option>
                  <option value="CCTV Installation">CCTV Installation</option>
                  <option value="Geyser Repair">Geyser Repair</option>
                  <option value="House Cleaning">House Cleaning</option>
                  <option value="Sofa Cleaning">Sofa Cleaning</option>
                  <option value="Carpet Cleaning">Carpet Cleaning</option>
                  <option value="Pest Control">Pest Control</option>
                  <option value="Bathroom Cleaning">Bathroom Cleaning</option>
                  <option value="Bike Mechanic">Bike Mechanic</option>
                  <option value="Car Mechanic">Car Mechanic</option>
                  <option value="Car Wash">Car Wash</option>
                  <option value="Battery Replacement">Battery Replacement</option>
                  <option value="Barber">Barber</option>
                  <option value="Beautician">Beautician</option>
                  <option value="Makeup Artist">Makeup Artist</option>
                  <option value="Massage Therapist">Massage Therapist</option>
                  <option value="Computer Repair">Computer Repair</option>
                  <option value="Mobile Repair">Mobile Repair</option>
                  <option value="Internet Setup">Internet / WiFi Setup</option>
                  <option value="Photographer">Photographer</option>
                  <option value="Tutor">Tutor / Teacher</option>
                </select>
              </div>

              <div className="form-field">
                <label>Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Max Price ($)</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={form.maxPrice}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="full-width short-description-area">
              <label>Short Description</label>
              <textarea
                name="description"
                placeholder="15-word limit..."
                value={form.description}
                onChange={handleChange}
                required
                rows={2}
              />
              <small className="word-count-label">{wordCount}/15 words</small>
            </div>

            <div className="form-grid compact-grid">
              <div className="form-field">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Visiting Price ($)</label>
                <input
                  type="number"
                  name="visitingPrice"
                  value={form.visitingPrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="full-width work-image-area">
              <label>Work Image</label>
              <div
                className="upload-box"
                onClick={() =>
                  document.getElementById("image-upload-input").click()
                }
              >
                <input
                  type="file"
                  id="image-upload-input"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ display: "none" }}
                  required
                />
                <FaCloudUploadAlt size={32} style={{ color: "#aaa", marginBottom: "8px" }} />
                <p className="upload-text">
                  <strong>Choose File</strong> or drag and drop
                </p>
                <p className="file-info">PNG, JPG, GIF up to 10MB</p>
                <p className="file-name">{imageFileName}</p>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="add-service-btn">
                Add Service
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ServiceAdd;
