import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { MachinesList } from "./components/MachinesList";
import { MachineDetail } from "./components/MachineDetail";
import { TeamView } from "./components/TeamView";
import { ManagingView } from "./components/ManagingView";
import { AssistanceRequestDialog } from "./components/AssistanceRequestDialog";
import { TaskManagement } from "./components/TaskManagement";
import { ProfitabilityView } from "./components/ProfitabilityView";
import { AssistanceRequestsView } from "./components/AssistanceRequestsView";
import { TechnicianRequestsView } from "./components/TechnicianRequestsView";
import { TechnicianProfileView } from "./components/TechnicianProfileView";
import { DirectorProfileView } from "./components/DirectorProfileView";
import { DirectorTeamView } from "./components/DirectorTeamView";
import { mockMachines } from "./data/mockData";
import { Toaster, toast } from "sonner";
const MainApp = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("machines");
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [assistanceDialogOpen, setAssistanceDialogOpen] = useState(false);
  const [activeMaintenanceId, setActiveMaintenanceId] = useState(null);
  const [appMachines, setAppMachines] = useState(mockMachines);
  if (!user) {
    return <Login />;
  }
  const handleMachineClick = (machine) => {
    setSelectedMachine(machine);
  };
  const handleBackToList = () => {
    setSelectedMachine(null);
  };
  const handleRequestAssistance = () => {
    setAssistanceDialogOpen(true);
  };
  const handleStartMaintenance = (machineId) => {
    setActiveMaintenanceId(machineId);
  };
  const handleEndMaintenance = (title, description) => {
    if (title && description) {
      toast.success("Maintenance completed", {
        description: `Logged: ${title}`
      });
    }
    setActiveMaintenanceId(null);
    setSelectedMachine(null);
    setActiveTab("machines");
  };
  const handleGoToMachine = (machineId) => {
    const machine = appMachines.find((m) => m.id === machineId);
    if (machine) {
      setSelectedMachine(machine);
      setActiveTab("machines");
    } else {
      toast.error("Machine not found");
    }
  };
  const handleAssignTechnician = (machineId, technicianIds) => {
    setAppMachines((prev) => prev.map((m) => m.id === machineId ? { ...m, assignedTechnicians: technicianIds } : m));
  };
  const renderContent = () => {
    if (user.role === "Maintenance Technician") {
      if (activeTab === "dashboard" || activeTab === "machines") {
        if (selectedMachine) {
          return <MachineDetail
            machine={selectedMachine}
            onBack={handleBackToList}
            onRequestAssistance={handleRequestAssistance}
            isMaintenanceActive={activeMaintenanceId === selectedMachine.id}
            canStartAnotherMaintenance={activeMaintenanceId === null}
            onStartMaintenance={() => handleStartMaintenance(selectedMachine.id)}
            onEndMaintenance={handleEndMaintenance}
          />;
        }
        return <MachinesList
          machines={appMachines.filter((m) => m.assignedTechnicians && m.assignedTechnicians.includes(user.id))}
          onMachineClick={handleMachineClick}
        />;
      }
      if (activeTab === "requests") {
        return <TechnicianRequestsView onGoToMachine={handleGoToMachine} />;
      }
      if (activeTab === "current-maintenance") {
        if (!activeMaintenanceId) {
          return <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-20">
              <h2 className="text-2xl font-bold mb-2">No Active Maintenance</h2>
              <p>You have not started maintenance on any machine yet.</p>
            </div>;
        }
        const activeMachine = appMachines.find((m) => m.id === activeMaintenanceId);
        if (activeMachine) {
          return <MachineDetail
            machine={activeMachine}
            onBack={() => setActiveTab("machines")}
            onRequestAssistance={handleRequestAssistance}
            isMaintenanceActive={true}
            canStartAnotherMaintenance={false}
            onStartMaintenance={() => handleStartMaintenance(activeMachine.id)}
            onEndMaintenance={handleEndMaintenance}
          />;
        }
      }
      if (activeTab === "user") {
        return <TechnicianProfileView />;
      }
    }
    if (activeTab === "task-management") {
      return <TaskManagement
        machines={appMachines}
        onAssignTechnician={handleAssignTechnician}
        onMachineClick={(machine) => {
          handleMachineClick(machine);
          setActiveTab("machines");
        }}
      />;
    }
    if (activeTab === "requests") {
      return <AssistanceRequestsView />;
    }
    if (activeTab === "profitability") {
      return <ProfitabilityView />;
    }
    if (user.role === "Maintenance Director") {
      if (activeTab === "team") {
        return <DirectorTeamView />;
      }
    }
    if (activeTab === "machines") {
      if (selectedMachine) {
        return <MachineDetail
          machine={selectedMachine}
          onBack={handleBackToList}
          onRequestAssistance={handleRequestAssistance}
          isMaintenanceActive={activeMaintenanceId === selectedMachine.id}
          canStartAnotherMaintenance={activeMaintenanceId === null}
          onStartMaintenance={() => handleStartMaintenance(selectedMachine.id)}
          onEndMaintenance={handleEndMaintenance}
        />;
      }
      return <MachinesList
        machines={appMachines}
        onMachineClick={handleMachineClick}
      />;
    }
    if (activeTab === "team") {
      return <TeamView />;
    }
    if (activeTab === "managing") {
      return <ManagingView />;
    }
    if (activeTab === "user") {
      return <DirectorProfileView />;
    }
    return <Dashboard />;
  };
  return <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
      
      {selectedMachine && <AssistanceRequestDialog
    machine={selectedMachine}
    open={assistanceDialogOpen}
    onOpenChange={setAssistanceDialogOpen}
  />}
      
      <Toaster />
    </div>;
};
const App = () => {
  return <AuthProvider>
      <MainApp />
    </AuthProvider>;
};
var stdin_default = App;
export {
  stdin_default as default
};
