import { Server, Socket } from 'socket.io';
import { RedisService } from '../services/redisService';
import { DataProcessingService } from '../services/dataProcessingService';
import { SensorData } from '../models/SensorData';

/**
 * Initialize WebSocket event handlers and Redis subscriptions
 */
export const initializeWebSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send initial sensor data on connection
    sendCurrentSensorData(socket);

    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Handle sensor data requests
    socket.on('request:sensorData', async () => {
      await sendCurrentSensorData(socket);
    });

    // Handle control commands (e.g., actuator controls)
    socket.on('control:actuator', (data) => {
      console.log('Actuator control received:', data);
      // TODO: Implement actuator control logic
      socket.emit('control:response', { success: true, data });
    });
  });

  // Subscribe to Redis pub/sub for sensor updates
  subscribeToSensorUpdates(io);
};

/**
 * Send current sensor data to a specific socket
 */
const sendCurrentSensorData = async (socket: Socket) => {
  try {
    const redisService = RedisService.getInstance();
    const sensorData = await redisService.getSensorData();
    socket.emit('sensor:update', sensorData);
  } catch (error) {
    console.error('Error sending sensor data:', error);
  }
};

/**
 * Subscribe to Redis pub/sub channel for real-time sensor updates
 */
const subscribeToSensorUpdates = (io: Server) => {
  const redisService = RedisService.getInstance();

  redisService.subscribe('sensor:updates', (message: string) => {
    try {
      const sensorData: SensorData = JSON.parse(message);
      // Broadcast to all connected clients
      io.emit('sensor:update', sensorData);

      // 1. Process the data to get warnings and alerts
      const analysis = DataProcessingService.validateSensorData(sensorData);

      // 2. Combine raw data with the analysis
      const processedData = { ...sensorData, analysis };

      // 3. Broadcast the enriched data to all connected clients
      io.emit('sensor:update', processedData);
    } catch (error) {
      console.error('Error processing sensor update:', error);
    }
  });
};
