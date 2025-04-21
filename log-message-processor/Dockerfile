# Use Python 3.6 as the base image
FROM python:3.6-slim

# Set working directory in the container
WORKDIR /app

# Copy requirements file to container
COPY requirements.txt .

# Install dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the application code to the container
COPY . .

# Expose environment variables at runtime
ENV REDIS_HOST=redis \
    REDIS_PORT=6379 \
    REDIS_CHANNEL=log_channel \
    ZIPKIN_URL=""

# Command to run when the container starts
CMD ["python3", "main.py"]