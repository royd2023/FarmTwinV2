# FarmTwin - Digital Twin for Agriculture

A real-time IoT monitoring system for agricultural environments using digital twin technology. This project enables live sensor data collection, visualization, and analysis for greenhouse and farm management.

Inspired by [mooreli104/digital-twins](https://github.com/mooreli104/digital-twins)

## Features

- Real-time sensor monitoring (Temperature, Humidity, Soil Moisture, Light Intensity)
- WebSocket-based live data streaming
- Interactive dashboard with real-time charts
- Python-based sensor data simulator
- ESP32 firmware support for physical sensors
- Redis pub/sub for high-performance data distribution
- Docker-compose setup for easy deployment
- Responsive UI with Tailwind CSS
- Sustainability metrics and analytics

## Architecture

```
ESP32/Simulator → Redis (Pub/Sub) → Backend (Node.js + Socket.io) → Frontend (React)
```

The system uses a hybrid approach:
- **Redis** for real-time caching and pub/sub messaging
- **WebSocket** for bidirectional client-server communication
- **REST API** for historical data queries
- **Optional PostgreSQL** for persistent storage

## Project Structure

```
FarmTwinV2/
├── backend/          # Node.js + Express + WebSocket server
├── frontend/         # React + Vite + Tailwind dashboard
├── esp32/            # ESP32 firmware (Arduino/PlatformIO)
├── simulator/        # Python sensor data simulator
├── docker-compose.yaml
├── DATABASE_SCHEMA.md
├── SETUP_GUIDE.md
└── PROJECT_STRUCTURE.md
```

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed architecture documentation.

## Quick Start

### Prerequisites
- **Docker** & **Docker Compose** (recommended)
- OR: Node.js 18+, Python 3.9+, Redis 6+ (for manual setup)

### Option 1: Docker Compose (Recommended) ⭐

**One-command startup:**

```bash
docker-compose up --build
```

Or use the startup scripts:

**Windows:**
```bash
start.bat
```

**Linux/macOS:**
```bash
chmod +x start.sh
./start.sh
```

**Access the application:**
- 🌐 Dashboard: **http://localhost**
- 📡 Backend API: **http://localhost:3000**
- 📊 Health Check: **http://localhost:3000/health**

For detailed Docker documentation, see [DOCKER.md](DOCKER.md)

### Option 2: Manual Setup

1. **Start Redis**
   ```bash
   docker run -d -p 6379:6379 redis:alpine
   ```

2. **Setup and run Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **Setup and run Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

4. **Run Simulator**
   ```bash
   cd simulator
   pip install -r requirements.txt
   python sensor_simulator.py
   ```

5. **Open Dashboard**
   - Navigate to `http://localhost:5173`
   - You should see live sensor data updating in real-time

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

## Technology Stack

### Backend
- **Node.js** + **Express** - REST API server
- **Socket.io** - WebSocket communication
- **TypeScript** - Type-safe development
- **Redis** - Real-time caching and pub/sub

### Frontend
- **React 18** - UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Socket.io-client** - WebSocket client

### Hardware/Simulation
- **ESP32** - IoT microcontroller
- **Python** - Sensor simulator
- **Arduino Framework** - Embedded development

### Infrastructure
- **Docker** & **Docker Compose** - Containerization
- **PostgreSQL** (optional) - Persistent storage
- **Nginx** (production) - Reverse proxy

## API Documentation

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/sensors/current` | Current sensor readings |
| GET | `/api/sensors/history` | Historical data |
| GET | `/api/system/status` | System status |

### WebSocket Events

| Event | Description |
|-------|-------------|
| `sensor:update` | Real-time sensor data broadcast |
| `request:sensorData` | Request current sensor data |
| `control:actuator` | Send actuator control commands |

## Development

### Run Tests
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

### Build for Production
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

## ESP32 Hardware Setup

1. Wire sensors according to [esp32/schematics/README.md](esp32/schematics/README.md)
2. Update WiFi credentials in `esp32/firmware/config.h`
3. Upload firmware using PlatformIO:
   ```bash
   cd esp32
   pio run --target upload
   ```

## Database Setup

For persistent data storage, set up PostgreSQL using the schema defined in [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] User authentication (Supabase Auth)
- [ ] Historical data persistence
- [ ] Email/SMS alert notifications
- [ ] Multi-device support
- [ ] Actuator control (pumps, fans, lights)
- [ ] Mobile app (React Native)
- [ ] Machine learning predictions
- [ ] Multi-language support

## Troubleshooting

See [SETUP_GUIDE.md](SETUP_GUIDE.md#troubleshooting) for common issues and solutions.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Inspired by [mooreli104/digital-twins](https://github.com/mooreli104/digital-twins)
- Built with modern web technologies and IoT best practices

## Support

For questions and support:
- Open an issue on GitHub
- Check the documentation in `/docs`
- Review [SETUP_GUIDE.md](SETUP_GUIDE.md) and [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)