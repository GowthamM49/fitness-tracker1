# 🚀 Render Deployment Guide

This guide will help you deploy your Fitness Tracker application to Render with the correct directory structure.

## 📁 Project Structure (Fixed)

```
fitness-tracker/
├── frontend/          # React frontend
├── backend/           # Node.js backend (moved from src/Backend)
├── render.yaml        # Render configuration
├── backend/render.yaml # Backend-specific configuration
└── package.json       # Root package.json
```

## 🔧 Render Configuration

### Option 1: Deploy Backend Only (Recommended)

1. **Go to Render Dashboard**
2. **Create New Web Service**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** `Node`

### Option 2: Use render.yaml (Full Stack)

1. **Go to Render Dashboard**
2. **Create New Blueprint**
3. **Connect your GitHub repository**
4. **Render will automatically detect `render.yaml`**

## 🔑 Environment Variables for Render

### Backend Environment Variables

Set these in your Render service settings:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key-here
FRONTEND_URL=https://your-frontend-domain.onrender.com
PORT=10000
```

### Frontend Environment Variables

Set these in your frontend service settings:

```env
REACT_APP_API_URL=https://your-backend-service.onrender.com/api
```

## 🛠️ Step-by-Step Deployment

### Step 1: Deploy Backend

1. **Create a new Web Service in Render**
2. **Connect your GitHub repository**
3. **Set Root Directory to:** `backend`
4. **Set Build Command to:** `npm install`
5. **Set Start Command to:** `npm start`
6. **Add environment variables** (see above)
7. **Deploy**

### Step 2: Deploy Frontend

1. **Create a new Static Site in Render**
2. **Connect your GitHub repository**
3. **Set Root Directory to:** `frontend`
4. **Set Build Command to:** `npm install && npm run build`
5. **Set Publish Directory to:** `build`
6. **Add environment variables** (see above)
7. **Deploy**

## 🔧 Manual Configuration

If the automatic detection doesn't work, use these manual settings:

### Backend Service Settings:
- **Name:** `fitness-tracker-backend`
- **Environment:** `Node`
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** `Free`

### Frontend Service Settings:
- **Name:** `fitness-tracker-frontend`
- **Environment:** `Static Site`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `build`
- **Plan:** `Free`

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. **Create a MongoDB Atlas account**
2. **Create a new cluster**
3. **Get your connection string**
4. **Add it to your backend environment variables**

### Option 2: Render Database

1. **Create a new PostgreSQL database in Render**
2. **Use the connection string provided**
3. **Update your backend to use PostgreSQL** (requires code changes)

## 🔍 Troubleshooting

### Common Issues:

1. **"Service Root Directory is missing"**
   - Make sure you set the Root Directory to `backend` (not `src/Backend`)
   - Check that the backend folder exists in your repository

2. **Build fails**
   - Check that all dependencies are in `backend/package.json`
   - Verify the build command is correct

3. **Environment variables not working**
   - Make sure you set them in the Render dashboard
   - Check the variable names match exactly

4. **CORS errors**
   - Update `FRONTEND_URL` in backend environment variables
   - Make sure it matches your deployed frontend URL exactly

## 📝 Pre-Deployment Checklist

- [ ] Backend folder is in the root directory (not in `src/Backend`)
- [ ] `backend/package.json` has all required dependencies
- [ ] `backend/server.js` exists and is properly configured
- [ ] Environment variables are set in Render
- [ ] MongoDB connection string is valid
- [ ] Frontend `REACT_APP_API_URL` points to your backend URL

## 🚀 Post-Deployment

1. **Test your backend API:**
   - Visit `https://your-backend.onrender.com/api/health`
   - Should return: `{"status":"OK","message":"Backend is running"}`

2. **Test your frontend:**
   - Visit your frontend URL
   - Check browser console for errors
   - Test user registration/login

3. **Update Vercel configuration:**
   - Update `vercel.json` with your new backend URL
   - Redeploy frontend if needed

## 🔄 Alternative: Deploy to Different Platforms

### Backend Options:
- **Railway:** Similar to Render, supports Node.js
- **Heroku:** Popular platform with good Node.js support
- **DigitalOcean App Platform:** Good alternative

### Frontend Options:
- **Vercel:** Excellent for React apps
- **Netlify:** Good alternative to Vercel
- **GitHub Pages:** Free option for static sites

Your project is now properly configured for Render deployment! 🎉
