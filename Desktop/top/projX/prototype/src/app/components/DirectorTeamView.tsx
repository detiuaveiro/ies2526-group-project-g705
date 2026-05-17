import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { mockTechnicianPerformance, mockBreakdowns } from '../data/mockData';
import { Users, Wrench, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export const DirectorTeamView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalRepairs = mockTechnicianPerformance.reduce((sum, tech) => sum + tech.completedRepairs, 0);
  const avgRepairTime = mockTechnicianPerformance.reduce((sum, tech) => sum + tech.avgRepairTime, 0) /
                        mockTechnicianPerformance.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Team Activity</h1>
        <p className="text-gray-600">Overview of maintenance technician performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Technicians</div>
                <div className="text-3xl font-bold mt-1">{mockTechnicianPerformance.length}</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full"><Users className="w-6 h-6 text-blue-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total Repairs</div>
                <div className="text-3xl font-bold mt-1">{totalRepairs}</div>
              </div>
              <div className="p-3 bg-green-100 rounded-full"><Wrench className="w-6 h-6 text-green-600" /></div>
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
              <div className="p-3 bg-yellow-100 rounded-full"><Clock className="w-6 h-6 text-yellow-600" /></div>
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
            {mockTechnicianPerformance.map((tech) => {
              const isExpanded = expandedId === tech.technicianId;
              return (
                <div
                  key={tech.technicianId}
                  className="border rounded-lg overflow-hidden"
                >
                  {/* Clickable header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : tech.technicianId)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {tech.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-lg">{tech.name}</div>
                        <div className="text-sm text-gray-600">Maintenance Technician</div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>

                  {/* Always-visible metrics */}
                  <div className="px-4 pb-4 grid grid-cols-3 gap-4">
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
                  </div>

                  {/* Collapsible Recent Activity */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-3 border-t">
                      <h4 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Recent Activity</h4>
                      <div className="space-y-2">
                        {mockBreakdowns
                          .filter(b => b.technicianId === tech.technicianId)
                          .sort((a, b) => b.date.getTime() - a.date.getTime())
                          .map(bd => (
                            <div key={bd.id} className="flex justify-between items-start gap-4 text-sm bg-gray-50 p-3 rounded-md">
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 truncate">{bd.title}</p>
                                <p className="text-gray-500 text-xs mt-1">{bd.date.toLocaleDateString()}</p>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${bd.resolved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {bd.resolved ? 'Resolved' : 'Ongoing'}
                              </span>
                            </div>
                          ))}
                        {mockBreakdowns.filter(b => b.technicianId === tech.technicianId).length === 0 && (
                          <p className="text-sm text-gray-500">No recent activity found.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
