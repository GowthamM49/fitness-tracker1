# Clean Deployment Instructions

## For Vercel Deployment (Frontend Only)

### Option 1: Upload Only Frontend Folder
1. Go to Vercel dashboard
2. Click "New Project"
3. Upload only the `frontend` folder
4. Set build command: `npm run build`
5. Set output directory: `build`

### Option 2: Use GitHub Repository
1. Create a new GitHub repository
2. Copy only these folders to the new repo:
   - `frontend/`
   - `backend/`
3. Connect the repository to Vercel
4. Set root directory to `frontend`

## Files to Include in Deployment

### ✅ Include These:
- `frontend/` folder (entire folder)
- `backend/` folder (entire folder)

### ❌ Don't Include These:
- `node_modules/` (root level)
- `package.json` (root level)
- `*.md` files (documentation)
- `*.bat` files (Windows scripts)
- `*.sh` files (Linux scripts)
- `vercel.json` (root level)
- `verify-setup.js`
- `.gitignore`

## Quick Setup

### For Frontend (Vercel):
1. Upload `frontend/` folder only
2. Set environment variables:
   - `REACT_APP_API_URL=https://your-backend-url.com/api`
3. Deploy

### For Backend (Separate Service):
1. Upload `backend/` folder only
2. Set environment variables:
   - `MONGODB_URI=mongodb+srv://...`
   - `JWT_SECRET=your-secret`
3. Deploy

## Result
Clean deployment with only the essential code folders!
