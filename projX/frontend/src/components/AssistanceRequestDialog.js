import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

const AssistanceRequestDialog = ({
  machine,
  open,
  onOpenChange
}) => {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && machine) {
      const fetchProblems = async () => {
        setIsLoading(true);
        try {
          // Extrai o número do ID da máquina (ex: "M002" -> 2), ou usa o ID direto se já for numérico
          const parsedMachineId = machine.id.toString().replace(/\D/g, '') || machine.id;
          const res = await fetch(`/api/v1/problems/machine/${parsedMachineId}`);
          if (!res.ok) throw new Error("Failed to fetch problems");

          const data = await res.json();
          const unresolved = data.filter(p => !p.resolved);
          setProblems(unresolved);

          if (unresolved.length > 0) {
            setSelectedProblemId(unresolved[0].id.toString());
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
  }, [open, machine]);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    if (!selectedProblemId) {
      toast.error("Please select a problem. No active problems found for this machine.");
      return;
    }

    try {
      const response = await fetch('/api/v1/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemId: parseInt(selectedProblemId),
          requestedById: parseInt(user?.id || "1"), // Fallback to 1
          reason,
          status: "PENDING"
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create request');
      }

      toast.success("Assistance request sent", {
        description: "The director will assign technicians shortly"
      });

      setReason("");
      setSelectedProblemId("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error("Failed to send request", {
        description: "An error occurred while communicating with the server."
      });
    }
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Request Assistance</DialogTitle>
        <DialogDescription>
          Request help from other maintenance technicians for this machine
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 mt-4">
        <div>
          <div className="text-sm text-gray-600">Machine</div>
          <div className="font-medium">{machine.name}</div>
        </div>

        <div>
          <div className="text-sm text-gray-600">Location</div>
          <div className="font-medium">{machine.location}</div>
        </div>

        <div>
          <Label htmlFor="problem">Related Problem</Label>
          {isLoading ? (
            <div className="text-sm text-gray-500 mt-1">Loading problems...</div>
          ) : problems.length > 0 ? (
            <select
              id="problem"
              value={selectedProblemId}
              onChange={(e) => setSelectedProblemId(e.target.value)}
              className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {problems.map(p => (
                <option key={p.id} value={p.id}>
                  {p.description}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-sm text-orange-600 mt-1">
              No active problems found for this machine.
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="reason">Reason for Assistance</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe why you need assistance with this machine..."
            rows={4}
            className="mt-2"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || problems.length === 0}>
            Send Request
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>;
};

export {
  AssistanceRequestDialog
};
