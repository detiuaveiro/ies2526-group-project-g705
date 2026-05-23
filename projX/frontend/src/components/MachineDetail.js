import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Wrench, AlertTriangle, ArrowLeft, Users, Activity } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { toast } from "sonner";

const API = "http://localhost:8080/api/v1";

export const MachineDetail = ({ machineId, onBack, onRequestAssistance }) => {
  const { user } = useAuth();

  const [machine, setMachine] = useState(null);
  const [problems, setProblems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [sensors, setSensors] = useState([]);

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
      .then((allLogs) => {
        // Ensure allLogs is an array before filtering
        if (Array.isArray(allLogs)) {
          setLogs(allLogs.filter((l) => l.machineId === machineId));
        } else {
          console.error("Expected array of logs, got:", allLogs);
          setLogs([]);
        }
      })
      .catch((e) => {
        console.error("Failed to load maintenance logs", e);
        setLogs([]);
      });
  };

  const loadSensors = () => {
    fetch(`${API}/sensors/${machineId}/history`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then(setSensors)
      .catch((e) => console.error("Failed to load sensors", e));
  };

  useEffect(() => {
    if (!machineId) return;
    loadMachine();
    loadProblems();
    loadLogs();
    loadSensors();
  }, [machineId, user]);

  useEffect(() => {
    if (!machineId) return;
    const interval = setInterval(() => {
      loadMachine();
      loadProblems();
      loadLogs();
      loadSensors();
    }, 5000);

    return () => clearInterval(interval);
  }, [machineId, user?.token]);

  const formatSensorData = () => {
    if (!sensors || sensors.length === 0) return [];

    const readings = sensors
      .map((curr) => ({
        ...curr,
        recordedAtDate: new Date(curr.recordedAt),
      }))
      .filter((curr) => !Number.isNaN(curr.recordedAtDate.getTime()));

    if (readings.length === 0) return [];

    const latestTimestamp = Math.max(...readings.map((curr) => curr.recordedAtDate.getTime()));
    const cutoffTimestamp = latestTimestamp - 12 * 60 * 60 * 1000; //12 horas

    const filtered = readings.filter((curr) => curr.recordedAtDate.getTime() >= cutoffTimestamp);

    const grouped = filtered.reduce((acc, curr) => {
      const time = curr.recordedAtDate.toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      if (!acc[time]) acc[time] = { time };
      acc[time][curr.sensorType] = curr.value;
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => a.time.localeCompare(b.time));
  };

  const handleStartMaintenance = () => {
    fetch(`${API}/maintenances/start?technicianId=${user.id}&machineId=${machineId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to start maintenance. Make sure you don't have another active session.");
        }
        toast.success("Maintenance started!");
        loadMachine();
      })
      .catch((e) => toast.error(e.message));
  };

  if (!machine) return <p>Loading...</p>;

  const isAssigned =
    user?.role === "TECHNICIAN" &&
    machine.assignedTechnicians?.some((t) => Number(t.id) === Number(user.id));

  const isMaintenanceOwner =
    machine.activeMaintenanceTechnicianId != null &&
    Number(machine.activeMaintenanceTechnicianId) === Number(user.id);

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
            <span className="font-medium">{(machine.downtimeSum ?? 0).toFixed(1)}h</span>
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

          {isAssigned && machine.status !== "MAINTENANCE" && (
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleStartMaintenance}>
              Start Maintenance
            </Button>
          )}

          {isAssigned && machine.status === "MAINTENANCE" && isMaintenanceOwner && (
            <Button className="w-full mt-4" onClick={() => onRequestAssistance(machine)}>
              Request Assistance
            </Button>
          )}

          {isAssigned && machine.status === "MAINTENANCE" && !isMaintenanceOwner && (
            <p className="text-sm text-amber-700 mt-2">
              Only {machine.assignedTechnicians?.find((t) => Number(t.id) === Number(machine.activeMaintenanceTechnicianId))?.name || "the technician who started maintenance"} can request assistance or end this maintenance.
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600">Machine ID</div>
          <div className="text-2xl font-bold mt-1">{machine.id}</div>
        </CardContent>
      </Card>

      {/* HEALTH STATUS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Health Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sensors.length === 0 ? (
            <p className="text-gray-500">No sensor data available for this machine.</p>
          ) : (
            <div className="h-80 mt-4 w-full" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={formatSensorData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="TEMPERATURE" stroke="#ef4444" name="Temperature (°C)" strokeWidth={2} />
                  <Line type="monotone" dataKey="PRESSURE" stroke="#3b82f6" name="Pressure (bar)" strokeWidth={2} />
                  <Line type="monotone" dataKey="VIBRATION" stroke="#10b981" name="Vibration (mm/s)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
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
                <li key={l.id} className="border p-4 rounded bg-gray-50 space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-blue-700">{l.title}</p>
                    <span className="text-xs text-gray-400">
                      {l.createdAt ? new Date(l.createdAt).toLocaleString("pt-PT") : "-"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 italic">"{l.description}"</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p><strong>Technician:</strong> {l.technicianName}</p>
                    <p><strong>Hours Spent:</strong> {l.hoursSpent}h</p>
                    <p><strong>Parts Used:</strong> {l.partsUsed || "None"}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
