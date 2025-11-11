import { SensorData } from '../models/SensorData';

/**
 * Service for processing and analyzing sensor data
 * Includes threshold checks, sustainability metrics, and anomaly detection
 */
export class DataProcessingService {
  // Define threshold values
  private static readonly THRESHOLDS = {
    temperature: { min: 15, max: 30, optimal: { min: 20, max: 25 } },
    humidity: { min: 40, max: 80, optimal: { min: 50, max: 70 } },
    soilMoisture: { min: 30, max: 70, optimal: { min: 40, max: 60 } },
    lightIntensity: { min: 200, max: 800, optimal: { min: 400, max: 600 } }
  };

  /**
   * Validate sensor data against threshold values
   */
  public static validateSensorData(data: SensorData): {
    isValid: boolean;
    warnings: string[];
    alerts: string[];
  } {
    const warnings: string[] = [];
    const alerts: string[] = [];

    // Temperature checks
    if (data.temperature < this.THRESHOLDS.temperature.min) {
      alerts.push('Temperature below minimum threshold');
    } else if (data.temperature > this.THRESHOLDS.temperature.max) {
      alerts.push('Temperature above maximum threshold');
    } else if (
      data.temperature < this.THRESHOLDS.temperature.optimal.min ||
      data.temperature > this.THRESHOLDS.temperature.optimal.max
    ) {
      warnings.push('Temperature outside optimal range');
    }

    // Humidity checks
    if (data.humidity < this.THRESHOLDS.humidity.min) {
      alerts.push('Humidity below minimum threshold');
    } else if (data.humidity > this.THRESHOLDS.humidity.max) {
      alerts.push('Humidity above maximum threshold');
    }

    // Soil moisture checks
    if (data.soilMoisture < this.THRESHOLDS.soilMoisture.min) {
      alerts.push('Soil moisture critically low - irrigation recommended');
    } else if (data.soilMoisture > this.THRESHOLDS.soilMoisture.max) {
      alerts.push('Soil moisture too high - check drainage');
    }

    return {
      isValid: alerts.length === 0,
      warnings,
      alerts
    };
  }

  /**
   * Calculate sustainability metrics
   */
  public static calculateSustainabilityMetrics(data: SensorData): {
    waterEfficiency: number;
    energyEfficiency: number;
    overallScore: number;
  } {
    // Placeholder for sustainability calculations
    // These would be based on historical data and optimal ranges

    const waterEfficiency = 85; // Percentage
    const energyEfficiency = 78; // Percentage
    const overallScore = (waterEfficiency + energyEfficiency) / 2;

    return {
      waterEfficiency,
      energyEfficiency,
      overallScore
    };
  }
}
