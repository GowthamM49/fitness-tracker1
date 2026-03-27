# Vercel Deployment Guide for KEC Fitness Tracker

## Project Overview
This is a full-stack fitness tracking application with:
- **Frontend**: React.js with Material-UI
- **Backend**: Node.js with Express and MongoDB
- **Database**: MongoDB Atlas (recommended for production)

## Deployment Strategy

### Option 1: Frontend Only (Recommended for Vercel)
Deploy only the frontend to Vercel and use a separate backend service.

### Option 2: Full Stack (Alternative)
Deploy frontend to Vercel and backend to Railway/Render/Heroku.

## Prerequisites
1. Vercel account
2. MongoDB Atlas account (for database)
3. GitHub repository

## Step 1: Prepare Backend for Separate Deployment

### Backend Environment Variables
Create these environment variables in your backend hosting service:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=5000
```

### Backend Deployment Options
- **Railway**: Easy MongoDB integration
- **Render**: Free tier available
- **Heroku**: Popular choice
- **DigitalOcean App Platform**: Good performance

## Step 2: Deploy Frontend to Vercel

### 1. Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository

### 2. Configure Build Settings
- **Framework Preset**: Create React App
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 3. Environment Variables
Add these in Vercel dashboard:

```env
REACT_APP_API_URL=https://your-backend-url.railway.app/api
REACT_APP_NAME=KEC Fitness Tracker
REACT_APP_VERSION=1.0.0
```

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## Step 3: Update Configuration

### Update API URL
After backend deployment, update the frontend environment variable:
```env
REACT_APP_API_URL=https://your-actual-backend-url.com/api
```

### Redeploy Frontend
Trigger a new deployment in Vercel to pick up the new environment variables.

## Step 4: Database Setup

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP addresses (or use 0.0.0.0/0 for all)
5. Get connection string
6. Update backend environment variables

### Sample Data
Run the seed script on your backend:
```bash
npm run seed-data
```

## Step 5: Domain Configuration (Optional)

### Custom Domain
1. In Vercel dashboard, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for your Vercel domain
   - Update CORS origin in backend

2. **API Connection Issues**
   - Verify environment variables are set correctly
   - Check backend is running and accessible
   - Test API endpoints manually

3. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Review build logs in Vercel dashboard

### Testing Deployment
1. Check frontend loads correctly
2. Test user registration/login
3. Verify API calls work
4. Test all major features

## Production Checklist

- [ ] Backend deployed and accessible
- [ ] MongoDB Atlas configured
- [ ] Environment variables set
- [ ] CORS configured for production domain
- [ ] Frontend builds successfully
- [ ] All features working in production
- [ ] SSL certificates active
- [ ] Performance optimized
- [ ] Error monitoring set up

## Support
For issues with deployment, check:
1. Vercel build logs
2. Backend service logs
3. MongoDB Atlas connection
4. Network connectivity

## Cost Estimation
- **Vercel**: Free tier (100GB bandwidth/month)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Backend hosting**: Varies by provider
  - Railway: $5/month
  - Render: Free tier available
  - Heroku: $7/month

Total estimated cost: $0-12/month depending on usage and hosting choices.
