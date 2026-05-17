import React, { useEffect, useState } from "react";

export default function YourMaintenanceStatistics({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:8080/api/v1/maintenance";

  useEffect(() => {
    fetch(`${API}/stats/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user.id]);

  if (loading) return <p>Loading...</p>;

  if (!stats)
    return (
      <div>
        <h2>Your Maintenance Statistics</h2>
        <p>No statistics available.</p>
      </div>
    );

  return (
    <div>
      <h2>Your Maintenance Statistics</h2>

      <div style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <p><strong>Tasks Completed:</strong> {stats.tasksCompleted}</p>
        <p><strong>Tasks Pending:</strong> {stats.tasksPending}</p>
        <p><strong>Average Repair Time:</strong> {stats.averageRepairTime} hours</p>
        <p><strong>Assisted Others:</strong> {stats.assistedCounter}</p>
        <p><strong>Was Assisted:</strong> {stats.wasAssistedCounter}</p>
        <p><strong>Available:</strong> {stats.isAvailable ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}
