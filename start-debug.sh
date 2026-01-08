#!/bin/bash

echo "🔧 Starting Manyani in Debug Mode..."
echo ""

BROWN='\033[38;5;130m'
GREEN='\033[38;5;28m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BROWN}========================================${NC}"
echo -e "${BROWN}   Manyani Rental - Debug Mode${NC}"
echo -e "${BROWN}========================================${NC}"
echo ""

# Stop any running processes
echo "🛑 Stopping existing processes..."
pkill -f "node" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 2

# Clear browser cache hint
echo "🧹 Clear browser cache if needed:"
echo "   Chrome: Ctrl+Shift+Del"
echo "   Firefox: Ctrl+Shift+Del"
echo ""

# MongoDB
echo "🗄️  Starting MongoDB..."
sudo systemctl restart mongod
sleep 3

# Clear database to avoid conflicts
echo "🗑️  Clearing test database..."
mongosh manyani_rentals --eval "db.dropDatabase()" --quiet 2>/dev/null || true

# Seed fresh test data
echo "🌱 Seeding fresh test data..."
cd backend
node test-data.js
cd ..

echo ""
echo "🔧 Starting Backend..."
cd backend
npm run dev > backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
echo "   Logs: backend/backend.log"

echo "⏳ Waiting for backend (10 seconds)..."
sleep 10

# Check if backend started
if ! curl -s http://localhost:5000 > /dev/null; then
    echo -e "${RED}❌ Backend failed to start. Check logs:${NC}"
    echo "   tail -f backend/backend.log"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}✅ Backend is running!${NC}"

echo ""
echo "🎨 Starting Frontend..."
cd ../frontend
# Clear node_modules and reinstall if needed
if [ -d "node_modules" ]; then
    echo "   Using existing node_modules"
else
    echo "   Installing dependencies..."
    npm install
fi

# Start frontend with clear output
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
echo "   Logs: frontend/frontend.log"

echo "⏳ Waiting for frontend (5 seconds)..."
sleep 5

# Check if frontend started
if ! curl -s http://localhost:3000 > /dev/null; then
    echo -e "${RED}❌ Frontend failed to start. Check logs:${NC}"
    echo "   tail -f frontend/frontend.log"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}✅ Frontend is running!${NC}"

echo ""
echo -e "${GREEN}✨ System is ready!${NC}"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo ""
echo "📋 Test Credentials:"
echo "   • Email: test@example.com"
echo "   • Password: password123"
echo ""
echo "🐛 Debug Tools:"
echo "   • Backend logs: tail -f backend/backend.log"
echo "   • Frontend logs: tail -f frontend/frontend.log"
echo "   • MongoDB: mongosh manyani_rentals"
echo ""
echo -e "${RED}⚠️  Press Ctrl+C to stop all services${NC}"
echo ""

# Monitor logs
tail -f backend/backend.log frontend/frontend.log &
TAIL_PID=$!

trap "echo ''; echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID $TAIL_PID 2>/dev/null; exit 0" INT
wait
