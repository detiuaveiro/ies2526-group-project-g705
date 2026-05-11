import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const API = "http://localhost:8080/api/v1/assistance-requests";

export const AssistanceRequestsView = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  const loadRequests = () => {
    fetch(API, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then(setRequests)
      .catch(() => {});
  };

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">All Assistance Requests</h2>

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
              <p>Status: {req.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
