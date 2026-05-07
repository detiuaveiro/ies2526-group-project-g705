# System Entities and Domain Structure

This document describes all entities, fields, and relationships for the Maintenance Management System.

---

## 1. User (Base Class)

All roles inherit from this base class.

| Field        | Type     |Description                    |
| ------------ | -------- |-------------------------------|
| id           | Long     | Unique identifier             |
| name         | String   | Full name                     |
| email        | String   | Login and notifications       |
| passwordHash | String   | Hashed password               |
| phoneNumber  | String   | Contact                       |
| age          | Int      | User Age                      |
| gender       | enum     | User Gender                   |
| role         | enum     | User Rule                     |
| isActive     | boolean  | User using system (afk)       |
| isOnline     | boolean  | User using system             |
| isPrivileged | boolean  | Admin-like privileges         |
| createdAt    | datetime | Account creation              |
| updatedAt    | datetime | Account updated               |
| lastLogin    | datetime | last login time               |


Subclasses:

* Technician
* Director
* Admin

---

## 2. Technician

Represents a maintenance technician with performance metrics.

| Field               | Type        | Description |
|---------------------|-------------|-------------|
| numberOfFaultsFixed | int         | Number of faults the technician has fixed |
| assistedCounter     | int         | Number of times the technician assisted another |
| wasAssistedCounter  | int         | Number of times the technician required help |
| averageRepairTime   | double      | Average repair time for tasks |
| tasksCompleted      | int         | Total completed tasks |
| tasksPending        | int         | Tasks still pending |
| isAvailable         | boolean     | Whether the technician is available |
| currentAssignment   | Machine     | Machine currently assigned |
| skillSet            | List<String>| Skills and specializations |

---


## 3. Maintenance Director

| Field         | Type        | Description |
|--------------|-------------|-------------|
| technicianIds| List<UUID>  | IDs of technicians managed |
| machineIds   | List<UUID>  | IDs of machines managed |

Inherits from `User`.

---

## 4. Machine

| Field           | Type        | Description |
|-----------------|-------------|-------------|
| id              | long        | Unique identifier |
| name            | String      | Machine name |
| location        | String      | Physical location |
| importanceLevel | int         | Importance for prioritization |
| status          | enum        | ACTIVE / INACTIVE / MAINTENANCE / BROKEN |
| downtimeSum     | Double      | Total downtime|
| suspicionFlag   | boolean     | Working Bad |
| createdAt       | datetime    | Registration timestamp |
| suspicionFlag   | boolean     | Indicates suspected malfunction |
| sensors         | List<Sensor>| Sensors associated with the machine |


Status values:

* ACTIVE
* ASSISTANCE_REQUESTED
* MAINTENANCE
* ARCHIVED

---

## 5. Maintenance

| Field           | Type                 | Description |
|-----------------|----------------------|-------------|
| id              | Long                 | Unique identifier |
| machine         | Machine              | Machine under maintenance |
| technician      | Technician           | Technician assigned |
| type            | enum                 | NORMAL / URGENT |
| status          | enum                 | PENDING / IN_PROGRESS / COMPLETED |
| notes           | String               | Optional notes |


Type:

* NORMAL
* SPECIAL

Status:

* PENDING
* IN_PROGRESS
* COMPLETED

---

## 6. Problem

| Field             | Type                 | Description |
|-------------------|----------------------|-------------|
| ID                | long                 | Unique identifier |
| machine           | Machine              | Machine where the problem occurred |
| description       | String               | Description of the issue |
| detectedAt        | datetime             | Time of detection problem |
| priority          | Double               | Calculated priority |
| resolved          | boolean              | Whether the problem is resolved |
| startProblemDate  | datetime             | When work on the problem started |
| solvedProblemDate | datetime             | When the problem was resolved |
| assignedTechnician| MaintenanceTechnician| Technician assigned |
| faultSeverity     | String               | Severity of the fault |


---

## 7. Assistance Request

Used for **technician-to-technician assistance**.

| Field               | Type        | Description |
|---------------------|-------------|-------------|
| id                  | Long        | Unique identifier |
| problem             | Problem     | Problem requiring assistance |
| requestedBy         | Technician  | Technician who requested help |
| reason              | String      | Reason for the request |
| status              | enum        | PENDING / ACCEPTED / COMPLETED |
| assignedTechnician  | Technician  | Technician assigned to assist |
| createdAt           | datetime    | Timestamp of request creation |

Status:

* PENDING
* ACCEPTED
* COMPLETED

---


## 8. Sensor & Readings

### Sensor (abstract)

| Field   | Type   | Description |
|---------|--------|-------------|
| id      | UUID   | Unique identifier |
| machine | Machine| Machine where the sensor is installed |
| readings| List<Reading> | Historical readings |

### Reading (abstract)

| Field     | Type        | Description |
|-----------|-------------|-------------|
| id        | UUID        | Unique identifier |
| timestamp | datetime    | When the reading was taken |
| sensor    | Sensor      | Sensor that produced the reading |

### Specialized Readings

| Type                | Extra Field | Description |
|---------------------|-------------|-------------|
| TemperatureReading  | temperature | Temperature in °C |
| PressureReading     | pressure    | Pressure in bar |
| VibrationReading    | pressure    | vibration |

### SensorReading

| Field       | Type        | Description |
|-------------|-------------|-------------|
| id          | Long        | Unique identifier |
| machine     | Machine     | Machine associated |
| sensorType  | enum        | TEMPERATURE / PRESSURE / VIBRATION |
| value       | Double      | Reading value |
| recordedAt  | datetime    | Timestamp |

---

## 9. Relationships

* User -> Technician / MaintenanceDirector / Admin (inheritance)
* Machine -> Problem (1-to-many)
* Machine -> Maintenance (1-to-many)
* Problem -> AssistanceRequest (1-to-many)
* Machine -> SensorReading (1-to-many)
* Technician -> AssistanceRequest (relations via requestedBy and assignedTechnician)
---