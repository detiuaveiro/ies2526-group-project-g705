# User Stories

## User Story 1:
**As a** Maintenance Technician,  
**I want** to know if there is a machine with a breakdown,  
**so that** I can fix it.  
	
### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
**Given** the user is logged in the system  
**And** the user has the role of Maintenance Technician  
**When** they navigate to the 'Machines' tab  
**Then** a tab labeled 'Machines' should be visible.  


## User Story 2:
**As a** Maintenance Director,  
**I want** to know if there is a machine that has been having several breakdowns,  
**so that** I can investigate a more serious fault.

### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
**Given** the user is logged in the system  
**And** the user has the role of Maintenance Director  
**When** they navigate to the 'Machines' tab
**Then** a section labled 'History' should be visible, where information regarding the machine should be visible, such as title, description and previous breakdowns ordered by their date.


## User Story 3:
**As a** Maintenance Director,  
**I want** to choose the technicians that can help when there is a request sent by another technician,
**so that** The machine can be fixed quicker.

### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
**Given** the user is logged in the system  
**And** the user has the role of Maintenance Director  
**When** they navigate to the 'Requests' tab
**Then** a section labled 'Requests' should be visible, where information regarding the request, such as
1. description
2. name of the techician who asked for help
3. machineId
4. machine's name
**And** a button/dropdwon for the director assign people, for each request

## User Story 4:
**As an** Administrator,  
**I want** to monitor the technicians' performance,  
**so that** I can ensure the maintenance team is meeting productivity expectations.

### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
**Given** the user is logged into the system  
**And** the user has the role of "Administrator"  
**When** the user navigates to the main interface  
**Then** a tab labeled "Team" should be visible  

## User Story 5:
**As a** Maintenance Technician,  
**I want** to monitor early warning signs from the machines,  
**so that** I can perform preventive repairs before a total breakdown occurs.

### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
**Given** the user is logged into the system   
**And** the user has the role of "Maintenance Technician"  
**When** the user is viewing a machine’s Individual Dashboard  
**Then** a section labeled "Health Status" should be visible  
**And** the section should display:  
1. A vibration trend graph (time vs value)  
2. A pressure trend graph (time vs value)  
3. A temperature trend graph (time vs value)  
And each graph should clearly label the time axis and the value axis  


## User Story 6:
**As a** Maintenance Technician,  
**I want** to view each machine's priority level based on its importance, downtime, and fault severity,  
**so that** I can optimize my workflow and fix the most critical issues first.

### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
**Given** the user is logged into the system
**When** the user navigates to the machine overview or ranking section
**Then** the system should display a ranking of machines
**And** the ranking should determine the priority order of the machines


## User Story 7:
**As a** Maintenance Technician,  
**I want** to request assistance for a machine in the app when a repair requires additional help,  
**so that** my colleagues are immediately notified and can assist me.

### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
**Given** the Maintenance Technician has completed the assistance request form  
**When** the Technician submits the request  
**Then** the system should send a real-time notification to all users with the role "Maintenance Technician"  
**And** the system may also notify users with the role "Administrator"  
**And** the notification should include:  
1. The machine identifier
2. The location
3. The reason for assistance
4. The timestamp of the request


## User Story 8:
**As a** Administrator,  
**I want** to register new equipment/machines in the app,  
**so that** the maintenance team can start tracking its performance and history.

### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
**Given** the user is logged into the system  
**And** the user has the role of "Administrator"  
**When** the user navigates to the main interface  
**Then** a tab labeled "Managing" should be visible  

## User Story 9:
**As a** Administrator,  
**I want** to remove equipment/machines from the app,  
**so that** the views of every user remain updated.

### Description:
No details added (to be added as the project develops).

### Acceptance Criteria:
**Given** the user is logged in as a Administrator  
**And** the equipment exists in the system  
**When** the user clicks the “Delete” button for that equipment  
**And** confirms the deletion  
**Then** the equipment is removed from all user views immediately  
**And** a success message “Equipment deleted successfully” is displayed  
**And** the deletion is logged in the system audit trail  

## User Story 10:
**As a** Administrator,  
**I want** to access the history of removed machines,  
**so that** I can review past performance, costs, and maintenance records for several purposes.

### Description:
No details added (to be added as the project develops)

### Acceptance Criteria:
**Given** the user is logged into the system  
**And** the user has the role of "Administrator"  
**When** the user navigates to the main interface  
**Then** a section labeled "Archived" should be visible  
**And** this section should provide access to removed or deactivated machines  

