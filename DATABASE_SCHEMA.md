# FarmTwin Database Schema

This document outlines the database schema for the FarmTwin digital twin system.

## Overview

The system uses a hybrid approach:
- **Redis**: Real-time caching and pub/sub for live sensor data
- **PostgreSQL/Supabase**: Persistent storage for historical data, user accounts, and system configuration

## Redis Data Structure

### Keys

| Key | Type | TTL | Description |
|-----|------|-----|-------------|
| `sensor:current` | String (JSON) | 300s | Current sensor readings |
| `sensor:history:{deviceId}` | List | - | Recent sensor readings (last 1000) |
| `device:{deviceId}:status` | String | - | Device online/offline status |
| `alerts:active` | Set | - | Active system alerts |

### Pub/Sub Channels

| Channel | Purpose |
|---------|---------|
| `sensor:updates` | Real-time sensor data broadcasts |
| `alerts` | System alert notifications |
| `device:status` | Device connection status updates |

## PostgreSQL Schema

### Tables

#### 1. users
Stores user account information

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. devices
Tracks IoT devices (ESP32 sensors, etc.)

```sql
CREATE TABLE devices (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  device_type VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  status VARCHAR(20) DEFAULT 'offline',
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. sensor_readings
Historical sensor data

```sql
CREATE TABLE sensor_readings (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(50) REFERENCES devices(id),
  timestamp TIMESTAMP NOT NULL,
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  soil_moisture DECIMAL(5,2),
  light_intensity INTEGER,
  co2_level INTEGER,
  ph_level DECIMAL(4,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient querying
CREATE INDEX idx_sensor_readings_device_timestamp
  ON sensor_readings(device_id, timestamp DESC);
CREATE INDEX idx_sensor_readings_timestamp
  ON sensor_readings(timestamp DESC);
```

#### 4. alerts
System alerts and notifications

```sql
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(50) REFERENCES devices(id),
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_device_unresolved
  ON alerts(device_id, resolved, created_at DESC);
```

#### 5. thresholds
Configurable alert thresholds per device

```sql
CREATE TABLE thresholds (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(50) REFERENCES devices(id),
  metric_name VARCHAR(50) NOT NULL,
  min_value DECIMAL(10,2),
  max_value DECIMAL(10,2),
  optimal_min DECIMAL(10,2),
  optimal_max DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(device_id, metric_name)
);
```

#### 6. actuator_commands
Log of commands sent to actuators

```sql
CREATE TABLE actuator_commands (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(50) REFERENCES devices(id),
  actuator_type VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  value INTEGER,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  executed_by UUID REFERENCES users(id)
);

CREATE INDEX idx_actuator_commands_device
  ON actuator_commands(device_id, executed_at DESC);
```

## Data Retention Policy

### Redis
- Current sensor data: 5 minutes TTL
- Historical cache: Last 1000 readings per device (FIFO)

### PostgreSQL
- Sensor readings: Keep all data
- Optionally implement partitioning by month for large datasets
- Alerts: Archive resolved alerts older than 6 months
- Logs: Retain for 90 days

## Sample Queries

### Get latest readings for a device
```sql
SELECT * FROM sensor_readings
WHERE device_id = 'ESP32_001'
ORDER BY timestamp DESC
LIMIT 100;
```

### Get average temperature over last 24 hours
```sql
SELECT
  device_id,
  AVG(temperature) as avg_temp,
  MIN(temperature) as min_temp,
  MAX(temperature) as max_temp
FROM sensor_readings
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY device_id;
```

### Get active alerts
```sql
SELECT a.*, d.name as device_name
FROM alerts a
JOIN devices d ON a.device_id = d.id
WHERE a.resolved = FALSE
ORDER BY a.created_at DESC;
```

## Migrations

Use a migration tool like:
- **Flyway** (Java-based)
- **Liquibase** (XML/YAML based)
- **Node-pg-migrate** (JavaScript)
- **Supabase Migrations** (if using Supabase)

Store migration files in `backend/migrations/` directory.

## Future Enhancements

1. **Time-series database**: Consider TimescaleDB extension for PostgreSQL or InfluxDB for better time-series performance
2. **Data aggregation**: Pre-compute hourly/daily averages for faster analytics
3. **Geospatial features**: Add PostGIS for location-based queries if managing multiple farm locations
4. **Audit logging**: Track all user actions and system changes
