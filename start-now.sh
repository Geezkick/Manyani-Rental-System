#!/bin/bash

echo "🏠 Starting Manyani Rental System..."
echo ""

# Colors
BROWN='\033[38;5;130m'
GREEN='\033[38;5;28m'
NC='\033[0m'

echo -e "${BROWN}========================================${NC}"
echo -e "${BROWN}   Manyani Rental Management System${NC}"
echo -e "${BROWN}========================================${NC}"
echo ""

# Check MongoDB
echo "🗄️  Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "   Starting MongoDB..."
    sudo systemctl start mongod
    sleep 2
fi

# Clear any existing data to avoid validation errors
echo "🗑️  Clearing old database (if any)..."
mongosh manyani_rentals --eval "db.dropDatabase()" --quiet

echo ""
echo "🔧 Starting Backend..."
cd backend
npm run dev &
BACKEND_PID=$!

echo "⏳ Waiting for backend..."
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
echo "📋 Test Registration:"
echo "   • Go to http://localhost:3000/register"
echo "   • Fill in the form (National ID photo NOT required)"
echo "   • Click 'Create Account'"
echo ""
echo "⚠️  Press Ctrl+C to stop"

trap "echo ''; echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT
wait
