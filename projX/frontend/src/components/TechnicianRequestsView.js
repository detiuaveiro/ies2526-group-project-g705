import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const API = "http://localhost:8080/api/v1/assistance-requests";

export const TechnicianRequestsView = ({ onGoToMachine }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  const loadRequests = () => {
    if (!user?.token || !user?.id) return;

    fetch(`${API}?role=TECHNICIAN&userId=${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((data) =>
        setRequests(
          Array.isArray(data)
            ? data.filter(
                (r) =>
                  r.status !== "COMPLETED" &&
                  Number(r.assignedTechnicianId) === Number(user.id) &&
                  Number(r.requestedById) !== Number(user.id)
              )
            : []
        )
      )
      .catch(() => {});
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
  }, [user?.id, user?.token]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Assistance Requests</h2>
      <p className="text-sm text-gray-600">
        Requests assigned to you by the director. Pending requests appear here after assignment.
      </p>

      {requests.length === 0 ? (
        <p>No requests assigned to you</p>
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
