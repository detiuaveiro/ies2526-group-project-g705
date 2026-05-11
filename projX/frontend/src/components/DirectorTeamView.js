import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api/v1";

export const DirectorTeamView = () => {
  const { user } = useAuth();

  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/users/technicians`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setTechnicians(data))
      .catch(() => toast.error("Failed to load technicians"));
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Team Overview</h1>
        <p className="text-gray-600">
          List of all maintenance technicians
        </p>
      </div>

      {/* TOP CARD */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Technicians</div>
              <div className="text-3xl font-bold mt-1">
                {technicians.length}
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TECHNICIAN LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Technicians</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                className="border rounded-lg p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {tech.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div>
                  <div className="font-medium text-lg">{tech.name}</div>
                  <div className="text-sm text-gray-600">
                    {tech.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
