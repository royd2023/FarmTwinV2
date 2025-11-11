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
        <SensorCard
          title="Temperature"
          value={sensorData?.temperature || 0}
          unit="°C"
          icon="🌡️"
        />
        <SensorCard
          title="Humidity"
          value={sensorData?.humidity || 0}
          unit="%"
          icon="💧"
        />
        <SensorCard
          title="Soil Moisture"
          value={sensorData?.soilMoisture || 0}
          unit="%"
          icon="🌱"
        />
        <SensorCard
          title="Light Intensity"
          value={sensorData?.lightIntensity || 0}
          unit="lux"
          icon="☀️"
        />
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
