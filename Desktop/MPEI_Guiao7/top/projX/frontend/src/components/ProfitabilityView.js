import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { DollarSign, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api/v1";

export const ProfitabilityView = () => {
  const { user } = useAuth();

  const [machines, setMachines] = useState([]);
  const [logsByMachine, setLogsByMachine] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/machines`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then(setMachines)
      .catch(() => toast.error("Failed to load machines"));
  }, [user]);

  useEffect(() => {
    machines.forEach((machine) => {
      fetch(`${API_URL}/maintenance/${machine.id}/logs`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((logs) =>
          setLogsByMachine((prev) => ({ ...prev, [machine.id]: logs }))
        )
        .catch(() =>
          toast.error(`Failed to load logs for machine ${machine.name}`)
        );
    });
  }, [machines, user]);

  const allLogs = Object.values(logsByMachine).flat();

  const totalCost = allLogs.reduce((sum, log) => sum + (log.cost || 0), 0);
  const totalTime = allLogs.reduce((sum, log) => sum + (log.hoursSpent || 0), 0);

  const avgCost = allLogs.length ? totalCost / allLogs.length : 0;
  const avgTime = allLogs.length ? totalTime / allLogs.length : 0;

  const machineStats = machines
    .map((machine) => {
      const logs = logsByMachine[machine.id] || [];
      const cost = logs.reduce((s, l) => s + (l.cost || 0), 0);
      const time = logs.reduce((s, l) => s + (l.hoursSpent || 0), 0);

      return {
        machine,
        logs,
        totalCost: cost,
        totalTime: time,
        count: logs.length,
      };
    })
    .filter((m) => m.count > 0)
    .sort((a, b) => b.totalCost - a.totalCost);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profitability Dashboard</h1>
        <p className="text-gray-600">
          Real maintenance cost and time analysis
        </p>
      </div>

      {/* GLOBAL STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-red-600" />
              <div className="text-2xl font-bold">€{totalCost.toFixed(0)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div className="text-2xl font-bold">{totalTime.toFixed(1)}h</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Average Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div className="text-2xl font-bold">€{avgCost.toFixed(0)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Average Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <div className="text-2xl font-bold">{avgTime.toFixed(1)}h</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MACHINE DETAILS */}
      <div className="grid gap-6">
        {machineStats.map(({ machine, logs, totalCost, totalTime, count }) => (
          <Card key={machine.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {machine.name}
                  </CardTitle>
                  <CardDescription>{machine.location}</CardDescription>
                </div>

                <div className="flex gap-2">
                  <Badge variant="outline" className="gap-1">
                    <DollarSign className="w-3 h-3" />€{totalCost.toFixed(0)}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Clock className="w-3 h-3" />{totalTime.toFixed(1)}h
                  </Badge>
                  <Badge variant="secondary">{count} Logs</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 text-sm text-gray-600">
                        Date
                      </th>
                      <th className="text-left py-2 px-4 text-sm text-gray-600">
                        Description
                      </th>
                      <th className="text-right py-2 px-4 text-sm text-gray-600">
                        Hours
                      </th>
                      <th className="text-right py-2 px-4 text-sm text-gray-600">
                        Cost
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          {formatDate(log.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-sm">{log.description}</td>
                        <td className="py-3 px-4 text-sm text-right">
                          {log.hoursSpent}h
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-red-600 font-bold">
                          €{log.cost.toFixed(0)}
                        </td>
                      </tr>
                    ))}

                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={2} className="py-3 px-4 text-sm">
                        Total
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        {totalTime.toFixed(1)}h
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-red-600">
                        €{totalCost.toFixed(0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
