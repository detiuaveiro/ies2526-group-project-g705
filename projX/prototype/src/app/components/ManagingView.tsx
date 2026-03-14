import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { mockMachines } from '../data/mockData';
import { Plus, Trash2, Archive, RefreshCw, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

export const ManagingView: React.FC = () => {
  const [machines, setMachines] = useState(mockMachines);
  const [archivedMachines, setArchivedMachines] = useState<typeof mockMachines>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<string | null>(null);
  
  const [newMachine, setNewMachine] = useState({
    name: '',
    location: '',
    sensors: ''
  });

  const handleAddMachine = () => {
    if (!newMachine.name || !newMachine.location) {
      toast.error('Please, fill in all required fields');
      return;
    }

    const machine = {
      id: `M${String(machines.length + archivedMachines.length + 1).padStart(3, '0')}`,
      name: newMachine.name,
      location: newMachine.location,
      status: 'operational' as const,
      priority: 5,
      vibration: 30,
      pressure: 70,
      temperature: 55,
      lastMaintenance: new Date()
    };

    setMachines([...machines, machine]);
    setNewMachine({ name: '', location: '', sensors: '' });
    setIsAddDialogOpen(false);
    toast.success('Machine added successfully', {
      description: `${machine.name} was added to the system`
    });
  };

  const handleArchiveMachine = (id: string) => {
    const machine = machines.find(m => m.id === id);
    if (machine) {
      setArchivedMachines([...archivedMachines, machine]);
      setMachines(machines.filter(m => m.id !== id));
      toast.success('Machine archived successfully', {
        description: `${machine.name} was moved to the archive`
      });
    }
  };

  const handleDeleteMachine = () => {
    if (!machineToDelete) return;
    
    const machine = archivedMachines.find(m => m.id === machineToDelete);
    if (machine) {
      setArchivedMachines(archivedMachines.filter(m => m.id !== machineToDelete));
      toast.success('Equipment deleted successfully', {
        description: `${machine.name} was permanently removed from the system`
      });
    }
    setDeleteDialogOpen(false);
    setMachineToDelete(null);
  };

  const handleRestoreMachine = (id: string) => {
    const machine = archivedMachines.find(m => m.id === id);
    if (machine) {
      setMachines([...machines, machine]);
      setArchivedMachines(archivedMachines.filter(m => m.id !== id));
      toast.success('Machine restored successfully', {
        description: `${machine.name} was restored and is active again`
      });
    }
  };

  const confirmDelete = (id: string) => {
    setMachineToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Machine Management</h1>
          <p className="text-gray-600">Add, remove, and manage industrial equipment</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Machine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Machine</DialogTitle>
              <DialogDescription>
                Fill in the machine data to add to the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Machine Name *</Label>
                <Input
                  id="name"
                  value={newMachine.name}
                  onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
                  placeholder="ex: Compressor Unit A1"
                />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={newMachine.location}
                  onChange={(e) => setNewMachine({ ...newMachine, location: e.target.value })}
                  placeholder="ex: Building A - Floor 1"
                />
              </div>
              <div>
                <Label htmlFor="sensors">Associated Sensors</Label>
                <Textarea
                  id="sensors"
                  value={newMachine.sensors}
                  onChange={(e) => setNewMachine({ ...newMachine, sensors: e.target.value })}
                  placeholder="ex: Vibration, Pressure, Temperature"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMachine}>
                <Plus className="w-4 h-4 mr-2" />
                Add Machine
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Machines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Active Machines
          </CardTitle>
          <CardDescription>
            {machines.length} machines in operation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {machines.map((machine) => {
              const statusColors = {
                operational: 'bg-green-500 text-white',
                warning: 'bg-yellow-500 text-white',
                critical: 'bg-orange-500 text-white',
                breakdown: 'bg-red-500 text-white'
              };
              
              const statusLabels = {
                operational: 'Operational',
                warning: 'Warning',
                critical: 'Critical',
                breakdown: 'Breakdown'
              };

              return (
                <div key={machine.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-semibold text-lg">{machine.name}</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[machine.status]}`}>
                        {statusLabels[machine.status]}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{machine.location}</div>
                    <div className="text-xs text-gray-500 mt-1">ID: {machine.id}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArchiveMachine(machine.id)}
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Archived Machines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="w-5 h-5" />
            Archived Machines
          </CardTitle>
          <CardDescription>
            Machines removed or deactivated for record consultation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {archivedMachines.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <Archive className="w-16 h-16 mx-auto mb-3 text-gray-400" />
              <p className="font-medium">No archived machines</p>
              <p className="text-sm mt-1">Archived machines will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {archivedMachines.map((machine) => (
                <div key={machine.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <div className="font-semibold">{machine.name}</div>
                    <div className="text-sm text-gray-600">{machine.location}</div>
                    <div className="text-xs text-gray-500 mt-1">ID: {machine.id}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestoreMachine(machine.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Restore
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmDelete(machine.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The machine will be permanently removed from the system, including all its historical data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMachine} className="bg-red-600 hover:bg-red-700">
              Permanently Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};