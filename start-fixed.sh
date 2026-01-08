#!/bin/bash

echo "🏠 Starting Manyani Rental System (Fixed Version)..."
echo ""

BROWN='\033[38;5;130m'
GREEN='\033[38;5;28m'
NC='\033[0m'

echo -e "${BROWN}========================================${NC}"
echo -e "${BROWN}   Manyani Rental Management System${NC}"
echo -e "${BROWN}========================================${NC}"
echo ""

# MongoDB
echo "🗄️  Starting MongoDB..."
sudo systemctl start mongod
sleep 2

# Seed test data
echo "🌱 Seeding test data..."
cd backend
node test-data.js
cd ..

echo ""
echo "🔧 Starting Backend..."
cd backend
npm run dev &
BACKEND_PID=$!

echo "⏳ Waiting for backend (5 seconds)..."
sleep 5

echo ""
echo "🎨 Starting Frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}✅ System is running!${NC}"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo ""
echo "📋 Test Credentials:"
echo "   • Email: test@example.com"
echo "   • Password: password123"
echo ""
echo "⚠️  Press Ctrl+C to stop"

trap "echo ''; echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT
wait
