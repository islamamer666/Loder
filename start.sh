#!/bin/bash

# Loder Start Script for Linux/Mac

echo "Starting Loder application..."
echo ""

# Check if PostgreSQL is running (Docker)
if ! docker ps --filter "name=loder-db" --format "{{.Names}}" | grep -q "loder-db"; then
    echo "Starting PostgreSQL container..."
    docker-compose up -d
    sleep 3
fi

# Start the application
echo "Starting frontend and backend servers..."
echo ""
npm run dev

