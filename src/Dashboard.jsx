import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard({ onLogout }) {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const pageSize = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/applications", {
          headers: { Authorization: localStorage.getItem("token") }
        });
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };
    fetchData();
  }, []);

  const filtered = applications.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.position.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const downloadPDF = async (id, name) => {
    try {
      const res = await axios.get(`http://localhost:3000/applications/${id}/pdf`, {
        responseType: "blob",
        headers: { Authorization: localStorage.getItem("token") }
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${name}_application.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading PDF:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout(); // notify App to return to login
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>HR Dashboard</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      {/* Search and Filter */}
      <input
        type="text"
        placeholder="Search by name or position..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select onChange={(e) => setSearch(e.target.value)}>
        <option value="">All Positions</option>
        {[...new Set(applications.map(app => app.position))].map(pos => (
          <option key={pos} value={pos}>{pos}</option>
        ))}
      </select>

      {/* Applications Table */}
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Email</th>
            <th>Submitted At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(app => (
            <tr key={app._id}>
              <td>{app.name}</td>
              <td>{app.position}</td>
              <td>{app.email}</td>
              <td>{new Date(app.submittedAt).toLocaleString()}</td>
              <td>
                <button onClick={() => setSelectedApp(app)}>View</button>
                <button onClick={() => downloadPDF(app._id, app.name)}>Download PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page}</span>
        <button disabled={page * pageSize >= filtered.length} onClick={() => setPage(page + 1)}>Next</button>
      </div>

      {/* Modal Preview */}
      {selectedApp && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedApp.name}</h3>
            <p><strong>Email:</strong> {selectedApp.email}</p>
            <p><strong>Position:</strong> {selectedApp.position}</p>
            <p><strong>Phone:</strong> {selectedApp.phone}</p>
            <p><strong>Nationality:</strong> {selectedApp.nationality}</p>
            <p><strong>Marital Status:</strong> {selectedApp.maritalStatus}</p>
            <button onClick={() => setSelectedApp(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
