import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { initializeWebSocket } from './ws/socketHandler';
import apiRoutes from './api/routes';
import { RedisService } from './services/redisService';

dotenv.config();


const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:80',
  'http://localhost'
]

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    // origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

// Initialize services and start server
const startServer = async () => {
  try {
    // Initialize Redis connection first
    const redisService = RedisService.getInstance();
    await redisService.connect();

    // Initialize WebSocket handlers after Redis is connected
    initializeWebSocket(io);

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 WebSocket server ready`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  const redisService = RedisService.getInstance();
  await redisService.disconnect();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
