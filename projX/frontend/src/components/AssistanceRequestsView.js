import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { mockAssistanceRequests, mockMachines, mockUsers } from "../data/mockData";
import { HelpCircle, Clock, MapPin, AlertCircle, UserPlus } from "lucide-react";
import { AssistanceRequestDialog } from "./AssistanceRequestDialog";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
const AssistanceRequestsView = () => {
  const { user } = useAuth();
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignments, setAssignments] = useState({});
  const [requests, setRequests] = useState(mockAssistanceRequests);
  const technicians = mockUsers.filter((u) => u.role === "Maintenance Technician");
  const filteredRequests = requests.filter((req) => {
    if (user?.role === "Maintenance Director" || user?.role === "Administrator") {
      return true;
    }
    if (user?.role === "Maintenance Technician") {
      return req.assignedTechnicians && req.assignedTechnicians.includes(user.id);
    }
    return false;
  });
  const handleCreateRequest = () => {
    const criticalMachine = mockMachines.find((m) => m.status === "critical" || m.status === "breakdown");
    if (criticalMachine) {
      setSelectedMachine(criticalMachine);
      setDialogOpen(true);
    }
  };
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "pending_admin":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "in-progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      default:
        return status;
    }
  };
  const handleAssignRequest = (requestId) => {
    const request = requests.find((r) => r.id === requestId);
    const technicianIds = assignments[requestId] || request?.assignedTechnicians || [];
    if (technicianIds.length === 0) {
      toast.error("Please select at least one technician");
      return;
    }
    const assignedNames = technicians.filter((t) => technicianIds.includes(t.id)).map((t) => t.name).join(", ");
    toast.success(`Request accepted and assigned to ${assignedNames}`);
    const updatedRequests = requests.map(
      (r) => r.id === requestId ? { ...r, status: "in-progress", assignedTechnicians: technicianIds } : r
    );
    setRequests(updatedRequests);
    const mockReq = mockAssistanceRequests.find((r) => r.id === requestId);
    if (mockReq) {
      mockReq.status = "in-progress";
      mockReq.assignedTechnicians = technicianIds;
    }
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Assistance Requests</h1>
          <p className="text-gray-600">
            {user?.role === "Maintenance Director" ? "Review requests and assign them to the appropriate technicians" : "Manage and resolve assistance requests for problematic machines"}
          </p>
        </div>
        {user?.role !== "Maintenance Director" && user?.role !== "Administrator" && <Button onClick={handleCreateRequest} size="lg">
            <HelpCircle className="w-5 h-5 mr-2" />
            New Request
          </Button>}
      </div>

      <div className="grid gap-4">
        {filteredRequests.length === 0 ? <Card>
            <CardContent className="py-12 text-center">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No assistance requests found</p>
            </CardContent>
          </Card> : filteredRequests.map((request) => {
    const validTechnicians = technicians.filter((t) => t.name !== request.requestedBy);
    const requestAssignments = assignments[request.id] || request.assignedTechnicians || [];
    return <Card key={request.id} className={`border-l-4 ${request.status === "pending" ? "border-l-yellow-500" : "border-l-blue-500"}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className={`w-5 h-5 ${request.status === "pending" ? "text-yellow-600" : "text-blue-600"}`} />
                      <h3 className="font-semibold text-lg">{request.machineName}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusLabel(request.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {request.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {formatDate(request.timestamp)}
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-3">
                      <p className="text-sm font-medium text-orange-900 mb-1">
                        Reason:
                      </p>
                      <p className="text-sm text-orange-800">
                        {request.reason}
                      </p>
                    </div>

                    <div className="text-sm text-gray-600">
                      Requested by: <span className="font-medium">{request.requestedBy}</span>
                    </div>
                    {request.assignedTechnicians && request.assignedTechnicians.length > 0 && <div className="text-sm text-gray-600 mt-1">
                        Assigned to: <span className="font-medium">
                          {mockUsers.filter((u) => request.assignedTechnicians?.includes(u.id)).map((u) => u.name).join(", ")}
                        </span>
                      </div>}
                  </div>

                  <div className="flex flex-col gap-2 min-w-[200px]">
                    {user?.role === "Maintenance Director" && <>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full text-left font-normal bg-white justify-between">
                              {(() => {
      if (requestAssignments.length === 0) return <span className="text-gray-500">Select technicians</span>;
      if (requestAssignments.length === validTechnicians.length) return "All Eligible Technicians";
      if (requestAssignments.length === 1) return validTechnicians.find((t) => t.id === requestAssignments[0])?.name || "1 selected";
      return `${requestAssignments.length} selected`;
    })()}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuCheckboxItem
      checked={validTechnicians.length > 0 && validTechnicians.every((t) => requestAssignments.includes(t.id))}
      onCheckedChange={(checked) => {
        if (checked) {
          setAssignments({ ...assignments, [request.id]: validTechnicians.map((t) => t.id) });
        } else {
          setAssignments({ ...assignments, [request.id]: [] });
        }
      }}
    >
                              All Eligible
                            </DropdownMenuCheckboxItem>
                            <div className="h-px bg-border my-1" />
                            {validTechnicians.map((tech) => <DropdownMenuCheckboxItem
      key={tech.id}
      checked={requestAssignments.includes(tech.id)}
      onCheckedChange={(checked) => {
        const next = checked ? [...requestAssignments, tech.id] : requestAssignments.filter((id) => id !== tech.id);
        setAssignments({ ...assignments, [request.id]: next });
      }}
    >
                                {tech.name}
                              </DropdownMenuCheckboxItem>)}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
      variant="default"
      onClick={() => handleAssignRequest(request.id)}
      className="w-full"
    >
                          <UserPlus className="w-4 h-4 mr-2" />
                          {request.assignedTechnicians && request.assignedTechnicians.length > 0 ? "Update Assignee(s)" : "Assign Technician(s)"}
                        </Button>
                      </>}
                    {(user?.role === "Maintenance Director" || user?.role === "Administrator") && <div className="w-full text-right text-sm text-gray-500 italic mt-2">
                          Managed by Director
                        </div>}
                  </div>
                </div>
              </CardContent>
            </Card>;
  })}
      </div>

      {user?.role !== "Maintenance Director" && user?.role !== "Administrator" && <Card>
          <CardHeader>
            <CardTitle>Machines with Alerts</CardTitle>
            <CardDescription>
              Machines that may require assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {mockMachines.filter((m) => m.status === "critical" || m.status === "breakdown" || m.status === "warning").map((machine) => <div
    key={machine.id}
    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
  >
                    <div>
                      <div className="font-medium">{machine.name}</div>
                      <div className="text-sm text-gray-600">{machine.location}</div>
                    </div>
                    <Button
    variant="outline"
    size="sm"
    onClick={() => {
      setSelectedMachine(machine);
      setDialogOpen(true);
    }}
  >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Request Help
                    </Button>
                  </div>)}
            </div>
          </CardContent>
        </Card>}

      {selectedMachine && <AssistanceRequestDialog
    machine={selectedMachine}
    open={dialogOpen}
    onOpenChange={setDialogOpen}
  />}
    </div>;
};
export {
  AssistanceRequestsView
};
