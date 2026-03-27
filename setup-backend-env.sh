#!/bin/bash

echo "Setting up Backend Environment..."

cd backend

echo ""
echo "Available environments:"
echo "1. Development (default)"
echo "2. Staging"
echo "3. Production"
echo ""
read -p "Choose environment (1-3): " choice

case $choice in
    1)
        cp env.development .env
        echo "✅ Created backend/.env from env.development"
        ;;
    2)
        cp env.staging .env
        echo "✅ Created backend/.env from env.staging"
        ;;
    3)
        cp env.production .env
        echo "✅ Created backend/.env from env.production"
        ;;
    *)
        cp env.development .env
        echo "✅ Created backend/.env from env.development (default)"
        ;;
esac

echo ""
echo "🎉 Backend environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Review and update backend/.env if needed"
echo "2. Start backend: cd backend && npm start"
echo ""
