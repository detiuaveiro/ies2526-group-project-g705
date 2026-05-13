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
  Archive,
  RefreshCw,
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

export const TeamView = () => {
  const { user } = useAuth();

  const [technicians, setTechnicians] = useState([]);
  const [archivedTechnicians, setArchivedTechnicians] = useState([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [techToDelete, setTechToDelete] = useState(null);

  const [newTech, setNewTech] = useState({
    name: "",
    email: "",
  });

  // LOAD TECHNICIANS FROM BACKEND
  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        const [activeRes, archivedRes] = await Promise.all([
          fetch(`${API_URL}/users/technicians`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          fetch(`${API_URL}/users/technicians/archived`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        if (!activeRes.ok || !archivedRes.ok) {
          throw new Error("Failed to load technicians");
        }

        const [activeData, archivedData] = await Promise.all([
          activeRes.json(),
          archivedRes.json(),
        ]);

        setTechnicians(activeData);
        setArchivedTechnicians(archivedData);
      } catch (error) {
        toast.error("Failed to load technicians");
      }
    };

    loadTechnicians();
  }, [user]);

  // ADD TECHNICIAN
  const handleAddTechnician = () => {
    if (!newTech.name || !newTech.email) {
      toast.error("Name and Email are required");
      return;
    }

    fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newTech.name,
        email: newTech.email,
        phoneNumber: newTech.phone,
        gender: newTech.gender,
        age: Number(newTech.age),
        role: "TECHNICIAN",
        password: "1234"
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((created) => {
        setTechnicians((prev) => [...prev, created]);
        toast.success(`${created.name} added to the team`);
        setIsAddDialogOpen(false);
        setNewTech({ name: "", email: "" });
      })
      .catch(() => toast.error("Failed to create technician"));
  };

  // ARCHIVE TECHNICIAN
  const handleArchive = (id) => {
    fetch(`${API_URL}/users/${id}/archive`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((updated) => {
        const tech = technicians.find((t) => t.id === id);
        setTechnicians((prev) => prev.filter((t) => t.id !== id));
        setArchivedTechnicians((prev) => [...prev, updated]);
        toast.success(`${tech.name} archived`);
      })
      .catch(() => toast.error("Failed to archive technician"));
  };

  // RESTORE TECHNICIAN
  const handleRestore = (id) => {
    fetch(`${API_URL}/users/${id}/restore`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((updated) => {
        setArchivedTechnicians((prev) => prev.filter((t) => t.id !== id));
        setTechnicians((prev) => [...prev, updated]);
        toast.success(`${updated.name} restored`);
      })
      .catch(() => toast.error("Failed to restore technician"));
  };

  // DELETE TECHNICIAN
  const handleDelete = () => {
    fetch(`${API_URL}/users/${techToDelete}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
      })
      .then(() => {
        setArchivedTechnicians((prev) =>
          prev.filter((t) => t.id !== techToDelete)
        );
        toast.success("Technician permanently deleted");
      })
      .catch(() => toast.error("Failed to delete technician"))
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

        {/* ADD TECHNICIAN */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Technician
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Register New Technician</DialogTitle>
              <DialogDescription>
                Fill in the technician's profile details.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
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
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTechnician}>Add Technician</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleArchive(tech.id)}
                >
                  <Archive className="w-4 h-4 mr-1" /> Archive
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ARCHIVED TECHNICIANS */}
      <Card>
        <CardHeader>
          <CardTitle>Archived Technicians</CardTitle>
        </CardHeader>

        <CardContent>
          {archivedTechnicians.length === 0 ? (
            <p className="text-gray-500">No archived technicians</p>
          ) : (
            <div className="space-y-3">
              {archivedTechnicians.map((tech) => (
                <div
                  key={tech.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                >
                  <div>
                    <div className="font-semibold">{tech.name}</div>
                    <div className="text-sm text-gray-600">{tech.email}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(tech.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" /> Restore
                    </Button>

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
