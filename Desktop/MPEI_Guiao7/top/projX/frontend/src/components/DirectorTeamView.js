import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, Wrench, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api/v1";

export const DirectorTeamView = () => {
  const { user } = useAuth();
  const [technicians, setTechnicians] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const loadTechnicians = () => {
    fetch(`${API_URL}/users/technicians`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setTechnicians(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load technicians"));
  };

  useEffect(() => {
    loadTechnicians();
    const interval = setInterval(loadTechnicians, 8000);
    return () => clearInterval(interval);
  }, [user]);

  const totalRepairs = technicians.reduce((s, t) => s + (t.numberOfFaultsFixed || 0), 0);
  const avgRepairTime =
    technicians.length > 0
      ? technicians.reduce((s, t) => s + (t.averageRepairTime || 0), 0) / technicians.length
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Team Activity</h1>
        <p className="text-gray-600">
          View technician availability and current work.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Technicians</div>
                <div className="text-3xl font-bold mt-1">{technicians.length}</div>
              </div>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Faults Fixed</div>
                <div className="text-3xl font-bold mt-1">{totalRepairs}</div>
              </div>
              <Wrench className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Avg Repair Time</div>
                <div className="text-3xl font-bold mt-1">{avgRepairTime.toFixed(1)}h</div>
              </div>
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Technicians</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {technicians.length === 0 && (
            <p className="text-gray-500 text-center py-8">No technicians registered</p>
          )}
          {technicians.map((tech) => {
            const isExpanded = expandedId === tech.id;
            return (
              <div key={tech.id} className="border rounded-lg overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(isExpanded ? null : tech.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {tech.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-lg">{tech.name}</div>
                      <div className="text-sm text-gray-600">{tech.currentActivity || "—"}</div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                <div className="px-4 pb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="font-bold">{tech.available ? "Available" : "Busy"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Current machine</div>
                    <div className="font-bold">{tech.currentMachineName || "—"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Tasks completed</div>
                    <div className="font-bold">{tech.tasksCompleted ?? 0}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Tasks pending</div>
                    <div className="font-bold">{tech.tasksPending ?? 0}</div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Email:</span> {tech.email || "—"}
                    </p>
                    <p>
                      <span className="text-gray-500">Phone:</span> {tech.phoneNumber || "—"}
                    </p>
                    <p>
                      <span className="text-gray-500">Avg repair time:</span>{" "}
                      {(tech.averageRepairTime ?? 0).toFixed(1)}h
                    </p>
                    <p>
                      <span className="text-gray-500">Skills:</span>{" "}
                      {tech.skillSet?.length ? tech.skillSet.join(", ") : "—"}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
