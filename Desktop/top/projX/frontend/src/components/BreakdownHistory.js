import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { History, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";

const API_URL = "http://localhost:8080/api/v1";

export const BreakdownHistory = () => {
  const { user } = useAuth();

  const [machines, setMachines] = useState([]);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/machines`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then(setMachines)
      .catch(() => toast.error("Failed to load machines"));
  }, [user]);

  useEffect(() => {
    fetch(`${API_URL}/problems`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then(setProblems)
      .catch(() => toast.error("Failed to load problems"));
  }, [user]);

  const breakdownsByMachine = machines
    .map((machine) => {
      const machineProblems = problems
        .filter((p) => p.machineId === machine.id)
        .sort(
          (a, b) =>
            new Date(b.startProblemDate).getTime() -
            new Date(a.startProblemDate).getTime()
        );

      return {
        machine,
        breakdowns: machineProblems,
        totalBreakdowns: machineProblems.length,
        unresolvedCount: machineProblems.filter((p) => !p.resolved).length,
      };
    })
    .filter((item) => item.totalBreakdowns > 0);

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

  const calcRepairTime = (p) => {
    if (!p.resolved || !p.startProblemDate || !p.solvedProblemDate) return null;

    const start = new Date(p.startProblemDate);
    const end = new Date(p.solvedProblemDate);

    const diffHours = (end - start) / (1000 * 60 * 60);
    return diffHours.toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Breakdown History</h1>
        <p className="text-gray-600">
          Complete log of breakdowns and maintenance per machine
        </p>
      </div>

      {breakdownsByMachine.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Breakdowns Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownsByMachine.map(item => ({
                name: item.machine.name,
                Total: item.totalBreakdowns,
                Unresolved: item.unresolvedCount
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="Total" fill="#3b82f6" name="Total Breakdowns" />
                <Bar dataKey="Unresolved" fill="#ef4444" name="Unresolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {breakdownsByMachine.map(
          ({ machine, breakdowns, totalBreakdowns, unresolvedCount }) => (
            <Card key={machine.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <History className="w-5 h-5" />
                      {machine.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {machine.location}
                    </CardDescription>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant="outline" className="gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {totalBreakdowns} Breakdowns
                    </Badge>

                    {unresolvedCount > 0 && (
                      <Badge variant="destructive" className="gap-1">
                        {unresolvedCount} Unresolved
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {breakdowns.map((p) => {
                    const repairTime = calcRepairTime(p);

                    return (
                      <div
                        key={p.id}
                        className="border-l-4 pl-4 py-2 rounded"
                        style={{
                          borderColor: p.resolved ? "#10b981" : "#ef4444",
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {p.resolved ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                              )}

                              <span className="font-medium">
                                {p.description}
                              </span>
                            </div>

                            <div className="text-sm text-gray-500">
                              {formatDate(p.startProblemDate)}
                            </div>
                          </div>

                          {p.resolved && (
                            <div className="flex gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {repairTime}h
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
};
