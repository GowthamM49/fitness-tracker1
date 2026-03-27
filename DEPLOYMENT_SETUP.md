# 🚀 Deployment Setup Guide

This guide will help you set up proper environment variables for both local development and production deployment.

## 📁 Environment Files Created

### 1. Backend Environment Files

- `backend/env.example` - Template with example values
- `backend/env.local` - Local development configuration
- `backend/env.production` - Production deployment configuration

### 2. Frontend Environment Files

- `frontend/env.example` - Template with example values

## 🔧 Setup Instructions

### Step 1: Backend Environment Setup

1. **For Local Development:**
   ```bash
   cd backend
   cp env.local .env
   ```

2. **For Production Deployment:**
   ```bash
   cd backend
   cp env.production .env
   # Edit .env with your actual production values
   ```

### Step 2: Frontend Environment Setup

1. **For Local Development:**
   ```bash
   cd frontend
   cp env.example .env
   # Edit .env with your local backend URL
   ```

2. **For Production Deployment:**
   ```bash
   cd frontend
   cp env.example .env
   # Edit .env with your production backend URL
   ```

## 🔑 Required Environment Variables

### Backend (.env)

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/fitness-tracker

# JWT Secret (IMPORTANT: Change this!)
JWT_SECRET=your-super-secure-jwt-secret-key

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=admin@fitness-tracker.com
ADMIN_PASSWORD=YourSecurePassword123!

# API Configuration
API_BASE_URL=http://localhost:5000/api
```

### Frontend (.env)

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5000/api

# For production, use your deployed backend URL:
# REACT_APP_API_URL=https://your-backend-domain.herokuapp.com/api
```

## 🌐 Production Deployment

### Backend Deployment (Heroku/Railway/Render)

1. **Set Environment Variables in your hosting platform:**
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A secure random string
   - `NODE_ENV` - Set to "production"
   - `FRONTEND_URL` - Your deployed frontend URL
   - `ADMIN_EMAIL` - Your admin email
   - `ADMIN_PASSWORD` - Your admin password

2. **Deploy your backend code**

### Frontend Deployment (Vercel/Netlify)

1. **Set Environment Variables in Vercel:**
   - `REACT_APP_API_URL` - Your deployed backend URL

2. **Deploy your frontend code**

## 🔒 Security Notes

1. **Never commit `.env` files to version control**
2. **Use strong, unique JWT secrets in production**
3. **Use MongoDB Atlas for production database**
4. **Enable CORS only for your frontend domain in production**
5. **Use HTTPS in production**

## 🧪 Testing Your Setup

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Test API:**
   - Visit `http://localhost:5000/api/health`
   - Should return: `{"status":"OK","message":"Backend is running"}`

## 📝 Environment Variable Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/fitness-tracker` |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `PORT` | Server port | No | `5000` |
| `NODE_ENV` | Environment mode | No | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | No | `http://localhost:3000` |
| `ADMIN_EMAIL` | Admin user email | No | `admin@fitness-tracker.com` |
| `ADMIN_PASSWORD` | Admin user password | No | `admin123` |
| `REACT_APP_API_URL` | Backend API URL | Yes | `http://localhost:5000/api` |

## 🆘 Troubleshooting

### Common Issues:

1. **"Missing required environment variables" error:**
   - Make sure you have a `.env` file in the backend directory
   - Check that `JWT_SECRET` is set

2. **MongoDB connection error:**
   - Verify your `MONGODB_URI` is correct
   - Make sure MongoDB is running (for local development)

3. **CORS errors:**
   - Check that `FRONTEND_URL` matches your frontend URL
   - Verify `REACT_APP_API_URL` in frontend matches your backend URL

4. **Frontend can't connect to backend:**
   - Check that backend is running on the correct port
   - Verify `REACT_APP_API_URL` is correct
   - Check browser console for errors
