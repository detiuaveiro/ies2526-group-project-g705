## Scenario 1 — User Authentication
   ### Actors:
     User (Administrator, Maintenance Director, Maintenance Technician)
     
   ### Description:
     A user logs into the system to access functionalities based on their role.

   ### Steps:

     1. The user enters their username and password.
     2. The system verifies the credentials.
     3. The system identifies the user role.
     4. The system gives access to functionalities based on the role.

   ### Relationships:

   #### Inheritance:
          Administrator, Maintenance Director, and Maintenance Technician inherit from User

   #### Dependency: 
          Authentication system depends on the User credentials and rules
---
## Scenario 2 — Registering a Machine
   ### Actors:
     Administrator

   ### Description:
     The administrator registers a new machine in the system.

   ### Steps:

     1. The administrator accesses the machine management module.
     2. The administrator inputs machine details (ID, name, location, sensors).
     3. The system validates the information.
     4. The system stores the machine in the database.

   ### Relationships:

   #### Association:
          A Machine is associated with multiple Sensors.

   #### Dependency:
          The system depends on the Machine entity to store information.
---
## Scenario 3 — Sensor Information Collection
   ### Actors:
     System (Sensors)

   ### Description:
     The sensors collect information from the machines.

   ### Steps:

     1. The sensors measure vibration, pressure, and temperature.
     2. The information is sent to the system.
     3. The system stores the information in the database.
     4. The information becomes available for monitoring and analysis.

   ### Relationships:

   #### Association:
          A Machine is associated with multiple Sensors.

   #### Dependency:
          The Failure Manager depends on sensor data.
---
## Scenario 4 — Error Detection
   ### Actors:
     Error Manager (System)

   ### Description:
     The system analyzes sensor information to detect errors.

   ### Steps:
     1. The system analyzes the latest sensor information.
     2. The system detects strange patterns.
     3. The system gives an error.
     4. The error is stored in the system logs.
     5. The error is made visible to the Maintenance Director.

   ### Relationships:

   #### Dependency:
          Error Manager depends on Sensor data.

   #### Association:
          An error is associated with a Machine.
---
## Scenario 5 — Assigning Maintenance
   ### Actors:
     Maintenance Director

   ### Description:
     The Maintenance Director gives a maintenance task to a maintenance technician.

   ### Steps:

     1. The Maintenance Director reviews the error notification.
     2. The director selects a maintenance technician.
     3. The system creates a maintenance notification.
     4. The technician is notified.

   ### Relationships:

   #### Association:
          Maintenance is associated with a Machine and a Maintenance Technician.

   #### Inheritance:
          Normal Maintenance and Special Maintenance inherit from Maintenance.
---
## Scenario 6 — Maintenance Technician Sends a Request
   ### Actors:
     Maintenance Technician

   ### Description:
     A maintenance technician sends a request for additional help during the maintenance.

   ### Steps:

     1. The maintenance technician accesses the task.
     2. The maintenance technician creates a request asking for help and report additional information.
     3. The system stores the request.
     4. The maintenance director receives the request.

   ### Relationships:

   #### Association:
          The Request is associated with a Maintenance Technician.

   #### Dependency:
          The Maintenance Director depends on the request information.

## Scenario 7 — Monitoring Machines
   ### Actors:
     Maintenance Technician, Maintenance Director, Administrator

   ### Description:
     Users monitor the machines and their information.

   ### Steps:

     1. The user accesses the system interface.
     2. The system displays their health status.
     3. The system displays the sensors information:
        - Vibration
        - Pressure
        - Temperature
     4. The user analyzes the machine data.

   ### Relationships:

   #### Association:
          Machine is associated with Sensors.

   #### Dependency:
          Monitoring depends on sensor data.

## Scenario 8 — Removing a Machine
   ### Actors:
     Administrator

   ### Description:
     The administrator removes a machine from the system.

   ### Steps:

     1. The administrator selects a machine.
     2. The administrator clicks in the delete option.
     3. The system asks for confirmation.
     4. The administrator confirms the deletion.
     5. The system removes the machine.
     6. The system displays a success message.
     7. The action is logged in the system.

   ### Relationships:

   #### Dependency:
          The system depends on the Machine entity.

   #### Dependency:
          The system logs user actions.

## Scenario 9 — Viewing Archived Machines
   ### Actors:
     Administrator

   ### Description:
     The administrator accesses removed machines.

   ### Steps:

     1. The administrator navigates to the "Archived" section
     2. The system displays all the removed machines
     3. The administrator reviews the historical data and the reassons.

   ### Relationships:

   #### Association:
          Machine is associated with a historical data

   #### Dependency:
          The system depends on stored information