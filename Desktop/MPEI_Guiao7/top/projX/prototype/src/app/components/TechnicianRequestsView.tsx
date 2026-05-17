import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { mockAssistanceRequests } from '../data/mockData';
import { AlertCircle, Clock, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface TechnicianRequestsViewProps {
  onGoToMachine: (machineId: string) => void;
}

export const TechnicianRequestsView: React.FC<TechnicianRequestsViewProps> = ({ onGoToMachine }) => {
  const { user } = useAuth();
  
  const filteredRequests = mockAssistanceRequests.filter(
    req => req.status === 'pending' && req.assignedTechnicians?.includes(user?.id || '')
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Assistance Requests</h1>
        <p className="text-gray-600">Review requests from other technicians needing your expertise</p>
      </div>

      <div className="grid gap-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-gray-600 bg-white rounded-lg border">
            No assistance requests available.
          </div>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold">{request.machineName}</h3>
                      <Badge variant={request.status === 'pending' ? 'default' : 'secondary'}>
                        {request.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-700">{request.reason}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {request.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Requested by {request.requestedBy}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {request.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <Button 
                      className="flex-1 md:flex-none"
                      onClick={() => onGoToMachine(request.machineId)}
                    >
                      Go to Machine
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
