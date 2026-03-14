import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { mockTechnicianPerformance, mockBreakdowns } from '../data/mockData';
import { Users, Wrench, Clock, DollarSign } from 'lucide-react';

export const TeamView: React.FC = () => {
  const totalRepairs = mockTechnicianPerformance.reduce((sum, tech) => sum + tech.completedRepairs, 0);
  const totalCost = mockTechnicianPerformance.reduce((sum, tech) => sum + tech.totalCost, 0);
  const avgRepairTime = mockTechnicianPerformance.reduce((sum, tech) => sum + tech.avgRepairTime, 0) / 
                        mockTechnicianPerformance.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Team Performance</h1>
        <p className="text-gray-600">Monitor maintenance technician productivity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total Repairs</div>
                <div className="text-3xl font-bold mt-1">{totalRepairs}</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Wrench className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Avg Repair Time</div>
                <div className="text-3xl font-bold mt-1">{avgRepairTime.toFixed(1)}h</div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total Cost</div>
                <div className="text-3xl font-bold mt-1">${(totalCost / 1000).toFixed(1)}k</div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Technician Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTechnicianPerformance.map((tech) => (
              <div key={tech.technicianId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {tech.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-lg">{tech.name}</div>
                      <div className="text-sm text-gray-600">Maintenance Technician</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Assigned Machines</div>
                    <div className="text-xl font-bold mt-1">{tech.assignedMachines}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Completed Repairs</div>
                    <div className="text-xl font-bold mt-1">{tech.completedRepairs}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Avg Repair Time</div>
                    <div className="text-xl font-bold mt-1">{tech.avgRepairTime}h</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Cost</div>
                    <div className="text-xl font-bold mt-1">${tech.totalCost.toLocaleString()}</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Efficiency Score</span>
                    <span className="font-medium text-green-600">
                      {((tech.completedRepairs / tech.avgRepairTime) * 10).toFixed(1)}/10
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${((tech.completedRepairs / tech.avgRepairTime) * 10) * 10}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Recent Activity</h4>
                  <div className="space-y-3">
                    {mockBreakdowns
                      .filter(b => b.technicianId === tech.technicianId)
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .map(breakdown => (
                        <div key={breakdown.id} className="flex justify-between items-start text-sm bg-gray-50 p-3 rounded-md">
                          <div>
                            <p className="font-medium text-gray-900">{breakdown.description}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              {breakdown.date.toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${breakdown.resolved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              {breakdown.resolved ? 'Resolved' : 'Ongoing'}
                            </span>
                          </div>
                        </div>
                      ))}
                    {mockBreakdowns.filter(b => b.technicianId === tech.technicianId).length === 0 && (
                      <p className="text-sm text-gray-500">No recent activity found.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
