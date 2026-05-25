# Software Architecture Notebook

## Architectural Pattern 
For the development of our application, we opted to follow one of the most common software architecture patterns: the `Layered Architecture Pattern`.

The `Layered Architecture Pattern` enables us to divide our application’s logic into distinct layers that address the main aspects of the system: presentation, backend, persistence, and integration.

We chose this pattern for its simplicity and flexibility, as it is widely used and allows for the separation of business logic from presentation logic, while abstracting database and messaging operations. It also aligns well with our project’s needs and requirements and our development team's size.


## Technology Decisions
The backend is developed using `Spring Boot`, the database is a relational `PostgreSQL` instance, and the frontend is built with `HTML`, `JavaScript`, `CSS`, and `React`.

Following the project guidelines provided by the professors, we containerize the application and its infrastructure with `Docker`. The current deployment is composed of separate containers for the backend, frontend, PostgreSQL database, RabbitMQ message broker, and the Python sensor generator.

By containerizing the database in `Docker`, we can spin up a temporary database for backend development. This allows us to:

- Test the backend without touching the real production database.
- Reset or recreate the database easily whenever needed.
- Share the development environment with the team in a consistent state.

The database and the application communicate through `JPA`, `Hibernate`, and `JDBC`.

The `Controller Layer` communicates with the `Presentation Layer` through `HTTP` requests exposed by the `REST API`.

The system also includes a messaging integration based on `RabbitMQ`, which is handled by a dedicated producer and consumer inside the backend.

The sensor publisher is implemented in Python and remains isolated inside its own container, while RabbitMQ is also kept inside its own container, matching the deployment defined in the YAML file.


## Presentation Layer
The `Presentation Layer` is organized into 3 sublayers, each exposed as a set of tabs in the web application.

### Technician Interface
- Profile
- Machines
- Requests
- Current Maintenance

### Director Interface
- Profile
- Dashboard
- Machines
- Machine Assignment
- Requests
- Team Activity

### Admin Interface
- Profile
- Dashboard
- Machines
- Team

These tabs define the user-facing navigation while keeping the underlying architecture unchanged.


## Backend Structure
The backend follows a layered organization with controllers, domain classes, DTOs, repositories, mappers, messaging components, and centralized exception handling.

### Controllers
The application exposes 10 controllers:

| Controller | Responsibility |
|---|---|
| `AuthController` | Handles authentication and registration endpoints. |
| `UserController` | Manages user profile and account operations. |
| `HomeController` | Serves the home and dashboard entry points. |
| `MachineController` | Manages machines, rankings, listings, and machine-related metrics. |
| `MaintenanceController` | Handles maintenance workflow operations. |
| `MaintenanceLogController` | Exposes maintenance log records and history. |
| `ProblemController` | Manages problem reporting and issue history. |
| `AssistanceRequestController` | Handles assistance request creation and management. |
| `TechnicianPerformanceController` | Exposes technician performance metrics. |
| `SensorController` | Manages sensor readings and sensor-related data. |

### Domain Model
The domain layer contains the business entities and enums used by the application:

| Area | Classes |
|---|---|
| User hierarchy | `User`, `Admin`, `Director`, `MaintenanceDirector`, `Technician`, `MaintenanceTechnician` |
| Machine model | `Machine` |
| Sensor hierarchy | `Sensor`, `PressureSensor`, `TemperatureSensor`, `VibrationSensor` |
| Reading hierarchy | `Reading`, `SensorReading`, `PressureReading`, `TemperatureReading`, `VibrationReading` |
| Maintenance model | `Maintenance`, `MaintenanceLog`, `MaintenanceSession` |
| Request and problem model | `AssistanceRequest`, `Request`, `Problem` |
| Enums | `MachineStatus`, `MaintenanceStatus`, `MaintenanceType`, `RequestStatus`, `SensorType`, `Gender`, `UserRole`, `AssistanceRequestStatus` |

### DTOs
The DTO layer keeps API payloads separated from the domain model:

| Area | DTOs |
|---|---|
| Machine data | `MachineDTO`, `MachineDashboardStatsDTO`, `MachineRankingDTO` |
| Maintenance data | `MaintenanceDTO`, `MaintenanceLogDTO`, `MaintenanceLogCreateDTO`, `MaintenanceSessionDTO`, `MaintenanceStatsDTO` |
| Assistance requests | `AssistanceRequestDTO`, `AssistanceRequestCreateDTO`, `AssistanceRequestCompleteDTO` |
| Sensor readings | `SensorReadingDTO` |
| Problems | `ProblemDTO`, `ProblemHistoryDTO` |
| Technicians | `TechnicianDTO`, `TechnicianPerformanceDTO` |
| Users and auth | `UserDTO`, `LoginRequest`, `LoginResponse` |
| Other payloads | `AssignRequest` |

### Repositories
The repository layer provides persistence access to the database:

| Repository | Responsibility |
|---|---|
| `MachineRepository` | Persists and queries machines. |
| `MaintenanceRepository` | Persists maintenance records. |
| `MaintenanceLogRepository` | Persists maintenance log entries. |
| `MaintenanceSessionRepository` | Persists maintenance sessions. |
| `UserRepository` | Persists base user data. |
| `AdminRepository` | Persists admin entities. |
| `DirectorRepository` | Persists director entities. |
| `MaintenanceDirectorRepository` | Persists maintenance director entities. |
| `TechnicianRepository` | Persists technician entities. |
| `MaintenanceTechnicianRepository` | Persists maintenance technician entities. |
| `SensorRepository` | Persists sensor entities. |
| `ReadingRepository` | Persists sensor reading entities. |
| `SensorReadingRepository` | Persists sensor-reading records. |
| `AssistanceRequestRepository` | Persists assistance requests. |
| `ProblemRepository` | Persists problems and fault records. |

### Mappers
The mapper layer converts domain objects into DTOs:

| Mapper | Responsibility |
|---|---|
| `MachineMapper` | Converts machine entities into machine DTOs. |
| `MaintenanceMapper` | Converts maintenance entities into maintenance DTOs. |
| `ProblemMapper` | Converts problem entities into problem DTOs. |
| `TechnicianMapper` | Converts technician entities into technician DTOs. |

### Messaging Layer
The messaging layer keeps RabbitMQ integration isolated from the rest of the application:

| Component | Responsibility |
|---|---|
| `RabbitProducer` | Publishes messages to RabbitMQ. |
| `RabbitConsumer` | Consumes sensor reading messages from RabbitMQ and stores them through the sensor service. |

### Exception Handling
The application uses a centralized exception handler:

| Component | Responsibility |
|---|---|
| `GlobalExceptionHandler` | Translates application exceptions into consistent HTTP responses. |


## Sensor Infrastructure
The sensor infrastructure is split between backend domain modeling and an external generator.

- The backend domain models sensors through inheritance, with `Sensor` as the base type and `PressureSensor`, `TemperatureSensor`, and `VibrationSensor` as specializations.
- Sensor measurements are modeled in a matching reading hierarchy, with `Reading` as the base type and `SensorReading`, `PressureReading`, `TemperatureReading`, and `VibrationReading` as concrete types.
- The backend exposes sensor data through `SensorController` and persists it with the sensor repositories.
- The Python sensor generator remains in its own container and publishes sensor messages to RabbitMQ.
- `RabbitConsumer` receives those messages and forwards them into the backend sensor storage flow.


## Deployment Diagram
The deployment diagram allows us to visualize the organization of the services and deployed containers defined in `docker-compose.yml`.

### 1. Backend Container
- **Build context:** `./projX`
- **Dockerfile:** `./projX/Dockerfile`
- **Port:** `8080:8080`
- **Main responsibilities:** Controllers, services, repositories, domain entities, DTOs, mappers, messaging, and exception handling
- **Environment Variables:**
  - `SPRING_PROFILES_ACTIVE=prod`
  - `SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/g705`
  - `SPRING_DATASOURCE_USERNAME=g705user`
  - `SPRING_DATASOURCE_PASSWORD=g705password`
  - `JWT_SECRET=...`
  - `SPRING_RABBITMQ_HOST=rabbitmq`
  - `SPRING_RABBITMQ_PORT=5672`
  - `SPRING_RABBITMQ_USERNAME=guest`
  - `SPRING_RABBITMQ_PASSWORD=guest`
- **Dependencies:** Waits for PostgreSQL and RabbitMQ to become healthy

### 2. PostgreSQL Container
- **Image:** `postgres:16-alpine`
- **Database:** `g705`
- **User / Password:** `g705user / g705password`
- **Port:** Internal database access through `5432`
- **Persistence:** Volume `postgres_data`

### 3. RabbitMQ Container
- **Image:** `rabbitmq:4-management`
- **Ports:** `5673:5672` and `15672:15672`
- **Role:** Message broker used by the backend producer/consumer and the Python sensor generator

### 4. Sensor Generator Container
- **Build context:** `./tools/sensor_publisher`
- **Role:** Python-based sensor publisher that sends readings to RabbitMQ
- **Dependencies:** Starts after the backend is healthy
- **Environment Variables:**
  - `API_URL=http://backend:8080/api/v1/machines`
  - `RABBITMQ_HOST=rabbitmq`
  - `PUBLISH_INTERVAL=30`

### 5. Frontend Container
- **Build context:** `./projX/frontend`
- **Dockerfile:** `./projX/frontend/Dockerfile`
- **Port:** `3000:3000`
- **Role:** Web client for the presentation layer tabs
- **Dependency:** Starts after the backend is healthy

### 6. Connections
- Users / Clients → Frontend: HTTP requests on port 3000
- Frontend → Backend: API requests on port 8080
- Backend → PostgreSQL: JDBC connection on port 5432
- Backend ↔ RabbitMQ: Producer and consumer messaging
- Sensor Generator → RabbitMQ: Publishes sensor readings

## Component Diagram

The `Spring Boot` application is split into a layered structure that keeps presentation, business logic, persistence, and integration concerns separated.

- The `Presentation Layer` provides the web application and is organized into the three tab groups described above: Technician Interface, Director Interface, and Admin Interface.
- The `Controller Layer` exposes the `REST API` endpoints used by the front end. In the current implementation, this layer is composed of `AuthController`, `UserController`, `HomeController`, `MachineController`, `MaintenanceController`, `MaintenanceLogController`, `ProblemController`, `AssistanceRequestController`, `TechnicianPerformanceController`, and `SensorController`.
- The `Service Layer` contains the business rules and coordinates operations across the rest of the backend.
- The `Repository Layer` provides database access for the domain model through Spring Data JPA.
- The `Domain Layer` contains the entities and enums that represent the system state.
- The `DTO Layer` isolates API payloads from the internal domain model.
- The `Messaging Layer` contains `RabbitProducer` and `RabbitConsumer`, which connect the backend to `RabbitMQ`.

The database built in `PostgreSQL` maps each class inside the `domain` folder into its own data table, under a common schema.
