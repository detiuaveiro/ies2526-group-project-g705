# How to run?

> [!IMPORTANT]
> **This document includes the commands you need to run in order to launch the application.**

---

## Run in detached mode (background)
```bash
docker compose up -d --build
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