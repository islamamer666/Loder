# Loder Local Setup Script for Windows PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Loder - Local Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if Docker is installed (optional)
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker is installed: $dockerVersion" -ForegroundColor Green
    $useDocker = $true
} catch {
    Write-Host "⚠ Docker is not installed. You'll need to set up PostgreSQL manually." -ForegroundColor Yellow
    $useDocker = $false
}

# Install root dependencies
Write-Host ""
Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install

# Install server dependencies
Write-Host ""
Write-Host "Installing server dependencies..." -ForegroundColor Yellow
Set-Location server
npm install
Set-Location ..

# Install client dependencies
Write-Host ""
Write-Host "Installing client dependencies..." -ForegroundColor Yellow
Set-Location client
npm install
Set-Location ..

# Setup environment file
Write-Host ""
Write-Host "Setting up environment file..." -ForegroundColor Yellow
if (-Not (Test-Path "server\.env")) {
    Copy-Item "server\env.example" "server\.env"
    Write-Host "✓ Created server\.env file" -ForegroundColor Green
} else {
    Write-Host "✓ server\.env already exists" -ForegroundColor Green
}

# Start PostgreSQL with Docker if available
if ($useDocker) {
    Write-Host ""
    Write-Host "Starting PostgreSQL database with Docker..." -ForegroundColor Yellow
    docker-compose up -d
    Write-Host "✓ PostgreSQL container started" -ForegroundColor Green
    Write-Host "Waiting for database to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
} else {
    Write-Host ""
    Write-Host "Please make sure PostgreSQL is running and the database 'loder' exists." -ForegroundColor Yellow
    Write-Host "Run the schema file: psql -U postgres -d loder -f server\database\schema.sql" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "This will start:" -ForegroundColor Yellow
Write-Host "  - Backend server on http://localhost:5000" -ForegroundColor White
Write-Host "  - Frontend app on http://localhost:3000" -ForegroundColor White
Write-Host ""

