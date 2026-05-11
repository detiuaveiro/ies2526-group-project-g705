import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Wrench, AlertTriangle, ArrowLeft, Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const API = "http://localhost:8080/api/v1";

export const MachineDetail = ({ machineId, onBack, onRequestAssistance }) => {
  const { user } = useAuth();

  const [machine, setMachine] = useState(null);
  const [problems, setProblems] = useState([]);
  const [logs, setLogs] = useState([]);

  const loadMachine = () => {
    fetch(`${API}/machines/${machineId}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then(setMachine);
  };

  const loadProblems = () => {
    fetch(`${API}/problems/machine/${machineId}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then(setProblems);
  };

  const loadLogs = () => {
    fetch(`${API}/maintenance/logs/all`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((allLogs) =>
        setLogs(allLogs.filter((l) => l.maintenanceId === machineId))
      );
  };

  useEffect(() => {
    if (!machineId) return;
    loadMachine();
    loadProblems();
    loadLogs();
  }, [machineId, user]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadMachine();
      loadProblems();
      loadLogs();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!machine) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <Button variant="outline" className="flex items-center gap-2" onClick={onBack}>
        <ArrowLeft className="w-4 h-4" />
        Back to Machines
      </Button>

      {/* MACHINE INFO */}
      <Card>
        <CardHeader>
          <CardTitle>{machine.name}</CardTitle>
          <p className="text-gray-600">{machine.location}</p>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Status</span>
            <Badge>{machine.status}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>Importance</span>
            <span className="font-medium">{machine.importanceLevel}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Downtime</span>
            <span className="font-medium">{machine.downtimeSum}h</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Suspicion</span>
            <span className={machine.suspicionFlag ? "text-red-600" : "text-green-600"}>
              {machine.suspicionFlag ? "Yes" : "No"}
            </span>
          </div>

          {/* NEW COUNTERS */}
          <div className="flex items-center justify-between">
            <span>Action Required</span>
            <span className="font-medium">{machine.actionRequiredCount}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Assistance Requested</span>
            <span className="font-medium">{machine.assistanceRequestedCount}</span>
          </div>

          {/* ASSIGNED TECHNICIANS */}
          <div className="flex items-center justify-between">
            <span>Assigned Technicians</span>
            <span className="font-medium flex gap-2">
              {machine.assignedTechnicians?.length === 0
                ? "None"
                : machine.assignedTechnicians.map((t) => t.name).join(", ")}
            </span>
          </div>

          {/* REQUEST ASSISTANCE BUTTON */}
          <Button className="w-full mt-4" onClick={() => onRequestAssistance(machine)}>
            Request Assistance
          </Button>
        </CardContent>
      </Card>

      {/* PROBLEMS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Problems History
          </CardTitle>
        </CardHeader>

        <CardContent>
          {problems.length === 0 ? (
            <p className="text-gray-500">No problems recorded</p>
          ) : (
            <ul className="space-y-2">
              {problems.map((p) => (
                <li key={p.id} className="border p-3 rounded space-y-2">
                  <p className="font-medium">
                    {p.description}
                    {p.resolved && (
                      <span className="ml-2 text-green-600 text-sm">(Resolved)</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {p.startProblemDate
                      ? new Date(p.startProblemDate).toLocaleString("pt-PT")
                      : "-"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* MAINTENANCE LOGS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            Maintenance Logs
          </CardTitle>
        </CardHeader>

        <CardContent>
          {logs.length === 0 ? (
            <p className="text-gray-500">No maintenance logs</p>
          ) : (
            <ul className="space-y-2">
              {logs.map((l) => (
                <li key={l.id} className="border p-3 rounded">
                  <p className="font-medium">Technician: {l.technicianName}</p>
                  <p className="text-sm text-gray-500">
                    Hours: {l.hoursSpent}h — Cost: {l.cost}€
                  </p>
                  <p className="text-sm text-gray-500">
                    {l.createdAt
                      ? new Date(l.createdAt).toLocaleString("pt-PT")
                      : "-"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
