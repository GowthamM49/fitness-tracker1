@echo off
echo Setting up Backend Environment...

cd backend

echo.
echo Available environments:
echo 1. Development (default)
echo 2. Staging
echo 3. Production
echo.
set /p choice="Choose environment (1-3): "

if "%choice%"=="1" (
    copy env.development .env
    echo ✅ Created backend/.env from env.development
) else if "%choice%"=="2" (
    copy env.staging .env
    echo ✅ Created backend/.env from env.staging
) else if "%choice%"=="3" (
    copy env.production .env
    echo ✅ Created backend/.env from env.production
) else (
    copy env.development .env
    echo ✅ Created backend/.env from env.development (default)
)

echo.
echo 🎉 Backend environment setup complete!
echo.
echo Next steps:
echo 1. Review and update backend/.env if needed
echo 2. Start backend: cd backend && npm start
echo.
pause
