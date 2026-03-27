# 🔧 Separate Frontend & Backend Environment Setup

This guide shows you how to set up separate environment configurations for your frontend and backend.

## 📁 Environment Files Structure

```
fitness-tracker/
├── frontend/
│   ├── env.development    # Frontend development config
│   ├── env.staging        # Frontend staging config
│   ├── env.production     # Frontend production config
│   └── .env               # Active frontend config (created by setup script)
├── backend/
│   ├── env.development    # Backend development config
│   ├── env.staging        # Backend staging config
│   ├── env.production     # Backend production config
│   └── .env               # Active backend config (created by setup script)
└── setup scripts...
```

## 🚀 Quick Setup

### Option 1: Use Setup Scripts (Recommended)

**For Frontend:**
```bash
# Windows
.\setup-frontend-env.bat

# Linux/Mac
chmod +x setup-frontend-env.sh
./setup-frontend-env.sh
```

**For Backend:**
```bash
# Windows
.\setup-backend-env.bat

# Linux/Mac
chmod +x setup-backend-env.sh
./setup-backend-env.sh
```

### Option 2: Manual Setup

**Frontend:**
```bash
cd frontend
cp env.development .env  # or env.staging, env.production
```

**Backend:**
```bash
cd backend
cp env.development .env  # or env.staging, env.production
```

## 🌍 Environment Configurations

### Frontend Environments

#### Development (`env.development`)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Fitness Tracker
REACT_APP_ENVIRONMENT=development
REACT_APP_ENABLE_DEBUG=true
```

#### Staging (`env.staging`)
```env
REACT_APP_API_URL=https://your-staging-backend.herokuapp.com/api
REACT_APP_NAME=Fitness Tracker
REACT_APP_ENVIRONMENT=staging
REACT_APP_ENABLE_DEBUG=true
```

#### Production (`env.production`)
```env
REACT_APP_API_URL=https://your-production-backend.herokuapp.com/api
REACT_APP_NAME=Fitness Tracker
REACT_APP_ENVIRONMENT=production
REACT_APP_ENABLE_DEBUG=false
```

### Backend Environments

#### Development (`env.development`)
```env
MONGODB_URI=mongodb://localhost:27017/fitness-tracker-dev
JWT_SECRET=fitness-tracker-dev-secret-key-2024
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Staging (`env.staging`)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker-staging
JWT_SECRET=fitness-tracker-staging-secret-key-2024
NODE_ENV=staging
FRONTEND_URL=https://your-staging-frontend.vercel.app
```

#### Production (`env.production`)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker-prod
JWT_SECRET=your-super-secure-production-jwt-secret-key-here
NODE_ENV=production
FRONTEND_URL=https://your-production-frontend.vercel.app
```

## 🔄 Switching Environments

### For Development
```bash
# Frontend
cd frontend
cp env.development .env

# Backend
cd backend
cp env.development .env
```

### For Staging
```bash
# Frontend
cd frontend
cp env.staging .env

# Backend
cd backend
cp env.staging .env
```

### For Production
```bash
# Frontend
cd frontend
cp env.production .env

# Backend
cd backend
cp env.production .env
```

## 🚀 Running the Application

### Development Mode
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

### Production Mode
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd backend
npm start
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different JWT secrets** for each environment
3. **Use different databases** for staging and production
4. **Use strong passwords** for production admin accounts
5. **Enable HTTPS** in production
6. **Use environment-specific CORS** settings

## 📝 Environment Variables Reference

### Frontend Variables
| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `REACT_APP_API_URL` | Backend API URL | Yes | `http://localhost:5000/api` |
| `REACT_APP_NAME` | App name | No | `Fitness Tracker` |
| `REACT_APP_ENVIRONMENT` | Environment name | No | `development` |
| `REACT_APP_ENABLE_DEBUG` | Enable debug mode | No | `true` |

### Backend Variables
| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/fitness-tracker` |
| `JWT_SECRET` | JWT secret key | Yes | `your-secret-key` |
| `NODE_ENV` | Node environment | No | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | No | `http://localhost:3000` |
| `PORT` | Server port | No | `5000` |

## 🆘 Troubleshooting

### Common Issues:

1. **Frontend can't connect to backend:**
   - Check `REACT_APP_API_URL` in frontend `.env`
   - Verify backend is running
   - Check CORS settings in backend

2. **Backend can't connect to database:**
   - Verify `MONGODB_URI` in backend `.env`
   - Check database credentials
   - Ensure database is accessible

3. **CORS errors:**
   - Check `FRONTEND_URL` in backend `.env`
   - Verify frontend URL matches exactly

4. **Environment variables not loading:**
   - Ensure `.env` file exists in correct directory
   - Check file permissions
   - Restart the application

## 📋 Checklist for Deployment

### Before Deployment:
- [ ] Update environment-specific URLs
- [ ] Set strong JWT secrets
- [ ] Configure database connections
- [ ] Set up CORS properly
- [ ] Test locally with production config
- [ ] Update admin credentials

### After Deployment:
- [ ] Test API endpoints
- [ ] Verify frontend-backend communication
- [ ] Check database connectivity
- [ ] Monitor logs for errors
- [ ] Test user registration/login
