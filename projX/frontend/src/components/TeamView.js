import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Users,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

const API_URL = "http://localhost:8080/api/v1";

const emptyTechnician = {
  name: "",
  email: "",
  password: "",
  phoneNumber: "",
  age: "",
  gender: "",
  skillSet: "",
};

export const TeamView = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [technicians, setTechnicians] = useState([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [techToDelete, setTechToDelete] = useState(null);

  const [newTech, setNewTech] = useState(emptyTechnician);

  // LOAD TECHNICIANS FROM BACKEND
  const loadTechnicians = async () => {
    try {
      const activeRes = await fetch(`${API_URL}/users/technicians`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!activeRes.ok) {
        throw new Error("Failed to load technicians");
      }

      const activeData = await activeRes.json();

      setTechnicians(activeData);
    } catch (error) {
      toast.error("Failed to load technicians");
    }
  };

  useEffect(() => {
    loadTechnicians();
  }, [user]);

  const handleAddTechnician = () => {
    if (!isAdmin) {
      toast.error("Only administrators can create technicians");
      return;
    }

    if (!newTech.name || !newTech.email || !newTech.password) {
      toast.error("Name, Email and Password are required");
      return;
    }

    const skillSet = newTech.skillSet
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newTech.name,
        email: newTech.email,
        password: newTech.password,
        phoneNumber: newTech.phoneNumber || null,
        age: newTech.age ? Number(newTech.age) : null,
        gender: newTech.gender || null,
        skillSet,
        role: "TECHNICIAN"
      })
    })
      .then((res) => {
        if (res.status === 403) throw new Error("Session expired. Please log out and log in again.");
        if (!res.ok) throw new Error("Failed to create technician");
        return res.json();
      })
      .then((created) => {
        loadTechnicians();
        toast.success(`${created.name} added to the team`);
        setIsAddDialogOpen(false);
        setNewTech(emptyTechnician);
      })
      .catch((err) => toast.error(err.message || "Failed to create technician"));
  };

  // DELETE TECHNICIAN
  const handleDelete = () => {
    if (!isAdmin) {
      toast.error("Only administrators can delete technicians");
      return;
    }

    fetch(`${API_URL}/users/${techToDelete}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        if (res.status === 403) throw new Error("Session expired. Please log out and log in again.");
        if (!res.ok) throw new Error("Failed to delete technician");
      })
      .then(() => {
        loadTechnicians();
        toast.success("Technician permanently deleted");
      })
      .catch((err) => toast.error(err.message || "Failed to delete technician"))
      .finally(() => {
        setDeleteDialogOpen(false);
        setTechToDelete(null);
      });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Team Management</h1>
          <p className="text-gray-600">Manage technicians</p>
        </div>

        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add Technician
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Register New Technician</DialogTitle>
                <DialogDescription>
                  Fill in the technician's profile details.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={newTech.name}
                    onChange={(e) =>
                      setNewTech((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={newTech.email}
                    onChange={(e) =>
                      setNewTech((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    value={newTech.password}
                    onChange={(e) =>
                      setNewTech((p) => ({ ...p, password: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={newTech.phoneNumber}
                    onChange={(e) =>
                      setNewTech((p) => ({ ...p, phoneNumber: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Age</Label>
                  <Input
                    type="number"
                    min="0"
                    value={newTech.age}
                    onChange={(e) =>
                      setNewTech((p) => ({ ...p, age: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Gender</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newTech.gender}
                    onChange={(e) =>
                      setNewTech((p) => ({ ...p, gender: e.target.value }))
                    }
                  >
                    <option value="">Not specified</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <Label>Skills</Label>
                  <Input
                    placeholder="Electrical, Mechanical, Diagnostics"
                    value={newTech.skillSet}
                    onChange={(e) =>
                      setNewTech((p) => ({ ...p, skillSet: e.target.value }))
                    }
                  />
                </div>


              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTechnician}>Add Technician</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* SUMMARY CARD */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Active Technicians</div>
              <div className="text-3xl font-bold mt-1">{technicians.length}</div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ACTIVE TECHNICIANS */}
      <Card>
        <CardHeader>
          <CardTitle>Active Technicians</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="font-semibold text-lg">{tech.name}</div>
                  <div className="text-sm text-gray-600">{tech.email}</div>
                </div>

                {isAdmin && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setTechToDelete(tech.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DELETE CONFIRMATION */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete technician permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
