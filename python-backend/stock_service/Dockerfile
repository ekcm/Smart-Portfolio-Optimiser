# Use an official Python image as a base
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Copy only necessary files to the container
COPY requirements.txt /app/
COPY stock_service.py /app/

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Expose the port your app runs on
EXPOSE 5001

# Command to run the application
CMD ["uvicorn", "stock_service:app", "--host", "0.0.0.0", "--port", "5001", "--reload"]