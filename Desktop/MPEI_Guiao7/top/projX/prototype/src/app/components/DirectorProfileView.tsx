import React from 'react';
import { Card, CardContent } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { mockMachines, mockUsers } from '../data/mockData';
import { Users, Target, Activity, CheckCircle, User as UserIcon } from 'lucide-react';

export const DirectorProfileView: React.FC = () => {
  const { user } = useAuth();
  
  // Computations
  const totalTechnicians = mockUsers.filter(u => u.role === 'Maintenance Technician').length;
  const totalMachines = mockMachines.length;
  const operationalMachines = mockMachines.filter(m => m.status === 'operational').length;
  const brokenMachines = mockMachines.filter(m => m.status === 'critical' || m.status === 'breakdown').length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Director Profile</h1>
        <p className="text-gray-600">View your account details and high-level factory metrics</p>
      </div>

      <Card className="border-t-4 border-t-purple-600">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="bg-purple-100 p-6 rounded-full">
              <UserIcon className="w-16 h-16 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <div className="text-purple-600 font-medium">{user?.role}</div>
              <div className="text-gray-500 text-sm mt-1">Username: {user?.username}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-xl font-bold mt-8 mb-4">Operations Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Technicians</p>
                <h3 className="text-3xl font-bold mt-2">{totalTechnicians}</h3>
              </div>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Machines</p>
                <h3 className="text-3xl font-bold mt-2">{totalMachines}</h3>
              </div>
              <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                <Target className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Operational</p>
                <h3 className="text-3xl font-bold mt-2 text-green-600">{operationalMachines}</h3>
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
                <p className="text-sm font-medium text-gray-600">Action Required</p>
                <h3 className="text-3xl font-bold mt-2 text-red-600">{brokenMachines}</h3>
              </div>
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
