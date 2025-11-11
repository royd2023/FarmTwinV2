import { useEffect, useState } from 'react';
import SensorCard from '../components/SensorCard';
import SensorChart from '../components/SensorChart';
import { useWebSocket } from '../hooks/useWebSocket';

interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightIntensity: number;
  timestamp: string;
}

// Thresholds (tomato greenhouse)
const sensorConfig = [
  { name: 'Temperature', key: 'temperature', unit: '°F', optimalMin: 65, optimalMax: 85, criticalMin: 55, criticalMax: 95 },
  { name: 'Humidity', key: 'humidity', unit: '%', optimalMin: 60, optimalMax: 80, criticalMin: 40, criticalMax: 90 },
  { name: 'Soil Moisture', key: 'soil_moisture', unit: '%', optimalMin: 40, optimalMax: 60, criticalMin: 30, criticalMax: 75 },
  { name: 'Light Level', key: 'light_level', unit: ' lux', optimalMin: 400, optimalMax: 800, criticalMin: 200, criticalMax: 1000 },
  { name: 'CO₂', key: 'co2_ppm', unit: ' ppm', optimalMin: 400, optimalMax: 1000, criticalMin: 300, criticalMax: 1500 },
];

const sensorKeyMap: Record<string, keyof SensorData> = {
  temperature: 'temperature',
  humidity: 'humidity',
  soil_moisture: 'soilMoisture',
  light_level: 'lightIntensity',
};



const Dashboard = () => {
  const { sensorData, isConnected } = useWebSocket();
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);

  useEffect(() => {
    if (sensorData) {
      setHistoricalData((prev) => [...prev.slice(-50), sensorData]);
    }
  }, [sensorData]);

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>


      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {sensorConfig.map((sensor) => {
          const dataKey = sensorKeyMap[sensor.key];
          const value = dataKey && sensorData
            ? Number(sensorData[dataKey])
            : 0;
          return (
            <SensorCard
              key={sensor.key}
              name={sensor.name}
              value={value}
              unit={sensor.unit}
              optimalMin={sensor.optimalMin}
              optimalMax={sensor.optimalMax}
              criticalMin={sensor.criticalMin}
              criticalMax={sensor.criticalMax}
            />
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SensorChart
          data={historicalData.map(d => ({ timestamp: d.timestamp, value: d.temperature }))}
          title="Temperature Trend"
          dataKey="value"
          color="#ef4444"
        />
        <SensorChart
          data={historicalData.map(d => ({ timestamp: d.timestamp, value: d.humidity }))}
          title="Humidity Trend"
          dataKey="value"
          color="#3b82f6"
        />
        <SensorChart
          data={historicalData.map(d => ({ timestamp: d.timestamp, value: d.soilMoisture }))}
          title="Soil Moisture Trend"
          dataKey="value"
          color="#22c55e"
        />
        <SensorChart
          data={historicalData.map(d => ({ timestamp: d.timestamp, value: d.lightIntensity }))}
          title="Light Intensity Trend"
          dataKey="value"
          color="#f59e0b"
        />
      </div>
    </div>
  );
};

export default Dashboard;
