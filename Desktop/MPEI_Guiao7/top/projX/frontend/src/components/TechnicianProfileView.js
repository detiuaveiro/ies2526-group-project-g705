import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { useAuth } from "../contexts/AuthContext";
import { Wrench, CheckCircle, Clock, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api/v1";

export const TechnicianProfileView = () => {
  const { user } = useAuth();

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/maintenance/logs/all`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch(() => toast.error("Failed to load technician logs"));
  }, [user]);

  const myLogs = logs.filter((log) => log.technicianName === user.name);

  const completedRepairs = myLogs.length;

  const totalHours = myLogs.reduce((sum, log) => sum + (log.hoursSpent || 0), 0);
  const avgRepairTime = completedRepairs ? totalHours / completedRepairs : 0;

  const totalCost = myLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

  const machinesWorked = new Set(
    myLogs.map((log) => log.maintenanceId)
  ).size;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Technician Profile</h1>
        <p className="text-gray-600">
          Your account details and real maintenance performance
        </p>
      </div>

      {/* PROFILE CARD */}
      <Card className="border-t-4 border-t-blue-600">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="bg-gray-100 p-6 rounded-full">
              <UserIcon className="w-16 h-16 text-gray-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <div className="text-blue-600 font-medium">{user?.role}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STATS */}
      <h3 className="text-xl font-bold mt-8 mb-4">Your Maintenance Statistics</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* MACHINES WORKED */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Machines Worked On
                </p>
                <h3 className="text-3xl font-bold mt-2">{machinesWorked}</h3>
              </div>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Wrench className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* COMPLETED REPAIRS */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completed Repairs
                </p>
                <h3 className="text-3xl font-bold mt-2">{completedRepairs}</h3>
              </div>
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AVG REPAIR TIME */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg. Repair Time
                </p>
                <div className="flex items-baseline gap-1 mt-2">
                  <h3 className="text-3xl font-bold">
                    {avgRepairTime.toFixed(1)}
                  </h3>
                  <span className="text-sm text-gray-500">hours</span>
                </div>
              </div>
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
