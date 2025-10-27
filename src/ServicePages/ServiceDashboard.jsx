import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import heroImage from "../assets/HeroService.png";
import "./ServiceDashboard.css";
import Footer from "./Footer";

const ServiceDashboard = () => {
  const navigate = useNavigate();
  const [Username, setUsername] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
    const url = import.meta.env.VITE_SERVER_URL;

  // Fetch user from JWT cookie
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/me`, {
          withCredentials: true,
        });
        const user = res.data.payload;
        if (user?.username) {
          setUsername(user.username);
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        alert("Session expired or not logged in. Please log in again.");
        navigate("/service/login");
      }
    };
    fetchUser();
  }, [navigate]);

  // Fetch services once username is available
  useEffect(() => {
    if (!Username) return;

    const fetchServices = async () => {
      try {
        const res = await fetch(
          `${url}/service/home/${Username}`,
          { credentials: "include" } // include cookie
        );
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [Username]);

  // Delete service
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch(
        `${url}/service/delete/${Username}/${id}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Service deleted successfully");
        setServices((prev) => prev.filter((s) => s._id !== id));
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Network error while deleting service");
    }
  };

  // Edit service
  const handleEdit = (service) => {
    setEditData(service);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const { image, ...updateData } = editData;
      const res = await fetch(
        `${url}/service/update/${Username}/${editData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Service updated successfully");
        setServices((prev) =>
          prev.map((s) => (s._id === editData._id ? { ...s, ...updateData } : s))
        );
        setShowModal(false);
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Network error while updating service");
    }
  };

  // Hero section
  const HeroSection = () => (
    <div className="hero-container">
      <div className="hero-left">
        <h1>
          Got a Skill? <br />
          <span>Start Earning Today!</span>
        </h1>
        <p>
          Join our platform and offer your services to customers in your city.
          <br />
          From cleaning to repair — your talent deserves recognition.
        </p>
        <div className="hero-buttons">
          <Link to="/service/add">
            <button className="primary-btn">Add Your Service</button>
          </Link>
          <button className="secondary-btn">Explore Services</button>
        </div>
      </div>
      <div className="hero-right">
        <img src={heroImage} alt="Hero Service" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <HeroSection />
        <div className="text-center mt-5">Loading...</div>
      </>
    );
  }

  return (
    <>
      <HeroSection />
      <div className="container py-5">
        <h3 className="mb-4 text-center fw-bolder">
          {services.length > 0 ? "Recently Added Services" : "No Services Added Yet"}
        </h3>

        {services.length === 0 ? (
          <div className="text-center mt-4 text-muted">
            You haven't added any services yet.
            <br />
            Click “Add Your Service” above to get started!
          </div>
        ) : (
          <div className="row">
            {services.map((service) => (
              <div key={service._id} className="col-md-6 col-lg-4 mb-4">
                <div className="provider-card shadow-sm h-100">
                  <div className="provider-img">
                    {service.image?.data ? (
                      <img
                        src={`data:${service.image.contentType};base64,${btoa(
                          new Uint8Array(service.image.data.data).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            ""
                          )
                        )}`}
                        alt={service.name}
                      />
                    ) : (
                      <img src="https://via.placeholder.com/400x200" alt="Service" />
                    )}
                  </div>
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <h5 className="fw-bold mb-0">{service.name}</h5>
                      </div>
                      <span
                        className={`badge ${
                          service.status === "active"
                            ? "bg-success"
                            : service.status === "inactive"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {service.status}
                      </span>
                    </div>
                    <h6 className="text-primary fw-bold">{service.service}</h6>
                    <p className="text-muted small mb-2">
                      <i className="fa-solid fa-briefcase"></i> {service.experience} years of experience
                    </p>
                    <p className="small">
                      <i className="fa-solid fa-message"></i> {service.description}
                    </p>
                    <ul className="list-unstyled small text-muted">
                      <li>
                        <i className="fa-solid fa-tag"></i> ₹{service.visitingPrice}(visiting) - ₹{service.maxPrice}(max)
                      </li>
                      <li>
                        <i className="fa-solid fa-phone"></i> {service.phone}
                      </li>
                      <li>
                        <i className="fa-solid fa-location-dot"></i> {service.location}
                      </li>
                    </ul>
                    <span
                      className={`badge ${
                        service.approve === "approve"
                          ? "bg-success"
                          : service.approve === "reject"
                          ? "bg-danger"
                          : service.approve === "pending"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {service.approve}
                    </span>
                  </div>
                  <div className="card-footer d-flex justify-content-end gap-2 p-3">
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(service._id)}>
                      Delete
                    </button>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(service)}>
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && editData && (
          <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Service</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input type="text" name="name" className="form-control" value={editData.name || ""} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input type="text" name="phone" className="form-control" value={editData.phone || ""} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Service</label>
                      <select name="service" className="form-control" value={editData.service || ""} onChange={handleChange}>
                        <option value="Plumber">Plumber</option>
                        <option value="Electrician">Electrician</option>
                        <option value="Carpenter">Carpenter</option>
                        <option value="Painter">Painter</option>
                        <option value="Washing Machine Repair">Washing Machine Repair</option>
                        <option value="Makeup Artist">Makeup Artist</option>
                        <option value="Hair Stylist">Hair Stylist</option>
                        <option value="Cricket Coaching">Cricket Coaching</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Experience (years)</label>
                      <input type="number" name="experience" className="form-control" value={editData.experience || ""} onChange={handleChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea name="description" className="form-control" value={editData.description || ""} onChange={handleChange}></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Location</label>
                      <input type="text" name="location" className="form-control" value={editData.location || ""} onChange={handleChange} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Visiting Price</label>
                      <input type="number" name="visitingPrice" className="form-control" value={editData.visitingPrice || ""} onChange={handleChange} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Max Price</label>
                      <input type="number" name="maxPrice" className="form-control" value={editData.maxPrice || ""} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select name="status" className="form-control" value={editData.status || "inactive"} onChange={handleChange}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ServiceDashboard;
