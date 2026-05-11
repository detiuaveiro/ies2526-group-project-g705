import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const API = "http://localhost:8080/api/v1/assistance-requests";

export const TechnicianRequestsView = ({ onGoToMachine }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  const loadRequests = () => {
    fetch(API, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((data) => setRequests(data.filter(r => r.status !== "COMPLETED")))
      .catch(() => {});
  };

  const acceptRequest = async (id) => {
    await fetch(`${API}/${id}/assign?technicianId=${user.id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    loadRequests();
  };

  const completeRequest = async (id) => {
    await fetch(`${API}/${id}/complete`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    loadRequests();
  };

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Assistance Requests</h2>

      {requests.length === 0 ? (
        <p>No requests</p>
      ) : (
        <ul className="space-y-2">
          {requests.map((req) => (
            <li key={req.id} className="border p-3 rounded">
              <p className="font-medium">{req.problemDescription}</p>
              <p className="text-sm text-gray-500">
                Machine: {req.machineName}
              </p>

              <button
                className="text-blue-600 underline mt-2"
                onClick={() => onGoToMachine(req.machineId)}
              >
                Go to machine
              </button>

              {req.status === "PENDING" && (
                <button
                  className="text-green-600 underline ml-4"
                  onClick={() => acceptRequest(req.id)}
                >
                  Accept Request
                </button>
              )}

              {req.status === "ACCEPTED" && (
                <button
                  className="text-purple-600 underline ml-4"
                  onClick={() => completeRequest(req.id)}
                >
                  Mark as Completed
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
