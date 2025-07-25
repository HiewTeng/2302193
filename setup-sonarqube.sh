#!/bin/bash

# SonarQube Setup Script
# This script helps configure SonarQube with custom credentials

echo "🚀 Setting up SonarQube with custom credentials..."

# Start SonarQube services
echo "📦 Starting SonarQube services..."
docker-compose up -d

# Wait for SonarQube to be ready
echo "⏳ Waiting for SonarQube to be ready..."
timeout=300
counter=0
while ! curl -s http://localhost:9000/api/system/status | grep -q "UP"; do
    sleep 5
    counter=$((counter + 5))
    if [ $counter -ge $timeout ]; then
        echo "❌ Timeout waiting for SonarQube to start"
        exit 1
    fi
    echo "   Still waiting... (${counter}s/${timeout}s)"
done

echo "✅ SonarQube is ready!"

# Display access information
echo ""
echo "🌐 SonarQube Access Information:"
echo "   URL: http://localhost:9000"
echo "   Default Login: admin/admin"
echo ""
echo "📝 Manual Steps Required:"
echo "   1. Open http://localhost:9000 in your browser"
echo "   2. Login with admin/admin"
echo "   3. Change admin password to: 2302193@sit.singaporetech.edu.sg"
echo "   4. Or create new user:"
echo "      - Username: user"
echo "      - Password: 2302193@sit.singaporetech.edu.sg"
echo ""
echo "🔧 To create a project token:"
echo "   1. Go to Administration > Security > Users"
echo "   2. Click on your user"
echo "   3. Go to 'Tokens' tab"
echo "   4. Generate a new token"
echo "   5. Add this token to GitHub Secrets as SONAR_TOKEN"
echo ""
echo "🎯 Project Configuration:"
echo "   - Project Key: 2302193-secure-app"
echo "   - Project Name: Secure Software Development - 2302193"
echo ""

# Check if project exists, if not provide creation command
echo "🔍 Checking project status..."
echo "   Manual project creation required in SonarQube UI"
echo ""
echo "✨ Setup complete! Open http://localhost:9000 to continue."
