# User Stories


## User Story 1:
**As a** Maintenance Technician,  
**I want** to know if there is a machine with a breakdown,  
**so that** I can fix it.  
	
### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
1. The Maintenance Technician should have a 'Machines' tab
2. Every Machine must have some kind of easy status (with problems / without problems / etc...) visualizer, so that the Maintenance Technician can do a quick observation of the status of every machine.


## User Story 2:
**As a** Maintenance Director,  
**I want** to know if there is a machine that has been having several breakdowns,  
**so that** I can investigate a more serious fault.


### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
1. The Maintenance Director should have a 'Machines' tab
2. Every Machine must have an Individual Dashboard
3. In this Individual Dashboard every machine must have a 'history' section. There, the Maintenance Director can see every breakdown the machine had, with the date, title and description.


## User Story 3:
**As a** Manager,  
**I want** to monitor machine profitability and failure history,  
**so that** I can make informed decisions regarding its replacement.

### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
1. The Manager should have a 'Machines' tab
2. Every Machine must have an Individual Dashboard
3. In this Individual Dashboard every machine must have a 'history' section. There, the Manager can see every breakdown the machine had, with the time it took to fix it and the total cost of the repair.
4. In the Individual Dashboard, every machine must have the 'cost of operation by hour' and 'estimated production/function by hour'.


## User Story 4:
**As an** Administrator,  
**I want** to monitor the technicians' performance,  
**so that** I can ensure the maintenance team is meeting productivity expectations.

### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
1. The Administrator should have a 'Team' tab
2. In this 'Team' tab, there must be a list of every worker. This list should have filters, such as 'active', 'completed tasks high/low', etc...
3. Every Technician should have the number of completed tasks, pending available tasks and the average repair time.


## User Story 5:
**As a** Maintenance Technician,  
**I want** to monitor early warning signs from the machines,  
**so that** I can perform preventive repairs before a total breakdown occurs.

### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
1. Every Machine must have an Individual Dashboard
2. In this Individual Dashboard there must be a 'Health Status' section where the data of the sensors of vibration, pressure, and temperature inside of the machine is displayed in a trend graph (time vs value).
3. The system must send an alert in case one of the sensors shows an unusual value.
4. There should be an easy sign (like colours green/yellow/red) to represent the status of the machine.


## User Story 6:
**As a** Maintenance Technician,  
**I want** to view each machine's priority level based on its importance, downtime, and fault severity,  
**so that** I can optimize my workflow and fix the most critical issues first.

### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
1. The app should have a ranking system.
2. Every machine should have a predetermined "importance" level, a downtime counter (in days/hours/minutes) and fault severity (to be determined if it'll be a number in a scale or a short description).
3. Either the ranking system is an algorithm or the Maintenance Technician should do the ranking himself.


## User Story 7:
**As a** Maintenance Technician,  
**I want** to request assistance for a machine in the app when a repair requires additional help,  
**so that** my colleagues are immediately notified and can assist me.

### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
1. Every machine individual dashboard should have a "Request Assistance" button.
2. When selected, the app should open a quick form with "reason of assistance" and "location" (if it isn't part of the machine's data).
3. The system must send, in real time, a notification to the Maintenance Team (can be also sent to the Administrator).
4. The machine, in the 'Machines' tab, must have a visual icon (like a flag) and should be available to all the Maintenance Team.
5. The Status of the machine must change to "Assistance Requested" and inside the machine dashboard, there should be a "give assistance" button.
6. Before a Technician gives assistance, he must press the "give assistance" button. When clicked, the Status changes to the one before the request of assistance.


## User Story 8:
**As a** Manager/Administrator,  
**I want** to register new equipment/machines in the app,  
**so that** the maintenance team can start tracking its performance and history.

### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
1. The app must have a "Managing" tab
2. There must be a "Add new equipment" button, that when pressed should show a registration form.

## User Story 9:
**As a** Manager/Administrator,  
**I want** to remove equipment/machines from the app,  
**so that** the views of every user remain updated.

### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
1. The app must have a "Managing" tab
2. There must be a "Remove this equipment" button that ,when pressed, should show a confirmation message and a forms (with the reason of the removal, etc).
3. The removed equipment won’t be eliminated from the database, just moved to a different table (?, or another ).

## User Story 10:
**As a** Manager/Administrator,  
**I want** to access the history of removed machines,  
**so that** I can review past performance, costs, and maintenance records for several purposes.

### Description:
No details added (to be added as the project develops)

### Acceptance Criteria:
1. There should be an “Archived” section.
2. The ‘history’ of a removed machine must be read only and can’t be edited.



