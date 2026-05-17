import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api/v1";

export const TechnicianAssignedMachines = ({ onGoToMachine }) => {
  const { user } = useAuth();
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/machines/assigned/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(setMachines)
      .catch(() => toast.error("Failed to load assigned machines"));
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Assigned Machines</h1>

      {machines.length === 0 ? (
        <div className="text-center py-12 text-gray-600 bg-white rounded-lg border">
          No machines assigned to you.
        </div>
      ) : (
        machines.map(machine => (
          <Card key={machine.id}>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{machine.name}</h3>
                <p className="text-gray-600">{machine.location}</p>
              </div>

              <Button onClick={() => onGoToMachine(machine.id)}>
                Go to Machine
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
