#!/bin/bash

echo "Setting up environment files for Fitness Tracker..."

echo ""
echo "Setting up Backend environment..."
cd backend
if [ ! -f .env ]; then
    cp env.local .env
    echo "✅ Created backend/.env from env.local"
else
    echo "⚠️  backend/.env already exists, skipping..."
fi

echo ""
echo "Setting up Frontend environment..."
cd ../frontend
if [ ! -f .env ]; then
    cp env.local .env
    echo "✅ Created frontend/.env from env.local"
else
    echo "⚠️  frontend/.env already exists, skipping..."
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Review and update the .env files if needed"
echo "2. Start the backend: cd backend && npm start"
echo "3. Start the frontend: cd frontend && npm start"
echo ""
