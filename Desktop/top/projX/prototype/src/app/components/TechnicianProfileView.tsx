import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { mockTechnicianPerformance } from '../data/mockData';
import { Wrench, CheckCircle, Clock, DollarSign, User as UserIcon } from 'lucide-react';

export const TechnicianProfileView: React.FC = () => {
  const { user } = useAuth();
  // Find performance stats for the current user
  const stats = mockTechnicianPerformance.find(p => p.technicianId === user?.id) || {
    assignedMachines: 0,
    completedRepairs: 0,
    avgRepairTime: 0,
    totalCost: 0
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Profile</h1>
        <p className="text-gray-600">View your account details and performance metrics</p>
      </div>

      <Card className="border-t-4 border-t-blue-600">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="bg-gray-100 p-6 rounded-full">
              <UserIcon className="w-16 h-16 text-gray-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <div className="text-blue-600 font-medium">{user?.role}</div>
              <div className="text-gray-500 text-sm mt-1">Username: {user?.username}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-xl font-bold mt-8 mb-4">Your Maintenance Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned Machines</p>
                <h3 className="text-3xl font-bold mt-2">{stats.assignedMachines}</h3>
              </div>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Wrench className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Repairs</p>
                <h3 className="text-3xl font-bold mt-2">{stats.completedRepairs}</h3>
              </div>
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Repair Time</p>
                <div className="flex items-baseline gap-1 mt-2">
                  <h3 className="text-3xl font-bold">{stats.avgRepairTime}</h3>
                  <span className="text-sm text-gray-500">hours</span>
                </div>
              </div>
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
