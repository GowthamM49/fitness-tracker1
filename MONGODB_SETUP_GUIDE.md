# 🗄️ MongoDB Setup Guide for KEC Fitness Tracker

## 📋 Current Status

### ✅ **Models Configured:**
- **User Model**: Authentication, roles, profile data
- **Workout Model**: Exercise tracking, duration, calories
- **Meal Model**: Nutrition tracking, macronutrients
- **Progress Model**: Weight tracking, goals
- **Challenge Model**: Community challenges
- **ForumThread Model**: Community discussions

### ❌ **MongoDB Status**: Not Running

## 🚀 **Setup Options**

### **Option 1: Local MongoDB Installation**

#### **Step 1: Install MongoDB**
```bash
# Download MongoDB Community Server from:
# https://www.mongodb.com/try/download/community

# Or use package manager:
# Windows (with Chocolatey):
choco install mongodb

# macOS (with Homebrew):
brew install mongodb-community

# Ubuntu/Debian:
sudo apt-get install mongodb
```

#### **Step 2: Start MongoDB Service**
```bash
# Windows:
net start MongoDB

# macOS/Linux:
sudo systemctl start mongod
# or
mongod --dbpath /data/db
```

#### **Step 3: Verify Installation**
```bash
# Check if MongoDB is running:
netstat -ano | findstr :27017

# Test connection:
cd "Fitness Tracker/backend"
npm run test-mongodb
```

### **Option 2: MongoDB Atlas (Cloud) - Recommended**

#### **Step 1: Create Atlas Account**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create a new cluster (free tier available)

#### **Step 2: Get Connection String**
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string

#### **Step 3: Update Environment Variables**
Create/update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### **Option 3: Docker MongoDB**

#### **Step 1: Install Docker**
Download from [Docker Desktop](https://www.docker.com/products/docker-desktop)

#### **Step 2: Run MongoDB Container**
```bash
docker run --name mongodb-fitness -p 27017:27017 -d mongo:latest
```

#### **Step 3: Verify Container**
```bash
docker ps
```

## 🔧 **Database Configuration**

### **Current Models Structure:**

#### **User Model:**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['student', 'faculty', 'admin'],
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

#### **Workout Model:**
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  date: Date,
  duration: Number,
  exercises: [{
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    restTime: Number,
    notes: String
  }],
  notes: String,
  totalExercises: Number,
  totalSets: Number,
  totalReps: Number,
  estimatedCalories: Number
}
```

#### **Meal Model:**
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  mealType: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
  date: Date,
  foodItems: [{
    name: String,
    quantity: Number,
    unit: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number
  }],
  notes: String,
  totalCalories: Number,
  totalProtein: Number,
  totalCarbs: Number,
  totalFat: Number,
  totalQuantity: Number
}
```

#### **Progress Model:**
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  weight: Number,
  bodyFat: Number,
  muscleMass: Number,
  notes: String
}
```

#### **Challenge Model:**
```javascript
{
  title: String,
  description: String,
  participants: Number,
  comments: [{
    userId: ObjectId (ref: User),
    userName: String,
    text: String,
    createdAt: Date
  }]
}
```

## 🧪 **Testing Data Storage**

### **Test Connection:**
```bash
cd "Fitness Tracker/backend"
npm run test-mongodb
```

### **Expected Output:**
```
Testing MongoDB connection...
Connection string: mongodb://localhost:27017/fitness-tracker
✅ MongoDB connection successful!
✅ Database write test successful!
✅ Database cleanup successful!
✅ Connection closed successfully!
```

## 🔄 **Data Migration (if needed)**

If you have existing data in localStorage, you can migrate it to MongoDB by:

1. **Start the backend server**
2. **Use the API endpoints** to save data
3. **Check admin panel** for data verification

## 📊 **Admin Panel Data Verification**

Once MongoDB is running:

1. **Start the backend server**: `npm run dev`
2. **Start the frontend**: `npm start`
3. **Login as admin/faculty**
4. **Go to Admin Panel**
5. **Check Dashboard** for user counts and statistics
6. **Generate reports** to verify data storage

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **MongoDB not starting:**
   - Check if port 27017 is free
   - Verify MongoDB service is running
   - Check firewall settings

2. **Connection refused:**
   - Verify MongoDB is running
   - Check connection string
   - Verify network access (for Atlas)

3. **Authentication failed:**
   - Check username/password
   - Verify database permissions
   - Check IP whitelist (for Atlas)

### **Quick Fix Commands:**
```bash
# Kill processes on port 27017
netstat -ano | findstr :27017
taskkill /PID <PID> /F

# Restart MongoDB service
net stop MongoDB
net start MongoDB

# Test connection
npm run test-mongodb
```

## 📈 **Next Steps After Setup:**

1. ✅ **Verify MongoDB connection**
2. ✅ **Test data operations**
3. ✅ **Check admin panel functionality**
4. ✅ **Generate sample reports**
5. ✅ **Verify all CRUD operations**

---

**Need Help?** Check the console logs when starting the backend server for detailed error messages.
