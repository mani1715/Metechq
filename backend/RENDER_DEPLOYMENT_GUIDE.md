# 🚀 Complete Render Deployment Guide for METECHQ Backend

## ✅ Pre-Deployment Checklist

Your backend is **100% production-ready** for Render deployment. All configuration files are in place:

- ✅ **PORT handling** - Uses `PORT` environment variable
- ✅ **MongoDB configuration** - Uses `MONGODB_URI` environment variable
- ✅ **CORS configuration** - Fully environment-based via `CORS_ORIGINS`
- ✅ **Environment variables** - All secrets use environment variables
- ✅ **Security** - `.gitignore` prevents committing secrets
- ✅ **Health check** - Root endpoint `/` returns 200 OK
- ✅ **Python runtime** - `runtime.txt` specifies Python 3.11.0
- ✅ **Dependencies** - `requirements.txt` lists all packages

---

## 📋 Step-by-Step Deployment on Render

### Step 1: Prepare MongoDB Atlas (Required)

Before deploying to Render, you need a production MongoDB database.

#### Option A: MongoDB Atlas (Recommended - Free Tier Available)

1. **Create MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create a New Cluster**
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Select a cloud provider and region (choose closest to your users)
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Create username and secure password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is required for Render to connect
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string, it looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual database user password
   - Add your database name: `/mspn_dev_db?retryWrites=true&w=majority`
   
   Final format:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mspn_dev_db?retryWrites=true&w=majority
   ```

---

### Step 2: Push Code to GitHub

1. **Initialize Git Repository** (if not already done)
   ```bash
   cd /app/backend
   git init
   git add .
   git commit -m "Initial commit - Production ready backend"
   ```

2. **Create GitHub Repository**
   - Go to https://github.com/new
   - Create a new repository (e.g., "mspn-dev-backend")
   - Don't initialize with README (since you have code)

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

**IMPORTANT**: The `.gitignore` file ensures your `.env` file is NOT pushed to GitHub. ✅

---

### Step 3: Deploy on Render

1. **Create Render Account**
   - Go to: https://render.com
   - Sign up (you can use GitHub for easy auth)

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"
   - Connect your GitHub repository
   - Select the repository you just pushed

3. **Configure Web Service**
   
   Fill in the following settings:
   
   | Field | Value |
   |-------|-------|
   | **Name** | `mspn-dev-backend` (or your preferred name) |
   | **Region** | Choose closest to your users |
   | **Branch** | `main` |
   | **Root Directory** | Leave empty (or `/backend` if repo has both frontend/backend) |
   | **Runtime** | `Python 3` |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `uvicorn server:app --host 0.0.0.0 --port $PORT` |

4. **Add Environment Variables**
   
   Click "Advanced" and add these environment variables:
   
   | Key | Value | Example |
   |-----|-------|----------|
   | `MONGODB_URI` | Your MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/mspn_dev_db?retryWrites=true&w=majority` |
   | `DB_NAME` | Your database name | `mspn_dev_db` |
   | `CORS_ORIGINS` | Your frontend URL(s) - comma separated | `https://your-frontend.vercel.app,https://www.yourdomain.com` |
   | `SECRET_KEY` | Strong random key for JWT | Generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"` |
   
   **Note**: `PORT` is automatically set by Render - don't add it manually.

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically:
     - Clone your repository
     - Install dependencies from `requirements.txt`
     - Start the server with the start command
     - Assign a public URL

6. **Monitor Deployment**
   - Watch the deployment logs in real-time
   - Look for:
     ```
     ✅ MongoDB client initialized for database: mspn_dev_db
     ✅ Application initialization complete!
     ```

7. **Get Your Backend URL**
   - Once deployed, Render provides a URL like:
   ```
   https://mspn-dev-backend.onrender.com
   ```
   - Save this URL - you'll need it for frontend configuration

---

## 🧪 Test Your Deployed Backend

### Test 1: Health Check
```bash
curl https://your-backend-url.onrender.com/
```

Expected response:
```json
{
  "status": "healthy",
  "service": "METECHQ API",
  "message": "Backend is running successfully"
}
```

### Test 2: API Endpoint
```bash
curl https://your-backend-url.onrender.com/api/
```

Expected response:
```json
{
  "message": "METECHQ API is running",
  "status": "healthy"
}
```

### Test 3: Admin Login
```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Expected: JWT token response (if admin was created during startup)

---

## 🔧 Environment Variables Reference

### Required Environment Variables (Set in Render Dashboard)

```bash
# MongoDB Connection (CRITICAL)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mspn_dev_db?retryWrites=true&w=majority

# Database Name
DB_NAME=mspn_dev_db

# CORS Origins (Frontend URLs - comma separated)
CORS_ORIGINS=https://your-frontend.vercel.app,https://www.yourdomain.com

# Secret Key for JWT (Generate strong random key)
SECRET_KEY=your-generated-secret-key-here

# PORT is automatically set by Render - DO NOT ADD MANUALLY
```

### Generating Secure SECRET_KEY

```bash
# Run this command locally to generate a secure secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Example output:
# kX9vN2mP4qR8sT1uV5wZ7yA3bC6dE9fH0iJ2kL4mN7oP9qR1sT3u
```

---

## 🌐 Frontend Integration

After deploying your backend, update your frontend environment variables:

### Vercel Deployment

In your frontend Vercel dashboard, set:

```bash
REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
```

### Local Development

Update `frontend/.env`:

```bash
REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
```

Or keep using `/api` for local development with the existing setup.

---

## 📊 Monitoring & Logs

### View Logs
1. Go to your Render dashboard
2. Click on your web service
3. Click "Logs" tab
4. You'll see real-time logs including:
   - MongoDB connection status
   - API requests
   - Errors (if any)

### Monitor Health
- Render automatically monitors your health check endpoint (`/`)
- If health check fails, Render will restart your service
- You'll receive email notifications for downtime

---

## 🔐 Security Best Practices

✅ **Never commit secrets to GitHub**
- `.gitignore` is configured to ignore `.env` files
- All secrets are set via Render environment variables

✅ **Use strong SECRET_KEY**
- Generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- Never reuse keys across environments

✅ **Change default admin password**
- Default: `admin` / `admin123`
- Change immediately after first login

✅ **Restrict CORS origins**
- Only allow your actual frontend domains
- Don't use `*` in production

✅ **Secure MongoDB connection**
- Use MongoDB Atlas with authentication
- Use strong database passwords
- Enable network access controls

---

## 🚨 Troubleshooting

### Issue: "MONGODB_URI environment variable is not set"
**Solution**: Add `MONGODB_URI` in Render environment variables

### Issue: "Connection timeout" or "Server selection timeout"
**Solution**: 
- Verify MongoDB Atlas network access allows 0.0.0.0/0
- Check MongoDB Atlas cluster is running
- Verify connection string is correct

### Issue: "CORS errors" in frontend
**Solution**: 
- Add your frontend URL to `CORS_ORIGINS` in Render
- Format: `https://your-frontend.vercel.app` (no trailing slash)
- Multiple origins: separate with commas

### Issue: "502 Bad Gateway"
**Solution**:
- Check Render logs for errors
- Verify start command is correct
- Ensure all dependencies are in `requirements.txt`

### Issue: "Health check failed"
**Solution**:
- Verify `/` endpoint returns 200 OK
- Check if app is binding to `0.0.0.0` and correct PORT
- Review logs for startup errors

---

## 📝 Render Configuration Summary

```yaml
# Service Configuration
Name: mspn-dev-backend
Runtime: Python 3
Branch: main
Build Command: pip install -r requirements.txt
Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT

# Environment Variables (Set in Render Dashboard)
MONGODB_URI: <your-mongodb-atlas-connection-string>
DB_NAME: mspn_dev_db
CORS_ORIGINS: <your-frontend-urls>
SECRET_KEY: <generated-secret-key>

# Automatic Variables (Set by Render)
PORT: <assigned-by-render>
```

---

## 🎉 Post-Deployment Checklist

- [ ] Backend is deployed and accessible
- [ ] Health check endpoint returns 200 OK
- [ ] MongoDB connection is successful
- [ ] Admin user is created (check logs)
- [ ] API endpoints respond correctly
- [ ] CORS is configured for frontend URL
- [ ] Frontend can connect to backend
- [ ] Default admin password is changed
- [ ] Logs show no errors
- [ ] Database contains expected collections

---

## 🆘 Support

If you encounter issues:

1. **Check Render Logs**: Most issues are visible in logs
2. **Verify Environment Variables**: Ensure all required vars are set
3. **Test MongoDB Connection**: Use MongoDB Compass to verify connection string
4. **Review CORS Settings**: Ensure frontend URL is in CORS_ORIGINS

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [Uvicorn Deployment](https://www.uvicorn.org/deployment/)

---

**Your backend is production-ready and follows all best practices! 🚀**
