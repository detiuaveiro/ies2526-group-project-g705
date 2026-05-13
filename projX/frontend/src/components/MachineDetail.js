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
      .then((allLogs) =>
        setLogs(allLogs.filter((l) => l.machineId === machineId))
      );
  };

  const loadSensors = () => {
    fetch(`${API}/sensors/${machineId}`, {
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
    const interval = setInterval(() => {
      loadMachine();
      loadProblems();
      loadLogs();
      loadSensors();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatSensorData = () => {
    if (!sensors || sensors.length === 0) return [];
    
    // Group by recordedAt
    const grouped = sensors.reduce((acc, curr) => {
      const time = new Date(curr.recordedAt).toLocaleTimeString("pt-PT", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      if (!acc[time]) acc[time] = { time };
      acc[time][curr.sensorType] = curr.value;
      return acc;
    }, {});
    
    // Sort by time
    return Object.values(grouped).sort((a, b) => a.time.localeCompare(b.time));
  };

  const handleStartMaintenance = () => {
    fetch(`${API}/maintenances/start?technicianId=${user.id}&machineId=${machineId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to start maintenance");
        toast.success("Maintenance started!");
        loadMachine();
      })
      .catch((e) => toast.error(e.message));
  };

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

          {/* START MAINTENANCE BUTTON (TECHNICIAN ONLY) */}
          {user?.role === "TECHNICIAN" && machine.status !== "MAINTENANCE" && (
            <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700" onClick={handleStartMaintenance}>
              Start Maintenance
            </Button>
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
            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatSensorData()}>
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
