@echo off
echo Setting up backend environment with your MongoDB URI...

echo MONGO_URI=mongodb+srv://gowthamm23it:1234567890@mern2025.oceilbj.mongodb.net/ > .env
echo JWT_SECRET=fitness-tracker-dev-secret-key-2024 >> .env
echo PORT=5010 >> .env
echo NODE_ENV=development >> .env
echo FRONTEND_URL=http://localhost:3010 >> .env
echo ADMIN_EMAIL=admin@fitness-tracker.dev >> .env
echo ADMIN_PASSWORD=admin123 >> .env

echo.
echo ✅ Backend .env file created successfully!
echo.
echo Environment variables set:
echo - MONGO_URI: Your MongoDB Atlas connection
echo - JWT_SECRET: Development secret key
echo - PORT: 5010
echo - NODE_ENV: development
echo - FRONTEND_URL: http://localhost:3010
echo.
echo You can now run: npm start
echo.
pause
