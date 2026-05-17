import React, { useState } from 'react';
import { Machine } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { mockAssistanceRequests } from '../data/mockData';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface AssistanceRequestDialogProps {
  machine: Machine;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AssistanceRequestDialog: React.FC<AssistanceRequestDialogProps> = ({
  machine,
  open,
  onOpenChange
}) => {
  const { user } = useAuth();
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for assistance');
      return;
    }

    const request = {
      id: `AR${String(mockAssistanceRequests.length + 1).padStart(3, '0')}`,
      machineId: machine.id,
      machineName: machine.name,
      location: machine.location,
      reason: reason,
      requestedBy: user?.name || 'Unknown',
      timestamp: new Date(),
      status: 'pending' as const
    };

    mockAssistanceRequests.push(request);
    
    toast.success('Assistance request sent', {
      description: 'The director will assign technicians shortly'
    });
    
    setReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Button onClick={handleSubmit}>
              Send Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
