import "./CustomerHome.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Convert MongoDB image buffer to Base64
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

const CustomerHome = () => {
  const [services, setServices] = useState([]);
  const [serviceType, setServiceType] = useState("All Services");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState(0);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    axios
      .get(`${url}/customer/home`)
      .then((res) => setServices(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filteredServices = services.filter((s) => {
    const inServiceType =
      serviceType === "All Services" || s.service === serviceType;
    const inLocation =
      location === "" ||
      s.location?.toLowerCase().includes(location.toLowerCase());
    const inExperience = !experience || s.experience >= experience;

    return inServiceType && inLocation && inExperience;
  });

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Find & Buy Trusted Local Services</h1>
          <p>Your one-stop marketplace for quality local service.</p>
          <button
            className="explore-btn"
            onClick={() =>
              document
                .querySelector(".home-main")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Services
          </button>
        </div>
      </div>

      <div className="home-flex">
        {/* Filters Sidebar */}
        <div className="home-filters">
          <h3>Filters</h3>

          <div className="filter-group">
            <label>Service Type</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            >
              <option value="All Services">All Services</option>
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

          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Minimum Experience (years)</label>
            <input
              type="number"
              min={0}
              value={experience}
              onChange={(e) => setExperience(+e.target.value)}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="home-main">
          <h1>Hire Local Services</h1>
          <div className="sub-text">Find the best professionals for your needs</div>

          <div className="row">
            {filteredServices.length === 0 ? (
              <p className="no-services-message">
                No services match your current filters. Try adjusting your search
                criteria!
              </p>
            ) : (
              filteredServices.map((s) => (
                <div key={s._id} className="col">
                  <div className="service-card">
                    <img
                      className="serviceimg"
                      src={
                        s.image && s.image.data
                          ? `data:${
                              s.image.contentType
                            };base64,${arrayBufferToBase64(s.image.data.data)}`
                          : "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={s.service}
                    />
                    <div className="card-body">
                      <span className="price-badge">$ {s.visitingPrice}</span>

                      <h3 className="service-title">{s.service}</h3>

                      <div className="name">
                        <i class="fa-solid fa-user"></i> {s.name}
                      </div>

                      <div className="experience">
                        {s.description}
                      </div>

                      <div className="location">
                        <i className="fa-solid fa-location-dot"></i> {s.location}
                      </div>

                      <div className="btn-group">
                        <button
                          className="book-btn"
                          onClick={() =>
                            navigate("/customer/select/service", {
                              state: { service: s },
                            })
                          }
                        >
                          Book Now
                        </button>
                        <button
                          className="details-btn"
                          onClick={() =>
                            navigate("/customer/view/details", {
                              state: { service: s },
                            })
                          }
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
