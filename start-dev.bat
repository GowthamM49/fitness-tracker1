@echo off
echo Starting KEC Fitness Tracker Development Environment...
echo.

echo Installing backend dependencies...
cd backend
call npm install
echo.

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo.

echo Starting MongoDB (make sure MongoDB is installed and running)...
echo If MongoDB is not running, please start it manually.
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo Starting frontend development server...
start "Frontend Server" cmd /k "cd frontend && npm start"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo KEC Fitness Tracker is starting up!
echo ========================================
echo.
echo Backend API: http://localhost:5000
echo Frontend App: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
