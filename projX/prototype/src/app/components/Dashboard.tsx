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

      <div className="space-y-6">
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

      </div>
    </div>
  );
};