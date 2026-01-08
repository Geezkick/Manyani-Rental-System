#!/bin/bash

echo "🔧 Fixing Manyani Application Issues..."
echo ""

# Fix frontend imports
echo "🎨 Fixing frontend imports..."
cd frontend
sed -i "s/ToastContainer/Toaster/g" src/main.tsx

# Fix backend duplicate variable declarations
echo "🔧 Fixing backend variable declarations..."
cd ../backend
sed -i '282s/const property = await/const propertyObj = await/' controllers/bookingController.js
sed -i '284s/if (property.landlord/if (propertyObj.landlord/' controllers/bookingController.js

echo ""
echo "✅ Issues fixed!"
echo ""
echo "🚀 Starting servers..."
echo ""

# Start backend
cd backend
npm run dev &
BACKEND_PID=$!

sleep 3

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
