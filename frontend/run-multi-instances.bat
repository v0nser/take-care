@echo off
echo 🚀 TakeCare Multi-Instance Setup
echo ==================================
echo 📋 This will run multiple instances of the same TakeCare app
echo 📋 Each instance can be used to test different user roles (doctor, patient, admin)
echo 📋 All instances share the same backend server on port 5000
echo 📋 Socket connections are properly isolated per instance
echo.

REM Check if backend is running
echo 🔍 Checking if backend is running on port 5000...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Backend server is not running on port 5000!
    echo    Please start your backend server first:
    echo    cd backend ^&^& npm start
    echo.
    pause
    exit /b 1
)
echo ✅ Backend server is running on port 5000
echo.

echo 🏥 Starting TakeCare instances...
echo.

REM Start Doctor Portal Instance (Port 5173)
echo 👨‍⚕️  Starting Doctor Portal Instance (Port 5173)...
start "Doctor Portal" cmd /k "set INSTANCE_ID=doctor && set PORT=5173 && npm run dev:multi"

REM Start Patient Portal Instance (Port 5174)
echo 👤 Starting Patient Portal Instance (Port 5174)...
start "Patient Portal" cmd /k "set INSTANCE_ID=patient && set PORT=5174 && npm run dev:multi"

REM Start Admin Portal Instance (Port 5175)
echo 👨‍💼 Starting Admin Portal Instance (Port 5175)...
start "Admin Portal" cmd /k "set INSTANCE_ID=admin && set PORT=5175 && npm run dev:multi"

echo.
echo ✅ All TakeCare instances are starting up!
echo.
echo 🌐 Access URLs:
echo    👨‍⚕️  Doctor Portal:  http://localhost:5173
echo    👤 Patient Portal:  http://localhost:5174
echo    👨‍💼 Admin Portal:   http://localhost:5175
echo    🔧 Backend API:     http://localhost:5000
echo.
echo 📱 Testing Instructions:
echo    1. Open each portal in a separate browser tab/window
echo    2. Log in with different user accounts (doctor, patient, admin)
echo    3. Test real-time features - each instance has isolated sockets
echo    4. All instances share the same backend data
echo.
echo 🔌 Socket Status:
echo    - Each instance has unique socket connections
echo    - No conflicts between instances
echo    - Real-time updates work independently per instance
echo.
echo All instances are now running in separate windows.
echo Close the windows to stop the portals.
pause 