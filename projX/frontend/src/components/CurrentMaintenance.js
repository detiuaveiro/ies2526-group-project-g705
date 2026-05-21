import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { EndMaintenanceDialog } from "./EndMaintenanceDialog";
import { toast } from "sonner";

export default function CurrentMaintenance({ user }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const API = "http://localhost:8080/api/v1/maintenances";
  const ASSISTANCE_API = "http://localhost:8080/api/v1/assistance-requests";

  const loadCurrentSession = (showLoading = false) => {
    if (showLoading) setLoading(true);
    fetch(`${API}/current/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(async (res) => {
        if (res.status === 204) return null;
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
    loadCurrentSession(true);
    const interval = setInterval(() => loadCurrentSession(false), 5000);
    return () => clearInterval(interval);
  }, [user.id]);

  const isAssistance = session?.sessionType === "ASSISTANCE";

  const handleEndMaintenance = (logData) => {
    if (isAssistance) {
      fetch(`${ASSISTANCE_API}/${session.assistanceRequestId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(logData),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to complete assistance request");
          toast.success("Assistance completed successfully!");
          setSession(null);
          loadCurrentSession();
        })
        .catch((e) => toast.error(e.message));
      return;
    }

    const maintenanceId = session.maintenanceRecordId;

    if (!maintenanceId) {
      toast.error("Internal error: maintenance record ID missing");
      return;
    }

    fetch(`http://localhost:8080/api/v1/maintenance/${maintenanceId}/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(logData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save maintenance log");
        return res.json();
      })
      .then(() => {
        return fetch(`${API}/finish/${session.id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${user.token}` },
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to end maintenance session");
        toast.success("Maintenance finished and logged successfully!");
        setSession(null);
        loadCurrentSession();
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
      <h2 className="text-2xl font-bold mb-4">
        {isAssistance ? "Current Assistance" : "Current Maintenance"}
      </h2>

      <div className="p-4 border rounded bg-white shadow-sm space-y-3">
        <p><strong>Machine:</strong> {session.machineName}</p>
        <p><strong>Started at:</strong> {new Date(session.startTime).toLocaleString()}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="text-blue-600 font-semibold">
            {isAssistance ? "Assistance in progress" : "In Progress"}
          </span>
        </p>

        <Button className="mt-4" onClick={() => setDialogOpen(true)}>
          {isAssistance ? "Complete Assistance" : "End Maintenance"}
        </Button>
      </div>

      <EndMaintenanceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        machineName={session.machineName}
        session={session}
        onConfirm={handleEndMaintenance}
      />
    </div>
  );
}
