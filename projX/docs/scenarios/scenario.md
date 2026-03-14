### Scenario 1 — User Authentication

   ### Actors:
        User (Administrator, Maintenance Director, Maintenance Technician)

   ### Description:
        A user makes the login in the system to access the platform according to their role.

   ### Steps:

        1- The user use their username and password.
        2- The system verifies the credentials.
        3- The system identifies the user role.
        4- The system give the access to the functionalities allowed for that role.

   ### Relationships involved: 

   ###### Inheritance:
            Administrator, Maintenance Director and Maintenance Technician inherit from the User class.

   ###### Dependency:
            The authentication system depends on the User entity to validate credentials.

### Scenario 2 — Registering a Machine

   ### Actors: 
        Administrator

   ### Description:
        The administrator registers a new machine in the system.

   ### Steps:

        1- The administrator accesses the machine management module.
        2- The administrator writes the machine details (ID, name, location, sensors).
        3- The system validates the information.
        4- The machine information is stored in the system database.

   ### Relationships involved:

   ###### Association:
            A Machine is associated with multiple Sensors.

   ###### Dependency:
            The system depends on the Machine entity to store operational information.

### Scenario 3 — Sensor Information Collection

   ### Actors: 
        System (Sensors)

   ### Description:
        Sensors collect information from machines.

   ### Steps:

        1- The sensors measure vibration, pressure, and temperature.
        2- The information is sent to the system.
        3- The system stores the information in the database.
        4- The information becomes available for monitoring and analysis.

### Relationships involved:

   ###### Association:
            A Machine is associated with multiple sensors.

   ###### Dependency:
            The Failure Manager depends on sensor data to detect anomalies.

### Scenario 4 — Error Detection

   ### Actors: 
        Error Manager (System)

   ### Description:
        The system analyzes sensor information to detect errors from the sensors.

   ### Steps:

        1- The system analyzes recent sensor information.
        2- The Failure Manager detects anormal patterns.
        3- The system generates an error.
        4- The error is stored in the system logs and made visible to the Maintenance Director.

   ### Relationships involved:

   ######  Dependency:
            Error Manager depends on Sensor.

   ###### Association:
            An error is associated with a specific Machine.

### Scenario 5 — Assigning Maintenance

   ### Actors: 
        Maintenance Director

   ### Description:
        The Maintenance Director gives a maintenance task to a maintenance technician.

   ### Steps:

        1- The Maintenance Director reviews the issue report.
        2- The director selects a technician.
        3- The system creates a maintenance record.
        4- The technician is notified about the assigned task.

   ### Relationships involved:

   ######  Association:
            Maintenance is associated with the Machine(system) and a Maintenance Technician.

   ######  Inheritance:
            Normal Maintenance and Special Maintenances inherit from Maintenance.

### Scenario 6 — Maintenance Technician Sends a Request

   ### Actors: 
        Maintenance Technician

   ### Description:
        A technician sends a request for additional resources during maintenance.

   ### Steps:

        1- The Maintenance Technician accesses the maintenance task.
        2- The Maintenance Technician creates a request describing the needed resources.
        3- The system stores the request.
        4- The Maintenance Director receives the request.

   ### Relationships involved:

   ######  Association:
        The request is associated with a Maintenance Technician.

   ######  Dependency:
        The Maintenance Director needs the request information to make a decision.