import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { mockMachines } from "../data/mockData";
import { AlertCircle, CheckCircle, AlertTriangle, XCircle, Play, Square, HelpCircle, Zap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AssistanceRequestDialog } from "./AssistanceRequestDialog";
import { toast } from "sonner";
const TechnicianWorkList = () => {
  const [maintenanceStatus, setMaintenanceStatus] = useState({});
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [assistanceDialogOpen, setAssistanceDialogOpen] = useState(false);
  const sortedMachines = [...mockMachines].sort((a, b) => {
    const statusPriority = {
      breakdown: 0,
      critical: 1,
      warning: 2,
      operational: 3
    };
    const statusDiff = statusPriority[a.status] - statusPriority[b.status];
    if (statusDiff !== 0) return statusDiff;
    return a.priority - b.priority;
  });
  const hazardMachines = mockMachines.filter(
    (m) => m.vibration > 80 || m.pressure > 110 || m.temperature > 90
  );
  const handleStartMaintenance = (machineId, machineName) => {
    setMaintenanceStatus((prev) => ({ ...prev, [machineId]: "in-progress" }));
    toast.success(`Manuten\xE7\xE3o iniciada para ${machineName}`);
  };
  const handleEndMaintenance = (machineId, machineName) => {
    setMaintenanceStatus((prev) => ({ ...prev, [machineId]: "idle" }));
    toast.success(`Manuten\xE7\xE3o conclu\xEDda para ${machineName}`);
  };
  const handleRequestHelp = (machine) => {
    setSelectedMachine(machine);
    setAssistanceDialogOpen(true);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "operational":
        return { bg: "bg-green-500", text: "text-green-700", border: "border-green-200", label: "Operacional" };
      case "warning":
        return { bg: "bg-yellow-500", text: "text-yellow-700", border: "border-yellow-200", label: "Aviso" };
      case "critical":
        return { bg: "bg-orange-500", text: "text-orange-700", border: "border-orange-200", label: "Cr\xEDtico" };
      case "breakdown":
        return { bg: "bg-red-500", text: "text-red-700", border: "border-red-200", label: "Avaria" };
      default:
        return { bg: "bg-gray-500", text: "text-gray-700", border: "border-gray-200", label: "Desconhecido" };
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-white" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-white" />;
      case "critical":
        return <AlertCircle className="w-5 h-5 text-white" />;
      case "breakdown":
        return <XCircle className="w-5 h-5 text-white" />;
      default:
        return null;
    }
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Lista de Trabalho</h1>
        <p className="text-gray-600">Máquinas organizadas por prioridade de manutenção</p>
      </div>

      {
    /* Alertas de Hazard */
  }
      {hazardMachines.length > 0 && <Alert variant="destructive" className="border-2 border-red-500 bg-red-50">
          <Zap className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">⚠️ Alerta de Perigo - Limites Ultrapassados</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-2">
              {hazardMachines.map((machine) => <div key={machine.id} className="bg-white border border-red-300 rounded p-3">
                  <div className="font-semibold text-red-900">{machine.name}</div>
                  <div className="text-sm text-red-800 mt-1">{machine.location}</div>
                  <div className="flex gap-4 mt-2 text-sm">
                    {machine.vibration > 80 && <span className="font-medium text-red-700">
                        ⚠️ Vibração: {machine.vibration} Hz (Limite: 80 Hz)
                      </span>}
                    {machine.pressure > 110 && <span className="font-medium text-red-700">
                        ⚠️ Pressão: {machine.pressure} bar (Limite: 110 bar)
                      </span>}
                    {machine.temperature > 90 && <span className="font-medium text-red-700">
                        ⚠️ Temperatura: {machine.temperature}°C (Limite: 90°C)
                      </span>}
                  </div>
                </div>)}
            </div>
          </AlertDescription>
        </Alert>}

      {
    /* Lista de Máquinas */
  }
      <Card>
        <CardHeader>
          <CardTitle>Máquinas - Ordenadas por Prioridade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedMachines.map((machine) => {
    const statusConfig = getStatusColor(machine.status);
    const isInMaintenance = maintenanceStatus[machine.id] === "in-progress";
    return <div
      key={machine.id}
      className={`border-2 ${statusConfig.border} rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow`}
    >
                  <div className="flex items-start justify-between gap-4">
                    {
      /* Info da Máquina */
    }
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="font-bold text-base px-3 py-1">
                          #{machine.priority}
                        </Badge>
                        <h3 className="text-lg font-semibold">{machine.name}</h3>
                        {isInMaintenance && <Badge className="bg-blue-600">Em Manutenção</Badge>}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        📍 {machine.location}
                      </div>

                      {
      /* Parâmetros */
    }
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-gray-600">Vibração: </span>
                          <span className={`font-semibold ${machine.vibration > 80 ? "text-red-600" : machine.vibration > 60 ? "text-yellow-600" : "text-green-600"}`}>
                            {machine.vibration} Hz
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Pressão: </span>
                          <span className={`font-semibold ${machine.pressure > 110 ? "text-red-600" : machine.pressure > 90 ? "text-yellow-600" : "text-green-600"}`}>
                            {machine.pressure} bar
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Temperatura: </span>
                          <span className={`font-semibold ${machine.temperature > 90 ? "text-red-600" : machine.temperature > 70 ? "text-yellow-600" : "text-green-600"}`}>
                            {machine.temperature}°C
                          </span>
                        </div>
                      </div>
                    </div>

                    {
      /* Status e Ações */
    }
                    <div className="flex flex-col items-end gap-3">
                      {
      /* Badge de Status */
    }
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bg}`}>
                        {getStatusIcon(machine.status)}
                        <span className="text-white font-medium">{statusConfig.label}</span>
                      </div>

                      {
      /* Botões de Ação */
    }
                      <div className="flex gap-2">
                        {!isInMaintenance ? <Button
      onClick={() => handleStartMaintenance(machine.id, machine.name)}
      className="bg-blue-600 hover:bg-blue-700"
    >
                            <Play className="w-4 h-4 mr-2" />
                            Start Maintenance
                          </Button> : <Button
      onClick={() => handleEndMaintenance(machine.id, machine.name)}
      className="bg-green-600 hover:bg-green-700"
    >
                            <Square className="w-4 h-4 mr-2" />
                            End Maintenance
                          </Button>}
                        
                        <Button
      variant="outline"
      onClick={() => handleRequestHelp(machine)}
      className="border-orange-500 text-orange-600 hover:bg-orange-50"
    >
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Request Help
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>;
  })}
          </div>
        </CardContent>
      </Card>

      {
    /* Dialog de Pedido de Assistência */
  }
      {selectedMachine && <AssistanceRequestDialog
    machine={selectedMachine}
    open={assistanceDialogOpen}
    onOpenChange={setAssistanceDialogOpen}
  />}
    </div>;
};
export {
  TechnicianWorkList
};
