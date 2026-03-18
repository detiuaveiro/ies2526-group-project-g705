import React from 'react';
import { Machine, Breakdown } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from './ui/button';
import { ArrowLeft, AlertCircle, Clock, DollarSign, ChevronDown, ChevronRight } from 'lucide-react';
import { mockSensorData, mockBreakdowns } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from './ui/badge';
import { EndMaintenanceDialog } from './EndMaintenanceDialog';
import { useState } from 'react';

interface MachineDetailProps {
  machine: Machine;
  onBack: () => void;
  onRequestAssistance: () => void;
  // New props for Technician workflow
  isMaintenanceActive?: boolean;
  canStartAnotherMaintenance?: boolean;
  onStartMaintenance?: () => void;
  onEndMaintenance?: (title?: string, description?: string) => void;
}

export const MachineDetail: React.FC<MachineDetailProps> = ({ 
  machine, 
  onBack,
  onRequestAssistance,
  isMaintenanceActive = false,
  canStartAnotherMaintenance = true,
  onStartMaintenance,
  onEndMaintenance
}) => {
  const { user } = useAuth();
  const [endMaintenanceDialogOpen, setEndMaintenanceDialogOpen] = useState(false);
  const sensorData = mockSensorData[machine.id] || { vibration: [], pressure: [], temperature: [] };
  const breakdowns = mockBreakdowns.filter(b => b.machineId === machine.id);
  const [expandedBreakdowns, setExpandedBreakdowns] = useState<Record<string, boolean>>({});

  const toggleBreakdown = (id: string) => {
    setExpandedBreakdowns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const canRequestAssistance = user?.role === 'Maintenance Technician';
  const canViewHistory = user?.role !== 'Maintenance Technician' || user.role === 'Maintenance Technician';
  const isTechnician = user?.role === 'Maintenance Technician';

  const formatChartData = (data: { timestamp: Date; value: number }[]) => {
    return data.map(d => ({
      time: new Date(d.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      value: Math.round(d.value * 10) / 10
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Machines
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{machine.name}</h1>
            <p className="text-gray-600">{machine.location}</p>
          </div>
        </div>
        {isTechnician && (
          <div className="flex gap-2">
            {!isMaintenanceActive ? (
              <Button 
                onClick={onStartMaintenance} 
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!canStartAnotherMaintenance}
              >
                <Clock className="w-4 h-4 mr-2" />
                Start Maintenance
              </Button>
            ) : (
              <>
                <Button variant="destructive" onClick={onRequestAssistance}>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Request Help
                </Button>
                <Button 
                  onClick={() => setEndMaintenanceDialogOpen(true)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  End Maintenance
                </Button>
              </>
            )}
          </div>
        )}
        {canRequestAssistance && !isTechnician && (
          <Button variant="destructive" onClick={onRequestAssistance}>
            <AlertCircle className="w-4 h-4 mr-2" />
            Request Assistance
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Status</div>
            <div className="text-2xl font-bold mt-1 capitalize">{machine.status}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Priority Level</div>
            <div className="text-2xl font-bold mt-1">
              {machine.priority === 1 ? 'High' : machine.priority <= 3 ? 'Medium' : 'Low'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Operational Status</div>
            <div className={`text-2xl font-bold mt-1 capitalize ${
              machine.operationalStatus === 'functional' ? 'text-green-600' :
              machine.operationalStatus === 'in-repair' ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {machine.operationalStatus === 'functional' ? 'Functional' :
               machine.operationalStatus === 'in-repair' ? 'In Repair' : 'Stopped'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Machine ID</div>
            <div className="text-2xl font-bold mt-1">{machine.id}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Vibration Trend (% of max)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={formatChartData(sensorData.vibration)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis label={{ value: 'Value (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Pressure Trend (PSI)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={formatChartData(sensorData.pressure)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis label={{ value: 'Value (PSI)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Temperature Trend (°C)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={formatChartData(sensorData.temperature)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis label={{ value: 'Value (°C)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {canViewHistory && (
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            {breakdowns.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No breakdown history available</p>
            ) : (
              <div className="space-y-4">
                {breakdowns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((breakdown) => (
                  <div 
                    key={breakdown.id} 
                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleBreakdown(breakdown.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {expandedBreakdowns[breakdown.id] ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                          {breakdown.title}
                        </div>
                        <div className="text-sm text-gray-600 mt-1 pl-6">
                          {new Date(breakdown.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <Badge variant={breakdown.resolved ? 'default' : 'destructive'}>
                        {breakdown.resolved ? 'Resolved' : 'Pending'}
                      </Badge>
                    </div>

                    {expandedBreakdowns[breakdown.id] && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <div className="text-sm border-l-2 border-blue-500 pl-3">
                          <span className="font-semibold text-gray-800 block mb-1">Description</span>
                          {breakdown.description}
                        </div>
                        {breakdown.resolved && (
                          <div className="flex gap-6 text-sm bg-white p-3 rounded-md border mt-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span className="font-medium">Repair Time:</span>
                              <span>{breakdown.repairTime} hours</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isMaintenanceActive && (
        <EndMaintenanceDialog
          open={endMaintenanceDialogOpen}
          onOpenChange={setEndMaintenanceDialogOpen}
          onConfirm={(title, description) => {
            if (onEndMaintenance) {
              onEndMaintenance(title, description);
            }
          }}
          machineName={machine.name}
        />
      )}
    </div>
  );
};
