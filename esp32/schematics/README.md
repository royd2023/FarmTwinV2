# ESP32 Wiring Schematics

This directory contains wiring diagrams and schematics for connecting sensors to the ESP32.

## Pin Connections

### DHT22 Temperature & Humidity Sensor
- VCC → 3.3V
- GND → GND
- DATA → GPIO 4

### Capacitive Soil Moisture Sensor
- VCC → 3.3V
- GND → GND
- AOUT → GPIO 34 (ADC1_CH6)

### LDR (Light Dependent Resistor) or BH1750 Light Sensor
**For LDR with voltage divider:**
- One leg of LDR → 3.3V
- Other leg of LDR → GPIO 35 (ADC1_CH7) AND one leg of 10kΩ resistor
- Other leg of 10kΩ resistor → GND

**For BH1750 (I2C):**
- VCC → 3.3V
- GND → GND
- SCL → GPIO 22
- SDA → GPIO 21

## Circuit Diagrams

Add your circuit diagrams (`.png`, `.jpg`, or `.svg` files) to this directory.

Example files:
- `wiring_diagram.png` - Complete wiring diagram
- `breadboard_layout.png` - Breadboard layout for prototyping
- `pcb_schematic.pdf` - PCB design schematic (if applicable)

## Important Notes

1. Always use appropriate pull-up/pull-down resistors where needed
2. Use a voltage divider if sensors output 5V to protect ESP32's 3.3V GPIO pins
3. Double-check polarity for power connections to avoid damaging components
4. Consider using a capacitor (100nF) between VCC and GND for each sensor for power supply filtering
5. For production deployments, consider proper enclosures and weatherproofing

## Tools for Creating Diagrams

- [Fritzing](https://fritzing.org/) - Easy breadboard and PCB design
- [KiCad](https://www.kicad.org/) - Professional PCB design software
- [EasyEDA](https://easyeda.com/) - Online circuit design tool
- [Tinkercad Circuits](https://www.tinkercad.com/circuits) - Simple online simulator
