const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  // reflect request origin automatically
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(express.json());

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'KEC Fitness Tracker API is running!' });
});

// Health check route
app.use('/api/health', require('./routes/health'));

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// User routes
app.use('/api/users', require('./routes/users'));

// Workout routes
app.use('/api/workouts', require('./routes/workouts'));

// Diet routes
app.use('/api/diet', require('./routes/diet'));

// Progress routes
app.use('/api/progress', require('./routes/progress'));

// Community routes
app.use('/api/community', require('./routes/community'));

// Admin routes
app.use('/api/admin', require('./routes/admin'));

// Recommendation routes
app.use('/api/recommendations', require('./routes/recommendations'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
}); 