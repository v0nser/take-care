#!/bin/bash

# Multi-Instance TakeCare Runner
# This script runs multiple instances of the same TakeCare app for testing different user roles
# Each instance has a unique ID and port, but shares the same backend

echo "🚀 TakeCare Multi-Instance Setup"
echo "=================================="
echo "📋 This will run multiple instances of the same TakeCare app"
echo "📋 Each instance can be used to test different user roles (doctor, patient, admin)"
echo "📋 All instances share the same backend server on port 5000"
echo "📋 Socket connections are properly isolated per instance"
echo ""

# Check if backend is running
echo "🔍 Checking if backend is running on port 5000..."
if ! curl -s http://localhost:5000/api/health > /dev/null; then
    echo "❌ Backend server is not running on port 5000!"
    echo "   Please start your backend server first:"
    echo "   cd backend && npm start"
    echo ""
    exit 1
fi
echo "✅ Backend server is running on port 5000"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all TakeCare instances..."
    pkill -f "vite.*vite.config.multi.js" 2>/dev/null
    echo "✅ All instances stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "🏥 Starting TakeCare instances..."
echo ""

# Start Doctor Portal Instance (Port 5173)
echo "👨‍⚕️  Starting Doctor Portal Instance (Port 5173)..."
INSTANCE_ID=doctor PORT=5173 npm run dev:multi &
DOCTOR_PID=$!
sleep 2

# Start Patient Portal Instance (Port 5174)
echo "👤 Starting Patient Portal Instance (Port 5174)..."
INSTANCE_ID=patient PORT=5174 npm run dev:multi &
PATIENT_PID=$!
sleep 2

# Start Admin Portal Instance (Port 5175)
echo "👨‍💼 Starting Admin Portal Instance (Port 5175)..."
INSTANCE_ID=admin PORT=5175 npm run dev:multi &
ADMIN_PID=$!
sleep 2

echo ""
echo "✅ All TakeCare instances are starting up!"
echo ""
echo "🌐 Access URLs:"
echo "   👨‍⚕️  Doctor Portal:  http://localhost:5173"
echo "   👤 Patient Portal:  http://localhost:5174"
echo "   👨‍💼 Admin Portal:   http://localhost:5175"
echo "   🔧 Backend API:     http://localhost:5000"
echo ""
echo "📱 Testing Instructions:"
echo "   1. Open each portal in a separate browser tab/window"
echo "   2. Log in with different user accounts (doctor, patient, admin)"
echo "   3. Test real-time features - each instance has isolated sockets"
echo "   4. All instances share the same backend data"
echo ""
echo "🔌 Socket Status:"
echo "   - Each instance has unique socket connections"
echo "   - No conflicts between instances"
echo "   - Real-time updates work independently per instance"
echo ""
echo "Press Ctrl+C to stop all instances"

# Wait for all processes
wait $DOCTOR_PID $PATIENT_PID $ADMIN_PID 