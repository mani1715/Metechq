# 🚀 Quick Start Guide - METECHQ Application

## ✅ Application is LIVE and Running!

### 🌐 Access URLs

**Frontend (Public Website):** `http://localhost:3000`
**Backend API:** `http://localhost:8001/api/`
**Admin Panel:** `http://localhost:3000/admin/login`
**Client Portal:** `http://localhost:3000/client/login`

---

## 🔐 Login Credentials

### Admin Access
- URL: `/admin/login`
- Username: `admin`
- Password: Configured via `INIT_SUPERADMIN_PASSWORD` in `.env`

### Client Access (3 Demo Clients)
- URL: `/client/login`

1. **john@acmecorp.com** / `client123`
2. **sarah@techinnovators.com** / `client123`
3. **mike@digitalsolutions.com** / `client123`

---

## 📁 Key Files and Locations

### Backend
- Main Server: `/app/backend/server.py`
- Environment: `/app/backend/.env`
- Database Config: `/app/backend/database.py`
- API Routes: `/app/backend/routes/`
- Dependencies: `/app/backend/requirements.txt`

### Frontend
- Main App: `/app/frontend/src/App.js`
- Environment: `/app/frontend/.env`
- Pages: `/app/frontend/src/pages/`
- Admin Panel: `/app/frontend/src/admin/`
- Dependencies: `/app/frontend/package.json`

---

## 🎯 Service Management

### Check Status
```bash
sudo supervisorctl status
```

### Restart Services
```bash
# Restart everything
sudo supervisorctl restart all

# Restart individual services
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
sudo supervisorctl restart mongodb
```

### View Logs
```bash
# Backend logs
tail -n 100 /var/log/supervisor/backend.err.log
tail -n 100 /var/log/supervisor/backend.out.log

# Frontend logs
tail -n 100 /var/log/supervisor/frontend.err.log
tail -n 100 /var/log/supervisor/frontend.out.log

# Follow logs in real-time
tail -f /var/log/supervisor/backend.err.log
```

---

## 🧪 Test API Endpoints

```bash
# Health check
curl http://localhost:8001/api/

# Get portfolio projects
curl http://localhost:8001/api/projects/

# Get blogs
curl http://localhost:8001/api/blogs/

# Get testimonials
curl http://localhost:8001/api/testimonials/
```

---

## 📦 Database Seeding

The database is already populated with:
- ✅ 1 Admin user
- ✅ 3 Demo clients
- ✅ 3 Client projects (with milestones, tasks, budget)
- ✅ 8 Portfolio projects
- ✅ Contact page content
- ✅ Booking settings

### Re-seed if needed
```bash
cd /app/backend

# Seed demo clients and projects
python seed_demo_data.py

# Seed portfolio projects
python seed_complete_portfolio.py

# Seed complete database
python seed_database.py
```

---

## 🔧 Making Changes

### Backend Changes
1. Edit files in `/app/backend/`
2. Hot reload is enabled - changes apply automatically
3. If adding new dependencies:
   ```bash
   cd /app/backend
   pip install package-name
   pip freeze > requirements.txt
   ```
4. Only restart if changing .env:
   ```bash
   sudo supervisorctl restart backend
   ```

### Frontend Changes
1. Edit files in `/app/frontend/src/`
2. Hot reload is enabled - changes apply automatically
3. If adding new dependencies:
   ```bash
   cd /app/frontend
   yarn add package-name
   ```
4. Only restart if changing .env:
   ```bash
   sudo supervisorctl restart frontend
   ```

---

## 🌐 Environment Variables

### Backend (.env)
Located at: `/app/backend/.env`

**Current Settings:**
```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=mspn_dev_db
CORS_ORIGINS=http://localhost:3000
SECRET_KEY=mspn-dev-secret-key-for-local-development-change-in-production
PORT=8001
```

**For Production:**
- Update `MONGODB_URI` with MongoDB Atlas connection string
- Change `SECRET_KEY` to a secure random key
- Update `CORS_ORIGINS` with production frontend URL

### Frontend (.env)
Located at: `/app/frontend/.env`

**Current Settings:**
```env
REACT_APP_BACKEND_URL=/api
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
USE_WEBPACK_PROXY=true
```

**For Production:**
- Update `REACT_APP_BACKEND_URL` with production backend URL
- Example: `https://your-backend.onrender.com/api`

---

## 📋 Features Checklist

### Public Website
- ✅ Home page with hero section
- ✅ About page
- ✅ Services showcase
- ✅ Portfolio gallery (8 projects)
- ✅ Blog system
- ✅ Contact form
- ✅ Testimonials
- ✅ Live chat widget
- ✅ Newsletter subscription

### Admin Panel
- ✅ Dashboard with analytics
- ✅ Content editor
- ✅ Portfolio manager
- ✅ Blog manager
- ✅ Client manager
- ✅ Client projects (with milestones & tasks)
- ✅ Booking system
- ✅ Testimonials manager
- ✅ Contact manager
- ✅ Newsletter manager
- ✅ Settings & permissions
- ✅ File storage

### Client Portal
- ✅ Secure login
- ✅ Project dashboard
- ✅ Milestones view
- ✅ Tasks view
- ✅ Budget tracking
- ✅ Team members
- ✅ File downloads
- ✅ Comments system
- ✅ Activity log
- ✅ Per-project chat

### Demo Showcases (8 Demos)
- ✅ E-commerce Platform (`/demo/ecommerce`)
- ✅ Corporate Website (`/demo/corporate`)
- ✅ Learning Management System (`/demo/lms`)
- ✅ Restaurant Booking (`/demo/restaurant-booking`)
- ✅ SaaS Landing Page (`/demo/saas-landing`)
- ✅ Mobile Design System (`/demo/mobile-design`)
- ✅ Real-Time Analytics (`/demo/analytics`)
- ✅ Social Media Tool (`/demo/social-media`)

---

## 🐛 Troubleshooting

### Backend not starting
```bash
# Check logs
tail -n 100 /var/log/supervisor/backend.err.log

# Common issues:
# - MongoDB not running: sudo supervisorctl restart mongodb
# - Missing dependencies: cd /app/backend && pip install -r requirements.txt
# - .env file missing: Check /app/backend/.env exists
```

### Frontend not loading
```bash
# Check logs
tail -n 100 /var/log/supervisor/frontend.err.log

# Common issues:
# - Dependencies missing: cd /app/frontend && yarn install
# - .env file missing: Check /app/frontend/.env exists
# - Port conflict: Check if port 3000 is available
```

### MongoDB connection failed
```bash
# Restart MongoDB
sudo supervisorctl restart mongodb

# Check MongoDB status
sudo supervisorctl status mongodb

# Check MongoDB logs
tail -n 50 /var/log/supervisor/mongodb*.log
```

### API calls failing
```bash
# Test backend health
curl http://localhost:8001/api/

# Check backend is running
sudo supervisorctl status backend

# Verify .env file
cat /app/backend/.env | grep MONGODB_URI
```

---

## 📚 Documentation Files

All documentation is in `/app/`:

- `DEPLOYMENT_READY.md` - Complete setup documentation
- `APPLICATION_SETUP_COMPLETE.md` - Setup details
- `CLIENT_DASHBOARD_ENHANCED_FEATURES.md` - Client features
- `CLIENT_PROJECTS_COMPLETE_GUIDE.md` - Project management
- `DEPLOYMENT_GUIDE.md` - Production deployment
- `ENHANCED_FEATURES_DOCUMENTATION.md` - Feature list
- `backend/API_DOCUMENTATION.md` - API reference
- `backend/RENDER_DEPLOYMENT_GUIDE.md` - Render deployment
- `frontend/VERCEL_DEPLOYMENT_GUIDE.md` - Vercel deployment

---

## 🚢 Deploying to Production

### 1. Prepare MongoDB
- Sign up for MongoDB Atlas (free tier available)
- Create a cluster
- Get connection string
- Update `MONGODB_URI` in backend/.env

### 2. Backend Deployment (Render/Railway)
- Connect GitHub repository
- Set environment variables from backend/.env.example
- Deploy using: `uvicorn server:app --host 0.0.0.0 --port $PORT`

### 3. Frontend Deployment (Vercel/Netlify)
- Connect GitHub repository
- Set `REACT_APP_BACKEND_URL` to backend URL
- Build command: `yarn build`
- Publish directory: `build`

### 4. Security
- Change admin password
- Generate new SECRET_KEY
- Update CORS_ORIGINS
- Enable HTTPS

---

## ✅ Everything Working

### Verified Features
✅ Backend API running on port 8001
✅ Frontend running on port 3000
✅ MongoDB connected and seeded
✅ Admin login working
✅ Client login working
✅ All API endpoints responding
✅ Hot reload enabled
✅ Demo data populated
✅ All pages accessible
✅ All features functional

---

## 🆘 Need Help?

- Check logs: `/var/log/supervisor/`
- Review documentation in `/app/*.md`
- Test API: Use curl commands above
- Restart services: `sudo supervisorctl restart all`

---

**Status:** ✅ FULLY OPERATIONAL
**Version:** 1.0.0
**Last Updated:** December 28, 2025
