# How to run?

> [!IMPORTANT]
> **This document includes the commands you need to run in order to launch the application.**

---

## Run all services (Backend, Frontend, and Database)
```bash
docker compose up -d --build
```

## Run only the Backend (and Database)
```bash
docker compose up -d --build backend
```

## Run only the Frontend
```bash
docker compose up -d --build frontend
```

---

## Access the Application

### Frontend Link
- **Main Website**: http://localhost:3000

### Backend Links
- **Base API**: http://localhost:8080
- **Swagger Documentation**: http://localhost:8080/swagger-ui/index.html

---

## Useful Database Commands

If you need to verify the data in the system, you can use these methods:

### 1. Check API Data (via Curl)
```bash
# Check latest temperature readings for the initialized machine (ID 1)
curl -X GET http://localhost:8080/api/v1/sensors/1/TEMPERATURE/latest
```

### 2. Check Database directly
```bash
docker exec -it G705-db psql -U g705user -d g705 -c "SELECT * FROM users;"
```
---

## Stop the containers
```bash
docker compose down
```