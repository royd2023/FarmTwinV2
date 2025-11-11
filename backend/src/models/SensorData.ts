/**
 * Interface representing sensor data from IoT devices or simulator
 */
export interface SensorData {
  deviceId: string;
  timestamp: string;
  temperature: number;        // Celsius
  humidity: number;           // Percentage
  soilMoisture: number;       // Percentage
  lightIntensity: number;     // Lux
  co2Level?: number;          // PPM (optional)
  phLevel?: number;           // pH scale (optional)
}

/**
 * Interface for actuator control commands
 */
export interface ActuatorCommand {
  deviceId: string;
  actuatorType: 'pump' | 'fan' | 'heater' | 'light' | 'valve';
  action: 'on' | 'off' | 'set';
  value?: number;             // For gradual controls (0-100)
  timestamp: string;
}

/**
 * Interface for system alerts
 */
export interface SystemAlert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  deviceId?: string;
  resolved: boolean;
}
