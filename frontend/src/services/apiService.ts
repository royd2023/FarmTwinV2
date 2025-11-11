import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Sensor data endpoints
  getCurrentSensorData: async () => {
    const response = await apiClient.get('/sensors/current');
    return response.data;
  },

  getHistoricalData: async (params?: { start?: string; end?: string; limit?: number }) => {
    const response = await apiClient.get('/sensors/history', { params });
    return response.data;
  },

  // System status
  getSystemStatus: async () => {
    const response = await apiClient.get('/system/status');
    return response.data;
  },
};

export default apiService;
