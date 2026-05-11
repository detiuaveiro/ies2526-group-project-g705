import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export const EndMaintenanceDialog = ({ open, onOpenChange, onConfirm, machineName }) => {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hoursSpent, setHoursSpent] = useState("");
  const [cost, setCost] = useState("");
  const [partsUsed, setPartsUsed] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return toast.error("Please provide a title");
    if (!description.trim()) return toast.error("Please provide a description");

    onConfirm({
      title,
      description,
      hoursSpent: Number(hoursSpent),
      cost: Number(cost),
      partsUsed,
      technicianId: user.id
    });

    setTitle("");
    setDescription("");
    setHoursSpent("");
    setCost("");
    setPartsUsed("");

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End Maintenance</DialogTitle>
          <DialogDescription>
            Conclude maintenance for {machineName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          
          <div>
            <Label>Work Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label>Detailed Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>

          <div>
            <Label>Hours Spent</Label>
            <Input
              type="number"
              value={hoursSpent}
              onChange={(e) => setHoursSpent(e.target.value)}
            />
          </div>

          <div>
            <Label>Cost (€)</Label>
            <Input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>

          <div>
            <Label>Parts Used</Label>
            <Input
              value={partsUsed}
              onChange={(e) => setPartsUsed(e.target.value)}
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
