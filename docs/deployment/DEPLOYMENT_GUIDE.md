# METECHQ - Deployment Guide

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Variables Setup](#environment-variables-setup)
3. [MongoDB Setup](#mongodb-setup)
4. [Backend Deployment (Render)](#backend-deployment-render)
5. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
6. [Alternative Deployment Options](#alternative-deployment-options)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Troubleshooting](#troubleshooting)

---

## 🔍 Pre-Deployment Checklist

### Before Pushing to GitHub:

- [ ] ✅ Review all code changes
- [ ] ✅ Test locally (backend and frontend)
- [ ] ✅ Verify .env files are in .gitignore
- [ ] ✅ Create .env.example files (already done)
- [ ] ✅ Remove any hardcoded credentials
- [ ] ✅ Update README if needed
- [ ] ✅ Run linting (optional but recommended)

### Files That Should NOT Be in Git:
- ❌ `/backend/.env`
- ❌ `/frontend/.env`
- ❌ `/node_modules/`
- ❌ `/backend/__pycache__/`
- ❌ Any credentials or API keys

### Files That SHOULD Be in Git:
- ✅ `/backend/.env.example`
- ✅ `/frontend/.env.example`
- ✅ All source code files
- ✅ `requirements.txt` and `package.json`
- ✅ This deployment guide

---

## 🔐 Environment Variables Setup

### Backend Environment Variables

After pushing to GitHub, create `.env` file in `/backend/` directory:

```bash
cd backend
cp .env.example .env
```

Then edit `.env` and add your values:

```env
# REQUIRED: Your MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mspn_dev_db?retryWrites=true&w=majority

# Database name
DB_NAME=mspn_dev_db

# CORS - Add your frontend URL
CORS_ORIGINS=https://your-frontend.vercel.app

# Generate a secure secret key
SECRET_KEY=your-generated-secret-key-here

# Port (auto-set by hosting platforms)
PORT=8001
```

### Frontend Environment Variables

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:

```env
# Your backend API URL
REACT_APP_BACKEND_URL=https://your-backend.onrender.com/api

WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
USE_WEBPACK_PROXY=false
```

---

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create Account**
   - Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Cluster"
   - Choose FREE tier (M0)
   - Select region closest to your users
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and strong password
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - For deployment: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For better security: Add specific IPs of your hosting service
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like:
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add your database name before the `?`:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mspn_dev_db?retryWrites=true&w=majority
   ```

6. **Add to Backend .env**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mspn_dev_db?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB (Development Only)

```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=mspn_dev_db
```

---

## 🚀 Backend Deployment (Render)

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
cd /app
git init
git add .
git commit -m "Initial commit - deployment ready"

# Add your GitHub repository
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. **Create Account**
   - Go to [https://render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service**
   ```
   Name: mspn-dev-backend
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
   ```

4. **Add Environment Variables**
   - Click "Environment" tab
   - Add these variables:
   ```
   MONGODB_URI = [your MongoDB Atlas connection string]
   DB_NAME = mspn_dev_db
   SECRET_KEY = [your secure secret key]
   CORS_ORIGINS = https://your-frontend-domain.vercel.app
   PORT = 8001
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL: `https://your-app.onrender.com`

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Update frontend `.env` with backend URL:
   ```env
   REACT_APP_BACKEND_URL=https://your-backend.onrender.com/api
   ```

2. Push changes to GitHub

### Step 2: Deploy on Vercel

1. **Create Account**
   - Go to [https://vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select your repository

3. **Configure Project**
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: yarn build
   Output Directory: build
   Install Command: yarn install
   ```

4. **Add Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add:
   ```
   REACT_APP_BACKEND_URL = https://your-backend.onrender.com/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build (2-5 minutes)
   - Your site will be live at: `https://your-app.vercel.app`

### Step 3: Update Backend CORS

1. Go back to Render dashboard
2. Update `CORS_ORIGINS` environment variable:
   ```
   CORS_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com
   ```
3. Redeploy backend

---

## 🔄 Alternative Deployment Options

### Backend Alternatives

**Railway**
```bash
Build Command: pip install -r requirements.txt
Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
Root Directory: backend
```

**Heroku**
```bash
# Add Procfile in backend directory
web: uvicorn server:app --host 0.0.0.0 --port $PORT
```

**DigitalOcean App Platform**
```yaml
name: mspn-backend
services:
  - name: api
    source_dir: backend
    build_command: pip install -r requirements.txt
    run_command: uvicorn server:app --host 0.0.0.0 --port $PORT
```

### Frontend Alternatives

**Netlify**
- Build command: `yarn build`
- Publish directory: `build`
- Base directory: `frontend`

**GitHub Pages**
- Build and deploy using GitHub Actions
- Add `homepage` in package.json

**AWS Amplify**
- Connect GitHub repository
- Auto-detect Create React App settings

---

## ✅ Post-Deployment Verification

### Backend Health Check

1. **Test Root Endpoint**
   ```bash
   curl https://your-backend.onrender.com/
   ```
   Expected response:
   ```json
   {
     "status": "healthy",
     "service": "METECHQ API",
     "message": "Backend is running successfully"
   }
   ```

2. **Test API Endpoint**
   ```bash
   curl https://your-backend.onrender.com/api/
   ```
   Expected response:
   ```json
   {
     "message": "METECHQ API is running",
     "status": "healthy"
   }
   ```

3. **Test Services Endpoint**
   ```bash
   curl https://your-backend.onrender.com/api/services/
   ```
   Should return list of services

### Frontend Verification

1. **Visit your site**: `https://your-app.vercel.app`
2. **Check pages**:
   - Home page loads
   - Services page displays
   - Portfolio shows projects
   - Contact form works
3. **Test API calls**:
   - Open browser DevTools (F12)
   - Go to Network tab
   - Navigate pages
   - Verify API calls succeed (200 status)

### Admin Panel

1. Visit: `https://your-app.vercel.app/admin/login`
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. **⚠️ IMPORTANT**: Change password immediately after first login!

---

## 🔧 Troubleshooting

### Backend Issues

**Problem: "Application failed to start"**
- ✅ Check build logs in Render dashboard
- ✅ Verify all dependencies in requirements.txt
- ✅ Check Python version (should be 3.11)
- ✅ Verify start command is correct

**Problem: "Database connection failed"**
- ✅ Verify MONGODB_URI is correct
- ✅ Check MongoDB Atlas network access (0.0.0.0/0)
- ✅ Verify database user credentials
- ✅ Ensure IP whitelist includes Render IPs

**Problem: "CORS errors"**
- ✅ Add frontend URL to CORS_ORIGINS
- ✅ Include https:// in URL
- ✅ No trailing slash in URL
- ✅ Redeploy backend after changes

### Frontend Issues

**Problem: "Cannot connect to backend"**
- ✅ Verify REACT_APP_BACKEND_URL is correct
- ✅ Include /api at the end
- ✅ Check backend is running
- ✅ Rebuild and redeploy frontend

**Problem: "Build failed"**
- ✅ Check build logs in Vercel
- ✅ Verify all dependencies in package.json
- ✅ Check for TypeScript errors
- ✅ Verify build command is correct

**Problem: "Environment variables not working"**
- ✅ Prefix with REACT_APP_
- ✅ Rebuild after adding env vars
- ✅ Don't use quotes in Vercel env values

### Database Issues

**Problem: "IP not whitelisted"**
- ✅ Go to MongoDB Atlas Network Access
- ✅ Click "Add IP Address"
- ✅ Select "Allow Access from Anywhere"
- ✅ Save changes

**Problem: "Authentication failed"**
- ✅ Double-check username and password
- ✅ Verify user has read/write permissions
- ✅ Check connection string format
- ✅ Ensure special characters in password are URL-encoded

---

## 🔒 Security Best Practices

### Production Checklist:

1. **Change Default Credentials**
   - ✅ Change admin password from `admin123`
   - ✅ Use strong passwords (12+ characters)
   
2. **Environment Variables**
   - ✅ Never commit .env files
   - ✅ Use platform environment variables
   - ✅ Generate secure SECRET_KEY
   
3. **CORS Configuration**
   - ✅ Only allow specific frontend domains
   - ✅ Don't use wildcard (*) in production
   
4. **MongoDB**
   - ✅ Use strong database passwords
   - ✅ Limit IP access when possible
   - ✅ Regular backups
   
5. **HTTPS**
   - ✅ Ensure both frontend and backend use HTTPS
   - ✅ Render and Vercel provide this automatically

---

## 📞 Support

### Common Commands

```bash
# Generate secure secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Test backend locally
cd backend
uvicorn server:app --reload

# Test frontend locally
cd frontend
yarn start

# View backend logs (Render)
# Go to Render dashboard → Logs tab

# View frontend logs (Vercel)
# Go to Vercel dashboard → Deployments → View Logs
```

### Useful Links

- MongoDB Atlas: https://cloud.mongodb.com
- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repository: https://github.com/yourusername/your-repo

---

## 🎉 Deployment Complete!

Your METECHQ website is now live and accessible worldwide!

**Frontend**: https://your-app.vercel.app
**Backend**: https://your-backend.onrender.com
**Admin Panel**: https://your-app.vercel.app/admin

### Next Steps:
1. ✅ Change admin password
2. ✅ Add your custom domain (optional)
3. ✅ Monitor application logs
4. ✅ Set up analytics
5. ✅ Configure email notifications

---

**Last Updated**: December 26, 2025
**Version**: 1.0.0
**Status**: 🚀 Production Ready