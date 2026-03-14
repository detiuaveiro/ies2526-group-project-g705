import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MachinesList } from './components/MachinesList';
import { MachineDetail } from './components/MachineDetail';
import { TeamView } from './components/TeamView';
import { ManagingView } from './components/ManagingView';
import { AssistanceRequestDialog } from './components/AssistanceRequestDialog';
import { BreakdownHistory } from './components/BreakdownHistory';
import { TaskManagement } from './components/TaskManagement';
import { ProfitabilityView } from './components/ProfitabilityView';
import { AssistanceRequestsView } from './components/AssistanceRequestsView';
import { TechnicianWorkList } from './components/TechnicianWorkList';
import { TechnicianRequestsView } from './components/TechnicianRequestsView';
import { TechnicianProfileView } from './components/TechnicianProfileView';
import { mockMachines } from './data/mockData';
import { Machine } from './types';
import { Toaster, toast } from 'sonner';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('machines');
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [assistanceDialogOpen, setAssistanceDialogOpen] = useState(false);
  const [activeMaintenanceId, setActiveMaintenanceId] = useState<string | null>(null);
  const [appMachines, setAppMachines] = useState<Machine[]>(mockMachines);

  if (!user) {
    return <Login />;
  }

  const handleMachineClick = (machine: Machine) => {
    setSelectedMachine(machine);
  };

  const handleBackToList = () => {
    setSelectedMachine(null);
  };

  const handleRequestAssistance = () => {
    setAssistanceDialogOpen(true);
  };

  const handleStartMaintenance = (machineId: string) => {
    setActiveMaintenanceId(machineId);
  };

  const handleEndMaintenance = (description?: string) => {
    if (description) {
      toast.success('Maintenance completed', {
        description: 'Work log has been saved.'
      });
    }
    setActiveMaintenanceId(null);
    setSelectedMachine(null);
    setActiveTab('machines');
  };

  const handleGoToMachine = (machineId: string) => {
    const machine = appMachines.find(m => m.id === machineId);
    if (machine) {
      setSelectedMachine(machine);
      setActiveTab('machines');
    } else {
      toast.error('Machine not found');
    }
  };

  const handleAssignTechnician = (machineId: string, technicianId: string) => {
    setAppMachines(prev => prev.map(m => m.id === machineId ? { ...m, assignedTechnician: technicianId } : m));
  };

  const renderContent = () => {
    // Dashboard específico para Técnico
    if (user.role === 'Maintenance Technician') {
      if (activeTab === 'dashboard' || activeTab === 'machines') {
        if (selectedMachine) {
          return (
            <MachineDetail
              machine={selectedMachine}
              onBack={handleBackToList}
              onRequestAssistance={handleRequestAssistance}
              isMaintenanceActive={activeMaintenanceId === selectedMachine.id}
              canStartAnotherMaintenance={activeMaintenanceId === null}
              onStartMaintenance={() => handleStartMaintenance(selectedMachine.id)}
              onEndMaintenance={handleEndMaintenance}
            />
          );
        }
        return (
          <MachinesList
            machines={appMachines.filter(m => m.assignedTechnician === user.id)}
            onMachineClick={handleMachineClick}
          />
        );
      }
      
      if (activeTab === 'requests') {
        return <TechnicianRequestsView onGoToMachine={handleGoToMachine} />;
      }
      
      if (activeTab === 'current-maintenance') {
        if (!activeMaintenanceId) {
          return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-20">
              <h2 className="text-2xl font-bold mb-2">No Active Maintenance</h2>
              <p>You have not started maintenance on any machine yet.</p>
            </div>
          );
        }
        
        const activeMachine = appMachines.find(m => m.id === activeMaintenanceId);
        if (activeMachine) {
          return (
            <MachineDetail
              machine={activeMachine}
              onBack={() => setActiveTab('machines')}
              onRequestAssistance={handleRequestAssistance}
              isMaintenanceActive={true}
              canStartAnotherMaintenance={false}
              onStartMaintenance={() => handleStartMaintenance(activeMachine.id)}
              onEndMaintenance={handleEndMaintenance}
            />
          );
        }
      }
      
      if (activeTab === 'user') {
        return <TechnicianProfileView />;
      }
    }

    // Navegação para Diretor
    if (activeTab === 'breakdown-history') {
      return <BreakdownHistory />;
    }

    if (activeTab === 'task-management') {
      return (
        <TaskManagement 
          machines={appMachines} 
          onAssignTechnician={handleAssignTechnician} 
          onMachineClick={handleMachineClick}
        />
      );
    }

    if (activeTab === 'requests') {
      return <AssistanceRequestsView />;
    }

    // Navegação para Admin/Analista
    if (activeTab === 'profitability') {
      return <ProfitabilityView />;
    }

    // Navegação comum
    if (activeTab === 'machines') {
      if (selectedMachine) {
        return (
          <MachineDetail
            machine={selectedMachine}
            onBack={handleBackToList}
            onRequestAssistance={handleRequestAssistance}
            isMaintenanceActive={activeMaintenanceId === selectedMachine.id}
            canStartAnotherMaintenance={activeMaintenanceId === null}
            onStartMaintenance={() => handleStartMaintenance(selectedMachine.id)}
            onEndMaintenance={handleEndMaintenance}
          />
        );
      }
      return (
        <MachinesList
          machines={appMachines}
          onMachineClick={handleMachineClick}
        />
      );
    }

    if (activeTab === 'team') {
      return <TeamView />;
    }

    if (activeTab === 'managing' || activeTab === 'archived') {
      return <ManagingView />;
    }

    return <Dashboard />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
      
      {selectedMachine && (
        <AssistanceRequestDialog
          machine={selectedMachine}
          open={assistanceDialogOpen}
          onOpenChange={setAssistanceDialogOpen}
        />
      )}
      
      <Toaster />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;