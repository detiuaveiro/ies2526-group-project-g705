import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Trash2, Archive, RefreshCw, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "./ui/dialog";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "./ui/alert-dialog";
import { MachineDetail } from "./MachineDetail";
import { useAuth } from "../contexts/AuthContext";

const API = "http://localhost:8080/api/v1";

export const ManagingView = () => {
  const { user } = useAuth();

  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState(null);

  const [selectedMachineId, setSelectedMachineId] = useState(null);

  const [newMachine, setNewMachine] = useState({
    name: "",
    location: "",
    importanceLevel: 3,
    status: "ACTIVE",
    downtimeSum: 0,
    suspicionFlag: false,
    vibrationSensor: false,
    temperatureSensor: false,
    pressureSensor: false,
  });

  const fetchMachines = () => {
    setLoading(true);
    fetch(`${API}/machines`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then((r) => r.json())
      .then(setMachines)
      .catch(() => toast.error("Failed to load machines"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMachines();
  }, [user]);

  const activeMachines = machines.filter((m) => m.status !== "ARCHIVED");
  const archivedMachines = machines.filter((m) => m.status === "ARCHIVED");

  const handleAddMachine = () => {
    if (!newMachine.name || !newMachine.location) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      name: newMachine.name.trim(),
      location: newMachine.location.trim(),
      importanceLevel: Number(newMachine.importanceLevel),
      status: newMachine.status,
      downtimeSum: Number(newMachine.downtimeSum) || 0,
      suspicionFlag: newMachine.suspicionFlag,
      vibrationSensor: newMachine.vibrationSensor,
      temperatureSensor: newMachine.temperatureSensor,
      pressureSensor: newMachine.pressureSensor,
    };

    fetch(`${API}/machines`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((created) => {
        setMachines((prev) => [...prev, created]);
        toast.success("Machine added successfully");
        setIsAddDialogOpen(false);
        setNewMachine({
          name: "",
          location: "",
          importanceLevel: 3,
          status: "ACTIVE",
          downtimeSum: 0,
          suspicionFlag: false,
          vibrationSensor: false,
          temperatureSensor: false,
          pressureSensor: false,
        });
      })
      .catch(() => toast.error("Failed to add machine"));
  };

  const handleArchiveMachine = (id) => {
    fetch(`${API}/machines/${id}/archive`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        fetchMachines();
        toast.success("Machine archived");
      })
      .catch(() => toast.error("Failed to archive machine"));
  };

  const handleRestoreMachine = (id) => {
    fetch(`${API}/machines/${id}/restore`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        fetchMachines();
        toast.success("Machine restored");
      })
      .catch(() => toast.error("Failed to restore machine"));
  };

  const handleDeleteMachine = () => {
    fetch(`${API}/machines/${machineToDelete}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        fetchMachines();
        toast.success("Machine deleted");
      })
      .catch(() => toast.error("Failed to delete machine"))
      .finally(() => {
        setDeleteDialogOpen(false);
        setMachineToDelete(null);
      });
  };

  if (selectedMachineId) {
    return (
      <MachineDetail
        machineId={selectedMachineId}
        onBack={() => setSelectedMachineId(null)}
      />
    );
  }

  const statusColors = {
    ACTIVE: "bg-green-500 text-white",
    MAINTENANCE: "bg-yellow-500 text-white",
    ASSISTANCE_REQUESTED: "bg-orange-500 text-white",
    ARCHIVED: "bg-gray-500 text-white"
  };

  const statusLabels = {
    ACTIVE: "Active",
    MAINTENANCE: "Maintenance",
    ASSISTANCE_REQUESTED: "Assistance Requested",
    ARCHIVED: "Archived"
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Machine Management</h1>
          <p className="text-gray-600">Add, remove, and manage industrial equipment</p>
        </div>

        {/* ADD MACHINE */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Machine
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Machine</DialogTitle>
              <DialogDescription>Fill in the machine data</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label>Machine Name *</Label>
                <Input
                  value={newMachine.name}
                  onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Location *</Label>
                <Input
                  value={newMachine.location}
                  onChange={(e) => setNewMachine({ ...newMachine, location: e.target.value })}
                />
              </div>

              <div>
                <Label>Importance Level (1 = High, 5 = Low)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={newMachine.importanceLevel}
                  onChange={(e) =>
                    setNewMachine({ ...newMachine, importanceLevel: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <Label>Initial Status</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newMachine.status}
                  onChange={(e) => setNewMachine({ ...newMachine, status: e.target.value })}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="ASSISTANCE_REQUESTED">Assistance Requested</option>
                </select>
              </div>

              <div>
                <Label>Downtime Sum (hours)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={newMachine.downtimeSum}
                  onChange={(e) =>
                    setNewMachine({ ...newMachine, downtimeSum: e.target.value })
                  }
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newMachine.suspicionFlag}
                  onChange={(e) =>
                    setNewMachine({ ...newMachine, suspicionFlag: e.target.checked })
                  }
                />
                <span>Mark as suspicious</span>
              </label>

              {/* SENSORS */}
              <div>
                <Label>Sensors</Label>
                <div className="space-y-2 mt-2">
                  {[
                    { key: "vibrationSensor", label: "Vibration Sensor" },
                    { key: "temperatureSensor", label: "Temperature Sensor" },
                    { key: "pressureSensor", label: "Pressure Sensor" }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMachine[key]}
                        onChange={(e) =>
                          setNewMachine({ ...newMachine, [key]: e.target.checked })
                        }
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMachine}>
                <Plus className="w-4 h-4 mr-2" />
                Add Machine
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ACTIVE MACHINES */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Active Machines
          </CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `${activeMachines.length} machines in operation`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {activeMachines.map((machine) => (
              <div
                key={machine.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedMachineId(machine.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold text-lg">{machine.name}</div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[machine.status]
                      }`}
                    >
                      {statusLabels[machine.status]}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{machine.location}</div>
                  <div className="text-xs text-gray-500 mt-1">ID: {machine.id}</div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArchiveMachine(machine.id);
                  }}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ARCHIVED MACHINES */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="w-5 h-5" />
            Archived Machines
          </CardTitle>
        </CardHeader>

        <CardContent>
          {archivedMachines.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No archived machines
            </div>
          ) : (
            <div className="space-y-3">
              {archivedMachines.map((machine) => (
                <div
                  key={machine.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedMachineId(machine.id)}
                >
                  <div className="flex-1">
                    <div className="font-semibold">{machine.name}</div>
                    <div className="text-sm text-gray-600">{machine.location}</div>
                  </div>

                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestoreMachine(machine.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Restore
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setMachineToDelete(machine.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* DELETE CONFIRMATION */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete machine permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMachine}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
