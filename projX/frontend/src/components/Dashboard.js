import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle, Wrench, AlertTriangle, Eye } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api/v1";

export const Dashboard = () => {
  const { user } = useAuth();

  const [machines, setMachines] = useState([]);
  const [problems, setProblems] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/machines`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setMachines(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load machines"));
  }, [user]);

  useEffect(() => {
    fetch(`${API_URL}/problems/history`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setProblems(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load breakdown history"));
  }, [user]);

  useEffect(() => {
    fetch(`${API_URL}/assistance-requests?role=DIRECTOR`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load assistance requests"));
  }, [user]);

  const active = machines.filter((m) => m.status === "ACTIVE").length;
  const maintenance = machines.filter((m) => m.status === "MAINTENANCE").length;

  const suspiciousCount = machines.filter((m) => m.suspicionFlag).length;

  const machinesWithDuplicateAssignments = machines.filter((m) => {
    const ids = (m.assignedTechnicians || []).map((t) => t.id);
    return ids.length !== new Set(ids).size;
  });

  const recentBreakdowns = problems
    .sort(
      (a, b) =>
        new Date(b.startProblemDate).getTime() -
        new Date(a.startProblemDate).getTime()
    )
    .slice(0, 5);

  const pendingRequests = requests.filter(
    (r) => String(r.status).toUpperCase() === "PENDING"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Real-time overview of the system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">Active</div>
                <div className="text-3xl font-bold">{active}</div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">Maintenance</div>
                <div className="text-3xl font-bold">{maintenance}</div>
              </div>
              <Wrench className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">Pending Requests</div>
                <div className="text-3xl font-bold">{pendingRequests.length}</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">Suspicious Machines</div>
                <div className="text-3xl font-bold">{suspiciousCount}</div>
              </div>
              <Eye className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {machinesWithDuplicateAssignments.length > 0 && (
        <Card className="border-amber-300 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-900">Duplicate technician assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {machinesWithDuplicateAssignments.map((m) => (
              <p key={m.id} className="text-sm text-amber-800">
                <span className="font-medium">{m.name}</span> has the same technician listed more than once.
                Re-assign in Machine Assignment to fix.
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Breakdowns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBreakdowns.length === 0 && (
              <p className="text-sm text-gray-500">No breakdowns recorded</p>
            )}
            {recentBreakdowns.map((p, index) => (
              <div key={p.problemId ?? p.id ?? `breakdown-${index}`} className="border-b pb-3">
                <div className="font-medium">{p.machineName}</div>
                <div className="text-sm text-gray-600">{p.description}</div>
                <div className="text-xs text-gray-500">
                  {new Date(p.startProblemDate).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Assistance Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 && (
            <p className="text-gray-500 text-sm">No pending requests</p>
          )}
          {pendingRequests.map((r) => (
            <div key={r.id} className="border-b pb-3 mb-3">
              <div className="font-medium">{r.machineName}</div>
              <div className="text-sm text-gray-600">{r.reason}</div>
              <div className="text-xs text-gray-500">
                Requested by {r.requestedByName}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
