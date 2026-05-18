import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export const EndMaintenanceDialog = ({
  open,
  onOpenChange,
  onConfirm,
  machineName,
  session,
}) => {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hoursSpent, setHoursSpent] = useState("");
  const [partsUsed, setPartsUsed] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return toast.error("Please provide a title");
    if (!description.trim()) return toast.error("Please provide a description");
    if (!hoursSpent || isNaN(hoursSpent) || Number(hoursSpent) <= 0) return toast.error("Please provide valid hours spent");
    if (!partsUsed.trim()) return toast.error("Please provide parts used (or 'None')");

    onConfirm({
      title: title.trim(),
      description: description.trim(),
      hoursSpent: Number(hoursSpent),
      partsUsed: partsUsed.trim(),
      technicianId: String(user.id),
    });

    setTitle("");
    setDescription("");
    setHoursSpent("");
    setPartsUsed("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>End Maintenance</DialogTitle>
          <DialogDescription>
            Conclude maintenance for {machineName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {session && (
            <div className="rounded-md bg-gray-50 border p-3 space-y-1 text-sm">
              <p><span className="text-gray-500">Session ID:</span> {session.id}</p>
              <p><span className="text-gray-500">Machine:</span> {session.machineName || machineName}</p>
              <p><span className="text-gray-500">Technician:</span> {session.technicianName || user?.name}</p>
              <p>
                <span className="text-gray-500">Started:</span>{" "}
                {session.startTime ? new Date(session.startTime).toLocaleString("pt-PT") : "—"}
              </p>
              {session.maintenanceRecordId && (
                <p><span className="text-gray-500">Maintenance record:</span> #{session.maintenanceRecordId}</p>
              )}
            </div>
          )}

          <div>
            <Label>Technician ID</Label>
            <Input value={user?.id ?? ""} readOnly className="bg-gray-50" />
          </div>

          <div>
            <Label>Work Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label>Detailed Description *</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>

          <div>
            <Label>Hours Spent *</Label>
            <Input
              type="number"
              min={0.1}
              step={0.1}
              value={hoursSpent}
              onChange={(e) => setHoursSpent(e.target.value)}
            />
          </div>

          <div>
            <Label>Parts Used *</Label>
            <Input
              value={partsUsed}
              onChange={(e) => setPartsUsed(e.target.value)}
              placeholder="List parts or 'None'"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Submit & End
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
