import React, { useEffect, useState } from "react";
import axios from "axios";
import "../AdminPages/AdminDashboard.css";

const AdminDashboard = () => {
  const [customerCount, setCustomerCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [loading, setLoading] = useState(true);
  const url = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [customerRes, serviceRes, bookingRes] = await Promise.all([
          axios.get(`${url}/api/customercount`),
          axios.get(`${url}/api/servicecount`),
          axios.get(`${url}/api/pendingbookings`),
        ]);

        setCustomerCount(customerRes.data.totalCustomers);
        setServiceCount(serviceRes.data.totalServices);
        setPendingBookings(bookingRes.data.pendingBookings);
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const totalUsers = customerCount + serviceCount;

  return (
    <div className="admindashboard">
      <div className="admindashboardheader">
        <h3>Dashboard</h3>
        <button>Refresh</button>
      </div>
      <div className="admindashboardbox container">
        <div className="box">
          <h3>Total Users</h3>
          {loading ? <p>Loading...</p> : <h2>{totalUsers}</h2>}
        </div>

        <div className="box">
          <h3>Customers</h3>
          {loading ? <p>Loading...</p> : <h2>{customerCount}</h2>}
        </div>

        <div className="box">
          <h3>Services</h3>
          {loading ? <p>Loading...</p> : <h2>{serviceCount}</h2>}
        </div>

        <div className="box">
          <h3>Pending Bookings</h3>
          {loading ? <p>Loading...</p> : <h2>{pendingBookings}</h2>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
