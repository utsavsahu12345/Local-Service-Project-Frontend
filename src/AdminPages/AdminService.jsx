import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminService.css';

// Status styling helper
const getStatus = (status) => {
  switch (status) {
    case 'pending': return { text: 'Pending', className: 'statuspending' };
    case 'approve': return { text: 'Approved', className: 'statusapproved' };
    case 'reject': return { text: 'Rejected', className: 'statusrejected' };
    default: return { text: status, className: '' };
  }
};

const ServiceProviderTable = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const url = import.meta.env.VITE_SERVER_URL;

  // Fetch all services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${url}/admin/service/approve/`);
        setServices(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Update status (approve/reject)
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${url}/admin/service/approve/button/update/${id}`, { status: newStatus });
      setServices((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, approve: newStatus } : item
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  // Filtered data based on dropdown
  const filteredServices = services.filter((s) => {
    if (filter === "All") return true;
    if (filter === "Pending") return s.approve === "pending";
    if (filter === "Approved") return s.approve === "approve";
    if (filter === "Rejected") return s.approve === "reject";
    return true;
  });

  return (
    <div className="tablecontainer">
      {/* Header */}
      <header>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
        <span className="dropdownarrow">▼</span>
      </header>

      {/* Table */}
      <section className="tablewrapper">
        <div className="tablecontent">
          {/* Header Row */}
          <div className="tableheaderrow">
            <div className="colserviceimage">IMAGE</div>
            <div className="colprovidername">PROVIDER</div>
            <div className="colservice">SERVICE</div>
            <div className="colexperience">EXP</div>
            <div className="collocation">LOCATION</div>
            <div className="colpricerange">PRICE</div>
            <div className="colstatus">STATUS</div>
            <div className="colactions">ACTIONS</div>
          </div>

          {/* Data Rows */}
          {filteredServices.length > 0 ? (
            filteredServices.map((s) => {
              const status = getStatus(s.approve);
              return (
                <div key={s._id} className="tablerow">
                  <div className="colserviceimage">
                    <div className="serviceimagecircle">
                      <img
                        className="serviceimage"
                        src={s.imageBase64 || "https://via.placeholder.com/40"}
                        alt={s.name}
                      />
                    </div>
                  </div>
                  <div className="colprovidername">{s.name}</div>
                  <div className="colservice">{s.service}</div>
                  <div className="colexperience">{s.experience} yrs</div>
                  <div className="collocation">{s.location}</div>
                  <div className="colpricerange">
                    ₹{s.visitingPrice} - ₹{s.maxPrice}
                  </div>
                  <div className={`colstatus ${status.className}`}>{status.text}</div>
                  <div className="colactions">
                    <button
                      className="actionbutton approvebutton"
                      onClick={() => handleStatusChange(s._id, "approve")}
                    >
                      ✔
                    </button>
                    <button
                      className="actionbutton rejectbutton"
                      onClick={() => handleStatusChange(s._id, "reject")}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="noresults">No {filter} services found</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ServiceProviderTable;
