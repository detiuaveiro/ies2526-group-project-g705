export type UserRole = 'Maintenance Technician' | 'Maintenance Director' | 'Administrator';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
}

export type MachineStatus = 'operational' | 'warning' | 'critical' | 'breakdown';

export type OperationalStatus = 'functional' | 'in-repair' | 'stopped';

export interface Machine {
  id: string;
  name: string;
  location: string;
  status: MachineStatus;
  operationalStatus: OperationalStatus;
  priority: number;
  vibration: number;
  pressure: number;
  temperature: number;
  lastMaintenance: Date;
  assignedTechnicians?: string[];
}

export interface SensorReading {
  timestamp: Date;
  value: number;
}

export interface MachineSensorData {
  vibration: SensorReading[];
  pressure: SensorReading[];
  temperature: SensorReading[];
}

export interface Breakdown {
  id: string;
  machineId: string;
  date: Date;
  title: string;
  description: string;
  repairTime: number; // in hours
  cost: number;
  technicianId: string;
  resolved: boolean;
}

export interface AssistanceRequest {
  id: string;
  machineId: string;
  machineName: string;
  location: string;
  reason: string;
  requestedBy: string;
  timestamp: Date;
  status: 'pending' | 'in-progress' | 'resolved';
  assignedTechnicians?: string[]; // Array of Technician IDs
}

export interface TechnicianPerformance {
  technicianId: string;
  name: string;
  assignedMachines: number;
  completedRepairs: number;
  avgRepairTime: number;
  totalCost: number;
}
