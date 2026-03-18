import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { 
  LayoutDashboard, 
  Wrench, 
  Users, 
  Settings,
  LogOut,
  Activity,
  Archive,
  HelpCircle,
  History,
  ClipboardList,
  TrendingUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  // Persona-specific navigation based on requirements
  const getMenuItems = () => {
    switch (user?.role) {
      case 'Maintenance Technician':
        // Technician: Machines, Requests, Current Maintenance, User
        return [
          { id: 'machines', label: 'Machines', icon: Wrench },
          { id: 'requests', label: 'Requests', icon: ClipboardList },
          { id: 'current-maintenance', label: 'Current Maintenance', icon: Activity }
        ];
      
      case 'Maintenance Director':
        // Director: Dashboard, Breakdown History, Machine Assignment, Requests
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'machines', label: 'Machines', icon: Wrench },
          { id: 'task-management', label: 'Machine Assignment', icon: Wrench },
          { id: 'requests', label: 'Requests', icon: ClipboardList },
          { id: 'team', label: 'Team Activity', icon: Users }
        ];
      
      case 'Administrator':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'managing', label: 'Machines', icon: Settings },
          { id: 'team', label: 'Team', icon: Users }
        ];
      
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex flex-col h-screen w-64 bg-gray-900 text-white">
      <div className="p-4 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <div className="font-bold text-lg">SmartSense</div>
          <div className="text-xs text-gray-400">Industrial Monitoring</div>
        </div>
      </div>
      
      <Separator className="bg-gray-700" />
      
      <div 
        className={cn(
          "p-4 mx-2 mt-2 mb-2 rounded-lg cursor-pointer transition-colors border border-transparent hover:bg-gray-800",
          activeTab === 'user' && "bg-gray-800 border-gray-700"
        )}
        onClick={() => onTabChange('user')}
      >
        <div className="text-xs text-gray-400 mb-1">Signed in as</div>
        <div className="text-sm font-medium">{user?.name}</div>
        <div className="text-xs text-gray-500">{user?.role}</div>
      </div>

      <Separator className="bg-gray-700" />

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};