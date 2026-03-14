import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { mockMachines, mockBreakdowns, mockAssistanceRequests } from '../data/mockData';
import { AlertCircle, CheckCircle, AlertTriangle, XCircle, TrendingUp, Clock, Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';

export const Dashboard: React.FC = () => {
  const operationalCount = mockMachines.filter(m => m.status === 'operational').length;
  const warningCount = mockMachines.filter(m => m.status === 'warning').length;
  const criticalCount = mockMachines.filter(m => m.status === 'critical').length;
  const breakdownCount = mockMachines.filter(m => m.status === 'breakdown').length;

  const recentBreakdowns = mockBreakdowns
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const pendingRequests = mockAssistanceRequests.filter(r => r.status === 'pending');

  // Identificar máquinas com hazard (limites ultrapassados)
  const hazardMachines = mockMachines.filter(m => 
    m.vibration > 80 || m.pressure > 110 || m.temperature > 90
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of the industrial monitoring system</p>
      </div>

      {/* Hazard Alerts */}
      {hazardMachines.length > 0 && (
        <Alert variant="destructive" className="border-2 border-red-500 bg-red-50">
          <Zap className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">Hazard Alert - Limits Exceeded</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-2">
              {hazardMachines.map(machine => (
                <div key={machine.id} className="bg-white border border-red-300 rounded p-3">
                  <div className="font-semibold text-red-900">{machine.name}</div>
                  <div className="text-sm text-red-800 mt-1">{machine.location}</div>
                  <div className="flex gap-4 mt-2 text-sm">
                    {machine.vibration > 80 && (
                      <span className="font-medium text-red-700">
                        ⚠️ Vibration: {machine.vibration} Hz (Limit: 80 Hz)
                      </span>
                    )}
                    {machine.pressure > 110 && (
                      <span className="font-medium text-red-700">
                        ⚠️ Pressure: {machine.pressure} bar (Limit: 110 bar)
                      </span>
                    )}
                    {machine.temperature > 90 && (
                      <span className="font-medium text-red-700">
                        ⚠️ Temperature: {machine.temperature}°C (Limit: 90°C)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Operational</div>
                <div className="text-3xl font-bold mt-1 text-green-700">{operationalCount}</div>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Warning</div>
                <div className="text-3xl font-bold mt-1 text-yellow-700">{warningCount}</div>
              </div>
              <div className="p-3 bg-yellow-500 rounded-full">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Critical</div>
                <div className="text-3xl font-bold mt-1 text-orange-700">{criticalCount}</div>
              </div>
              <div className="p-3 bg-orange-500 rounded-full">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Breakdown</div>
                <div className="text-3xl font-bold mt-1 text-red-700">{breakdownCount}</div>
              </div>
              <div className="p-3 bg-red-500 rounded-full">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Breakdowns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBreakdowns.map((breakdown) => {
                const machine = mockMachines.find(m => m.id === breakdown.machineId);
                return (
                  <div key={breakdown.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                    <div className={`p-2 rounded-full ${breakdown.resolved ? 'bg-green-500' : 'bg-red-500'}`}>
                      {breakdown.resolved ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <XCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{machine?.name}</div>
                      <div className="text-sm text-gray-600">{breakdown.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(breakdown.date).toLocaleDateString('en-US')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assistance Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No pending assistance requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{request.machineName}</div>
                        <div className="text-sm text-gray-600 mt-1">{request.location}</div>
                        <div className="text-sm text-gray-700 mt-2">{request.reason}</div>
                        <div className="text-xs text-gray-500 mt-2">
                          Requested by {request.requestedBy} at {new Date(request.timestamp).toLocaleTimeString('en-US')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Priority Ranking */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Ranking - Critical Machines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockMachines
              .filter(m => m.priority <= 3)
              .sort((a, b) => a.priority - b.priority)
              .map((machine) => {
                let statusColor = 'bg-green-500';
                let statusText = 'Operational';
                
                if (machine.status === 'breakdown') {
                  statusColor = 'bg-red-500';
                  statusText = 'Breakdown';
                } else if (machine.status === 'critical') {
                  statusColor = 'bg-orange-500';
                  statusText = 'Critical';
                } else if (machine.status === 'warning') {
                  statusColor = 'bg-yellow-500';
                  statusText = 'Warning';
                }

                return (
                  <div key={machine.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4" style={{ borderLeftColor: statusColor.replace('bg-', '#').replace('500', '') }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-bold">
                          #{machine.priority}
                        </Badge>
                        <div className="font-medium">{machine.name}</div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{machine.location}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-right">
                        <div className="flex items-center gap-3">
                          <span className={`${machine.vibration > 80 ? 'text-red-600' : machine.vibration > 60 ? 'text-yellow-600' : 'text-green-600'} font-medium`}>
                            {machine.vibration} Hz
                          </span>
                          <span className={`${machine.pressure > 110 ? 'text-red-600' : machine.pressure > 90 ? 'text-yellow-600' : 'text-green-600'} font-medium`}>
                            {machine.pressure} bar
                          </span>
                          <span className={`${machine.temperature > 90 ? 'text-red-600' : machine.temperature > 70 ? 'text-yellow-600' : 'text-green-600'} font-medium`}>
                            {machine.temperature}°C
                          </span>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-medium text-white ${statusColor}`}>
                        {statusText}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};