import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { mockAssistanceRequests, mockMachines, mockUsers } from '../data/mockData';
import { HelpCircle, Clock, MapPin, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';
import { AssistanceRequestDialog } from './AssistanceRequestDialog';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export const AssistanceRequestsView: React.FC = () => {
  const { user } = useAuth();
  const [selectedMachine, setSelectedMachine] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const technicians = mockUsers.filter(u => u.role === 'Maintenance Technician');

  const handleCreateRequest = () => {
    // Encontrar uma máquina com problemas
    const criticalMachine = mockMachines.find(m => m.status === 'critical' || m.status === 'breakdown');
    if (criticalMachine) {
      setSelectedMachine(criticalMachine);
      setDialogOpen(true);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
  };

  const handleAssignRequest = (requestId: string) => {
    const technicianId = assignments[requestId];
    if (!technicianId) {
      toast.error('Please, select a technician');
      return;
    }
    const technician = technicians.find(t => t.id === technicianId);
    toast.success(`Request accepted and assigned to ${technician?.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Assistance Requests</h1>
          <p className="text-gray-600">
            Manage and resolve assistance requests for problematic machines
          </p>
        </div>
        {user?.role !== 'Maintenance Director' && (
          <Button onClick={handleCreateRequest} size="lg">
            <HelpCircle className="w-5 h-5 mr-2" />
            New Request
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {mockAssistanceRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No assistance requests found</p>
              {user?.role !== 'Maintenance Director' && (
                <Button onClick={handleCreateRequest} className="mt-4">
                  Create First Request
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          mockAssistanceRequests.map((request) => (
            <Card key={request.id} className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-semibold text-lg">{request.machineName}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusLabel(request.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {request.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {formatDate(request.timestamp)}
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                      <p className="text-sm font-medium text-yellow-900 mb-1">
                        Reason:
                      </p>
                      <p className="text-sm text-yellow-800">
                        {request.reason}
                      </p>
                    </div>

                    <div className="text-sm text-gray-600">
                      Requested by: <span className="font-medium">{request.requestedBy}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[200px]">
                    {request.status === 'pending' && (
                      <>
                        {user?.role === 'Maintenance Director' ? (
                          <>
                            <Select
                              value={assignments[request.id] || ''}
                              onValueChange={(value) => 
                                setAssignments({ ...assignments, [request.id]: value })
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
                              variant="default" 
                              onClick={() => handleAssignRequest(request.id)}
                              disabled={!assignments[request.id]}
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Assign & Accept
                            </Button>
                          </>
                        ) : (
                          <Button variant="default" size="sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {user?.role !== 'Maintenance Director' && (
        <Card>
          <CardHeader>
            <CardTitle>Machines with Alerts</CardTitle>
            <CardDescription>
              Machines that may require assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {mockMachines
                .filter(m => m.status === 'critical' || m.status === 'breakdown' || m.status === 'warning')
                .map((machine) => (
                  <div
                    key={machine.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">{machine.name}</div>
                      <div className="text-sm text-gray-600">{machine.location}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedMachine(machine);
                        setDialogOpen(true);
                      }}
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Request Help
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedMachine && (
        <AssistanceRequestDialog
          machine={selectedMachine}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
};
