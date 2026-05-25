import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { AlertCircle, Clock, MapPin, UserMinus, UserPlus } from "lucide-react";

const API = "http://localhost:8080/api/v1";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-PT");
};

const statusLabel = (status) => {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "ACCEPTED":
      return "In Progress";
    case "COMPLETED":
      return "Completed";
    default:
      return status;
  }
};

const statusColor = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "ACCEPTED":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "COMPLETED":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const AssistanceRequestsView = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechByRequest, setSelectedTechByRequest] = useState({});
  const [filter, setFilter] = useState("active");

  const loadRequests = () => {
    fetch(`${API}/assistance-requests?role=DIRECTOR`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load");
        const data = await r.json();
        return Array.isArray(data) ? data : [];
      })
      .then(setRequests)
      .catch(() => toast.error("Failed to load assistance requests"));
  };

  useEffect(() => {
    fetch(`${API}/users/technicians`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(async (r) => {
        const data = await r.json();

        console.log("TECHNICIANS RESPONSE:", data);

        setTechnicians(Array.isArray(data) ? data : []);
      })
      .catch(() => toast.error("Failed to load technicians"));
  }, [user]);

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const handleUnassign = async (request) => {
    try {
      const res = await fetch(`${API}/assistance-requests/${request.id}/unassign`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to unassign");
      }
      toast.success("Technician removed from request");
      setSelectedTechByRequest((prev) => ({ ...prev, [request.id]: undefined }));
      loadRequests();
    } catch (e) {
      toast.error(e.message || "Failed to remove assignment");
    }
  };

  const handleAssign = async (request) => {
    const technicianId =
      selectedTechByRequest[request.id] ?? request.assignedTechnicianId;

    if (request.assignedTechnicianId) {
      toast.error("Remove the current assignment before assigning another technician");
      return;
    }

    if (!technicianId) {
      toast.error("Select a technician to assign");
      return;
    }

    if (Number(technicianId) === Number(request.requestedById)) {
      toast.error("Cannot assign the request to the technician who created it");
      return;
    }

    try {
      const res = await fetch(
        `${API}/assistance-requests/${request.id}/assign?technicianId=${technicianId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || "Failed to assign");
      }
      toast.success("Request send to the Technician", {
          description: "The technician will be notified.",
        });
      loadRequests();
    } catch (e) {
      toast.error(e.message || "Failed to assign technician");
    }
  };

  const normalizeStatus = (req) =>
    String(req.status || "")
      .trim()
      .toUpperCase();

  const activeRequests = requests.filter(
    (r) => normalizeStatus(r) === "PENDING" || normalizeStatus(r) === "ACCEPTED"
  );
  const completedRequests = requests.filter((r) => normalizeStatus(r) === "COMPLETED");

  const filteredRequests = filter === "completed" ? completedRequests : activeRequests;
  const activeCount = activeRequests.length;
  const completedCount = completedRequests.length;

  const isActiveStatus = (status) => {
    const s = String(status || "")
      .trim()
      .toUpperCase();

    return s === "PENDING" || s === "ACCEPTED";
  };

  const eligibleTechnicians = (request) =>
    technicians.filter((t) => {
      if (Number(t.id) === Number(request.requestedById)) return false;
      const assignedOnMachine = request.machineAssignedTechnicianIds || [];
      return !assignedOnMachine.map(Number).includes(Number(t.id));
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Assistance Requests</h1>
        <p className="text-gray-600">
          Sending to the Technician.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === "active" ? "default" : "outline"}
          onClick={() => setFilter("active")}
        >
          Active ({activeCount})
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
        >
          Completed ({completedCount})
        </Button>
      </div>

      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-600">
            No {filter === "completed" ? "completed" : "active"} requests
          </CardContent>
        </Card>
      ) : (
        <div key={filter} className="grid gap-4">
          {filteredRequests.map((request) => {
            const eligible = eligibleTechnicians(request);
            const selectedId =
              selectedTechByRequest[request.id] ?? request.assignedTechnicianId;
            const selectValue =
              selectedId != null && selectedId !== "" ? String(selectedId) : "";

            return (
              <Card
                key={request.id}
                className={`border-l-4 ${
                  request.status === "PENDING" ? "border-l-yellow-500" : "border-l-blue-500"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-4 justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        <h3 className="font-semibold text-lg">{request.machineName}</h3>
                        <Badge className={statusColor(request.status)}>
                          {statusLabel(request.status)}
                        </Badge>
                        <span className="text-xs text-gray-500">#{request.id}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {request.machineLocation || "—"}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        Created: {formatDate(request.createdAt)}
                      </div>

                      <p className="text-sm text-gray-600">
                        Problem #{request.problemId}: {request.problemDescription}
                      </p>

                      <div className="bg-orange-50 border border-orange-200 rounded p-3">
                        <p className="text-sm font-medium text-orange-900">Reason</p>
                        <p className="text-sm text-orange-800">{request.reason}</p>
                      </div>

                      <p className="text-sm text-gray-600">
                        Requested by: <span className="font-medium">{request.requestedByName}</span>
                      </p>

                      {request.assignedTechnicianName && (
                        <p className="text-sm text-gray-600">
                          Assigned to:{" "}
                          <span className="font-medium">{request.assignedTechnicianName}</span>
                        </p>
                      )}

                      {request.acceptedAt && (
                        <p className="text-xs text-gray-500">
                          Accepted: {formatDate(request.acceptedAt)}
                        </p>
                      )}
                      {request.completedAt && (
                        <p className="text-xs text-gray-500">
                          Completed: {formatDate(request.completedAt)}
                        </p>
                      )}
                    </div>

                    {isActiveStatus(request.status) && (
                      <div className="flex flex-col gap-2 min-w-[220px]">
                        {!request.assignedTechnicianId ? (
                          <>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={selectValue}
                              onChange={(e) => {
                                const v = e.target.value;
                                setSelectedTechByRequest({
                                  ...selectedTechByRequest,
                                  [request.id]: v ? Number(v) : undefined,
                                });
                              }}
                            >
                              <option value="">Choose technician</option>
                              {eligible.length === 0 && (
                                <option value="" disabled>
                                  No other technician available
                                </option>
                              )}
                              {eligible.map((tech) => (
                                <option key={tech.id} value={String(tech.id)}>
                                  {tech.name}
                                </option>
                              ))}
                            </select>
                            <Button
                              onClick={() => handleAssign(request)}
                              className="w-full"
                              disabled={eligible.length === 0}
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Send to technician
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => handleUnassign(request)}
                            className="w-full text-red-700 border-red-200 hover:bg-red-50"
                          >
                            <UserMinus className="w-4 h-4 mr-2" />
                            Remove assigned technician
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
