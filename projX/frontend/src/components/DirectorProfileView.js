import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { useAuth } from "../contexts/AuthContext";
import { Users, Target, Activity, CheckCircle, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api/v1";

export const DirectorProfileView = () => {
  const { user } = useAuth();

  const [technicians, setTechnicians] = useState([]);
  const [machines, setMachines] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/users/technicians`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then(setTechnicians)
      .catch(() => toast.error("Failed to load technicians"));
  }, [user]);

  useEffect(() => {
    fetch(`${API_URL}/machines`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then(setMachines)
      .catch(() => toast.error("Failed to load machines"));
  }, [user]);

  useEffect(() => {
    // initialize form fields when user is available
    if (user) {
      setFormName(user.name || "");
      setFormEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!formName || !formEmail) {
      toast.error("Name and email are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: formName, email: formEmail }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Failed to update user", err);
        toast.error("Failed to update profile");
        setSaving(false);
        return;
      }

      const updated = await res.json();

      // Update localStorage entry used by AuthContext, then reload so app reflects new values
      try {
        const stored = JSON.parse(localStorage.getItem("smartSensesUser") || "null");
        if (stored && stored.id === updated.id) {
          const token = stored.token;
          const newStored = { ...stored, name: updated.name, email: updated.email };
          localStorage.setItem("smartSensesUser", JSON.stringify(newStored));
          if (token) localStorage.setItem("token", token);
        }
      } catch (e) {
        // ignore storage errors
      }

      toast.success("Profile updated");
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const totalMachines = Array.isArray(machines) ? machines.length : 0;
  const operational = Array.isArray(machines) ? machines.filter((m) => m.status === "ACTIVE").length : 0;
  const actionRequired = Array.isArray(machines) ? machines.filter(
    (m) => m.status === "MAINTENANCE" || m.status === "ASSISTANCE_REQUESTED"
  ).length : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Director Profile</h1>
        <p className="text-gray-600">View your account details and factory metrics</p>
      </div>

      {/* ADMIN: simplified profile + edit */}
      {user?.role === "ADMIN" && (
        <div>
          <Card className="border-t-4 border-t-purple-600">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="bg-purple-100 p-6 rounded-full">
                    <UserIcon className="w-16 h-16 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    <div className="text-purple-600 font-medium">{user?.role}</div>
                  </div>
                </div>

                <div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave()}
                        disabled={saving}
                        className="px-4 py-2 bg-green-600 text-white rounded-md"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => { setIsEditing(false); setFormName(user.name); setFormEmail(user.email); }}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Full name</label>
                    <input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <input
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6">
            <p className="text-sm text-gray-600">This view shows only your profile details and an edit option.</p>
          </div>
        </div>
      )}

      {/* METRICS */}
      <h3 className="text-xl font-bold mt-8 mb-4">Operations Overview</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Technicians */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Technicians</p>
                <h3 className="text-3xl font-bold mt-2">{technicians.length}</h3>
              </div>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Machines */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Machines</p>
                <h3 className="text-3xl font-bold mt-2">{totalMachines}</h3>
              </div>
              <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                <Target className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operational */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Operational</p>
                <h3 className="text-3xl font-bold mt-2 text-green-600">{operational}</h3>
              </div>
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Required */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Action Required</p>
                <h3 className="text-3xl font-bold mt-2 text-red-600">{actionRequired}</h3>
              </div>
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
