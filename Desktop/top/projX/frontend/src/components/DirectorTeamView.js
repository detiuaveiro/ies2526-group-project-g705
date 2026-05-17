import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
  DialogTrigger,
} from "./ui/dialog";
import { Users, Wrench, Clock, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api/v1";
const GENDERS = ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"];

export const DirectorTeamView = () => {
  const { user } = useAuth();
  const [technicians, setTechnicians] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTech, setNewTech] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    age: "",
    gender: "",
    skillSet: "",
  });

  const loadTechnicians = () => {
    fetch(`${API_URL}/users/technicians`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setTechnicians(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load technicians"));
  };

  useEffect(() => {
    loadTechnicians();
  }, [user]);

  const totalRepairs = technicians.reduce((s, t) => s + (t.numberOfFaultsFixed || 0), 0);
  const avgRepairTime =
    technicians.length > 0
      ? technicians.reduce((s, t) => s + (t.averageRepairTime || 0), 0) / technicians.length
      : 0;

  const handleAddTechnician = () => {
    if (!newTech.name || !newTech.email || !newTech.password) {
      toast.error("Name, email and password are required");
      return;
    }

    const skills = newTech.skillSet
      ? newTech.skillSet.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

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
        role: "TECHNICIAN",
        phoneNumber: newTech.phoneNumber || null,
        age: newTech.age ? Number(newTech.age) : null,
        gender: newTech.gender || null,
        skillSet: skills,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        toast.success("Technician registered");
        setIsAddOpen(false);
        setNewTech({
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
          age: "",
          gender: "",
          skillSet: "",
        });
        loadTechnicians();
      })
      .catch(() => toast.error("Failed to create technician"));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Team Activity</h1>
          <p className="text-gray-600">Technician status and performance</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              New Technician
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Technician</DialogTitle>
              <DialogDescription>All profile fields for the technician entity</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name *</Label>
                <Input value={newTech.name} onChange={(e) => setNewTech({ ...newTech, name: e.target.value })} />
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={newTech.email} onChange={(e) => setNewTech({ ...newTech, email: e.target.value })} />
              </div>
              <div>
                <Label>Password *</Label>
                <Input type="password" value={newTech.password} onChange={(e) => setNewTech({ ...newTech, password: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={newTech.phoneNumber} onChange={(e) => setNewTech({ ...newTech, phoneNumber: e.target.value })} />
              </div>
              <div>
                <Label>Age</Label>
                <Input type="number" min={18} value={newTech.age} onChange={(e) => setNewTech({ ...newTech, age: e.target.value })} />
              </div>
              <div>
                <Label>Gender</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newTech.gender}
                  onChange={(e) => setNewTech({ ...newTech, gender: e.target.value })}
                >
                  <option value="">—</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>{g.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Skills (comma-separated)</Label>
                <Input
                  placeholder="Hydraulics, Electrical, PLC"
                  value={newTech.skillSet}
                  onChange={(e) => setNewTech({ ...newTech, skillSet: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddTechnician}>Add Technician</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Technicians</div>
                <div className="text-3xl font-bold mt-1">{technicians.length}</div>
              </div>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Faults Fixed</div>
                <div className="text-3xl font-bold mt-1">{totalRepairs}</div>
              </div>
              <Wrench className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Avg Repair Time</div>
                <div className="text-3xl font-bold mt-1">{avgRepairTime.toFixed(1)}h</div>
              </div>
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Technicians</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {technicians.length === 0 && (
            <p className="text-gray-500 text-center py-8">No technicians registered</p>
          )}
          {technicians.map((tech) => {
            const isExpanded = expandedId === tech.id;
            return (
              <div key={tech.id} className="border rounded-lg overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(isExpanded ? null : tech.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {tech.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-lg">{tech.name}</div>
                      <div className="text-sm text-gray-600">{tech.currentActivity || "—"}</div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>

                <div className="px-4 pb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="font-bold">{tech.available ? "Available" : "Busy"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Current machine</div>
                    <div className="font-bold">{tech.currentMachineName || "—"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Tasks completed</div>
                    <div className="font-bold">{tech.tasksCompleted ?? 0}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Tasks pending</div>
                    <div className="font-bold">{tech.tasksPending ?? 0}</div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t space-y-2 text-sm">
                    <p><span className="text-gray-500">Email:</span> {tech.email || "—"}</p>
                    <p><span className="text-gray-500">Phone:</span> {tech.phoneNumber || "—"}</p>
                    <p><span className="text-gray-500">Avg repair time:</span> {(tech.averageRepairTime ?? 0).toFixed(1)}h</p>
                    <p>
                      <span className="text-gray-500">Skills:</span>{" "}
                      {tech.skillSet?.length ? tech.skillSet.join(", ") : "—"}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
