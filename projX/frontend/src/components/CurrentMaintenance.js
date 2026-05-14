import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { EndMaintenanceDialog } from "./EndMaintenanceDialog";
import { toast } from "sonner";

export default function CurrentMaintenance({ user }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const API = "http://localhost:8080/api/v1/maintenances";

  const loadCurrentSession = () => {
    setLoading(true);
    fetch(`${API}/current/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        setSession(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadCurrentSession();
  }, [user.id]);

  const handleEndMaintenance = (logData) => {
    const maintenanceId = session.maintenanceRecordId;
    
    if (!maintenanceId) {
      toast.error("Internal error: maintenance record ID missing");
      return;
    }

    // 1. Post the log
    fetch(`http://localhost:8080/api/v1/maintenance/${maintenanceId}/log`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}` 
      },
      body: JSON.stringify(logData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save maintenance log");
        return res.json();
      })
      .then(() => {
        // 2. End the session
        return fetch(`${API}/finish/${session.id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${user.token}` },
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to end maintenance session");
        toast.success("Maintenance finished and logged successfully!");
        setSession(null);
      })
      .catch((e) => toast.error(e.message));
  };

  if (loading) return <p>Loading...</p>;

  if (!session)
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Current Maintenance</h2>
        <p className="text-gray-600">No active maintenance at the moment.</p>
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Current Maintenance</h2>

      <div className="p-4 border rounded bg-white shadow-sm space-y-3">
        <p><strong>Machine:</strong> {session.machineName}</p>
        <p><strong>Started at:</strong> {new Date(session.startTime).toLocaleString()}</p>
        <p><strong>Status:</strong> <span className="text-blue-600 font-semibold">In Progress</span></p>
        
        <Button className="mt-4" onClick={() => setDialogOpen(true)}>
          End Maintenance
        </Button>
      </div>

      <EndMaintenanceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        machineName={session.machineName}
        onConfirm={handleEndMaintenance}
      />
    </div>
  );
}
