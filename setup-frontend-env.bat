@echo off
echo Setting up Frontend Environment...

cd frontend

echo.
echo Available environments:
echo 1. Development (default)
echo 2. Staging
echo 3. Production
echo.
set /p choice="Choose environment (1-3): "

if "%choice%"=="1" (
    copy env.development .env
    echo ✅ Created frontend/.env from env.development
) else if "%choice%"=="2" (
    copy env.staging .env
    echo ✅ Created frontend/.env from env.staging
) else if "%choice%"=="3" (
    copy env.production .env
    echo ✅ Created frontend/.env from env.production
) else (
    copy env.development .env
    echo ✅ Created frontend/.env from env.development (default)
)

echo.
echo 🎉 Frontend environment setup complete!
echo.
echo Next steps:
echo 1. Review and update frontend/.env if needed
echo 2. Start frontend: cd frontend && npm start
echo.
pause
