# FarmTwin Sensor Simulator

This Python-based simulator generates realistic sensor data for testing the FarmTwin digital twin system without requiring physical hardware.

## Features

- Simulates 4 environmental sensors:
  - Temperature (with daily cycle variations)
  - Humidity (inversely correlated with temperature)
  - Soil Moisture (gradual depletion with automatic irrigation resets)
  - Light Intensity (follows day/night cycle)

- Publishes data to Redis pub/sub for real-time distribution
- Configurable update interval (default: 2 seconds)
- Realistic noise and variations in sensor readings
- Simulates daily cycles (accelerated for testing)

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure Redis is running:
```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install Redis locally
# Windows: https://redis.io/docs/getting-started/installation/install-redis-on-windows/
# Linux: sudo apt-get install redis-server
# macOS: brew install redis
```

3. Run the simulator:
```bash
python sensor_simulator.py
```

## Configuration

Edit the following variables in `sensor_simulator.py`:

- `REDIS_HOST`: Redis server hostname (default: 'localhost')
- `REDIS_PORT`: Redis server port (default: 6379)
- `DEVICE_ID`: Unique identifier for this simulator instance
- `PUBLISH_INTERVAL`: Time between data updates in seconds (default: 2)

## Sample Output

```
✅ Sensor Simulator initialized (Device ID: SIMULATOR_001)
📡 Connected to Redis at localhost:6379

🚀 Starting sensor simulation (publishing every 2s)
Press Ctrl+C to stop

📊 2025-01-15T10:30:00 | Temp: 24.5°C | Humidity: 58.2% | Soil: 49.8% | Light: 720 lux
📊 2025-01-15T10:30:02 | Temp: 24.3°C | Humidity: 58.5% | Soil: 49.6% | Light: 715 lux
```

## Integration

The simulator publishes data to Redis in the following format:

```json
{
  "deviceId": "SIMULATOR_001",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "temperature": 24.5,
  "humidity": 58.2,
  "soilMoisture": 49.8,
  "lightIntensity": 720
}
```

This data is:
1. Stored in Redis key `sensor:current` (with 5-minute expiry)
2. Published to Redis channel `sensor:updates` for real-time updates

The backend server subscribes to this channel and broadcasts updates to connected frontend clients via WebSocket.

## Advanced Usage

### Running Multiple Simulators

To simulate multiple sensors/devices, run multiple instances with different device IDs:

```bash
# Terminal 1
python sensor_simulator.py  # SIMULATOR_001

# Terminal 2 (modify DEVICE_ID in the script first)
python sensor_simulator.py  # SIMULATOR_002
```

### Custom Sensor Profiles

Modify the base values in the `__init__` method to simulate different environments:

```python
# Greenhouse (warm, humid)
self.base_temperature = 26.0
self.base_humidity = 75.0

# Arid climate (hot, dry)
self.base_temperature = 32.0
self.base_humidity = 35.0

# Indoor farm (controlled)
self.base_temperature = 20.0
self.base_humidity = 55.0
```

## Troubleshooting

**Connection errors:**
- Ensure Redis is running: `redis-cli ping` should return `PONG`
- Check firewall settings if using a remote Redis server

**No data in frontend:**
- Verify the backend is subscribed to Redis pub/sub
- Check backend logs for Redis connection status
- Ensure WebSocket connection is established in the frontend

## License

MIT
