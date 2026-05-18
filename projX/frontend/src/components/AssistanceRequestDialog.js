import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

const API = "http://localhost:8080/api/v1";

const AssistanceRequestDialog = ({
  machine,
  open,
  onOpenChange
}) => {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [newProblemDescription, setNewProblemDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const machineId = machine?.id != null ? Number(machine.id) : null;

  useEffect(() => {
    if (open && machine && machineId) {
      const fetchProblems = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`${API}/problems/machine/${machineId}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          if (!res.ok) throw new Error("Failed to fetch problems");

          const data = await res.json();
          const unresolved = Array.isArray(data) ? data.filter((p) => !p.resolved) : [];
          setProblems(unresolved);

          if (unresolved.length > 0) {
            setSelectedProblemId(String(unresolved[0].id));
          } else {
            setSelectedProblemId("");
          }
        } catch (error) {
          console.error("Error fetching problems:", error);
          toast.error("Failed to load machine problems");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProblems();
    }
  }, [open, machine, machineId, user?.token]);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    const payload = {
      machineId,
      requestedById: Number(user.id),
      reason: reason.trim(),
    };

    if (selectedProblemId) {
      payload.problemId = parseInt(selectedProblemId, 10);
    } else if (!newProblemDescription.trim()) {
      toast.error("Select a problem or describe a new one for this machine");
      return;
    }

    if (!selectedProblemId && newProblemDescription.trim()) {
      payload.reason = `${reason.trim()} — ${newProblemDescription.trim()}`;
    }

    try {
      const response = await fetch(`${API}/assistance-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create request");
      }

      toast.success("Assistance request sent", {
        description: "The director will assign technicians shortly",
      });

      setReason("");
      setSelectedProblemId("");
      setNewProblemDescription("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating request:", error);
      toast.error(error.message || "Failed to send request");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Request Assistance</DialogTitle>
          <DialogDescription>
            Request help from other maintenance technicians for this machine
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Machine ID</Label>
            <Input value={machineId ?? ""} readOnly className="bg-gray-50" />
          </div>

          <div>
            <div className="text-sm text-gray-600">Machine</div>
            <div className="font-medium">{machine?.name}</div>
          </div>

          <div>
            <div className="text-sm text-gray-600">Location</div>
            <div className="font-medium">{machine?.location}</div>
          </div>

          <div>
            <Label htmlFor="problem">Related Problem (optional if new below)</Label>
            {isLoading ? (
              <div className="text-sm text-gray-500 mt-1">Loading problems...</div>
            ) : problems.length > 0 ? (
              <select
                id="problem"
                value={selectedProblemId}
                onChange={(e) => setSelectedProblemId(e.target.value)}
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">— New problem (describe below) —</option>
                {problems.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id}: {p.description}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-orange-600 mt-1">
                No active problems — describe the issue below.
              </p>
            )}
          </div>

          {!selectedProblemId && (
            <div>
              <Label>New problem description</Label>
              <Textarea
                value={newProblemDescription}
                onChange={(e) => setNewProblemDescription(e.target.value)}
                placeholder="Describe the machine issue..."
                rows={2}
                className="mt-2"
              />
            </div>
          )}

          <div>
            <Label htmlFor="reason">Reason for Assistance *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe why you need assistance..."
              rows={4}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Requested by</Label>
            <Input value={user?.name || ""} readOnly className="bg-gray-50" />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              Send Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AssistanceRequestDialog };
