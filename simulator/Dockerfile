# Simulator Dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Configuration - read from environment variables
ARG REDIS_HOST 
ARG REDIS_PORT 
ARG DEVICE_ID
ARG PUBLISH_INTERVAL 

ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PORT=$REDIS_PORT  
ENV DEVICE_ID=$DEVICE_ID 
ENV PUBLISH_INTERVAL=$PUBLISH_INTERVAL 

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY sensor_simulator.py .

# Run the simulator
CMD ["python", "-u", "sensor_simulator.py", "--host", "0.0.0.0"]
