import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { mockBreakdowns, mockMachines } from "../data/mockData";
import { History, AlertTriangle, CheckCircle, Clock, DollarSign } from "lucide-react";
import { Badge } from "./ui/badge";
const BreakdownHistory = () => {
  const breakdownsByMachine = mockMachines.map((machine) => {
    const machineBreakdowns = mockBreakdowns.filter((b) => b.machineId === machine.id).sort((a, b) => b.date.getTime() - a.date.getTime());
    return {
      machine,
      breakdowns: machineBreakdowns,
      totalBreakdowns: machineBreakdowns.length,
      unresolvedCount: machineBreakdowns.filter((b) => !b.resolved).length
    };
  }).filter((item) => item.totalBreakdowns > 0);
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Breakdown History</h1>
        <p className="text-gray-600">
          Complete log of breakdowns and maintenance per machine
        </p>
      </div>

      <div className="grid gap-6">
        {breakdownsByMachine.map(({ machine, breakdowns, totalBreakdowns, unresolvedCount }) => <Card key={machine.id}>
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
                  {unresolvedCount > 0 && <Badge variant="destructive" className="gap-1">
                      {unresolvedCount} Unresolved
                    </Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {breakdowns.map((breakdown) => <div
    key={breakdown.id}
    className="border-l-4 pl-4 py-2 rounded"
    style={{
      borderColor: breakdown.resolved ? "#10b981" : "#ef4444"
    }}
  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {breakdown.resolved ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                          <span className="font-medium">
                            {breakdown.description}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(breakdown.date)}
                        </div>
                      </div>
                      {breakdown.resolved && <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-4 h-4" />
                            {breakdown.repairTime}h
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            €{breakdown.cost.toLocaleString()}
                          </div>
                        </div>}
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>)}
      </div>
    </div>;
};
export {
  BreakdownHistory
};
