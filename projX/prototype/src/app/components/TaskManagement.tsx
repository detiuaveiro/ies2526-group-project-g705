import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { mockUsers, mockBreakdowns } from '../data/mockData';
import { AlertTriangle, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Machine } from '../types';

interface TaskManagementProps {
  machines: Machine[];
  onAssignTechnician: (machineId: string, techId: string) => void;
  onMachineClick: (machine: Machine) => void;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({ machines, onAssignTechnician, onMachineClick }) => {
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  // Obter técnicos disponíveis
  const technicians = mockUsers.filter(u => u.role === 'Maintenance Technician');

  const handleAssignTechnician = (machine: Machine) => {
    const technicianId = assignments[machine.id] || machine.assignedTechnician;
    if (!technicianId) {
      toast.error('Please, select a technician');
      return;
    }
    const technician = technicians.find(t => t.id === technicianId);
    
    // Call the parent state updater
    onAssignTechnician(machine.id, technicianId);

    toast.success('Machine assigned successfully', {
      description: `${machine.name} has been assigned to ${technician?.name}`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'breakdown':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'critical':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'breakdown':
        return 'Breakdown';
      case 'critical':
        return 'Critical';
      case 'warning':
        return 'Warning';
      case 'operational':
        return 'Operational';
      default:
        return status;
    }
  };

  // Sort machines: critical/breakdown first, then warning, then operational
  const sortedMachines = [...machines].sort((a, b) => {
    const priorityValues: Record<string, number> = { 'breakdown': 1, 'critical': 2, 'warning': 3, 'operational': 4 };
    return priorityValues[a.status] - priorityValues[b.status];
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Machine Assignment</h1>
        <p className="text-gray-600">
          Assign technicians to machines requiring attention.
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Needs Assignment</CardTitle>
            <CardDescription>Assign technicians to machines.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedMachines.map((machine) => {
                let statusColor = 'bg-green-500';
                
                if (machine.status === 'breakdown') {
                  statusColor = 'bg-red-500';
                } else if (machine.status === 'critical') {
                  statusColor = 'bg-orange-500';
                } else if (machine.status === 'warning') {
                  statusColor = 'bg-yellow-500';
                }
                
                const unresolvedBreakdown = mockBreakdowns.find(b => b.machineId === machine.id && !b.resolved);

                return (
                  <Card key={machine.id} className={`border-l-4 ${statusColor}`}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{machine.name}</h3>
                            <Badge className={getStatusColor(machine.status)}>
                              {getStatusLabel(machine.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {machine.location}
                          </p>
                          {unresolvedBreakdown && (
                            <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                              <p className="text-sm font-medium text-red-900">
                                {unresolvedBreakdown.description}
                              </p>
                            </div>
                          )}
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Vibration:</span>
                              <span className={`ml-2 font-medium ${
                                machine.vibration > 80 ? 'text-red-600' : 
                                machine.vibration > 60 ? 'text-yellow-600' : 
                                'text-green-600'
                              }`}>
                                {machine.vibration} Hz
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Pressure:</span>
                              <span className={`ml-2 font-medium ${
                                machine.pressure > 110 ? 'text-red-600' : 
                                machine.pressure > 90 ? 'text-yellow-600' : 
                                'text-green-600'
                              }`}>
                                {machine.pressure} bar
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Temperature:</span>
                              <span className={`ml-2 font-medium ${
                                machine.temperature > 90 ? 'text-red-600' : 
                                machine.temperature > 70 ? 'text-yellow-600' : 
                                'text-green-600'
                              }`}>
                                {machine.temperature}°C
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 min-w-[250px]">
                          <Select
                            value={assignments[machine.id] || machine.assignedTechnician || ''}
                            onValueChange={(value) => 
                              setAssignments({ ...assignments, [machine.id]: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select technician" />
                            </SelectTrigger>
                            <SelectContent>
                              {technicians.map((tech) => (
                                <SelectItem key={tech.id} value={tech.id}>
                                  {tech.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={() => handleAssignTechnician(machine)}
                            className="w-full"
                            disabled={!(assignments[machine.id] || machine.assignedTechnician)}
                          >
                            Assign Machine
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => onMachineClick(machine)}
                            className="w-full flex items-center gap-2"
                          >
                            <BarChart2 className="w-4 h-4" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
