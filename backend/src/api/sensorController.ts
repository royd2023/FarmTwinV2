import { Request, Response } from 'express';
import { RedisService } from '../services/redisService';

/**
 * Get current sensor readings from Redis cache
 */
export const getSensorData = async (req: Request, res: Response) => {
  try {
    const redisService = RedisService.getInstance();
    const sensorData = await redisService.getSensorData();

    res.json({
      success: true,
      data: sensorData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sensor data'
    });
  }
};

/**
 * Get historical sensor data with optional time range
 */
export const getHistoricalData = async (req: Request, res: Response) => {
  try {
    const { start, end, limit = 100 } = req.query;

    // TODO: Implement database query for historical data
    // This would typically query from a time-series database or Supabase

    res.json({
      success: true,
      data: [],
      message: 'Historical data endpoint - to be implemented'
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch historical data'
    });
  }
};
