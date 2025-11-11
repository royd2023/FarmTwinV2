# FarmTwin Project Structure

This document provides a comprehensive overview of the FarmTwin digital twin system architecture and file organization.

## Project Tree

```
FarmTwinV2/
├── backend/                    # Node.js + Express + WebSocket server
│   ├── src/
│   │   ├── api/               # REST API endpoints
│   │   │   ├── routes.ts      # API route definitions
│   │   │   ├── sensorController.ts
│   │   │   └── systemController.ts
│   │   ├── ws/                # WebSocket handlers
│   │   │   └── socketHandler.ts
│   │   ├── services/          # Business logic layer
│   │   │   ├── redisService.ts
│   │   │   └── dataProcessingService.ts
│   │   ├── models/            # Data models and interfaces
│   │   │   └── SensorData.ts
│   │   └── index.ts           # Application entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                   # React + Vite + Tailwind UI
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Layout.tsx
│   │   │   ├── SensorCard.tsx
│   │   │   └── SensorChart.tsx
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── Settings.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   └── useWebSocket.tsx
│   │   ├── services/          # API client services
│   │   │   └── apiService.ts
│   │   ├── styles/            # Global styles
│   │   │   └── index.css
│   │   ├── App.tsx            # Root component
│   │   └── main.tsx           # Application entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
│
├── esp32/                      # ESP32 firmware
│   ├── firmware/
│   │   ├── main.cpp           # Main firmware code
│   │   └── config.h           # WiFi and server configuration
│   ├── schematics/
│   │   └── README.md          # Wiring diagrams and pin layouts
│   └── platformio.ini         # PlatformIO configuration
│
├── simulator/                  # Python sensor simulator
│   ├── sensor_simulator.py    # Main simulator script
│   ├── requirements.txt       # Python dependencies
│   └── README.md              # Simulator documentation
│
├── .gitignore
├── docker-compose.yaml         # Docker orchestration
├── DATABASE_SCHEMA.md          # Database structure documentation
├── SETUP_GUIDE.md              # Setup instructions
├── PROJECT_STRUCTURE.md        # This file
└── README.md                   # Project overview
```

## Architecture Overview

### System Components

```
┌─────────────┐
│   ESP32     │ ──┐
│  Sensors    │   │
└─────────────┘   │
                  │  Sensor Data
┌─────────────┐   │  (HTTP/MQTT)
│  Simulator  │ ──┤
│  (Python)   │   │
└─────────────┘   │
                  ↓
              ┌─────────┐
              │  Redis  │ ← Pub/Sub + Cache
              └─────────┘
                  ↑ ↓
              ┌─────────────────┐
              │  Backend        │
              │  (Node.js +     │ ← REST API + WebSocket
              │   Express +     │
              │   Socket.io)    │
              └─────────────────┘
                  ↑
                  │  WebSocket + HTTP
                  ↓
              ┌─────────────────┐
              │   Frontend      │
              │   (React +      │ ← User Interface
              │    Vite +       │
              │    Tailwind)    │
              └─────────────────┘
```

### Data Flow

1. **Data Generation**
   - ESP32 sensors read physical environment → HTTP POST to backend
   - Python simulator generates mock data → Redis pub/sub

2. **Data Processing**
   - Backend receives sensor data
   - Validates against thresholds
   - Caches in Redis (key: `sensor:current`)
   - Publishes to Redis channel (`sensor:updates`)
   - Optionally stores in PostgreSQL for historical analysis

3. **Data Distribution**
   - Backend subscribes to Redis pub/sub channel
   - Broadcasts updates to all connected WebSocket clients
   - Frontend receives real-time updates

4. **User Interface**
   - Dashboard displays current readings with status indicators
   - Charts visualize trends over time
   - Settings allow threshold configuration
   - Analytics show sustainability metrics

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **WebSocket**: Socket.io
- **Language**: TypeScript
- **Cache/Pub-Sub**: Redis
- **Database**: PostgreSQL (optional, for persistence)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: React Context API
- **HTTP Client**: Axios
- **WebSocket Client**: Socket.io-client

### Embedded
- **Hardware**: ESP32
- **Framework**: Arduino
- **Platform**: PlatformIO
- **Language**: C++
- **Sensors**: DHT22, Soil Moisture, LDR/BH1750

### Simulator
- **Language**: Python 3.9+
- **Libraries**: redis, python-dotenv

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Nginx (for production)
- **Process Manager**: PM2 (for production)

## API Endpoints

### REST API (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/api/sensors/current` | Get current sensor readings |
| GET | `/api/sensors/history` | Get historical data |
| GET | `/api/system/status` | Get system status |
| POST | `/api/sensors/data` | Receive data from ESP32 (future) |

### WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `connect` | Client → Server | Client connects |
| `disconnect` | Client → Server | Client disconnects |
| `sensor:update` | Server → Client | Broadcast sensor data |
| `request:sensorData` | Client → Server | Request current data |
| `control:actuator` | Client → Server | Send control command |
| `control:response` | Server → Client | Control command response |

## Key Files Explained

### Backend

**`backend/src/index.ts`**
- Application entry point
- Initializes Express server, Socket.io, and Redis
- Sets up middleware and routes

**`backend/src/ws/socketHandler.ts`**
- WebSocket connection management
- Subscribes to Redis pub/sub
- Broadcasts sensor updates to clients

**`backend/src/services/redisService.ts`**
- Singleton Redis client
- Handles caching and pub/sub operations
- Provides abstractions for data access

**`backend/src/services/dataProcessingService.ts`**
- Sensor data validation
- Threshold checking
- Sustainability metrics calculation

### Frontend

**`frontend/src/App.tsx`**
- Root React component
- Routing configuration
- WebSocket provider wrapper

**`frontend/src/hooks/useWebSocket.tsx`**
- Custom hook for WebSocket connection
- Manages connection state
- Provides real-time sensor data

**`frontend/src/pages/Dashboard.tsx`**
- Main dashboard view
- Displays sensor cards and charts
- Maintains historical data for visualization

### ESP32

**`esp32/firmware/main.cpp`**
- Main firmware logic
- Sensor reading functions
- WiFi connection management
- HTTP client for data transmission

**`esp32/firmware/config.h`**
- WiFi credentials
- Server endpoint configuration
- Pin definitions

### Simulator

**`simulator/sensor_simulator.py`**
- Generates realistic sensor readings
- Simulates daily cycles (temperature, light)
- Publishes to Redis pub/sub
- Includes noise and correlations between sensors

## Environment Variables

### Backend (.env)
```
PORT=3000
NODE_ENV=development
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://...
```

### Frontend (.env)
```
VITE_BACKEND_URL=http://localhost:3000
```

## Development Workflow

1. **Start Redis**
   ```bash
   docker run -d -p 6379:6379 redis:alpine
   ```

2. **Start Backend**
   ```bash
   cd backend && npm run dev
   ```

3. **Start Frontend**
   ```bash
   cd frontend && npm run dev
   ```

4. **Start Simulator**
   ```bash
   cd simulator && python sensor_simulator.py
   ```

5. **Access Dashboard**
   - Open `http://localhost:5173` in browser
   - Real-time data should appear automatically

## Extending the System

### Adding New Sensors

1. Update `backend/src/models/SensorData.ts` interface
2. Modify `simulator/sensor_simulator.py` to generate new data
3. Add validation in `dataProcessingService.ts`
4. Create new sensor card component in frontend
5. Update dashboard to display new sensor

### Adding Database Persistence

1. Install database client: `npm install pg` (PostgreSQL)
2. Create database schema (see `DATABASE_SCHEMA.md`)
3. Add database service: `backend/src/services/databaseService.ts`
4. Store sensor readings after validation
5. Create API endpoints for historical queries

### Adding Authentication

1. Install auth library: `npm install @supabase/supabase-js`
2. Add auth middleware to backend routes
3. Create login/signup pages in frontend
4. Protect WebSocket connections
5. Add user-specific device management

### Adding Notifications

1. Implement alert detection in `dataProcessingService.ts`
2. Add email service (e.g., SendGrid, Nodemailer)
3. Create push notification service (e.g., Firebase Cloud Messaging)
4. Store alert preferences per user
5. Send notifications when thresholds exceeded

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
- Test WebSocket communication
- Verify data flow from simulator → backend → frontend
- Test threshold alerts

## Deployment

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed deployment instructions.

### Quick Deploy with Docker
```bash
docker-compose up -d
```

### Manual Deploy
1. Build backend: `cd backend && npm run build`
2. Build frontend: `cd frontend && npm run build`
3. Deploy static files (frontend/dist) to CDN
4. Run backend with PM2: `pm2 start dist/index.js`

## License

MIT
