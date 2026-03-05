# System Entities and Backend Structure

This document describes all entities, fields, and relationships for the Maintenance Management System.

---

## 1. User (Base Class)

All roles inherit from this base class.

| Field | Type | Description |
|-------|------|-------------|
| IdentificationPhotoUrl | string | Path to the user's picture|
| UserID | UUID / int | Unique identifier |
| Name | string | Full name |
| Age | int | Optional |
| Gender | enum | Male / Female / Other / Prefer not to say |
| Email | string | Login and notifications |
| PasswordHash | string | For authentication |
| PhoneNumber | string | Optional |
| CreatedAt | datetime | Account creation timestamp |
| UpdatedAt | datetime | Last update timestamp |
| IsActive | boolean | Active/inactive account |
| IsOnline | boolean | Is/Isn't using the app in that moment |
| IsPrivelaged | boolean | Is/in't an admin |
| lastLogin | Datetime | Last time the user logged in |



---

## 2. Maintenance Technician (inherits User)

| Field | Type | Description |
|-------|------|-------------|
| NumberOfFaultsFixed | int | Total faults fixed |
| AssistedCounter | int | Times helped other technicians |
| WasAssistedCounter | int | Times required help from another techinician |
| AverageRepairTime | float | Average repair time (hours/minutes) |
| TasksCompleted | int | Number of completed tasks |
| TasksPending | int | Number of pending tasks |
| IsAvailable | boolean | Currently available for assignments |
| CurrentAssignment | MachineID / nullable | Machine currently assigned |
| SkillSet | array of strings | Types of machines they specialize in |

---

## 5. Maintenance Director(inherits User)

| Field | Type | Description |
|-------|------|-------------|
| TechniciansIds | array of UserID | Ids of the Techinicias managed by the Director |
| MachinesIds | array of MachineID | Ids of the Machines managed by the Director |

> Admin inherits User and has all permissions by default.

---

## 5. Machine

| Field | Type | Description |
|-------|------|-------------|
| IdentificationPhotoUrl | string | Path to the machine's picture|
| MachineID | UUID / int | Unique identifier |
| Name | string | Machine name or identifier |
| Location | string | Physical location |
| ImportanceLevel | int | |
| LastDownDate | datetime | Time offline |
| Status | enum | Active / Assistance Requested / Maintenance / Archived |
| Sensors | object | Sensor readings: vibration, pressure, temperature |
| CreatedAt | datetime | Registration date |
| UpdatedAt | datetime | Last update |
| ArchivedAt | datetime / nullable | When machine was removed |
| DowntimeSum | float | Sum of all downtimes are are calculated |
| SuspicionFlag | boolean | Sensors suspect the machine might be broken |


---

## 6. Problem (Fault / Defeito)

| Field | Type | Description |
|-------|------|-------------|
| ProblemID | UUID | Unique ID |
| MachineID | UUID | Machine related to problem |
| Description | string | Short description of the issue |
| DetectedAt | datetime | Time the fault was detected |
| Priority | float | Fault priority |
| Resolved | boolean | Whether it’s fixed |
| SolvedProblemDate | datetime | Date when the problem was resolved |
| StartProblemDate | datetime | Date when the problem was issued |
| ResolutionTime |  | Time it was resolved |
| AssignedTechnician | UserID / nullable | Technician handling the problem |
| FaultSeverity | int / string | Numeric or short description |
| Maintenance | object | Maintenance associated with the problem |

---

## 7. Maintenance (Normal / Special)

| Field | Type | Description |
|-------|------|-------------|
| MaintenanceID | UUID | Unique ID |
| MachineID | UUID | Target machine |
| TechnicianID | UUID | Assigned technician |
| Type | enum | Normal / Special |
| Status | enum | Pending / In Progress / Completed |
| Notes | text | Optional notes |

---

## 8. Request (Pedido / Assistance)

| Field | Type | Description |
|-------|------|-------------|
| RequestID | UUID | Unique ID |
| ProblemID | UUID | Problem associated |
| RequestedBy | UserID | Technician requesting help |
| Reason | string | Reason for assistance |
| Status | enum | Pending / Accepted / Completed |
| AssignedTechnician | UserID / nullable | Technician giving assistance |
| CreatedAt | datetime | Request time |

---


## 10. Relationships Overview

- **User → Technician / Director / Analyst** (inheritance)  
- **Machine → Problem** (1-to-many)  
- **Problem → Maintenance** (1-to-many)  
- **Request → Problem** (many-to-1)  
---

