#!/bin/bash

echo "Starting KEC Fitness Tracker Development Environment..."
echo

echo "Installing backend dependencies..."
cd backend
npm install
echo

echo "Installing frontend dependencies..."
cd ../frontend
npm install
cd ..
echo

echo "Starting MongoDB (make sure MongoDB is installed and running)..."
echo "If MongoDB is not running, please start it manually."
echo

echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "Waiting for backend to start..."
sleep 3

echo "Starting frontend development server..."
cd frontend && npm start &
FRONTEND_PID=$!

echo
echo "========================================"
echo "KEC Fitness Tracker is starting up!"
echo "========================================"
echo
echo "Backend API: http://localhost:5000"
echo "Frontend App: http://localhost:3000"
echo
echo "Press Ctrl+C to stop all servers"

# Function to cleanup processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
