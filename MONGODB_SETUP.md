# MongoDB Setup Guide for Fitness Tracker

## Prerequisites
1. Install MongoDB Community Edition on your system
2. Make sure MongoDB service is running

## Setup Steps

### 1. Install MongoDB (if not already installed)
- **Windows**: Download from https://www.mongodb.com/try/download/community
- **macOS**: `brew install mongodb-community`
- **Linux**: Follow official MongoDB installation guide

### 2. Start MongoDB Service
- **Windows**: MongoDB should start automatically as a service
- **macOS**: `brew services start mongodb-community`
- **Linux**: `sudo systemctl start mongod`

### 3. Create Environment File
Create a `.env` file in the `backend` directory with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 4. Install Dependencies
```bash
cd "Fitness Tracker/backend"
npm install
```

### 5. Start the Backend Server
```bash
npm run dev
```

### 6. Test MongoDB Connection
The server should log "Connected to MongoDB" when started successfully.

## Database Collections Created
- `users` - User accounts and profiles
- `workouts` - Workout logs and exercises
- `meals` - Meal logs and nutrition data
- `progressentries` - Weight and progress tracking
- `goals` - Fitness goals and targets
- `challenges` - Community challenges
- `forumthreads` - Community forum posts

## API Endpoints Now Available
- **Authentication**: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`
- **Workouts**: `/api/workouts` (GET, POST, PUT, DELETE)
- **Diet**: `/api/diet` (GET, POST, PUT, DELETE)
- **Progress**: `/api/progress/entries`, `/api/progress/goals`
- **Community**: `/api/community`

## Testing the Setup
1. Start the backend server
2. Start the frontend application
3. Register a new user
4. Try logging a workout or meal
5. Check MongoDB to see the data being stored

## Troubleshooting
- If MongoDB connection fails, ensure MongoDB service is running
- Check if port 27017 is available
- Verify the connection string in `.env` file
- Check MongoDB logs for any errors
