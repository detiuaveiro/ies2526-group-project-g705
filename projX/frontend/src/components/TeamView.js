import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { mockTechnicianPerformance, mockBreakdowns } from "../data/mockData";
import { Users, Wrench, Clock, Plus, Archive, RefreshCw, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "./ui/dialog";
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
import { toast } from "sonner";
const initialTechnicians = mockTechnicianPerformance.map((tp, i) => ({
  id: tp.technicianId,
  name: tp.name,
  birthdate: "1985-06-15",
  gender: i % 2 === 0 ? "Male" : "Female",
  email: `${tp.name.toLowerCase().replace(" ", ".")}@smartsense.io`,
  phone: `+351 9${Math.floor(1e7 + Math.random() * 9e7)}`,
  skillSet: ["Hydraulics", "Electrical Systems"],
  completedRepairs: tp.completedRepairs,
  avgRepairTime: tp.avgRepairTime,
  assignedMachines: tp.assignedMachines
}));
const TeamView = () => {
  const [technicians, setTechnicians] = useState(initialTechnicians);
  const [archivedTechnicians, setArchivedTechnicians] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [techToDelete, setTechToDelete] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [newTech, setNewTech] = useState({
    name: "",
    birthdate: "",
    gender: "",
    email: "",
    phone: "",
    skillSet: []
  });
  const totalRepairs = technicians.reduce((s, t) => s + t.completedRepairs, 0);
  const avgRepairTime = technicians.length > 0 ? technicians.reduce((s, t) => s + t.avgRepairTime, 0) / technicians.length : 0;
  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !newTech.skillSet.includes(trimmed)) {
      setNewTech((prev) => ({ ...prev, skillSet: [...prev.skillSet, trimmed] }));
      setSkillInput("");
    }
  };
  const handleRemoveSkill = (skill) => {
    setNewTech((prev) => ({ ...prev, skillSet: prev.skillSet.filter((s) => s !== skill) }));
  };
  const handleAddTechnician = () => {
    if (!newTech.name || !newTech.email) {
      toast.error("Name and Email are required");
      return;
    }
    const tech = {
      id: `T${Date.now()}`,
      name: newTech.name,
      birthdate: newTech.birthdate,
      gender: newTech.gender,
      email: newTech.email,
      phone: newTech.phone,
      skillSet: newTech.skillSet,
      completedRepairs: 0,
      avgRepairTime: 0,
      assignedMachines: 0
    };
    setTechnicians((prev) => [...prev, tech]);
    setNewTech({ name: "", birthdate: "", gender: "", email: "", phone: "", skillSet: [] });
    setSkillInput("");
    setIsAddDialogOpen(false);
    toast.success(`${tech.name} added to the team`);
  };
  const handleArchive = (id) => {
    const tech = technicians.find((t) => t.id === id);
    if (tech) {
      setArchivedTechnicians((prev) => [...prev, tech]);
      setTechnicians((prev) => prev.filter((t) => t.id !== id));
      toast.success(`${tech.name} archived`);
    }
  };
  const handleRestore = (id) => {
    const tech = archivedTechnicians.find((t) => t.id === id);
    if (tech) {
      setTechnicians((prev) => [...prev, tech]);
      setArchivedTechnicians((prev) => prev.filter((t) => t.id !== id));
      toast.success(`${tech.name} restored`);
    }
  };
  const confirmDelete = (id) => {
    setTechToDelete(id);
    setDeleteDialogOpen(true);
  };
  const handleDelete = () => {
    const tech = archivedTechnicians.find((t) => t.id === techToDelete);
    if (tech) {
      setArchivedTechnicians((prev) => prev.filter((t) => t.id !== techToDelete));
      toast.success(`${tech.name} permanently deleted`);
    }
    setDeleteDialogOpen(false);
    setTechToDelete(null);
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Team Management</h1>
          <p className="text-gray-600">Manage maintenance technicians and track performance</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Technician
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Technician</DialogTitle>
              <DialogDescription>Fill in the technician's profile details.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label htmlFor="tech-name">Name *</Label>
                <Input id="tech-name" value={newTech.name} onChange={(e) => setNewTech((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. João Neves" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="tech-birthdate">Birthdate</Label>
                <Input id="tech-birthdate" type="date" value={newTech.birthdate} onChange={(e) => setNewTech((p) => ({ ...p, birthdate: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="tech-gender">Gender</Label>
                <select
    id="tech-gender"
    value={newTech.gender}
    onChange={(e) => setNewTech((p) => ({ ...p, gender: e.target.value }))}
    className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
  >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="tech-email">Email *</Label>
                <Input id="tech-email" type="email" value={newTech.email} onChange={(e) => setNewTech((p) => ({ ...p, email: e.target.value }))} placeholder="e.g. joao.neves@smartsense.io" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="tech-phone">Phone Number</Label>
                <Input id="tech-phone" value={newTech.phone} onChange={(e) => setNewTech((p) => ({ ...p, phone: e.target.value }))} placeholder="e.g. +351 912 345 678" className="mt-1" />
              </div>
              <div>
                <Label>Skill Set</Label>
                <div className="flex gap-2 mt-1">
                  <Input
    value={skillInput}
    onChange={(e) => setSkillInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddSkill();
      }
    }}
    placeholder="Type a skill and press Enter"
  />
                  <Button type="button" variant="outline" onClick={handleAddSkill}>Add</Button>
                </div>
                {newTech.skillSet.length > 0 && <div className="flex flex-wrap gap-2 mt-2">
                    {newTech.skillSet.map((skill) => <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveSkill(skill)} />
                      </Badge>)}
                  </div>}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddTechnician}>Add Technician</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {
    /* Summary Cards */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Active Technicians</div>
                <div className="text-3xl font-bold mt-1">{technicians.length}</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full"><Users className="w-6 h-6 text-blue-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total Repairs</div>
                <div className="text-3xl font-bold mt-1">{totalRepairs}</div>
              </div>
              <div className="p-3 bg-green-100 rounded-full"><Wrench className="w-6 h-6 text-green-600" /></div>
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
              <div className="p-3 bg-yellow-100 rounded-full"><Clock className="w-6 h-6 text-yellow-600" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {
    /* Active Technicians */
  }
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Active Technicians</CardTitle>
          <CardDescription>{technicians.length} technicians currently active</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {technicians.map((tech) => <div key={tech.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {tech.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-semibold">{tech.name}</div>
                      <div className="text-xs text-gray-500">{tech.email}</div>
                      {tech.phone && <div className="text-xs text-gray-500">{tech.phone}</div>}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleArchive(tech.id)}>
                    <Archive className="w-4 h-4 mr-1" /> Archive
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                  <div><span className="text-gray-500">Assigned:</span> <span className="font-medium">{tech.assignedMachines}</span></div>
                  <div><span className="text-gray-500">Repairs:</span> <span className="font-medium">{tech.completedRepairs}</span></div>
                  <div><span className="text-gray-500">Avg Time:</span> <span className="font-medium">{tech.avgRepairTime}h</span></div>
                </div>
                {tech.skillSet.length > 0 && <div className="flex flex-wrap gap-1">
                    {tech.skillSet.map((skill) => <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>)}
                  </div>}
                {
    /* Recent activity */
  }
                {mockBreakdowns.filter((b) => b.technicianId === tech.id).length > 0 && <div className="mt-3 pt-3 border-t">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent Activity</div>
                    <div className="space-y-2">
                      {mockBreakdowns.filter((b) => b.technicianId === tech.id).sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 2).map((bd) => <div key={bd.id} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                            <span className="text-gray-700 truncate">{bd.title}</span>
                            <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${bd.resolved ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>{bd.resolved ? "Resolved" : "Ongoing"}</span>
                          </div>)}
                    </div>
                  </div>}
              </div>)}
          </div>
        </CardContent>
      </Card>

      {
    /* Archived Technicians */
  }
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Archive className="w-5 h-5" /> Archived Technicians</CardTitle>
          <CardDescription>Former team members kept for record purposes</CardDescription>
        </CardHeader>
        <CardContent>
          {archivedTechnicians.length === 0 ? <div className="text-center py-10 text-gray-500">
              <Archive className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No archived technicians</p>
            </div> : <div className="space-y-3">
              {archivedTechnicians.map((tech) => <div key={tech.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {tech.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-700">{tech.name}</div>
                      <div className="text-xs text-gray-500">{tech.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleRestore(tech.id)}>
                      <RefreshCw className="w-4 h-4 mr-1" /> Restore
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => confirmDelete(tech.id)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>)}
            </div>}
        </CardContent>
      </Card>

      {
    /* Delete confirm dialog */
  }
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete technician permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All records associated with this technician will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export {
  TeamView
};
