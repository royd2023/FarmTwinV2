import { Router } from 'express';
import { getSensorData, getHistoricalData } from './sensorController';
import { getSystemStatus } from './systemController';

const router = Router();

// Sensor data endpoints
router.get('/sensors/current', getSensorData);
router.get('/sensors/history', getHistoricalData);

// System status endpoints
router.get('/system/status', getSystemStatus);

export default router;
