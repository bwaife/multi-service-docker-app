# Docker Multi-Service Application

A project designed to practice advanced Docker concepts through real-world simulation of a production-grade, multi-container application stack.


## Technology Stack

- Nginx
- Nodejs(API Service)
- MongoDB(Database)
- Redis(Cache)
- Docker
- React


## Prerequisites

Docker>= 24.x
Docker compose>= 2.x


## Clone the Repository 

```bash
git clone https://github.com/xxx/multi-service-docker-app.git
```

## Set up Secrets

```bash
mkdir -p secrets

echo "your_mongo_root_password" > secrets/mongo_root_password.txt
echo "your_mongo_app_password"  > secrets/mongo_app_password.txt
echo "your_redis_password"      > secrets/redis_password.txt
echo "your_jwt_secret"          > secrets/jwt_secret.txt
```

## Build and Start the stack 

```bash
# Build all images and start all services
docker compose up --build

# Run in detached mode
docker compose up --build -d

```

## Verify Services are running

```bash
docker compose ps 

```
All containers are healthy 

## Test the application

```bash
# Perform a healthcheck 

http://localhost:8080/health

# Retrieve the items saved in the database 

http://localhost:8080/api/items 

```

