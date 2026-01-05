#!/bin/bash

# Loder Local Setup Script for Linux/Mac

echo "========================================"
echo "Loder - Local Setup Script"
echo "========================================"
echo ""

# Check if Node.js is installed
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js is installed: $NODE_VERSION"
else
    echo "✗ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if Docker is installed (optional)
echo "Checking Docker installation..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo "✓ Docker is installed: $DOCKER_VERSION"
    USE_DOCKER=true
else
    echo "⚠ Docker is not installed. You'll need to set up PostgreSQL manually."
    USE_DOCKER=false
fi

# Install root dependencies
echo ""
echo "Installing root dependencies..."
npm install

# Install server dependencies
echo ""
echo "Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo ""
echo "Installing client dependencies..."
cd client
npm install
cd ..

# Setup environment file
echo ""
echo "Setting up environment file..."
if [ ! -f "server/.env" ]; then
    cp server/env.example server/.env
    echo "✓ Created server/.env file"
else
    echo "✓ server/.env already exists"
fi

# Start PostgreSQL with Docker if available
if [ "$USE_DOCKER" = true ]; then
    echo ""
    echo "Starting PostgreSQL database with Docker..."
    docker-compose up -d
    echo "✓ PostgreSQL container started"
    echo "Waiting for database to be ready..."
    sleep 5
else
    echo ""
    echo "Please make sure PostgreSQL is running and the database 'loder' exists."
    echo "Run the schema file: psql -U postgres -d loder -f server/database/schema.sql"
fi

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "This will start:"
echo "  - Backend server on http://localhost:5000"
echo "  - Frontend app on http://localhost:3000"
echo ""

