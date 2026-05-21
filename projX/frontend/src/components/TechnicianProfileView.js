import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { useAuth } from "../contexts/AuthContext";
import { Wrench, CheckCircle, Clock, User as UserIcon, Pencil } from "lucide-react";
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api/v1";
const GENDERS = ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"];

export const TechnicianProfileView = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [logs, setLogs] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    age: "",
    gender: "",
    password: "",
  });

  const loadProfile = () => {
    if (!user?.id || !user?.token) return;
    fetch(`${API_URL}/users/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          age: data.age != null ? String(data.age) : "",
          gender: data.gender || "",
          password: "",
        });
      })
      .catch(() => toast.error("Failed to load profile"));
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id, user?.token]);

  useEffect(() => {
    if (!user?.token) return;
    fetch(`${API_URL}/maintenance/logs/all`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load logs");
        }
        return res.json();
      })
      .then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch(() => {
        setLogs([]);
        toast.error("Failed to load technician logs");
      });
  }, [user]);

  const handleSave = async () => {
    if (!form.name?.trim() || !form.email?.trim()) {
      toast.error("Name and email are required");
      return;
    }

    const age = Number(form.age);
    if (form.age && (age < 18 || age > 99)) {
      toast.error("Age must be between 18 and 99");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: profile?.role || user.role,
      phoneNumber: form.phoneNumber || null,
      age: form.age ? Number(form.age) : null,
      gender: form.gender || null,
    };

    if (form.password?.trim()) {
      payload.password = form.password;
    }

    try {
      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update profile");
      }

      const updated = await res.json();
      setProfile(updated);
      if (updateUser) {
        updateUser({ name: updated.name, email: updated.email });
      }
      toast.success("Profile updated");
      setEditOpen(false);
    } catch (e) {
      toast.error(e.message || "Failed to update profile");
    }
  };

  const effectiveProfile = profile || user;
  if (!effectiveProfile) {
    return <p className="text-gray-600">Loading profile...</p>;
  }

  const allLogs = Array.isArray(logs) ? logs : [];
  const myLogs = allLogs.filter((log) => log.technicianName === user?.name);
  const completedRepairs = myLogs.length;
  const totalHours = myLogs.reduce((sum, log) => sum + (log.hoursSpent || 0), 0);
  const avgRepairTime = completedRepairs ? totalHours / completedRepairs : 0;
  const machinesWorked = new Set(myLogs.map((log) => log.maintenanceId)).size;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-600">Your account details</p>
        </div>
        <Button onClick={() => setEditOpen(true)}>
          <Pencil className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <Card className="border-t-4 border-t-blue-600">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-6">
            <div className="bg-gray-100 p-6 rounded-full">
              <UserIcon className="w-16 h-16 text-gray-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{effectiveProfile.name}</h2>
              <p className="text-blue-600 font-medium">{effectiveProfile.role}</p>
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="font-medium">{effectiveProfile.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Phone</dt>
              <dd className="font-medium">{effectiveProfile.phoneNumber || "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Age</dt>
              <dd className="font-medium">{effectiveProfile.age ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Gender</dt>
              <dd className="font-medium">{effectiveProfile.gender || "—"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Input
                type="email"
                value={form.email}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              />
            </div>
            <div>
              <Label>Age</Label>
              <Input
                type="number"
                min={18}
                max={99}
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            </div>
            <div>
              <Label>Gender</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">—</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>New password (leave blank to keep)</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <h3 className="text-xl font-bold mt-8 mb-4">Your Maintenance Statistics</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Machines Worked On</p>
                <h3 className="text-3xl font-bold mt-2">{machinesWorked}</h3>
              </div>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Wrench className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Repairs</p>
                <h3 className="text-3xl font-bold mt-2">{completedRepairs}</h3>
              </div>
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Repair Time</p>
                <div className="flex items-baseline gap-1 mt-2">
                  <h3 className="text-3xl font-bold">{avgRepairTime.toFixed(1)}</h3>
                  <span className="text-sm text-gray-500">hours</span>
                </div>
              </div>
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
