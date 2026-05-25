import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Trash2, Settings, Pencil, Search, Eye } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState(null);

  const [selectedMachineId, setSelectedMachineId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const emptyEditMachine = {
    id: null,
    name: "",
    location: "",
    importanceLevel: 3,
    status: "ACTIVE",
    vibrationSensor: false,
    temperatureSensor: false,
    pressureSensor: false,
  };

  const [editMachine, setEditMachine] = useState(emptyEditMachine);

  const [newMachine, setNewMachine] = useState({
    name: "",
    location: "",
    importanceLevel: 3,
    status: "ACTIVE",
    vibrationSensor: false,
    temperatureSensor: false,
    pressureSensor: false,
  });

  const fetchMachines = () => {
    setLoading(true);
    fetch(`${API}/machines`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(async (r) => {
        const data = await r.json().catch(() => null);

        if (!r.ok) {
          throw new Error(data?.message || data?.error || "Failed to load machines");
        }

        return Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];
      })
      .then(setMachines)
      .catch((error) => {
        setMachines([]);
        toast.error(error.message || "Failed to load machines");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMachines();
  }, [user]);

    const visibleMachines = machines.filter(
      (machine) =>
        (machine.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||

        (machine.location || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

      const openEditDialog = (machine) => {
      setEditMachine({
        id: machine.id,
        name: machine.name || "",
        location: machine.location || "",
        importanceLevel: machine.importanceLevel || 3,
        status: machine.status || "ACTIVE",
        vibrationSensor: machine.vibrationSensor || false,
        temperatureSensor: machine.temperatureSensor || false,
        pressureSensor: machine.pressureSensor || false,
      });

      setIsEditDialogOpen(true);
    };
  const handleUpdateMachine = () => {
    if (!editMachine.name || !editMachine.location) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      name: editMachine.name.trim(),
      location: editMachine.location.trim(),
      importanceLevel: Number(editMachine.importanceLevel),
      status: editMachine.status,
      vibrationSensor: editMachine.vibrationSensor,
      temperatureSensor: editMachine.temperatureSensor,
      pressureSensor: editMachine.pressureSensor,
    };

    fetch(`${API}/machines/${editMachine.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error();
        }

        return res.json();
      })
      .then(() => {
        toast.success("Machine updated successfully");
        setIsEditDialogOpen(false);
        setEditMachine(emptyEditMachine);
        fetchMachines();
      })
      .catch(() => {
        toast.error("Failed to update machine");
      });
  };
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
      downtimeSum: 0,
      suspicionFlag: false,
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
          vibrationSensor: false,
          temperatureSensor: false,
          pressureSensor: false,
        });
      })
      .catch(() => toast.error("Failed to add machine"));
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
  };

  const statusLabels = {
    ACTIVE: "Active",
    MAINTENANCE: "Maintenance",
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Machine Management</h1>
          <p className="text-gray-600">
            Add, remove, and manage industrial equipment
          </p>
        </div>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

          <Input
            type="text"
            placeholder="Search machines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
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
                  {/* Assistance Requested removed */}
                </select>
              </div>

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

      {/* MACHINES */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Machines
          </CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `${visibleMachines.length} machines in operation`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {visibleMachines.map((machine) => (
              <div
                key={machine.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
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

                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    className="bg-blue-600/90 hover:bg-blue-600 text-white shadow-sm"
                    onClick={() => setSelectedMachineId(machine.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(machine)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
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
        </CardContent>
      </Card>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Machine</DialogTitle>
            <DialogDescription>
              Update machine information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label>Machine Name *</Label>
              <Input
                value={editMachine.name}
                onChange={(e) =>
                  setEditMachine({ ...editMachine, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Location *</Label>
              <Input
                value={editMachine.location}
                onChange={(e) =>
                  setEditMachine({ ...editMachine, location: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Importance Level</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={editMachine.importanceLevel}
                onChange={(e) =>
                  setEditMachine({
                    ...editMachine,
                    importanceLevel: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label>Status</Label>

              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editMachine.status}
                onChange={(e) =>
                  setEditMachine({
                    ...editMachine,
                    status: e.target.value,
                  })
                }
              >
                <option value="ACTIVE">Active</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <div>
              <Label>Sensors</Label>

              <div className="space-y-2 mt-2">
                {[
                  { key: "vibrationSensor", label: "Vibration Sensor" },
                  { key: "temperatureSensor", label: "Temperature Sensor" },
                  { key: "pressureSensor", label: "Pressure Sensor" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={editMachine[key]}
                      onChange={(e) =>
                        setEditMachine({
                          ...editMachine,
                          [key]: e.target.checked,
                        })
                      }
                    />

                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button onClick={handleUpdateMachine}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
