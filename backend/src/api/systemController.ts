import { Request, Response } from 'express';
import { RedisService } from '../services/redisService';

/**
 * Get overall system health and status
 */
export const getSystemStatus = async (req: Request, res: Response) => {
  try {
    const redisService = RedisService.getInstance();
    const redisConnected = redisService.isConnected();

    res.json({
      success: true,
      status: {
        server: 'online',
        redis: redisConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      }
    });
  } catch (error) {
    console.error('Error fetching system status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system status'
    });
  }
};
