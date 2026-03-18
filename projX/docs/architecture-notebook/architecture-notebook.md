# Software Architecture Notebook

## Architectural Pattern 
For the development of our application, we opted to follow one of the most common software architecture patterns: the `Layered Architecture Pattern`.

The `Layered Architecture Pattern` enables us to divide our application’s logic into three layers that address the main aspects of the system: database, backend, and frontend.

We chose this pattern for its simplicity and flexibility, as it is widely used and allows for the separation of business logic from presentation logic, while abstracting database operations. It also aligns well with our project’s needs and requirements and our development team's size.


## Technology Decisions
The backend will be developed using `Spring Boot`, the database is a relational `PostgreSQL` instance, and the frontend will be built with `HTML`, `JavaScript`, and `CSS`.

Following the project guidelines provided by the professors, we chose to containerize both our application and the database into two separate `Docker` containers. These containers communicate with each other through a dedicated `Docker` network.

By containerizing the database in `Docker`, you can spin up a temporary (“disposable”) database for backend development. This allows you to:

- Test your backend without touching the real production database.
- Reset or recreate the database easily whenever you want.
- Share the development environment with your team in a consistent state.

The database and the application will include `JPA / Hibernate / JDBC` as the communication method.

The `Controller Layer` will communicate with the `Presentation Layer` through `HTTP Protocol Requests`, passed through the `Rest API`.


## Deployment Diagram
The deployment diagram allows us to visualize the organization of the servers and deployed containers.

### 1. Spring Boot Application Container (`G705-app`)
- **Artifact:** Built from `./projX/Dockerfile` → `myapp.jar`
- **Port:** 8080 (HTTP)
- **Layers inside container:**
  - **Controller:** Handles HTTP requests
  - **Service:** Business logic
  - **Repository:** Data access
  - **Domain:** Entities / models
- **Environment Variables:**
  - `SPRING_PROFILES_ACTIVE=prod`
  - `SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/g705`
  - `SPRING_DATASOURCE_USERNAME=g705user`
  - `SPRING_DATASOURCE_PASSWORD=g705password`
- **Dependency:** Starts after `G705-db` container

### 2. PostgreSQL Container (`G705-db`)
- **Image:** `postgres:16-alpine`
- **Database:** `g705`
- **User / Password:** `g705user / g705password`
- **Port:** 5432 (internal)
- **Persistence:** Volume `postgres_data`

### 3. Connections
- `G705-app` → `G705-db`: JDBC connection (port 5432)
- Users / Clients → `G705-app`: HTTP requests (port 8080)

## Component Diagram

The `SpringBoot Application` is split up into a series of layers.

- The `Domain Layer` contains information about the different entities that populate the system.
It stores nuclear information regarding these entities such as their fields/attributes, behaviours and relationships with eachother, such as inheritance or composition.

- The `Repository Layer` is responsible for providing an interface capable of communicating with the database, directly from a `JAVA` environment.

- The `Service Layer` houses most of the application's business logic.

- The `Controller Layer` will be responsible for containing the `Rest API` endpoints which interact with an external `Presentation Layer` through `HTTP Requests`.
  - After establishing the `Domain` structure, we've decided that the endpoint distribution should consist in 7 different controllers:

  |Controller| Role|
  |---|---|
  |`AuthController`| Handles authentication and security|
  |`UserController`| Manages user accounts and role-based user operations.|
  |`Machine Controller`|Manages machines and their operational status.|
  |`ProblemController`|Manages machine faults and technician assignments.|
  |`MaintenanceController`|Manages maintenance tasks and their progress.|
  |`RequestController`|Manages technician assistance requests and collaboration.|
  |`SensorController`|Manages sensor-points related data, holding values such as count(),min(),max(),median(),variance() etc. Holds values for the different types of sensors: temperature,pressure and vibration.
  

- The `Presentation Layer` will provide a `GUI`, resulting in a `Web Application`, which is then provided to the client for them to use.


The database built in `PostgrSQL` maps each class inside of the `domain` folder into it's own data table, under a common schema.
