const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();

// Environment validation
const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// Middleware
const allowedOriginsFromEnv = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// Always include FRONTEND_URL if provided, plus localhost for dev
const staticAllowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3010',
  'http://127.0.0.1:3010',
  // legacy defaults (if you still open the old URLs)
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

const allowedOrigins = Array.from(new Set([
  ...staticAllowedOrigins,
  ...allowedOriginsFromEnv
]));

const isVercelPreview = (origin) => {
  if (!origin) return false;
  try {
    const { hostname } = new URL(origin);
    // Match *.vercel.app previews
    return hostname.endsWith('.vercel.app');
  } catch (_e) {
    return false;
  }
};

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (like curl/Postman) which may not send origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || isVercelPreview(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to database
connectDB();

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

// AI Fitness Coach (OpenAI optional; falls back to rule-based tips)
app.use('/api/coach', require('./routes/coach'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5010;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`📊 Environment: ${NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3010'}`);
}); 