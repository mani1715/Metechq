# 🚀 VERCEL DEPLOYMENT - QUICK REFERENCE

## ⚡ 5-Minute Deployment

### 1. Prerequisites
```bash
✅ Backend live at: https://YOUR-BACKEND.onrender.com
✅ Code pushed to GitHub
✅ Vercel account ready
```

### 2. Backend CORS Setup
In Render → Environment Variables:
```env
CORS_ORIGINS=https://YOUR-APP.vercel.app
```
💾 Save & Restart

### 3. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com/new)
2. Import your GitHub repo
3. Set root directory: `frontend`
4. Add environment variable:
   - **Name:** `REACT_APP_BACKEND_URL`
   - **Value:** `https://YOUR-BACKEND.onrender.com`
   - ⚠️ **DO NOT** include `/api` suffix
5. Click "Deploy"

### 4. Verify
```bash
# Open your Vercel URL
https://YOUR-APP.vercel.app

# Check console (F12) for:
[API Config] ✅ Final API Base URL: https://YOUR-BACKEND.onrender.com/api
```

---

## 🎯 Environment Variable Format

| Environment | Value | Example |
|-------------|-------|---------|
| **Local** | `/api` | `/api` |
| **Vercel** | `https://backend.onrender.com` | `https://mspn-backend.onrender.com` |

⚠️ **CRITICAL:** Do NOT include `/api` suffix in production URL!

---

## 🔧 Vercel Configuration

### Framework Detection
- **Framework:** Create React App
- **Build Command:** `yarn build` or `npm run build`
- **Output Directory:** `build`
- **Install Command:** `yarn install` or `npm install`
- **Root Directory:** `frontend`

### Required Files (Already Present)
- ✅ `vercel.json` - SPA routing
- ✅ `.env.example` - Environment template
- ✅ `.gitignore` - Excludes .env
- ✅ `package.json` - Scripts & dependencies

---

## 🐛 Common Issues & Fixes

### CORS Error
```
❌ Access to fetch at '...' has been blocked by CORS policy
```
**Fix:** Add Vercel URL to backend `CORS_ORIGINS`

### Wrong API URL
```
❌ [API Config] Final API Base URL: /api
```
**Fix:** Set `REACT_APP_BACKEND_URL` in Vercel environment variables

### 404 on Refresh
```
❌ Cannot GET /about
```
**Fix:** Already fixed! `vercel.json` handles SPA routing

### Build Fails
```
❌ Module not found: Can't resolve '...'
```
**Fix:** 
```bash
cd /app/frontend
yarn install
yarn build
```

---

## 📁 Project Structure

```
frontend/
├── build/                    # ✅ Build output (after yarn build)
│   ├── index.html
│   ├── static/
│   │   ├── js/
│   │   └── css/
│   └── asset-manifest.json
├── src/
│   └── services/
│       └── api.js            # ✅ API configuration
├── .env                      # ❌ NOT in git
├── .env.example              # ✅ Template
├── .gitignore                # ✅ Ignores .env
├── vercel.json               # ✅ SPA config
├── package.json              # ✅ Scripts
└── VERCEL_DEPLOYMENT_GUIDE.md # ✅ Full guide
```

---

## 🔐 Security Checklist

- [x] `.env` in `.gitignore`
- [x] Environment variables in Vercel only
- [x] Backend CORS configured (no wildcard)
- [x] HTTPS enforced
- [x] JWT tokens in localStorage
- [ ] **Change default admin password!**

---

## 📊 Build Verification

```bash
cd /app/frontend
yarn build

# ✅ Success indicators:
Compiled successfully.
File sizes after gzip:
  290.19 kB  build/static/js/main.*.js
  52.37 kB   build/static/css/main.*.css
Done in ~45s
```

---

## 🧪 Test Endpoints

After deployment:

```bash
# Frontend
curl https://YOUR-APP.vercel.app

# Backend health
curl https://YOUR-BACKEND.onrender.com/

# Backend API
curl https://YOUR-BACKEND.onrender.com/api/

# Test login
curl -X POST https://YOUR-BACKEND.onrender.com/api/admins/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"<your-init-superadmin-password>"}'
```

---

## 📞 Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Deployment Guide:** `/frontend/VERCEL_DEPLOYMENT_GUIDE.md`
- **Full Checklist:** `/frontend/PRODUCTION_CHECKLIST.md`
- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs

---

## 🎯 Administrator Authentication
**Admin Panel:** `/admin/login`
- Use the credentials initialized via `INIT_SUPERADMIN_PASSWORD` in your backend `.env` configuration.

---

## 🔄 Redeploy

To trigger a new deployment:

1. **Via Vercel Dashboard:**
   - Go to Deployments
   - Click "Redeploy"

2. **Via Git Push:**
   ```bash
   git push origin main
   # Auto-deploys on Vercel
   ```

3. **Via CLI:**
   ```bash
   cd /app/frontend
   vercel --prod
   ```

---

## ✅ Success Indicators

### Build Successful
```
✅ Compiled successfully
✅ Build folder ready to be deployed
✅ Done in ~45s
```

### Deployment Successful
```
✅ Vercel: Building... Complete
✅ Vercel: Deployment ready
✅ Preview: https://YOUR-APP.vercel.app
```

### Runtime Working
```
✅ [API Config] Environment: production
✅ [API Config] Final API Base URL: https://backend.onrender.com/api
✅ No CORS errors
✅ API calls returning data
```

---

## 💡 Pro Tips

1. **Environment Variables**
   - Test locally first: Create `.env` with production URL
   - Verify in console: Check `[API Config]` logs

2. **CORS Issues**
   - Always restart backend after CORS changes
   - Use exact URLs (no trailing slashes)

3. **Build Optimization**
   - Keep bundle size < 500KB (currently ~290KB ✅)
   - Use lazy loading for large components

4. **Monitoring**
   - Enable Vercel Analytics
   - Check logs regularly
   - Setup uptime monitoring

---

**Last Build:** December 2024  
**Build Time:** ~45s  
**Bundle Size:** 290KB (gzipped) ✅  
**Status:** Production Ready ✅
