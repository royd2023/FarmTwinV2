/**
 * FarmTwin ESP32 Firmware
 *
 * This firmware reads sensor data and sends it to the backend server
 * via WiFi using WebSocket or HTTP POST requests.
 *
 * Sensors supported:
 * - DHT22 (Temperature & Humidity)
 * - Soil Moisture Sensor (Capacitive or Resistive)
 * - LDR or BH1750 (Light Intensity)
 *
 * Platform: ESP32
 * Framework: Arduino
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include "config.h"

// Pin definitions
#define DHT_PIN 4
#define SOIL_MOISTURE_PIN 34
#define LIGHT_SENSOR_PIN 35

// Sensor objects
DHT dht(DHT_PIN, DHT22);

// Timing variables
unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 2000; // Send data every 2 seconds

// Function declarations
void connectWiFi();
void readSensors(float &temp, float &humidity, int &soilMoisture, int &lightIntensity);
void sendDataToServer(float temp, float humidity, int soilMoisture, int lightIntensity);

void setup() {
  Serial.begin(115200);
  Serial.println("FarmTwin ESP32 Starting...");

  // Initialize sensors
  dht.begin();
  pinMode(SOIL_MOISTURE_PIN, INPUT);
  pinMode(LIGHT_SENSOR_PIN, INPUT);

  // Connect to WiFi
  connectWiFi();

  Serial.println("Setup complete. Starting data collection...");
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Reconnecting...");
    connectWiFi();
  }

  // Send data at regular intervals
  if (millis() - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = millis();

    // Read sensor values
    float temperature, humidity;
    int soilMoisture, lightIntensity;
    readSensors(temperature, humidity, soilMoisture, lightIntensity);

    // Send to server
    sendDataToServer(temperature, humidity, soilMoisture, lightIntensity);
  }

  delay(100);
}

/**
 * Connect to WiFi network
 */
void connectWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi connection failed!");
  }
}

/**
 * Read all sensor values
 */
void readSensors(float &temp, float &humidity, int &soilMoisture, int &lightIntensity) {
  // Read DHT22 sensor
  temp = dht.readTemperature();
  humidity = dht.readHumidity();

  // Check for failed DHT reading
  if (isnan(temp) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    temp = 0;
    humidity = 0;
  }

  // Read soil moisture (analog value 0-4095, convert to percentage)
  int soilMoistureRaw = analogRead(SOIL_MOISTURE_PIN);
  soilMoisture = map(soilMoistureRaw, 0, 4095, 0, 100);

  // Read light intensity (analog value 0-4095, convert to lux approximation)
  int lightRaw = analogRead(LIGHT_SENSOR_PIN);
  lightIntensity = map(lightRaw, 0, 4095, 0, 1000);

  // Print to serial for debugging
  Serial.printf("Temp: %.1f°C | Humidity: %.1f%% | Soil: %d%% | Light: %d lux\n",
                temp, humidity, soilMoisture, lightIntensity);
}

/**
 * Send sensor data to backend server via HTTP POST
 */
void sendDataToServer(float temp, float humidity, int soilMoisture, int lightIntensity) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Cannot send data - WiFi not connected");
    return;
  }

  HTTPClient http;

  // Create JSON payload
  StaticJsonDocument<256> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["timestamp"] = millis();
  doc["temperature"] = temp;
  doc["humidity"] = humidity;
  doc["soilMoisture"] = soilMoisture;
  doc["lightIntensity"] = lightIntensity;

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  // Send HTTP POST request
  String serverUrl = String(SERVER_URL) + "/api/sensors/data";
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    Serial.printf("Data sent successfully. Response code: %d\n", httpResponseCode);
  } else {
    Serial.printf("Error sending data. Error code: %d\n", httpResponseCode);
  }

  http.end();
}
