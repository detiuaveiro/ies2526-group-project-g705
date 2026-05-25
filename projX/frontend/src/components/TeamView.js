import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Users, Plus, Trash2, Pencil, User as UserIcon, Search } from "lucide-react";
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
  const [directors, setDirectors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const emptyUserForm = {
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    age: "",
    gender: "",
    role: "TECHNICIAN",
    skillSet: "",
  };

  const [newUser, setNewUser] = useState(emptyUserForm);
  const [editForm, setEditForm] = useState(emptyUserForm);

  const GENDERS = ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"];
  const ROLE_OPTIONS = ["TECHNICIAN", "DIRECTOR"];

  const loadTeam = async () => {
    if (!user?.token) return;
    try {
      const [techRes, directorRes] = await Promise.all([
        fetch(`${API_URL}/users/technicians`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        fetch(`${API_URL}/users/directors`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
      ]);

      if (!techRes.ok || !directorRes.ok) {
        throw new Error("Failed to load team members");
      }

      const [techData, directorData] = await Promise.all([
        techRes.json(),
        directorRes.json(),
      ]);

      setTechnicians(Array.isArray(techData) ? techData : []);
      setDirectors(Array.isArray(directorData) ? directorData : []);
    } catch (error) {
      toast.error("Failed to load team members");
    }
  };

  useEffect(() => {
    loadTeam();
  }, [user]);

  const parseSkillSet = (value) =>
    value
      ? value.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  const buildUserPayload = (form) => {
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      phoneNumber: form.phoneNumber || null,
      age: form.age ? Number(form.age) : null,
      gender: form.gender || null,
    };

    if (form.password?.trim()) {
      payload.password = form.password;
    }

    if (form.role === "TECHNICIAN") {
      payload.skillSet = parseSkillSet(form.skillSet);
    }

    return payload;
  };

  const getErrorMessage = async (res, fallback) => {
    try {
      const data = await res.json();
      return data?.error || data?.message || fallback;
    } catch (err) {
      try {
        const text = await res.text();
        return text || fallback;
      } catch (errText) {
        return fallback;
      }
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Name, Email and Password are required");
      return;
    }

    if (newUser.role === "DIRECTOR" && directors.length > 0) {
      toast.error("Only one director can exist at a time");
      return;
    }

    const payload = buildUserPayload(newUser);

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const message = await getErrorMessage(res, "Failed to add team member");
        throw new Error(message);
      }

      const created = await res.json();
      toast.success(`${created.name} added to the team`);
      setIsAddDialogOpen(false);
      setNewUser(emptyUserForm);
      loadTeam();
    } catch (error) {
      toast.error(error.message || "Failed to add team member");
    }
  };

  const openEditDialog = async (member, roleOverride) => {
    const resolvedRole = member.role || roleOverride || "TECHNICIAN";
    const baseForm = {
      ...emptyUserForm,
      name: member.name || "",
      email: member.email || "",
      phoneNumber: member.phoneNumber || "",
      age: member.age != null ? String(member.age) : "",
      gender: member.gender || "",
      role: resolvedRole,
      skillSet: Array.isArray(member.skillSet) ? member.skillSet.join(", ") : "",
      password: "",
    };

    setEditingUser({ ...member, role: resolvedRole });
    setEditForm(baseForm);
    setIsEditDialogOpen(true);

    try {
      const res = await fetch(`${API_URL}/users/${member.id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to load user details");
      }

      const data = await res.json();

      setEditingUser((prev) => ({
        ...prev,
        ...data,
        role: data.role || resolvedRole,
      }));
      setEditForm({
        ...baseForm,
        name: data.name || baseForm.name,
        email: data.email || baseForm.email,
        phoneNumber: data.phoneNumber || baseForm.phoneNumber,
        age: data.age != null ? String(data.age) : baseForm.age,
        gender: data.gender || baseForm.gender,
        role: data.role || resolvedRole,
        skillSet: Array.isArray(data.skillSet)
          ? data.skillSet.join(", ")
          : baseForm.skillSet,
      });
    } catch {
      setEditForm(baseForm);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser?.id) return;
    if (!editForm.name || !editForm.email) {
      toast.error("Name and Email are required");
      return;
    }

    const hasOtherDirector = directors.some((d) => d.id !== editingUser.id);
    if (editForm.role === "DIRECTOR" && hasOtherDirector) {
      toast.error("Only one director can exist at a time");
      return;
    }

    const payload = buildUserPayload(editForm);

    try {
      const res = await fetch(`${API_URL}/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const message = await getErrorMessage(res, "Failed to update user");
        throw new Error(message);
      }

      await res.json();
      toast.success("User updated");
      setIsEditDialogOpen(false);
      setEditingUser(null);
      setEditForm(emptyUserForm);
      loadTeam();
    } catch (error) {
      toast.error(error.message || "Failed to update user");
    }
  };

  const handleDelete = async () => {
    if (!userToDelete?.id) return;
    try {
      const res = await fetch(`${API_URL}/users/${userToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) {
        const message = await getErrorMessage(res, "Failed to delete user");
        throw new Error(message);
      }

      toast.success("User permanently deleted");
      loadTeam();
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const directorLocked = editingUser
    ? directors.some((d) => d.id !== editingUser.id)
    : directors.length > 0;

  const filteredTechnicians = technicians.filter(
    (tech) =>
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDirectors = directors.filter(
    (director) =>
      director.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      director.email.toLowerCase().includes(searchTerm.toLowerCase())
  );  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Team Management</h1>
          <p className="text-gray-600">Manage technicians and directors</p>
        </div>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

          <Input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Register New Team Member</DialogTitle>
              <DialogDescription>
                Fill in the team member profile details.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={newUser.name}
                    onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input
                    value={newUser.phoneNumber}
                    onChange={(e) =>
                      setNewUser((p) => ({ ...p, phoneNumber: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Age</Label>
                  <Input
                    type="number"
                    min={18}
                    value={newUser.age}
                    onChange={(e) => setNewUser((p) => ({ ...p, age: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Gender</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newUser.gender}
                    onChange={(e) => setNewUser((p) => ({ ...p, gender: e.target.value }))}
                  >
                    <option value="">-</option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Role *</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newUser.role}
                    onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))}
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option
                        key={role}
                        value={role}
                        disabled={role === "DIRECTOR" && directors.length > 0}
                      >
                        {role}
                      </option>
                    ))}
                  </select>
                  {directors.length > 0 && newUser.role === "DIRECTOR" && (
                    <p className="text-xs text-red-500 mt-1">
                      A director already exists. Delete or edit the current director to change it.
                    </p>
                  )}
                </div>
              </div>

              {newUser.role === "TECHNICIAN" && (
                <div>
                  <Label>Skills (comma-separated)</Label>
                  <Input
                    placeholder="Hydraulics, Electrical"
                    value={newUser.skillSet}
                    onChange={(e) => setNewUser((p) => ({ ...p, skillSet: e.target.value }))}
                  />
                </div>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Technicians</div>
                <div className="text-3xl font-bold mt-1">{technicians.length}</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Directors</div>
                <div className="text-3xl font-bold mt-1">{directors.length}</div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <UserIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Directors</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDirectors.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No director registered</p>
          ) : (
            <div className="space-y-3">
              {filteredDirectors.map((director) => (
                <div
                  key={director.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="font-semibold text-lg">{director.name}</div>
                    <div className="text-sm text-gray-600">{director.email}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(director, "DIRECTOR")}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setUserToDelete(director);
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

      <Card>
        <CardHeader>
          <CardTitle>Technicians</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTechnicians.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No technicians registered</p>
          ) : (
            <div className="space-y-3">
              {filteredTechnicians.map((tech) => (
                <div
                  key={tech.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="font-semibold text-lg">{tech.name}</div>
                    <div className="text-sm text-gray-600">{tech.email}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(tech, "TECHNICIAN")}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setUserToDelete({ ...tech, role: "TECHNICIAN" });
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>Update profile details.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name *</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>

              <div>
                <Label>New password (optional)</Label>
                <Input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm((p) => ({ ...p, password: e.target.value }))}
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={editForm.phoneNumber}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, phoneNumber: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label>Age</Label>
                <Input
                  type="number"
                  min={18}
                  value={editForm.age}
                  onChange={(e) => setEditForm((p) => ({ ...p, age: e.target.value }))}
                />
              </div>

              <div>
                <Label>Gender</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editForm.gender}
                  onChange={(e) => setEditForm((p) => ({ ...p, gender: e.target.value }))}
                >
                  <option value="">-</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Role *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editForm.role}
                  onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option
                      key={role}
                      value={role}
                      disabled={role === "DIRECTOR" && directorLocked}
                    >
                      {role}
                    </option>
                  ))}
                </select>
                {directorLocked && editForm.role === "DIRECTOR" && (
                  <p className="text-xs text-red-500 mt-1">
                    A director already exists. Delete or edit the current director to change it.
                  </p>
                )}
              </div>
            </div>

            {editForm.role === "TECHNICIAN" && (
              <div>
                <Label>Skills (comma-separated)</Label>
                <Input
                  placeholder="Hydraulics, Electrical"
                  value={editForm.skillSet}
                  onChange={(e) => setEditForm((p) => ({ ...p, skillSet: e.target.value }))}
                />
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete team member permanently?</AlertDialogTitle>
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
