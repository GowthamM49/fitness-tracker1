# 🏋️‍♂️ KEC Fitness Tracker - Complete Setup Guide

## 🚀 Quick Start (Windows)

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download here](https://git-scm.com/)

### One-Click Setup (Windows)
1. **Double-click** `start-dev.bat` in the project root
2. **Wait** for all dependencies to install
3. **Open** http://localhost:3000 in your browser
4. **Login** with admin credentials: `admin@kec.com` / `admin123`

---

## 🛠️ Manual Setup

### Step 1: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
copy env.example .env

# Start backend server
npm run dev
```

### Step 2: Frontend Setup
```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Start frontend server
npm start
```

### Step 3: Database Setup
```bash
# Make sure MongoDB is running
# Create admin user (optional)
cd backend
node scripts/create-admin-user.js
```

---

## 📋 Complete Feature List

### 🔐 Authentication System
- **User Registration** with profile setup
- **Login/Logout** with JWT tokens
- **Password hashing** with bcrypt
- **Protected routes** with role-based access
- **Admin panel** for user management

### 🏃‍♂️ Workout Management
- **Log workouts** with exercises and sets
- **Workout history** with progress tracking
- **Exercise templates** for quick logging
- **Duration and intensity** tracking
- **Notes and personal records**

### 🍎 Diet & Nutrition
- **Meal logging** with detailed nutrition
- **30+ AI meal recommendations** based on fitness goals
- **Custom meal creation** with personal recipes
- **Nutrition dashboard** with macro tracking
- **Meal history** with search and filtering
- **Calorie and macro calculators**

### 📊 Progress & Analytics
- **Weight tracking** with progress charts
- **BMI calculator** with health insights
- **Goal setting** and achievement tracking
- **Analytics dashboard** with trends
- **Progress photos** and measurements
- **Export data** functionality

### 👥 Community Features
- **User profiles** with achievements
- **Progress sharing** and motivation
- **Community challenges** and competitions
- **Leaderboards** and rankings
- **Social interactions** and comments

### 🎯 Smart Recommendations
- **Personalized meal suggestions** based on:
  - Fitness goals (weight loss, gain, muscle building, maintenance)
  - User profile (age, gender, height, weight)
  - Meal history and preferences
  - Nutritional needs and restrictions
- **Custom meal creation** with rating system
- **Learning algorithm** that improves over time

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student/faculty/admin),
  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  fitnessGoal: String,
  points: Number,
  isActive: Boolean,
  lastLogin: Date,
  registrationDate: Date
}
```

### Meals Collection
```javascript
{
  userId: ObjectId,
  name: String,
  mealType: String (Breakfast/Lunch/Dinner/Snack),
  date: Date,
  foodItems: [{
    name: String,
    quantity: Number,
    unit: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  }],
  totalCalories: Number,
  totalProtein: Number,
  totalCarbs: Number,
  totalFat: Number,
  notes: String
}
```

### Workouts Collection
```javascript
{
  userId: ObjectId,
  name: String,
  date: Date,
  duration: Number,
  exercises: [{
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    duration: Number
  }],
  notes: String
}
```

### Progress Collection
```javascript
{
  userId: ObjectId,
  date: Date,
  weight: Number,
  bodyFat: Number,
  muscleMass: Number,
  measurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    arms: Number,
    thighs: Number
  },
  notes: String
}
```

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Workouts
- `GET /api/workouts` - Get user workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts/:id` - Get specific workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

### Diet
- `GET /api/diet` - Get user meals
- `POST /api/diet` - Create meal
- `GET /api/diet/:id` - Get specific meal
- `PUT /api/diet/:id` - Update meal
- `DELETE /api/diet/:id` - Delete meal

### Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Log progress
- `PUT /api/progress/:id` - Update progress
- `DELETE /api/progress/:id` - Delete progress

### Recommendations
- `GET /api/recommendations/meals` - Get meal recommendations
- `GET /api/recommendations/meals/:mealType` - Get recommendations by type
- `POST /api/recommendations/meals/custom` - Save custom meal
- `GET /api/recommendations/meals/custom` - Get custom meals
- `POST /api/recommendations/meals/:id/rate` - Rate meal

### Community
- `GET /api/community/users` - Get community users
- `GET /api/community/leaderboard` - Get leaderboard
- `POST /api/community/challenges` - Create challenge
- `GET /api/community/challenges` - Get challenges

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get system statistics

---

## 🎨 Frontend Components

### Pages
- **Dashboard** - Overview and quick actions
- **WorkoutPage** - Workout logging and history
- **DietPage** - Meal logging and recommendations
- **ProgressPage** - Progress tracking and analytics
- **CommunityPage** - Social features and challenges
- **ProfilePage** - User profile and settings
- **AdminPanel** - Admin management interface

### Components
- **MealLogger** - Log meals with nutrition tracking
- **MealRecommendations** - AI-powered meal suggestions
- **CustomMealCreator** - Create and save custom meals
- **WorkoutLogger** - Log workouts with exercises
- **ProgressTracker** - Track weight and measurements
- **AnalyticsDashboard** - Visualize progress data
- **CommunityFeatures** - Social interactions

---

## 🚀 Deployment

### Backend Deployment
1. **Set environment variables** in production
2. **Configure MongoDB** connection string
3. **Set JWT secret** for security
4. **Deploy to** Heroku, AWS, or DigitalOcean

### Frontend Deployment
1. **Build production** version: `npm run build`
2. **Deploy to** Netlify, Vercel, or AWS S3
3. **Configure API** endpoints for production

---

## 🔒 Security Features

- **JWT authentication** with secure tokens
- **Password hashing** with bcrypt
- **CORS protection** for API security
- **Input validation** and sanitization
- **Role-based access** control
- **Rate limiting** (can be added)

---

## 📱 Mobile Responsiveness

- **Fully responsive** design for all devices
- **Mobile-first** approach
- **Touch-friendly** interface
- **Progressive Web App** ready

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
npm test
```

---

## 📈 Performance Features

- **Lazy loading** for better performance
- **Image optimization** for faster loading
- **Caching** for frequently accessed data
- **Database indexing** for faster queries
- **Code splitting** for smaller bundles

---

## 🎯 User Experience

- **Intuitive navigation** with sidebar
- **Real-time updates** for progress tracking
- **Smart recommendations** based on user data
- **Visual feedback** for all actions
- **Accessibility** features for all users

---

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes

3. **Dependencies Issues**
   - Delete node_modules and package-lock.json
   - Run npm install again

4. **CORS Errors**
   - Check API URL configuration
   - Verify CORS settings in server.js

### Support
- Check the main README.md for detailed setup
- Review error logs in console
- Ensure all prerequisites are installed

---

## 🎉 Success!

Once everything is running, you'll have a complete fitness tracking application with:

✅ **User authentication and management**  
✅ **Workout logging and tracking**  
✅ **Meal logging with AI recommendations**  
✅ **Progress tracking and analytics**  
✅ **Community features and social interaction**  
✅ **Admin panel for user management**  
✅ **Mobile-responsive design**  
✅ **Secure API with proper authentication**  

**Access your app at:** http://localhost:3000  
**API documentation at:** http://localhost:5000  

**Default admin login:** admin@kec.com / admin123
