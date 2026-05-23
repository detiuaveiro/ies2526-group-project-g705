import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AlertCircle, Wrench, CheckCircle, HelpCircle } from "lucide-react";
import { AssistanceRequestDialog } from "./AssistanceRequestDialog";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api/v1";

export const TechnicianWorkList = () => {
  const { user } = useAuth();

  const [machines, setMachines] = useState([]);
  const [assistanceDialogOpen, setAssistanceDialogOpen] = useState(false);
  const [helpMachine, setHelpMachine] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/machines/assigned/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then(setMachines)
      .catch(() => toast.error("Failed to load machines"));
  }, [user]);

  const handleStartMaintenance = (machine) => {
    fetch(`${API_URL}/maintenances/start?technicianId=${user.id}&machineId=${machine.id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to start maintenance");
        toast.success(`Maintenance started for ${machine.name}`);
        // Update the machine list locally to reflect the change
        setMachines(machines.map(m => m.id === machine.id ? { ...m, status: "MAINTENANCE" } : m));
      })
      .catch((e) => toast.error(e.message));
  };

  const handleRequestHelp = (machine) => {
    setHelpMachine(machine);
    setAssistanceDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-600">Active</Badge>;
      case "MAINTENANCE":
        return <Badge className="bg-yellow-600">Maintenance</Badge>;
      // ASSISTANCE_REQUESTED and ARCHIVED removed from badge options
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Work List</h1>
        <p className="text-gray-600">Machines assigned to you</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Machines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {machines.map((machine) => {
              const isMaintenanceOwner =
                machine.activeMaintenanceTechnicianId != null &&
                Number(machine.activeMaintenanceTechnicianId) === Number(user.id);

              return (
              <div
                key={machine.id}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{machine.name}</h3>
                    <p className="text-sm text-gray-600">{machine.location}</p>

                    <div className="mt-2">{getStatusBadge(machine.status)}</div>

                    <div className="mt-2 text-sm text-gray-700">
                      Importance: {machine.importanceLevel}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {machine.status === "ACTIVE" && (
                      <Button
                        className="bg-blue-600"
                        onClick={() => handleStartMaintenance(machine)}
                      >
                        <Wrench className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                    )}

                    {machine.status === "MAINTENANCE" && isMaintenanceOwner && (
                      <Button
                        variant="outline"
                        className="border-orange-500 text-orange-600"
                        onClick={() => handleRequestHelp(machine)}
                      >
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Request Help
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {helpMachine && (
        <AssistanceRequestDialog
          machine={helpMachine}
          open={assistanceDialogOpen}
          onOpenChange={(open) => {
            setAssistanceDialogOpen(open);
            if (!open) setHelpMachine(null);
          }}
        />
      )}
    </div>
  );
};
