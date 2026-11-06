# 🚀 Render Deployment Quick Start

## ⏱️ Deploy in 15 Minutes

### Step 1: MongoDB Atlas (5 min)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account → Create M0 FREE cluster
3. Create database user with password (save it!)
4. Network Access → Add IP Address → Allow from Anywhere (0.0.0.0/0)
5. Connect → Application → Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/mspn_dev_db?retryWrites=true&w=majority
   ```

### Step 2: Push to GitHub (2 min)

```bash
cd /app/backend
git init
git add .
git commit -m "Production ready backend"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 3: Deploy on Render (5 min)

1. Sign up at https://render.com
2. New + → Web Service → Connect GitHub repo
3. **Configure**:
   - **Name**: `mspn-dev-backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables** (Click Advanced):

   ```bash
   # Required - Get from MongoDB Atlas
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mspn_dev_db?retryWrites=true&w=majority
   
   # Database name
   DB_NAME=mspn_dev_db
   
   # Your frontend URL (update after frontend deployment)
   CORS_ORIGINS=https://your-frontend.vercel.app
   
   # Generate with: python -c "import secrets; print(secrets.token_urlsafe(32))"
   SECRET_KEY=your-generated-secret-key-here
   ```

5. Click **Create Web Service**

### Step 4: Test (1 min)

```bash
# Health check
curl https://your-backend-name.onrender.com/

# Expected response:
# {"status":"healthy","service":"METECHQ API","message":"Backend is running successfully"}
```

---

## 🎯 Environment Variables Summary

| Variable | Where to Get It | Example |
|----------|----------------|---------|
| `MONGODB_URI` | MongoDB Atlas → Connect → Application | `mongodb+srv://user:pass@cluster.net/db` |
| `DB_NAME` | Choose your database name | `mspn_dev_db` |
| `CORS_ORIGINS` | Your frontend URL(s) | `https://frontend.vercel.app` |
| `SECRET_KEY` | Run: `python -c "import secrets; print(secrets.token_urlsafe(32))"` | `KjoVBWf-lh7u...` |

**Note**: `PORT` is automatically set by Render - don't add it!

---

## ✅ Success Indicators

Look for these in Render logs:

```
🔗 Connecting to MongoDB Atlas (production)...
✅ MongoDB client initialized for database: mspn_dev_db
✅ Super admin created successfully!
✅ Application initialization complete!
```

---

## 🔐 Administrator Credentials

- **Username**: Configured via `INIT_SUPERADMIN_USERNAME` (default `admin`)
- **Password**: Configured via `INIT_SUPERADMIN_PASSWORD` in Render environment variables

---

## 🐛 Quick Troubleshooting

| Error | Fix |
|-------|-----|
| "MONGODB_URI not set" | Add in Render environment variables |
| "Connection timeout" | MongoDB Atlas → Network Access → Allow 0.0.0.0/0 |
| "CORS error" | Add frontend URL to `CORS_ORIGINS` |
| "502 Bad Gateway" | Check Render logs for errors |

---

## 📚 Full Documentation

- **Complete Guide**: `RENDER_DEPLOYMENT_GUIDE.md`
- **Production Summary**: `PRODUCTION_READY_SUMMARY.md`
- **API Docs**: `API_DOCUMENTATION.md`

---

**Ready to Deploy! 🚀**
