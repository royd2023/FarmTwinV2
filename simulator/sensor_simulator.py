"""
FarmTwin Sensor Data Simulator

This script simulates realistic sensor readings for a greenhouse/farm environment
and publishes them to Redis pub/sub for consumption by the backend server.

Simulated sensors:
- Temperature (°C)
- Humidity (%)
- Soil Moisture (%)
- Light Intensity (lux)
"""

import redis
import json
import time
import random
import math
from datetime import datetime
from typing import Dict

class SensorSimulator:
    def __init__(self, redis_host='localhost', redis_port=6379, device_id='SIM_001'):
        """Initialize the sensor simulator with Redis connection"""
        self.redis_client = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)
        self.device_id = device_id

        # Base values for sensors (around these values, we'll add realistic variations)
        self.base_temperature = 22.0
        self.base_humidity = 60.0
        self.base_soil_moisture = 50.0
        self.base_light_intensity = 500.0

        # Time tracking for daily cycles
        self.start_time = time.time()

        print(f"✅ Sensor Simulator initialized (Device ID: {device_id})")
        print(f"📡 Connected to Redis at {redis_host}:{redis_port}")

    def get_time_of_day_factor(self) -> float:
        """
        Calculate a time-of-day factor (0.0 to 1.0) based on a 24-hour cycle
        This simulates day/night variations
        """
        # Simulate a full day every 2 minutes for testing (or use real time)
        cycle_duration = 120  # seconds (2 minutes = 1 day)
        # For real-time daily cycle, uncomment below:
        # cycle_duration = 86400  # seconds (24 hours)

        elapsed = time.time() - self.start_time
        day_progress = (elapsed % cycle_duration) / cycle_duration

        # Use sine wave for smooth day/night transition
        # 0.0 = midnight, 0.5 = noon, 1.0 = midnight again
        return (math.sin(2 * math.pi * day_progress - math.pi / 2) + 1) / 2

    def generate_temperature(self) -> float:
        """Generate realistic temperature reading with daily variation"""
        time_factor = self.get_time_of_day_factor()

        # Temperature varies between 15°C (night) and 28°C (day)
        daily_variation = 6.5 * (time_factor * 2 - 1)  # -6.5 to +6.5
        random_noise = random.uniform(-0.5, 0.5)

        temperature = self.base_temperature + daily_variation + random_noise
        return round(temperature, 1)

    def generate_humidity(self, temperature: float) -> float:
        """Generate humidity with inverse correlation to temperature"""
        time_factor = self.get_time_of_day_factor()

        # Humidity inversely correlates with temperature (higher temp = lower humidity)
        temp_effect = -(temperature - self.base_temperature) * 1.5
        daily_variation = 15 * (1 - time_factor)  # Higher at night
        random_noise = random.uniform(-2, 2)

        humidity = self.base_humidity + temp_effect + daily_variation + random_noise
        return round(max(30, min(90, humidity)), 1)  # Clamp between 30-90%

    def generate_soil_moisture(self) -> float:
        """Generate soil moisture with slow gradual decrease (simulates water consumption)"""
        # Soil moisture slowly decreases over time (simulating plant water uptake)
        elapsed_minutes = (time.time() - self.start_time) / 60
        depletion = elapsed_minutes * 0.2  # Loses 0.2% per minute

        random_noise = random.uniform(-1, 1)
        soil_moisture = self.base_soil_moisture - depletion + random_noise

        # Reset if too low (simulates irrigation)
        if soil_moisture < 30:
            self.base_soil_moisture = 65
            soil_moisture = 65

        return round(max(20, min(80, soil_moisture)), 1)

    def generate_light_intensity(self) -> float:
        """Generate light intensity based on time of day"""
        time_factor = self.get_time_of_day_factor()

        # Light follows day/night cycle (0 at night, high during day)
        daily_variation = 600 * time_factor  # 0 to 600 lux variation
        random_noise = random.uniform(-20, 20)

        # Add some clouds effect (random drops in light)
        cloud_effect = random.uniform(-100, 0) if random.random() > 0.8 else 0

        light_intensity = self.base_light_intensity + daily_variation + random_noise + cloud_effect
        return round(max(0, min(1000, light_intensity)), 0)

    def generate_sensor_data(self) -> Dict:
        """Generate a complete set of sensor readings"""
        temperature = self.generate_temperature()
        humidity = self.generate_humidity(temperature)
        soil_moisture = self.generate_soil_moisture()
        light_intensity = self.generate_light_intensity()

        return {
            'deviceId': self.device_id,
            'timestamp': datetime.now().isoformat(),
            'temperature': temperature,
            'humidity': humidity,
            'soilMoisture': soil_moisture,
            'lightIntensity': light_intensity
        }

    def publish_data(self, data: Dict):
        """Publish sensor data to Redis"""
        try:
            # Store current data in Redis cache
            self.redis_client.set('sensor:current', json.dumps(data), ex=300)

            # Publish to pub/sub channel
            self.redis_client.publish('sensor:updates', json.dumps(data))

            print(f"📊 {data['timestamp'][:19]} | Temp: {data['temperature']}°C | "
                  f"Humidity: {data['humidity']}% | Soil: {data['soilMoisture']}% | "
                  f"Light: {data['lightIntensity']} lux")

        except Exception as e:
            print(f"❌ Error publishing data: {e}")

    def run(self, interval: int = 2):
        """
        Run the simulator continuously

        Args:
            interval: Time between sensor readings in seconds (default: 2)
        """
        print(f"\n🚀 Starting sensor simulation (publishing every {interval}s)")
        print("Press Ctrl+C to stop\n")

        try:
            while True:
                sensor_data = self.generate_sensor_data()
                self.publish_data(sensor_data)
                time.sleep(interval)

        except KeyboardInterrupt:
            print("\n\n⏹️  Simulator stopped by user")
        except Exception as e:
            print(f"\n❌ Error in simulator: {e}")
        finally:
            self.redis_client.close()
            print("👋 Redis connection closed")


if __name__ == '__main__':
    # Configuration
    REDIS_HOST = 'localhost'
    REDIS_PORT = 6379
    DEVICE_ID = 'SIMULATOR_001'
    PUBLISH_INTERVAL = 2  # seconds

    # Create and run simulator
    simulator = SensorSimulator(
        redis_host=REDIS_HOST,
        redis_port=REDIS_PORT,
        device_id=DEVICE_ID
    )

    simulator.run(interval=PUBLISH_INTERVAL)
