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
    username: 'ana.costa',
    password: 'password',
    role: 'Maintenance Technician',
    name: 'Ana Costa'
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
    operationalStatus: 'in-repair',
    priority: 1,
    vibration: 85,
    pressure: 120,
    temperature: 95,
    lastMaintenance: new Date('2026-02-28'),
    assignedTechnicians: ['1']
  },
  {
    id: 'M002',
    name: 'Hydraulic Press B2',
    location: 'Building B - Floor 2',
    status: 'warning',
    operationalStatus: 'functional',
    priority: 2,
    vibration: 65,
    pressure: 95,
    temperature: 75,
    lastMaintenance: new Date('2026-03-01'),
    assignedTechnicians: ['1']
  },
  {
    id: 'M003',
    name: 'CNC Machine C3',
    location: 'Building C - Floor 3',
    status: 'operational',
    operationalStatus: 'functional',
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
    operationalStatus: 'stopped',
    priority: 1,
    vibration: 95,
    pressure: 140,
    temperature: 105,
    lastMaintenance: new Date('2026-02-15'),
    assignedTechnicians: ['1']
  },
  {
    id: 'M005',
    name: 'Cooling Tower E2',
    location: 'Building E - Floor 2',
    status: 'operational',
    operationalStatus: 'functional',
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
    operationalStatus: 'functional',
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
    title: 'Bearing failure in main rotor',
    description: "Detailed inspection and maintenance log: The technician isolated the impacted systems, performed a full diagnostic, and applied the necessary repairs to restore the machine strictly to its operational baseline.",
    repairTime: 4.5,
    cost: 3200,
    technicianId: '1',
    resolved: true
  },
  {
    id: 'B002',
    machineId: 'M001',
    date: new Date('2026-02-15'),
    title: 'Oil leak in pressure line',
    description: "Detailed inspection and maintenance log: The technician isolated the impacted systems, performed a full diagnostic, and applied the necessary repairs to restore the machine strictly to its operational baseline.",
    repairTime: 2.0,
    cost: 850,
    technicianId: '1',
    resolved: true
  },
  {
    id: 'B003',
    machineId: 'M001',
    date: new Date('2026-01-20'),
    title: 'Electrical fault in control panel',
    description: "Detailed inspection and maintenance log: The technician isolated the impacted systems, performed a full diagnostic, and applied the necessary repairs to restore the machine strictly to its operational baseline.",
    repairTime: 6.0,
    cost: 4500,
    technicianId: '1',
    resolved: true
  },
  {
    id: 'B004',
    machineId: 'M002',
    date: new Date('2026-03-01'),
    title: 'Hydraulic cylinder seal replacement',
    description: "Detailed inspection and maintenance log: The technician isolated the impacted systems, performed a full diagnostic, and applied the necessary repairs to restore the machine strictly to its operational baseline.",
    repairTime: 3.0,
    cost: 1200,
    technicianId: '1',
    resolved: true
  },
  {
    id: 'B005',
    machineId: 'M004',
    date: new Date('2026-03-05'),
    title: 'Motor overheating - Critical failure',
    description: "Detailed inspection and maintenance log: The technician isolated the impacted systems, performed a full diagnostic, and applied the necessary repairs to restore the machine strictly to its operational baseline.",
    repairTime: 0,
    cost: 0,
    technicianId: '1',
    resolved: false
  },
  {
    id: 'B006',
    machineId: 'M004',
    date: new Date('2026-02-15'),
    title: 'Belt tension adjustment',
    description: "Detailed inspection and maintenance log: The technician isolated the impacted systems, performed a full diagnostic, and applied the necessary repairs to restore the machine strictly to its operational baseline.",
    repairTime: 1.5,
    cost: 450,
    technicianId: '1',
    resolved: true
  },
  {
    id: 'B007',
    machineId: 'M004',
    date: new Date('2026-01-10'),
    title: 'Sensor calibration failure',
    description: "Detailed inspection and maintenance log: The technician isolated the impacted systems, performed a full diagnostic, and applied the necessary repairs to restore the machine strictly to its operational baseline.",
    repairTime: 2.5,
    cost: 600,
    technicianId: '1',
    resolved: true
  },
  {
    id: 'B008',
    machineId: 'M006',
    date: new Date('2026-02-25'),
    title: 'Vibration damper replacement',
    description: "Detailed inspection and maintenance log: The technician isolated the impacted systems, performed a full diagnostic, and applied the necessary repairs to restore the machine strictly to its operational baseline.",
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
  },
  {
    id: 'AR002',
    machineId: 'M001',
    machineName: 'Compressor Unit A1',
    location: 'Building A - Floor 1',
    reason: 'Unusual vibration patterns detected on the main shaft.',
    requestedBy: 'Ana Costa',
    timestamp: new Date('2026-03-16T08:15:00'),
    status: 'pending'
  },
  {
    id: 'AR003',
    machineId: 'M002',
    machineName: 'Hydraulic Press B2',
    location: 'Building B - Floor 2',
    reason: 'Hydraulic fluid pressure is fluctuating wildly during operation.',
    requestedBy: 'Robert Wilson',
    timestamp: new Date('2026-03-16T09:45:00'),
    status: 'pending',
    assignedTechnicians: ['3']
  },
  {
    id: 'AR004',
    machineId: 'M003',
    machineName: 'CNC Machine C3',
    location: 'Building C - Floor 3',
    reason: 'Tooling axis alignment error code 402 shown on screen.',
    requestedBy: 'Lisa Anderson',
    timestamp: new Date('2026-03-15T14:20:00'),
    status: 'pending',
    assignedTechnicians: ['1']
  },
  {
    id: 'AR005',
    machineId: 'M005',
    machineName: 'Cooling Tower E2',
    location: 'Building E - Floor 2',
    reason: 'Water flow rate has dropped by 15%. Possible pump issue.',
    requestedBy: 'John Smith',
    timestamp: new Date('2026-03-15T16:10:00'),
    status: 'resolved',
    assignedTechnicians: ['1']
  },
  {
    id: 'AR006',
    machineId: 'M006',
    machineName: 'Turbine F1',
    location: 'Building F - Floor 1',
    reason: 'Audible grinding noise during start-up sequence.',
    requestedBy: 'Michael Brown',
    timestamp: new Date('2026-03-14T11:05:00'),
    status: 'pending'
  },
  {
    id: 'AR007',
    machineId: 'M001',
    machineName: 'Compressor Unit A1',
    location: 'Building A - Floor 1',
    reason: 'Safety valve triggering prematurely at 110 psi.',
    requestedBy: 'David Lee',
    timestamp: new Date('2026-03-14T13:30:00'),
    status: 'pending',
    assignedTechnicians: ['5']
  },
  {
    id: 'AR008',
    machineId: 'M004',
    machineName: 'Conveyor System D1',
    location: 'Building D - Floor 1',
    reason: 'Belt tension system fails to hold setting over 24h period.',
    requestedBy: 'Sarah Connor',
    timestamp: new Date('2026-03-13T09:20:00'),
    status: 'resolved',
    assignedTechnicians: ['6']
  },
  {
    id: 'AR009',
    machineId: 'M002',
    machineName: 'Hydraulic Press B2',
    location: 'Building B - Floor 2',
    reason: 'Oil temperature exceeds 80C under normal load.',
    requestedBy: 'James Hold',
    timestamp: new Date('2026-03-12T15:45:00'),
    status: 'pending'
  },
  {
    id: 'AR010',
    machineId: 'M005',
    machineName: 'Cooling Tower E2',
    location: 'Building E - Floor 2',
    reason: 'Fan motor drawing excessive current during low-speed operation.',
    requestedBy: 'Elena Cruz',
    timestamp: new Date('2026-03-11T10:15:00'),
    status: 'pending',
    assignedTechnicians: ['3']
  },
  {
    id: 'AR011',
    machineId: 'M003',
    machineName: 'CNC Machine C3',
    location: 'Building C - Floor 3',
    reason: 'Coolant circulation pump failed.',
    requestedBy: 'Thomas Muller',
    timestamp: new Date('2026-03-10T14:30:00'),
    status: 'resolved',
    assignedTechnicians: ['1']
  },
  {
    id: 'AR012',
    machineId: 'M006',
    machineName: 'Turbine F1',
    location: 'Building F - Floor 1',
    reason: 'Sensor reading discrepancy on inlet temperature sensor.',
    requestedBy: 'Sophie Martin',
    timestamp: new Date('2026-03-10T08:00:00'),
    status: 'pending'
  },
  {
    id: 'AR013',
    machineId: 'M001',
    machineName: 'Compressor Unit A1',
    location: 'Building A - Floor 1',
    reason: 'Air leak detected near the primary manifold seal.',
    requestedBy: 'John Smith',
    timestamp: new Date('2026-03-09T11:20:00'),
    status: 'pending',
    assignedTechnicians: ['3']
  },
  {
    id: 'AR014',
    machineId: 'M004',
    machineName: 'Conveyor System D1',
    location: 'Building D - Floor 1',
    reason: 'Rollers on section 3 are seizing up intermittently.',
    requestedBy: 'Ana Costa',
    timestamp: new Date('2026-03-08T16:40:00'),
    status: 'pending'
  },
  {
    id: 'AR015',
    machineId: 'M002',
    machineName: 'Hydraulic Press B2',
    location: 'Building B - Floor 2',
    reason: 'Control interface unresponsive for brief periods (lag).',
    requestedBy: 'Lisa Anderson',
    timestamp: new Date('2026-03-08T09:10:00'),
    status: 'resolved',
    assignedTechnicians: ['5']
  },
  {
    id: 'AR016',
    machineId: 'M005',
    machineName: 'Cooling Tower E2',
    location: 'Building E - Floor 2',
    reason: 'Filter blockage alarm triggered despite recent cleaning.',
    requestedBy: 'Robert Wilson',
    timestamp: new Date('2026-03-07T13:25:00'),
    status: 'pending',
    assignedTechnicians: ['1']
  },
  {
    id: 'AR017',
    machineId: 'M003',
    machineName: 'CNC Machine C3',
    location: 'Building C - Floor 3',
    reason: 'Spindle motor producing high-frequency vibration during cuts.',
    requestedBy: 'John Smith',
    timestamp: new Date('2026-03-06T10:00:00'),
    status: 'pending'
  },
  {
    id: 'AR018',
    machineId: 'M006',
    machineName: 'Turbine F1',
    location: 'Building F - Floor 1',
    reason: 'Oil pressure warning light blinking intermittently.',
    requestedBy: 'Ana Costa',
    timestamp: new Date('2026-03-05T15:50:00'),
    status: 'resolved',
    assignedTechnicians: ['3']
  },
  {
    id: 'AR019',
    machineId: 'M001',
    machineName: 'Compressor Unit A1',
    location: 'Building A - Floor 1',
    reason: 'Condensate drain valve stuck closed.',
    requestedBy: 'Lisa Anderson',
    timestamp: new Date('2026-03-04T08:30:00'),
    status: 'pending'
  },
  {
    id: 'AR020',
    machineId: 'M004',
    machineName: 'Conveyor System D1',
    location: 'Building D - Floor 1',
    reason: 'Proximity sensor at loading station failing to detect smaller parts.',
    requestedBy: 'Robert Wilson',
    timestamp: new Date('2026-03-03T14:15:00'),
    status: 'pending',
    assignedTechnicians: ['3']
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
    technicianId: '3',
    name: 'Ana Costa',
    assignedMachines: 4,
    completedRepairs: 6,
    avgRepairTime: 1.5,
    totalCost: 5200
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