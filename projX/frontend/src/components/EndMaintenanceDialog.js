import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
const EndMaintenanceDialog = ({
  open,
  onOpenChange,
  onConfirm,
  machineName
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Please provide a title for the maintenance log");
      return;
    }
    if (!description.trim()) {
      toast.error("Please provide a description of the work performed");
      return;
    }
    onConfirm(title, description);
    setTitle("");
    setDescription("");
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End Maintenance</DialogTitle>
          <DialogDescription>
            Conclude maintenance for {machineName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title">Work Title</Label>
            <Input
    id="title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="e.g. Broken valve replacement"
    className="mt-2"
  />
          </div>

          <div>
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
    id="description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Describe the actions taken, parts replaced, and overall result..."
    rows={5}
    className="mt-2"
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
    </Dialog>;
};
export {
  EndMaintenanceDialog
};
