# KEC Fitness Tracker

A comprehensive health management platform designed for students, faculty, and fitness enthusiasts at KEC. The system allows users to track workouts, monitor diet, analyze progress, and participate in community challenges.

## 🚀 Quick Start Commands

### **Frontend (React App)**
```bash
# Navigate to frontend directory
cd "Fitness Tracker/frontend"

# Install dependencies
npm install

# Start development server (default port: 3001)
npm start

# Or specify custom port:
npm run start:3000  # Run on port 3000
npm run start:3001  # Run on port 3001 (default)
npm run start:3002  # Run on port 3002
```
**Frontend will run on:** `http://localhost:3001` (default)

### **Backend (Node.js API)**
```bash
# Navigate to backend directory
cd "Fitness Tracker/backend"

# Install dependencies
npm install

# Start development server
npm run dev
```
**Backend will run on:** `http://localhost:5000`

### **Run Both Simultaneously**
Open two terminal windows:

**Terminal 1 (Frontend):**
```bash
cd "Fitness Tracker/frontend"
npm start
```

**Terminal 2 (Backend):**
```bash
cd "Fitness Tracker/backend"
npm run dev
```

## 🚀 Features

### Core Modules
- **User Management**: Secure authentication with JWT, profile management
- **Workout Tracking**: Log exercises, track sets/reps, workout history
- **Diet & Nutrition**: Meal logging, calorie tracking, nutrition analysis
- **Progress Analytics**: BMI tracking, weight changes, performance trends
- **Community**: Fitness challenges, leaderboards, social features
- **Fitness Calculators**: BMI, BMR, TDEE, calorie targets, macronutrient breakdown

### Technology Stack

#### Frontend
- **React.js** - Dynamic UI and component-based architecture
- **React Router** - Navigation between modules
- **Material-UI** - Modern and responsive design components
- **Custom CSS** - Styled components and utility classes
- **Recharts** - Fitness analytics & visualizations
- **Axios** - HTTP client for API communication

#### Backend
- **Node.js** - JavaScript runtime for backend logic
- **Express.js** - Framework for creating RESTful APIs
- **JWT** - Authentication & secure user sessions
- **bcrypt.js** - Password hashing and security
- **MongoDB** - Database (planned)
- **Mongoose** - Object modeling for MongoDB (planned)

## 📦 Project Structure

```
Fitness Tracker/
├── frontend/               # Frontend React app
│   ├── src/               # Source files
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React Context for state management
│   │   ├── services/     # API services
│   │   └── ...
│   ├── public/            # Public static assets
│   ├── package.json       # Frontend dependencies
│   └── node_modules/     # Frontend dependencies
├── backend/               # Backend Node.js API
│   ├── routes/            # API routes
│   ├── models/            # Database models (planned)
│   ├── middleware/        # Custom middleware
│   └── server.js          # Main server file
├── start-dev.bat          # Windows development startup script
├── start-dev.sh           # Linux/Mac development startup script
└── README.md             # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for full functionality)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Fitness Tracker"
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Start Frontend**
   ```bash
   # From the frontend directory
   cd frontend
   npm start
   ```

5. **Start Backend**
   ```bash
   # From the backend directory
   cd backend
   npm run dev
   ```

## 🎯 Available Scripts

### Frontend Scripts
- `npm start` - Starts the development server
- `npm build` - Creates a production build
- `npm test` - Runs the test suite
- `npm run eject` - Ejects from Create React App (irreversible)

### Backend Scripts
- `npm run dev` - Starts development server with nodemon
- `npm start` - Starts production server
- `npm test` - Runs the test suite

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### API Endpoints
- **Base URL**: `http://localhost:5000/api`
- **Auth**: `/api/auth/login`, `/api/auth/register`
- **Users**: `/api/users/profile`
- **Workouts**: `/api/workouts`
- **Diet**: `/api/diet`
- **Progress**: `/api/progress`
- **Community**: `/api/community`

## 📱 Features Overview

### Authentication System
- ✅ JWT-based authentication
- ✅ Secure login/register forms
- ✅ Protected routes
- ✅ User session management

### Dashboard
- ✅ Overview cards with key metrics
- ✅ Progress tracking visualization
- ✅ Quick action buttons
- ✅ Responsive design

### Navigation
- ✅ Sidebar navigation
- ✅ Top navbar with user menu
- ✅ Responsive layout
- ✅ Active route highlighting

## 🚧 Development Status

### Completed ✅
- Project structure setup
- Authentication system (frontend + backend)
- Dashboard with mock data
- Navigation and routing
- UI components with Material-UI
- Basic API structure
- Fitness calculation utilities (BMI, BMR, TDEE, calories, macros)
- Interactive calculator components

### In Progress 🔄
- Database integration
- Real data integration
- Workout tracking module
- Diet & nutrition module

### Planned 📋
- Progress analytics with charts
- Community features
- Profile management
- Mobile responsiveness improvements

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Material-UI components with custom styling
- **Accessibility**: ARIA labels and keyboard navigation
- **Loading States**: Progress indicators for better UX
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation feedback

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Protected Routes**: Authentication-based access control
- **Input Validation**: Client and server-side validation
- **CORS Configuration**: Secure API communication

## 📊 Performance

- **Code Splitting**: Lazy loading for better performance
- **Optimized Builds**: Production-ready builds
- **Caching**: Browser caching for static assets
- **Bundle Analysis**: Webpack bundle analyzer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Frontend Development**: React.js, Material-UI, Custom CSS
- **Backend Development**: Node.js, Express.js
- **Database**: MongoDB, Mongoose (planned)
- **Authentication**: JWT, bcrypt

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**KEC Fitness Tracker** - Empowering healthy lifestyles through technology! 💪

# fitness-tracker  
"# fitness-tracker3" 
