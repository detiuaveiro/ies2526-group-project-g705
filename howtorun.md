# Build and start the container
docker compose up --build

# Run in detached mode (background)
docker compose up -d --build

# Stop the container
docker compose down

# Clean up the environment (remove containers, networks, images, and volumes)
docker compose down --volumes --rmi all

# Alternative: Full Docker cleanup (removes ALL Docker data, not just this project)
docker system prune -a --volumes -f

# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# After starting, open your browser and go to:
# http://localhost:8081
# or
# http://localhost:8081/hello

# Note: Container name is G705