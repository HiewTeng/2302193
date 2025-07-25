# SonarQube Setup Script for Windows
# This script helps configure SonarQube with custom credentials

Write-Host "🚀 Setting up SonarQube with custom credentials..." -ForegroundColor Green

# Start SonarQube services
Write-Host "📦 Starting SonarQube services..." -ForegroundColor Yellow
docker-compose up -d

# Wait for SonarQube to be ready
Write-Host "⏳ Waiting for SonarQube to be ready..." -ForegroundColor Yellow
$timeout = 300
$counter = 0

do {
    Start-Sleep -Seconds 5
    $counter += 5
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:9000/api/system/status" -Method Get -TimeoutSec 5
        if ($response.status -eq "UP") {
            break
        }
    } catch {
        # Continue waiting
    }
    
    Write-Host "   Still waiting... (${counter}s/${timeout}s)" -ForegroundColor Gray
    
    if ($counter -ge $timeout) {
        Write-Host "❌ Timeout waiting for SonarQube to start" -ForegroundColor Red
        exit 1
    }
} while ($true)

Write-Host "✅ SonarQube is ready!" -ForegroundColor Green

# Display access information
Write-Host ""
Write-Host "🌐 SonarQube Access Information:" -ForegroundColor Cyan
Write-Host "   URL: http://localhost:9000" -ForegroundColor White
Write-Host "   Default Login: admin/admin" -ForegroundColor White
Write-Host ""
Write-Host "📝 Manual Steps Required:" -ForegroundColor Cyan
Write-Host "   1. Open http://localhost:9000 in your browser" -ForegroundColor White
Write-Host "   2. Login with admin/admin" -ForegroundColor White
Write-Host "   3. Change admin password to: 2302193@sit.singaporetech.edu.sg" -ForegroundColor White
Write-Host "   4. Or create new user:" -ForegroundColor White
Write-Host "      - Username: user" -ForegroundColor Gray
Write-Host "      - Password: 2302193@sit.singaporetech.edu.sg" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 To create a project token:" -ForegroundColor Cyan
Write-Host "   1. Go to Administration > Security > Users" -ForegroundColor White
Write-Host "   2. Click on your user" -ForegroundColor White
Write-Host "   3. Go to 'Tokens' tab" -ForegroundColor White
Write-Host "   4. Generate a new token" -ForegroundColor White
Write-Host "   5. Add this token to GitHub Secrets as SONAR_TOKEN" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Project Configuration:" -ForegroundColor Cyan
Write-Host "   - Project Key: 2302193-secure-app" -ForegroundColor White
Write-Host "   - Project Name: Secure Software Development - 2302193" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Opening SonarQube in browser..." -ForegroundColor Yellow
Start-Process "http://localhost:9000"
Write-Host ""
Write-Host "✨ Setup complete! Continue configuration in the browser." -ForegroundColor Green
