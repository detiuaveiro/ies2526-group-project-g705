import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { mockUsers, mockBreakdowns } from "../data/mockData";
import { BarChart2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
const TaskManagement = ({ machines, onAssignTechnician, onMachineClick }) => {
  const [assignments, setAssignments] = useState({});
  const technicians = mockUsers.filter((u) => u.role === "Maintenance Technician");
  const handleAssignTechnician = (machine) => {
    const technicianIds = assignments[machine.id] || machine.assignedTechnicians || [];
    if (technicianIds.length === 0) {
      toast.error("Please select at least one technician");
      return;
    }
    onAssignTechnician(machine.id, technicianIds);
    const names = technicians.filter((t) => technicianIds.includes(t.id)).map((t) => t.name).join(", ");
    toast.success("Machine assigned successfully", {
      description: `${machine.name} has been assigned to ${names}`
    });
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "breakdown":
        return "bg-red-100 text-red-800 border-red-300";
      case "critical":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case "breakdown":
        return "Breakdown";
      case "critical":
        return "Critical";
      case "warning":
        return "Warning";
      case "operational":
        return "Operational";
      default:
        return status;
    }
  };
  const sortedMachines = [...machines].sort((a, b) => {
    const priorityValues = { "breakdown": 1, "critical": 2, "warning": 3, "operational": 4 };
    return priorityValues[a.status] - priorityValues[b.status];
  });
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Machine Assignment</h1>
        <p className="text-gray-600">
          Assign technicians to machines requiring attention.
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Needs Assignment</CardTitle>
            <CardDescription>Assign technicians to machines.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedMachines.map((machine) => {
    let statusColor = "bg-green-50 border border-green-200";
    if (machine.status === "breakdown") {
      statusColor = "bg-red-50 border border-red-200";
    } else if (machine.status === "critical") {
      statusColor = "bg-orange-50 border border-orange-200";
    } else if (machine.status === "warning") {
      statusColor = "bg-yellow-50 border border-yellow-200";
    }
    const unresolvedBreakdown = mockBreakdowns.find((b) => b.machineId === machine.id && !b.resolved);
    return <Card key={machine.id} className={`border-l-4 ${statusColor} shadow-sm`}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{machine.name}</h3>
                            <Badge className={getStatusColor(machine.status)}>
                              {getStatusLabel(machine.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {machine.location}
                          </p>
                          {unresolvedBreakdown && <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                              <p className="text-sm font-medium text-red-900">
                                {unresolvedBreakdown.description}
                              </p>
                            </div>}
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Vibration:</span>
                              <span className={`ml-2 font-medium ${machine.vibration > 80 ? "text-red-600" : machine.vibration > 60 ? "text-yellow-600" : "text-green-600"}`}>
                                {machine.vibration} Hz
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Pressure:</span>
                              <span className={`ml-2 font-medium ${machine.pressure > 110 ? "text-red-600" : machine.pressure > 90 ? "text-yellow-600" : "text-green-600"}`}>
                                {machine.pressure} bar
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Temperature:</span>
                              <span className={`ml-2 font-medium ${machine.temperature > 90 ? "text-red-600" : machine.temperature > 70 ? "text-yellow-600" : "text-green-600"}`}>
                                {machine.temperature}°C
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 min-w-[250px]">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full text-left font-normal bg-white justify-between">
                                {(() => {
      const current = assignments[machine.id] || machine.assignedTechnicians || [];
      if (current.length === 0) return <span className="text-gray-500">Select technicians</span>;
      if (current.length === technicians.length) return "All Technicians";
      if (current.length === 1) return technicians.find((t) => t.id === current[0])?.name || "1 selected";
      return `${current.length} selected`;
    })()}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                              <DropdownMenuCheckboxItem
      checked={technicians.every((t) => (assignments[machine.id] || machine.assignedTechnicians || []).includes(t.id))}
      onCheckedChange={(checked) => {
        if (checked) {
          setAssignments({ ...assignments, [machine.id]: technicians.map((t) => t.id) });
        } else {
          setAssignments({ ...assignments, [machine.id]: [] });
        }
      }}
    >
                                All
                              </DropdownMenuCheckboxItem>
                              <div className="h-px bg-border my-1" />
                              {technicians.map((tech) => <DropdownMenuCheckboxItem
      key={tech.id}
      checked={(assignments[machine.id] || machine.assignedTechnicians || []).includes(tech.id)}
      onCheckedChange={(checked) => {
        const current = assignments[machine.id] || machine.assignedTechnicians || [];
        const next = checked ? [...current, tech.id] : current.filter((id) => id !== tech.id);
        setAssignments({ ...assignments, [machine.id]: next });
      }}
    >
                                  {tech.name}
                                </DropdownMenuCheckboxItem>)}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button
      onClick={() => handleAssignTechnician(machine)}
      className="w-full"
    >
                            {machine.assignedTechnicians && machine.assignedTechnicians.length > 0 ? "Change Assignee(s)" : "Assign Machine"}
                          </Button>
                          <Button
      variant="outline"
      onClick={() => onMachineClick(machine)}
      className="w-full flex items-center justify-center gap-2"
    >
                            <BarChart2 className="w-4 h-4" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>;
  })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export {
  TaskManagement
};
