import { Wrench, AlertTriangle, CheckCircle, Archive } from "lucide-react";

const statusConfig = {
  ACTIVE: {
    label: "Active",
    color: "text-green-600",
    bg: "bg-green-100",
    icon: CheckCircle
  },
  MAINTENANCE: {
    label: "Maintenance",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    icon: Wrench
  },
  ASSISTANCE_REQUESTED: {
    label: "Assistance Requested",
    color: "text-orange-600",
    bg: "bg-orange-100",
    icon: AlertTriangle
  },
  ARCHIVED: {
    label: "Archived",
    color: "text-gray-600",
    bg: "bg-gray-200",
    icon: Archive
  }
};

export const MachineCard = ({ machine, onClick }) => {
  const config = statusConfig[machine.status] || statusConfig.ACTIVE;
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{machine.name}</h3>

        <span
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
        >
          <Icon className="w-4 h-4" />
          {config.label}
        </span>
      </div>

      <p className="text-sm text-gray-600">{machine.location}</p>
      <p className="text-xs text-gray-500 mt-1">ID: {machine.id}</p>
    </div>
  );
};
