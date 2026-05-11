import React, { useEffect, useState } from "react";

export default function CurrentMaintenance({ user }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:8080/api/v1/maintenance";

  useEffect(() => {
    fetch(`${API}/current/${user.id}`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        setSession(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user.id]);

  if (loading) return <p>Loading...</p>;

  if (!session)
    return (
      <div>
        <h2>Current Maintenance</h2>
        <p>No active maintenance at the moment.</p>
      </div>
    );

  return (
    <div>
      <h2>Current Maintenance</h2>

      <div className="p-3 border rounded">
        <p><strong>Machine:</strong> {session.machineName}</p>
        <p><strong>Started at:</strong> {new Date(session.startTime).toLocaleString()}</p>
        <p><strong>Status:</strong> In Progress</p>
      </div>
    </div>
  );
}
