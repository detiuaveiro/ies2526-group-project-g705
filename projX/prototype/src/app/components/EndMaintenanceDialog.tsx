import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface EndMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (description: string) => void;
  machineName: string;
}

export const EndMaintenanceDialog: React.FC<EndMaintenanceDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  machineName
}) => {
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!description.trim()) {
      toast.error('Please provide a description of the work performed');
      return;
    }

    onConfirm(description);
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End Maintenance</DialogTitle>
          <DialogDescription>
            Conclude maintenance for {machineName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="description">Work Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the actions taken, parts replaced, and overall result..."
              rows={5}
              className="mt-2"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Submit & End
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
