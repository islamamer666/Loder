# Loder Start Script for Windows PowerShell

Write-Host "Starting Loder application..." -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is running (Docker)
$dockerRunning = docker ps --filter "name=loder-db" --format "{{.Names}}" | Select-String "loder-db"
if (-Not $dockerRunning) {
    Write-Host "Starting PostgreSQL container..." -ForegroundColor Yellow
    docker-compose up -d
    Start-Sleep -Seconds 3
}

# Start the application
Write-Host "Starting frontend and backend servers..." -ForegroundColor Yellow
Write-Host ""
npm run dev

