#!/bin/bash

echo "Setting up Frontend Environment..."

cd frontend

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
        echo "✅ Created frontend/.env from env.development"
        ;;
    2)
        cp env.staging .env
        echo "✅ Created frontend/.env from env.staging"
        ;;
    3)
        cp env.production .env
        echo "✅ Created frontend/.env from env.production"
        ;;
    *)
        cp env.development .env
        echo "✅ Created frontend/.env from env.development (default)"
        ;;
esac

echo ""
echo "🎉 Frontend environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Review and update frontend/.env if needed"
echo "2. Start frontend: cd frontend && npm start"
echo ""
