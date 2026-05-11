import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

const API = "http://localhost:8080/api/v1/assistance-requests";

export const AssistanceRequestDialog = ({ machine, open, onOpenChange }) => {
  const { user } = useAuth();
  const [reason, setReason] = useState("");

  if (!machine) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          machineId: machine.id,
          requestedById: user.id,
          reason,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Assistance request sent");
      setReason("");
      onOpenChange(false);
    } catch {
      toast.error("Failed to send request");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Assistance</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Machine</Label>
            <p className="font-medium">{machine.name}</p>
          </div>

          <div>
            <Label>Reason</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the issue..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Send</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
