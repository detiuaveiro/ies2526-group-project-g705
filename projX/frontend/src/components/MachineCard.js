import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertTriangle, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { cn } from "../lib/utils";
const statusConfig = {
  operational: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
    label: "Operational"
  },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    label: "Warning"
  },
  critical: {
    icon: AlertCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    label: "Critical"
  },
  breakdown: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    label: "Breakdown"
  }
};
const MachineCard = ({ machine, onClick }) => {
  const config = statusConfig[machine.status];
  const Icon = config.icon;
  return <Card
    className="cursor-pointer hover:shadow-lg transition-shadow"
    onClick={onClick}
  >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{machine.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{machine.location}</p>
          </div>
          <div className={cn("p-2 rounded-full", config.bgColor)}>
            <Icon className={cn("w-5 h-5", config.color)} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <span className={cn("text-sm font-medium", config.color)}>
            {config.label}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Priority</span>
          <span className="text-sm font-medium">
            {machine.priority === 1 ? "High" : machine.priority <= 3 ? "Medium" : "Low"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <div className="text-center">
            <div className="text-xs text-gray-600">Vibration</div>
            <div className={cn(
    "text-sm font-medium",
    machine.vibration > 80 ? "text-red-600" : machine.vibration > 60 ? "text-yellow-600" : "text-green-600"
  )}>
              {machine.vibration}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600">Pressure</div>
            <div className={cn(
    "text-sm font-medium",
    machine.pressure > 110 ? "text-red-600" : machine.pressure > 90 ? "text-yellow-600" : "text-green-600"
  )}>
              {machine.pressure} PSI
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600">Temp</div>
            <div className={cn(
    "text-sm font-medium",
    machine.temperature > 90 ? "text-red-600" : machine.temperature > 70 ? "text-yellow-600" : "text-green-600"
  )}>
              {machine.temperature}°C
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export {
  MachineCard
};
