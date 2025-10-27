import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminBooking.css";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("");
  const [filterProvider, setFilterProvider] = useState("");
  const url = import.meta.env.VITE_SERVER_URL;


  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${url}/admin/bookings`, { withCredentials: true });
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      await axios.put(`${url}/admin/bookings/${id}/cancel`, {}, { withCredentials: true });
      fetchBookings(); // refresh after cancel
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.customername.toLowerCase().includes(search.toLowerCase()) &&
      (filterService ? b.service === filterService : true) &&
      (filterProvider ? b.providername === filterProvider : true)
  );

  return (
    <div className="bookingContainer">
      <div className="header">
        <div>
          <h1>Booking Management</h1>
          <p>Manage and view all customer bookings.</p>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select onChange={(e) => setFilterService(e.target.value)}>
          <option value="">Service</option>
          {[...new Set(bookings.map((b) => b.service))].map((s, i) => (
            <option key={i}>{s}</option>
          ))}
        </select>
        <select onChange={(e) => setFilterProvider(e.target.value)}>
          <option value="">Provider</option>
          {[...new Set(bookings.map((b) => b.providername))].map((p, i) => (
            <option key={i}>{p}</option>
          ))}
        </select>
      </div>

      <div className="tableWrapper">
        <table className="bookingTable">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Service Name</th>
              <th>Provider Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => (
              <tr key={b._id}>
                <td>{b.customername}</td>
                <td>{b.service}</td>
                <td>{b.providername}</td>
                <td>{new Date(b.customerdate).toLocaleDateString()}</td>
                <td>
                  <span className={`status ${b.status.toLowerCase()}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  {["completed", "rejected", "cancel"].includes(
                    b.status.toLowerCase()
                  ) ? (
                    <span className="status disabled">{b.status}</span>
                  ) : (
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="cancelButton"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;
