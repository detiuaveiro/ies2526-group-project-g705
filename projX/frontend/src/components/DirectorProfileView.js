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
import { User as UserIcon, Pencil } from "lucide-react";
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api/v1";

const GENDERS = ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"];

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-PT");
};

export const DirectorProfileView = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
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
    if (!user?.id) return;
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
  }, [user?.id]);

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
      active: profile?.active ?? true,
      online: profile?.online ?? false,
      privileged: profile?.privileged ?? false,
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

  if (!profile) {
    return <p className="text-gray-600">Loading profile...</p>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
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

      <Card className="border-t-4 border-t-purple-600">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-6">
            <div className="bg-purple-100 p-6 rounded-full">
              <UserIcon className="w-16 h-16 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-purple-600 font-medium">{profile.role}</p>
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="font-medium">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Phone</dt>
              <dd className="font-medium">{profile.phoneNumber || "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Age</dt>
              <dd className="font-medium">{profile.age ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Gender</dt>
              <dd className="font-medium">{profile.gender || "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Status</dt>
              <dd className="font-medium">{profile.active ? "Active" : "Inactive"}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Member since</dt>
              <dd className="font-medium">{formatDate(profile.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Last login</dt>
              <dd className="font-medium">{formatDate(profile.lastLogin)}</dd>
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
    </div>
  );
};
