# Use Python 3.6 as the base image
FROM python:3.9-slim

# Set working directory in the container
WORKDIR /app

# Copy requirements file to container
COPY requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code to the container
COPY . .

# Expose environment variables at runtime
ENV REDIS_HOST=azurerm_redis_cache.redis.hostname 
ENV REDIS_PORT=6379 
ENV REDIS_CHANNEL=log_channel
ENV REDIS_PASSWORD=azurerm_redis_cache.redis.primary_access_key

    # ZIPKIN_URL=""

# Command to run when the container starts
CMD ["python3", "main.py"]