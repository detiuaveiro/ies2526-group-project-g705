import { useState, useEffect } from "react";
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

import CurrentMaintenance from "./components/CurrentMaintenance";
import YourMaintenanceStatistics from "./components/YourMaintenanceStatistics";

import { Toaster, toast } from "sonner";

const API_URL = "http://localhost:8080/api/v1";

const MainApp = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState(
    () => (user?.role === "DIRECTOR" || user?.role === "ADMIN" ? "dashboard" : "machines")
  );
  const [selectedMachine, setSelectedMachine] = useState(null);

  const [selectedMachineForAssistance, setSelectedMachineForAssistance] = useState(null);
  const [assistanceDialogOpen, setAssistanceDialogOpen] = useState(false);

  const [appMachines, setAppMachines] = useState([]);

  useEffect(() => {
    if (!user?.token) return;

    const endpoint =
      user.role === "TECHNICIAN"
        ? `${API_URL}/machines/assigned/${user.id}`
        : `${API_URL}/machines`;

    fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAppMachines(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load machines"));
  }, [user]);

  if (!user) return <Login />;

  const handleMachineClick = (machine) => setSelectedMachine(machine);
  const handleBackToList = () => setSelectedMachine(null);

  const handleRequestAssistance = (machine) => {
    setSelectedMachineForAssistance(machine);
    setAssistanceDialogOpen(true);
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

  const reloadMachines = () => {
    if (!user?.token) return;
    const endpoint =
      user.role === "TECHNICIAN"
        ? `${API_URL}/machines/assigned/${user.id}`
        : `${API_URL}/machines`;
    fetch(endpoint, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setAppMachines(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to reload machines"));
  };

  const handleAssignTechnician = () => {
    reloadMachines();
  };

  const renderContent = () => {
    // TECHNICIAN
    if (user.role === "TECHNICIAN") {
      if (activeTab === "dashboard" || activeTab === "machines") {
        if (selectedMachine) {
          return (
            <MachineDetail
              machineId={selectedMachine.id}
              onBack={handleBackToList}
              onRequestAssistance={handleRequestAssistance}
            />
          );
        }

        return (
          <MachinesList
            machines={appMachines.filter(
              (m) =>
                m.assignedTechnicians &&
                m.assignedTechnicians.some((t) => t.id === user.id)
            )}
            onMachineClick={handleMachineClick}
          />
        );
      }

      if (activeTab === "requests") {
        return <TechnicianRequestsView onGoToMachine={handleGoToMachine} />;
      }

      if (activeTab === "current-maintenance") {
        return <CurrentMaintenance user={user} />;
      }

      if (activeTab === "stats") {
        return <YourMaintenanceStatistics user={user} />;
      }

      if (activeTab === "user") {
        return <TechnicianProfileView />;
      }
    }

    // DIRECTOR / ADMIN

    if (activeTab === "task-management") {
      return (
        <TaskManagement
          machines={appMachines}
          onAssignTechnician={handleAssignTechnician}
          onMachineClick={(machine) => {
            handleMachineClick(machine);
            setActiveTab("machines");
          }}
        />
      );
    }

    if (activeTab === "requests") return <AssistanceRequestsView />;
    if (activeTab === "profitability") return <ProfitabilityView />;

    if (user.role === "DIRECTOR" && activeTab === "team") {
      return <DirectorTeamView />;
    }

    if (activeTab === "machines") {
      if (selectedMachine) {
        return (
          <MachineDetail
            machineId={selectedMachine.id}
            onBack={handleBackToList}
            onRequestAssistance={handleRequestAssistance}
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

    if (activeTab === "team") return <TeamView />;
    if (activeTab === "managing") return <ManagingView />;

    if (activeTab === "user") {
      return user.role === "TECHNICIAN" ? (
        <TechnicianProfileView />
      ) : (
        <DirectorProfileView />
      );
    }

    return <Dashboard />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-auto">
        <div className="p-8">{renderContent()}</div>
      </main>

      {selectedMachineForAssistance && (
        <AssistanceRequestDialog
          machine={selectedMachineForAssistance}
          open={assistanceDialogOpen}
          onOpenChange={setAssistanceDialogOpen}
        />
      )}

      <Toaster />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <MainApp />
  </AuthProvider>
);

export default App;
