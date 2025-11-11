# Docker Deployment Guide

This guide explains how to run the entire FarmTwin stack using Docker and Docker Compose.

## Quick Start

Run the entire application with a single command:

```bash
docker-compose up --build
```

That's it! The command will:
1. Build all Docker images (backend, frontend, simulator)
2. Start Redis
3. Start the backend server
4. Start the frontend
5. Start the sensor simulator

Access the application at: **http://localhost**

## Services

The docker-compose setup includes:

| Service | Port | Description |
|---------|------|-------------|
| **frontend** | 80 | React dashboard (nginx) |
| **backend** | 3000 | Node.js API + WebSocket server |
| **redis** | 6379 | Redis cache & pub/sub |
| **simulator** | - | Python sensor data generator |

## Docker Commands

### Start all services
```bash
docker-compose up --build
```

### Start in detached mode (background)
```bash
docker-compose up -d --build
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f simulator
```

### Stop all services
```bash
docker-compose down
```

### Stop and remove volumes
```bash
docker-compose down -v
```

### Restart a specific service
```bash
docker-compose restart backend
```

### Rebuild a specific service
```bash
docker-compose up -d --build backend
```

### View running containers
```bash
docker-compose ps
```

### Execute commands in a container
```bash
# Backend shell
docker-compose exec backend sh

# Check Redis
docker-compose exec redis redis-cli ping

# View backend logs
docker-compose exec backend cat /app/logs/app.log
```

## Architecture

### Service Dependencies

```
redis (starts first)
  ↓
backend (waits for redis)
  ↓
frontend (waits for backend health check)

simulator (starts after redis)
```

### Health Checks

The backend includes a health check that:
- Tests the `/health` endpoint every 30 seconds
- Allows 40 seconds for initial startup
- Frontend waits for backend to be healthy before starting

### Networking

All services communicate through a Docker bridge network named `farmtwin-network`:
- Services can reference each other by service name
- Backend connects to Redis at `redis://redis:6379`
- Frontend connects to backend at `http://backend:3000` (internal) or `http://localhost:3000` (from browser)

## Configuration

### Environment Variables

Edit `docker-compose.yaml` to customize:

**Backend:**
```yaml
environment:
  - PORT=3000
  - NODE_ENV=production
  - REDIS_URL=redis://redis:6379
  - FRONTEND_URL=http://localhost:80
```

**Simulator:**
```yaml
environment:
  - REDIS_HOST=redis
  - REDIS_PORT=6379
```

### Port Mapping

To change exposed ports, edit the `ports` section:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Access at http://localhost:8080

  backend:
    ports:
      - "4000:3000"  # Backend on port 4000
```

## Data Persistence

### Redis Data

Redis data is persisted in a named volume:
```yaml
volumes:
  redis_data:
```

To clear Redis data:
```bash
docker-compose down -v
```

### PostgreSQL (Optional)

To enable PostgreSQL for persistent storage, uncomment in `docker-compose.yaml`:

```yaml
postgres:
  image: postgres:15-alpine
  container_name: farmtwin-postgres
  ports:
    - "5432:5432"
  environment:
    - POSTGRES_USER=farmtwin
    - POSTGRES_PASSWORD=farmtwin_password
    - POSTGRES_DB=farmtwin
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

## Production Deployment

### Security Considerations

1. **Change default passwords** in environment variables
2. **Use Docker secrets** for sensitive data
3. **Enable HTTPS** with reverse proxy (nginx/Traefik)
4. **Limit exposed ports** - only expose what's necessary
5. **Update base images** regularly for security patches

### Using .env file

Create a `.env` file in the project root:

```env
# Backend
BACKEND_PORT=3000
REDIS_URL=redis://redis:6379
NODE_ENV=production

# Database
POSTGRES_USER=farmtwin
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=farmtwin

# Frontend
VITE_BACKEND_URL=http://localhost:3000
```

Reference in `docker-compose.yaml`:
```yaml
env_file:
  - .env
```

### Reverse Proxy Setup

For production with HTTPS, use nginx or Traefik:

**nginx example:**
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Troubleshooting

### Container won't start

Check logs:
```bash
docker-compose logs <service-name>
```

### Port already in use

Change the port mapping in `docker-compose.yaml`:
```yaml
ports:
  - "8080:80"  # Use different host port
```

### Build fails

Clear Docker cache and rebuild:
```bash
docker-compose build --no-cache
docker-compose up
```

### Redis connection errors

Verify Redis is running:
```bash
docker-compose exec redis redis-cli ping
# Should return: PONG
```

### Frontend shows "Disconnected"

1. Check backend is healthy:
   ```bash
   docker-compose exec backend wget -O- http://localhost:3000/health
   ```

2. Verify WebSocket connections are allowed through firewall

3. Check browser console for CORS errors

### Out of disk space

Remove unused Docker resources:
```bash
docker system prune -a --volumes
```

## Development vs Production

### Development Mode

For development with hot reload, use local setup instead:
```bash
# Terminal 1: Redis
docker run -d -p 6379:6379 redis:alpine

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Frontend
cd frontend && npm run dev

# Terminal 4: Simulator
cd simulator && python sensor_simulator.py
```

### Production Mode

Use Docker Compose for production:
- Optimized builds
- Automatic restarts
- Health checks
- Resource limits
- Logging

## Monitoring

### View resource usage
```bash
docker stats
```

### Container health status
```bash
docker-compose ps
```

### Backend health endpoint
```bash
curl http://localhost:3000/health
```

## Scaling

To run multiple simulator instances:

```bash
docker-compose up -d --scale simulator=3
```

## Updating

### Update application code
```bash
git pull
docker-compose up -d --build
```

### Update base images
```bash
docker-compose pull
docker-compose up -d --build
```

## Backup

### Backup Redis data
```bash
docker-compose exec redis redis-cli SAVE
docker cp farmtwin-redis:/data/dump.rdb ./backup/
```

### Restore Redis data
```bash
docker cp ./backup/dump.rdb farmtwin-redis:/data/
docker-compose restart redis
```

## Support

For issues:
- Check logs: `docker-compose logs -f`
- Verify services: `docker-compose ps`
- Review [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Open GitHub issue with logs attached
