import { User, Machine, Breakdown, AssistanceRequest, MachineSensorData, TechnicianPerformance } from '../types';

// Mock users for different roles
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'joao.neves',
    password: 'password',
    role: 'Maintenance Technician',
    name: 'João Neves'
  },
  {
    id: '2',
    username: 'manuel.gomes',
    password: 'password',
    role: 'Maintenance Director',
    name: 'Manuel Gomes'
  },
  {
    id: '3',
    username: 'analyst1',
    password: 'password',
    role: 'Analyst',
    name: 'Carlos Silva'
  },
  {
    id: '4',
    username: 'sara.lopes',
    password: 'password',
    role: 'Administrator',
    name: 'Sara Lopes'
  }
];

// Generate sensor data for the last 24 hours
const generateSensorData = (baseValue: number, variance: number): { timestamp: Date; value: number }[] => {
  const data = [];
  const now = new Date();
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const value = baseValue + (Math.random() - 0.5) * variance;
    data.push({ timestamp, value });
  }
  return data;
};

export const mockMachines: Machine[] = [
  {
    id: 'M001',
    name: 'Compressor Unit A1',
    location: 'Building A - Floor 1',
    status: 'critical',
    priority: 1,
    vibration: 85,
    pressure: 120,
    temperature: 95,
    lastMaintenance: new Date('2026-02-28'),
    assignedTechnician: '1'
  },
  {
    id: 'M002',
    name: 'Hydraulic Press B2',
    location: 'Building B - Floor 2',
    status: 'warning',
    priority: 2,
    vibration: 65,
    pressure: 95,
    temperature: 75,
    lastMaintenance: new Date('2026-03-01'),
    assignedTechnician: '1'
  },
  {
    id: 'M003',
    name: 'CNC Machine C3',
    location: 'Building C - Floor 3',
    status: 'operational',
    priority: 5,
    vibration: 35,
    pressure: 70,
    temperature: 55,
    lastMaintenance: new Date('2026-03-03')
  },
  {
    id: 'M004',
    name: 'Conveyor System D1',
    location: 'Building D - Floor 1',
    status: 'breakdown',
    priority: 1,
    vibration: 95,
    pressure: 140,
    temperature: 105,
    lastMaintenance: new Date('2026-02-15'),
    assignedTechnician: '1'
  },
  {
    id: 'M005',
    name: 'Cooling Tower E2',
    location: 'Building E - Floor 2',
    status: 'operational',
    priority: 4,
    vibration: 40,
    pressure: 75,
    temperature: 60,
    lastMaintenance: new Date('2026-03-04')
  },
  {
    id: 'M006',
    name: 'Turbine F1',
    location: 'Building F - Floor 1',
    status: 'warning',
    priority: 3,
    vibration: 70,
    pressure: 100,
    temperature: 80,
    lastMaintenance: new Date('2026-02-25')
  }
];

export const mockSensorData: Record<string, MachineSensorData> = {
  M001: {
    vibration: generateSensorData(85, 20),
    pressure: generateSensorData(120, 30),
    temperature: generateSensorData(95, 15)
  },
  M002: {
    vibration: generateSensorData(65, 15),
    pressure: generateSensorData(95, 20),
    temperature: generateSensorData(75, 10)
  },
  M003: {
    vibration: generateSensorData(35, 8),
    pressure: generateSensorData(70, 10),
    temperature: generateSensorData(55, 8)
  },
  M004: {
    vibration: generateSensorData(95, 25),
    pressure: generateSensorData(140, 35),
    temperature: generateSensorData(105, 20)
  },
  M005: {
    vibration: generateSensorData(40, 10),
    pressure: generateSensorData(75, 12),
    temperature: generateSensorData(60, 8)
  },
  M006: {
    vibration: generateSensorData(70, 18),
    pressure: generateSensorData(100, 25),
    temperature: generateSensorData(80, 12)
  }
};

export const mockBreakdowns: Breakdown[] = [
  {
    id: 'B001',
    machineId: 'M001',
    date: new Date('2026-02-28'),
    description: 'Bearing failure in main rotor',
    repairTime: 4.5,
    cost: 3200,
    technicianId: '1',
    resolved: true
  },
  {
    id: 'B002',
    machineId: 'M001',
    date: new Date('2026-02-15'),
    description: 'Oil leak in pressure line',
    repairTime: 2.0,
    cost: 850,
    technicianId: '1',
    resolved: true
  },
  {
    id: 'B003',
    machineId: 'M001',
    date: new Date('2026-01-20'),
    description: 'Electrical fault in control panel',
    repairTime: 6.0,
    cost: 4500,
    technicianId: '1',
    resolved: true
  },
  {
    id: 'B004',
    machineId: 'M002',
    date: new Date('2026-03-01'),
    description: 'Hydraulic cylinder seal replacement',
    repairTime: 3.0,
    cost: 1200,
    technicianId: '1',
    resolved: true
  },
  {
    id: 'B005',
    machineId: 'M004',
    date: new Date('2026-03-05'),
    description: 'Motor overheating - Critical failure',
    repairTime: 0,
    cost: 0,
    technicianId: '1',
    resolved: false
  },
  {
    id: 'B006',
    machineId: 'M004',
    date: new Date('2026-02-15'),
    description: 'Belt tension adjustment',
    repairTime: 1.5,
    cost: 450,
    technicianId: '1',
    resolved: true
  },
  {
    id: 'B007',
    machineId: 'M004',
    date: new Date('2026-01-10'),
    description: 'Sensor calibration failure',
    repairTime: 2.5,
    cost: 600,
    technicianId: '1',
    resolved: true
  },
  {
    id: 'B008',
    machineId: 'M006',
    date: new Date('2026-02-25'),
    description: 'Vibration damper replacement',
    repairTime: 3.5,
    cost: 2100,
    technicianId: '1',
    resolved: true
  }
];

export const mockAssistanceRequests: AssistanceRequest[] = [
  {
    id: 'AR001',
    machineId: 'M004',
    machineName: 'Conveyor System D1',
    location: 'Building D - Floor 1',
    reason: 'Motor overheating beyond normal parameters. Need specialist assistance.',
    requestedBy: 'John Smith',
    timestamp: new Date('2026-03-05T10:30:00'),
    status: 'pending'
  }
];

export const mockTechnicianPerformance: TechnicianPerformance[] = [
  {
    technicianId: '1',
    name: 'John Smith',
    assignedMachines: 3,
    completedRepairs: 12,
    avgRepairTime: 3.2,
    totalCost: 15400
  },
  {
    technicianId: '5',
    name: 'Robert Wilson',
    assignedMachines: 2,
    completedRepairs: 8,
    avgRepairTime: 2.8,
    totalCost: 8900
  },
  {
    technicianId: '6',
    name: 'Lisa Anderson',
    assignedMachines: 1,
    completedRepairs: 15,
    avgRepairTime: 2.5,
    totalCost: 12300
  }
];