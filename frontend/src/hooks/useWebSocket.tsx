import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SensorData {
  deviceId: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightIntensity: number;
}

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sensorData: SensorData | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  sensorData: null,
});

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);

  useEffect(() => {
    const socketUrl = ((import.meta as any).env?.VITE_BACKEND_URL) || 'http://localhost:3000';
    const newSocket = io(socketUrl);

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('sensor:update', (data: SensorData) => {
      setSensorData(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, sensorData }}>
      {children}
    </WebSocketContext.Provider>
  );
};
