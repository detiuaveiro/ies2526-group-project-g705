import { useState } from "react";
import { MachineCard } from "./MachineCard";
import { Input } from "./ui/input";
import { Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
const MachinesList = ({ machines, onMachineClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredMachines = machines.filter((machine) => {
    const matchesSearch = machine.name.toLowerCase().includes(searchTerm.toLowerCase()) || machine.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || machine.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const priorityValues = { "breakdown": 1, "critical": 2, "warning": 3, "operational": 4 };
    return priorityValues[a.status] - priorityValues[b.status];
  });
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Machines</h1>
        <p className="text-gray-600">Monitor and manage industrial machinery</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
    type="text"
    placeholder="Search machines..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-10"
  />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="breakdown">Breakdown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMachines.map((machine) => <MachineCard
    key={machine.id}
    machine={machine}
    onClick={() => onMachineClick(machine)}
  />)}
      </div>

      {filteredMachines.length === 0 && <div className="text-center py-12 text-gray-600">
          No machines found matching your criteria
        </div>}
    </div>;
};
export {
  MachinesList
};
