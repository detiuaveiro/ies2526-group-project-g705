import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { EndMaintenanceDialog } from "./EndMaintenanceDialog";

const API = "http://localhost:8080/api/v1/assistance-requests";

const normalizeStatus = (status) => String(status || "").toUpperCase();

export const TechnicianRequestsView = ({ onGoToMachine }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const loadRequests = () => {
    if (!user?.token || user?.id == null) return;

    setLoading(true);
    fetch(`${API}?role=TECHNICIAN&userId=${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || `Failed to load (${res.status})`);
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        return list.filter((req) => normalizeStatus(req.status) !== "COMPLETED");
      })
      .then((list) => {
        setRequests(list);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.message || "Failed to load assistance requests");
      });
  };

  const handleCompleteAssistance = (logData) => {
    if (!selectedRequest) return;

    fetch(`${API}/${selectedRequest.id}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(logData),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        toast.success("Assistance completed successfully");
        setSelectedRequest(null);
        loadRequests();
      })
      .catch(() => toast.error("Failed to complete assistance request"));
  };

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 2000);
    return () => clearInterval(interval);
  }, [user?.id, user?.token]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Assistance Requests</h2>
      <p className="text-sm text-gray-600">
        Requests that the director sends to <strong>you</strong>.
      </p>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && requests.length === 0 && (
        <p className="text-gray-600">No requests at the moment.</p>
      )}

      {!loading && requests.length > 0 && (
        <ul className="space-y-3">
          {requests.map((req) => {
            const status = normalizeStatus(req.status);
            return (
              <li key={req.id} className="border p-4 rounded-lg bg-white shadow-sm">
                <p className="font-medium">{req.machineName}</p>
                <p className="text-sm text-gray-600 mt-1">{req.reason}</p>
                <p className="text-sm text-gray-500">{req.problemDescription}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Requested by {req.requestedByName} · Status: {status}
                </p>

                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="text-blue-600 underline text-sm"
                    onClick={() => onGoToMachine(req.machineId)}
                  >
                    Go to the Machine
                  </button>

                  {status === "ACCEPTED" && (
                    <button
                      type="button"
                      className="text-purple-600 underline text-sm font-medium"
                      onClick={() => {
                        setSelectedRequest(req);
                        setDialogOpen(true);
                      }}
                    >
                      Complete Assistance
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {selectedRequest && (
        <EndMaintenanceDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setSelectedRequest(null);
          }}
          machineName={selectedRequest.machineName}
          session={{
            machineName: selectedRequest.machineName,
            startTime: selectedRequest.acceptedAt || selectedRequest.createdAt,
            technicianName: user?.name,
          }}
          onConfirm={handleCompleteAssistance}
        />
      )}
    </div>
  );
};
