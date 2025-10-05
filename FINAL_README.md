# 🏋️‍♂️ KEC Fitness Tracker - Complete Health Management Platform

## 🌟 Overview

The KEC Fitness Tracker is a comprehensive, full-stack web application designed for students, faculty, and fitness enthusiasts to manage their health and fitness journey. Built with modern technologies, it provides personalized recommendations, progress tracking, and community features.

## ✨ Key Features

### 🔐 **Authentication & User Management**
- Secure user registration and login
- Role-based access (Student, Faculty, Admin)
- Profile management with fitness goals
- JWT-based authentication

### 🏃‍♂️ **Workout Management**
- Log workouts with exercises and sets
- Workout history and progress tracking
- Exercise templates and personal records
- Duration and intensity tracking

### 🍎 **Advanced Diet & Nutrition**
- **30+ AI-powered meal recommendations** based on fitness goals
- **Custom meal creation** with personal recipes
- Detailed nutrition tracking (calories, macros, micronutrients)
- Meal history with search and filtering
- Smart recommendations that learn from user preferences

### 📊 **Progress & Analytics**
- Weight and body measurements tracking
- BMI calculator with health insights
- Visual progress charts and trends
- Goal setting and achievement tracking
- Data export functionality

### 👥 **Community Features**
- User profiles with achievements
- Progress sharing and motivation
- Community challenges and competitions
- Leaderboards and social interactions

### 🎯 **Smart AI Recommendations**
- **Personalized meal suggestions** based on:
  - Fitness goals (weight loss, gain, muscle building, maintenance)
  - User profile (age, gender, height, weight)
  - Meal history and food preferences
  - Nutritional needs and dietary restrictions
- **Learning algorithm** that improves recommendations over time
- **Rating system** for continuous improvement

## 🚀 Quick Start

### Option 1: One-Click Setup (Windows)
```bash
# Double-click start-dev.bat
# Wait for installation
# Open http://localhost:3000
# Login: admin@kec.com / admin123
```

### Option 2: Manual Setup
```bash
# Install all dependencies
npm run install-all

# Start both servers
npm run dev

# Or start individually:
# Backend: cd backend && npm run dev
# Frontend: npm start
```

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React 19** with modern hooks
- **Material-UI** for beautiful components
- **React Router** for navigation
- **Axios** for API communication
- **Recharts** for data visualization

### Database
- **MongoDB** with comprehensive schemas
- **User management** with roles and permissions
- **Meal tracking** with detailed nutrition data
- **Workout logging** with exercise tracking
- **Progress monitoring** with analytics

## 📁 Project Structure

```
Fitness Tracker/
├── backend/                 # Backend API
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/          # Authentication middleware
│   ├── scripts/            # Database setup scripts
│   └── server.js           # Main server file
├── src/                    # Frontend React app
│   ├── components/         # Reusable components
│   ├── pages/              # Main application pages
│   ├── services/           # API service functions
│   ├── context/            # React context providers
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── docs/                   # Documentation
```

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
  mealType: String,
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

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Workouts
- `GET /api/workouts` - Get user workouts
- `POST /api/workouts` - Create workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

### Diet & Nutrition
- `GET /api/diet` - Get user meals
- `POST /api/diet` - Create meal
- `GET /api/diet/:id` - Get specific meal
- `PUT /api/diet/:id` - Update meal
- `DELETE /api/diet/:id` - Delete meal

### Smart Recommendations
- `GET /api/recommendations/meals` - Get AI meal recommendations
- `GET /api/recommendations/meals/:mealType` - Get recommendations by type
- `POST /api/recommendations/meals/custom` - Save custom meal
- `GET /api/recommendations/meals/custom` - Get user's custom meals
- `POST /api/recommendations/meals/:id/rate` - Rate meal recommendations

### Progress Tracking
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Log progress
- `PUT /api/progress/:id` - Update progress
- `DELETE /api/progress/:id` - Delete progress

### Community
- `GET /api/community/users` - Get community users
- `GET /api/community/leaderboard` - Get leaderboard
- `POST /api/community/challenges` - Create challenge
- `GET /api/community/challenges` - Get challenges

### Admin Panel
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get system statistics

## 🎨 Frontend Components

### Main Pages
- **Dashboard** - Overview with quick actions and stats
- **WorkoutPage** - Workout logging and history
- **DietPage** - Meal logging with AI recommendations
- **ProgressPage** - Progress tracking and analytics
- **CommunityPage** - Social features and challenges
- **ProfilePage** - User profile and settings
- **AdminPanel** - Admin management interface

### Key Components
- **MealLogger** - Log meals with detailed nutrition
- **MealRecommendations** - AI-powered meal suggestions
- **CustomMealCreator** - Create and save custom meals
- **WorkoutLogger** - Log workouts with exercises
- **ProgressTracker** - Track weight and measurements
- **AnalyticsDashboard** - Visualize progress data
- **CommunityFeatures** - Social interactions

## 🎯 Smart Features

### AI Meal Recommendations
- **30+ diverse meal templates** across all fitness goals
- **Personalized suggestions** based on user profile
- **Learning algorithm** that improves over time
- **Custom meal integration** with user creations
- **Rating system** for continuous improvement

### Progress Analytics
- **Visual charts** for weight and measurements
- **Trend analysis** with insights
- **Goal tracking** with achievements
- **Data export** for external analysis

### Community Features
- **User profiles** with achievements
- **Progress sharing** and motivation
- **Challenges** and competitions
- **Leaderboards** and rankings

## 🔒 Security Features

- **JWT authentication** with secure tokens
- **Password hashing** with bcrypt
- **CORS protection** for API security
- **Input validation** and sanitization
- **Role-based access** control
- **Protected routes** for sensitive data

## 📱 Responsive Design

- **Mobile-first** approach
- **Fully responsive** for all devices
- **Touch-friendly** interface
- **Progressive Web App** ready
- **Accessibility** features included

## 🚀 Deployment

### Backend Deployment
1. Set environment variables in production
2. Configure MongoDB connection string
3. Set JWT secret for security
4. Deploy to Heroku, AWS, or DigitalOcean

### Frontend Deployment
1. Build production version: `npm run build`
2. Deploy to Netlify, Vercel, or AWS S3
3. Configure API endpoints for production

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

## 📈 Performance Features

- **Lazy loading** for better performance
- **Image optimization** for faster loading
- **Caching** for frequently accessed data
- **Database indexing** for faster queries
- **Code splitting** for smaller bundles

## 🔧 Environment Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
```

### Frontend
- API proxy configured for development
- Environment variables for production
- CORS settings for cross-origin requests

## 🎉 Success Metrics

Once running, you'll have:

✅ **Complete authentication system**  
✅ **Advanced workout tracking**  
✅ **AI-powered meal recommendations**  
✅ **Comprehensive progress analytics**  
✅ **Community features and social interaction**  
✅ **Admin panel for user management**  
✅ **Mobile-responsive design**  
✅ **Secure API with proper authentication**  
✅ **30+ diverse meal recommendations**  
✅ **Custom meal creation system**  
✅ **Smart learning algorithms**  

## 🌐 Access Points

- **Frontend Application:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000/api
- **Admin Panel:** http://localhost:3000/admin

## 👤 Default Credentials

- **Admin Login:** admin@kec.com / admin123
- **Test User:** user@kec.com / user123

## 📞 Support

- Check `COMPLETE_SETUP_GUIDE.md` for detailed setup
- Review error logs in console
- Ensure all prerequisites are installed
- MongoDB must be running for database operations

---

**🎯 Ready to transform your fitness journey with AI-powered recommendations and comprehensive tracking!**
