/**
 * Configuration file for ESP32 FarmTwin
 *
 * Update these values with your WiFi credentials and server details
 */

#ifndef CONFIG_H
#define CONFIG_H

// WiFi Configuration
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// Server Configuration
#define SERVER_URL "http://192.168.1.100:3000"  // Replace with your server IP
#define DEVICE_ID "ESP32_FARM_001"               // Unique device identifier

// Sensor Calibration (optional - adjust based on your sensors)
#define SOIL_MOISTURE_DRY 2800    // ADC value when soil is dry
#define SOIL_MOISTURE_WET 1200    // ADC value when soil is wet

// Timing Configuration
#define SENSOR_READ_INTERVAL 2000  // Read sensors every 2 seconds (ms)
#define DEEP_SLEEP_DURATION 300    // Deep sleep duration in seconds (for battery mode)

// Enable/Disable Features
#define ENABLE_DEEP_SLEEP false    // Set to true for battery-powered operation
#define ENABLE_OTA_UPDATES false   // Set to true to enable Over-The-Air updates

#endif // CONFIG_H
