# FarmTwin Setup Guide

Complete guide to setting up the FarmTwin digital twin system for local development and production deployment.

## Prerequisites

### Required Software
- **Node.js** v18+ and npm
- **Python** 3.9+
- **Redis** 6+
- **Git**

### Optional (for production)
- **Docker** & Docker Compose
- **PostgreSQL** 14+ (or Supabase account)
- **ESP32** board with sensors (or use simulator)

---

## Quick Start (Local Development)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FarmTwinV2
```

### 2. Setup Redis

#### Option A: Using Docker
```bash
docker run -d -p 6379:6379 --name farmtwin-redis redis:alpine
```

#### Option B: Local Installation
- **Windows**: [Download installer](https://redis.io/docs/getting-started/installation/install-redis-on-windows/)
- **macOS**: `brew install redis && brew services start redis`
- **Linux**: `sudo apt-get install redis-server && sudo systemctl start redis`

Verify Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# nano .env  # or use your preferred editor

# Run in development mode
npm run dev
```

The backend server should start on `http://localhost:3000`

### 4. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env if needed
# Default: VITE_BACKEND_URL=http://localhost:3000

# Run development server
npm run dev
```

The frontend should start on `http://localhost:5173`

### 5. Setup Simulator

```bash
cd ../simulator

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run simulator
python sensor_simulator.py
```

You should see simulated sensor data being published every 2 seconds.

### 6. Verify Everything Works

1. Open your browser to `http://localhost:5173`
2. You should see the dashboard with live sensor data
3. The connection status indicator should show "Connected"
4. Charts should update in real-time

---

## ESP32 Hardware Setup (Optional)

### 1. Install PlatformIO

```bash
# Using VS Code
# Install the PlatformIO IDE extension

# Or install CLI
pip install platformio
```

### 2. Configure ESP32

```bash
cd esp32/firmware

# Edit config.h with your WiFi credentials and server IP
# nano config.h

# Update the following:
# - WIFI_SSID
# - WIFI_PASSWORD
# - SERVER_URL (your backend server IP)
```

### 3. Wire Sensors

Refer to `esp32/schematics/README.md` for wiring diagrams.

Basic connections:
- **DHT22**: GPIO 4
- **Soil Moisture**: GPIO 34 (analog)
- **Light Sensor**: GPIO 35 (analog)

### 4. Upload Firmware

```bash
# Build and upload
pio run --target upload

# Open serial monitor
pio device monitor
```

### 5. Add Endpoint for ESP32 Data

Update backend to accept ESP32 sensor data:

```typescript
// backend/src/api/routes.ts
router.post('/sensors/data', async (req, res) => {
  // Publish received data to Redis
  const redisService = RedisService.getInstance();
  await redisService.setSensorData(req.body);
  await redisService.publish('sensor:updates', JSON.stringify(req.body));
  res.json({ success: true });
});
```

---

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Docker Builds

#### Backend
```bash
cd backend
docker build -t farmtwin-backend .
docker run -p 3000:3000 --env-file .env farmtwin-backend
```

#### Frontend
```bash
cd frontend
docker build -t farmtwin-frontend .
docker run -p 5173:5173 farmtwin-frontend
```

---

## Production Deployment

### Environment Variables

Create production `.env` files:

**Backend (.env)**
```env
NODE_ENV=production
PORT=3000
REDIS_URL=redis://your-redis-host:6379
DATABASE_URL=postgresql://user:password@host:5432/farmtwin
FRONTEND_URL=https://your-domain.com
```

**Frontend (.env.production)**
```env
VITE_BACKEND_URL=https://api.your-domain.com
```

### Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE farmtwin;
```

2. Run migrations (if available):
```bash
cd backend
npm run migrate
```

3. Or manually create tables using `DATABASE_SCHEMA.md`

### Build for Production

**Backend**
```bash
cd backend
npm run build
npm start
```

**Frontend**
```bash
cd frontend
npm run build

# Serve static files with nginx, Apache, or use a CDN
# Built files are in frontend/dist/
```

### Deployment Platforms

#### Option 1: VPS (DigitalOcean, Linode, AWS EC2)
1. Use Docker Compose for easy orchestration
2. Set up nginx as reverse proxy
3. Use PM2 for Node.js process management
4. Configure SSL with Let's Encrypt

#### Option 2: Platform as a Service
- **Backend**: Railway, Render, Heroku
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Database**: Supabase, Railway, Neon

#### Option 3: Kubernetes
See `k8s/` directory for Kubernetes manifests (to be created)

---

## Troubleshooting

### Backend won't start
- Check Redis is running: `redis-cli ping`
- Verify `.env` file exists with correct values
- Check port 3000 is not in use: `lsof -i :3000` (macOS/Linux)

### Frontend shows "Disconnected"
- Verify backend is running on correct port
- Check CORS settings in backend
- Ensure WebSocket connection is allowed through firewall

### Simulator not publishing data
- Check Redis connection
- Verify Redis is accepting connections: `redis-cli ping`
- Check Python dependencies are installed

### ESP32 not connecting
- Double-check WiFi credentials in `config.h`
- Ensure ESP32 is on same network as backend
- Update `SERVER_URL` with correct IP address
- Check serial monitor for error messages

---

## Development Tips

### Hot Reload
- Backend: Changes auto-reload with nodemon
- Frontend: Vite provides instant HMR
- Simulator: Restart manually after changes

### Debugging
- Backend: Use VS Code debugger or `console.log`
- Frontend: React DevTools browser extension
- Redis: Monitor commands with `redis-cli MONITOR`

### Testing
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## Next Steps

1. Review [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for architecture details
2. Check [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for database setup
3. Customize sensor thresholds in Settings page
4. Add authentication (Supabase Auth recommended)
5. Set up automated alerts (email, SMS, push notifications)
6. Implement data persistence to PostgreSQL
7. Add historical data analytics

---

## Support

For issues and questions:
- Check existing GitHub issues
- Review documentation in each component's README
- Create new issue with detailed description and logs

## License

MIT
