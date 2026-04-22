# How to run?

> [!IMPORTANT]
> **This document includes the commands you need to run in order to launch the application.**

---

## Run in detached mode (background)
```bash
docker compose up -d --build
```

## Verify Data Generation
After running the command above, wait a few seconds for the system to boot and the sensor data to be generated. You can verify the data is in the system using these methods:

### 1. Check API Data (via Curl)
```bash
# Check latest temperature readings for the initialized machine (ID 1)
curl -X GET http://localhost:8080/api/v1/sensors/1/TEMPERATURE/latest
```

### 2. Check Redis Cache
```bash
# Connect to Redis and check if current values are being updated
docker exec -it G705-redis redis-cli get current_value:1:TEMPERATURE
```

### 3. Check Database
```bash
docker exec -it G705-db psql -U g705user -d g705 -c "SELECT * FROM sensor_readings ORDER BY recorded_at DESC LIMIT 10;"
```

## View database tables
```bash
docker exec -it G705-db psql -U g705user -d g705
``` 

From here you can do stuff like:
```bash
\dt
``` 

## Stop the container
```bash
docker compose down
```

### After starting, open your browser and go to:
### http://localhost:8080
### or
### http://localhost:8080/hello

### Note: Container name is G705-app