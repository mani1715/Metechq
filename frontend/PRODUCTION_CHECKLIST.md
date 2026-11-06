# ✅ Production Deployment Checklist

## Pre-Deployment Verification

### 🔧 Configuration Files

- [x] **vercel.json** - SPA routing configured
- [x] **.env.example** - Environment template exists
- [x] **.gitignore** - `.env` files excluded from git
- [x] **package.json** - Build scripts configured
- [x] **src/services/api.js** - Centralized API config with environment variable support

### 🌐 Environment Variables

#### Local Development (.env)
```bash
REACT_APP_BACKEND_URL=/api
```

#### Production on Vercel
- [ ] Set in Vercel Dashboard: `REACT_APP_BACKEND_URL=https://your-backend.onrender.com`
- [ ] Applied to: Production ✓ Preview ✓ Development ✓

### 🔐 Backend Configuration

- [ ] Backend deployed on Render at: `https://_____.onrender.com`
- [ ] Backend health check working: `curl https://_____.onrender.com/`
- [ ] Backend CORS configured with Vercel URL:
  ```env
  CORS_ORIGINS=https://your-app.vercel.app
  ```
- [ ] Backend API endpoints accessible: `curl https://_____.onrender.com/api/`

### 🗄️ Git Repository

- [ ] Frontend code pushed to GitHub
- [ ] `.env` NOT committed (verify with: `git status`)
- [ ] `.env.example` committed as template
- [ ] All changes committed with clear messages
- [ ] Repository accessible from Vercel

---

## Deployment Steps

### Step 1: Verify Backend
```bash
# Health check
curl https://your-backend.onrender.com/

# API check
curl https://your-backend.onrender.com/api/

# Test login endpoint
curl -X POST https://your-backend.onrender.com/api/admins/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"<your-init-superadmin-password>"}'
```

### Step 2: Update Backend CORS
In Render Dashboard → Backend → Environment Variables:
```env
CORS_ORIGINS=https://your-frontend.vercel.app,https://www.yourdomain.com
```
→ Save and restart backend

### Step 3: Deploy on Vercel

#### Via Dashboard:
1. [ ] Login to [vercel.com](https://vercel.com)
2. [ ] Click "Add New" → "Project"
3. [ ] Import GitHub repository
4. [ ] Configure:
   - Root Directory: `frontend`
   - Framework: `Create React App`
   - Build Command: `yarn build`
   - Output Directory: `build`
5. [ ] Add Environment Variable:
   - Name: `REACT_APP_BACKEND_URL`
   - Value: `https://your-backend.onrender.com`
6. [ ] Click "Deploy"

#### Via CLI:
```bash
cd /app/frontend
npm install -g vercel
vercel login
vercel --prod
# Set env var when prompted
```

### Step 4: Verify Deployment
- [ ] Deployment succeeded (no errors in Vercel logs)
- [ ] Visit deployed URL: `https://_____.vercel.app`
- [ ] Home page loads correctly
- [ ] No console errors

---

## Post-Deployment Testing

### Frontend Loading
- [ ] Home page (`/`) loads
- [ ] About page (`/about`) loads
- [ ] Services page (`/services`) loads
- [ ] Portfolio page (`/portfolio`) loads
- [ ] Blog page (`/blogs`) loads
- [ ] Contact page (`/contact`) loads
- [ ] Navigation between pages works
- [ ] Page refresh doesn't show 404 (SPA routing)

### API Connectivity
Open browser DevTools (F12) → Console:
- [ ] `[API Config]` logs visible
- [ ] API Base URL shows Render backend: `https://your-backend.onrender.com/api`
- [ ] No CORS errors in console
- [ ] API calls returning data (Network tab)

### Data Loading
- [ ] Home page hero section loads
- [ ] Services display correctly
- [ ] Portfolio projects load with images
- [ ] Blog posts display
- [ ] Contact form submits successfully (test with real data)
- [ ] Chat widget appears and works

### Admin Panel
- [ ] Navigate to `/admin/login`
- [ ] Login form loads
- [ ] Login with configured administrator credentials works
- [ ] Credentials configured via `INIT_SUPERADMIN_PASSWORD` in `.env`
- [ ] Dashboard displays after login
- [ ] Admin navigation works
- [ ] Can view/edit services
- [ ] Can view/edit projects
- [ ] Can view contacts
- [ ] Can view/edit blog posts
- [ ] Can manage testimonials
- [ ] Settings page loads
- [ ] Logout works

### Client Portal
- [ ] Navigate to `/client/login`
- [ ] Client login page loads
- [ ] Client can login (if credentials exist)
- [ ] Client dashboard displays projects
- [ ] Client project details load

### Demo Projects
- [ ] `/demo/ecommerce` loads
- [ ] `/demo/lms` loads
- [ ] `/demo/corporate` loads
- [ ] `/demo/mobile-design` loads
- [ ] `/demo/restaurant` loads
- [ ] `/demo/saas` loads
- [ ] `/demo/social-media` loads
- [ ] `/demo/analytics` loads

### Responsive Design
Test on different devices/screen sizes:
- [ ] Desktop (1920px+)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)
- [ ] All pages responsive
- [ ] Navigation menu works on mobile

---

## Security Verification

### Environment Variables
- [ ] `.env` NOT in git history: `git log --all --full-history -- "*/.env"`
- [ ] Only `.env.example` committed
- [ ] Production env vars set in Vercel only (not in code)

### CORS Configuration
- [ ] Backend CORS not using wildcard `*`
- [ ] Backend CORS lists specific Vercel domains
- [ ] No CORS errors in browser console

### HTTPS
- [ ] Frontend uses HTTPS: `https://your-app.vercel.app`
- [ ] Backend uses HTTPS: `https://your-backend.onrender.com`
- [ ] No mixed content warnings

### Authentication
- [ ] JWT tokens stored in localStorage (check DevTools → Application)
- [ ] Admin token sent in Authorization header (check Network tab)
- [ ] Logout clears tokens
- [ ] Protected routes redirect to login when unauthenticated
- [ ] **IMPORTANT:** Change default admin password!

---

## Performance Checks

### Build Size
```bash
cd /app/frontend
yarn build

# Check output
ls -lh build/static/js/*.js
# Look for main chunk size (should be < 500KB for good performance)
```

### Load Time
- [ ] Initial page load < 3 seconds
- [ ] Time to Interactive < 5 seconds
- [ ] No unnecessary bundle size warnings

### Caching
Check Response Headers in DevTools → Network:
- [ ] Static assets have `Cache-Control` header
- [ ] Hashed assets cached for 1 year
- [ ] HTML not cached (or short cache)

### API Performance
- [ ] API calls complete < 2 seconds
- [ ] No timeout errors (15s timeout configured)
- [ ] Proper loading states shown

---

## Monitoring Setup

### Vercel Dashboard
- [ ] Deployment notifications enabled
- [ ] Email alerts configured
- [ ] Vercel Analytics enabled (optional)
- [ ] Domain configured (if using custom domain)

### Error Tracking
- [ ] Check Vercel deployment logs for build errors
- [ ] Monitor Vercel function logs for runtime errors
- [ ] Check Render backend logs for API errors

### Uptime Monitoring
- [ ] Setup uptime monitoring (optional):
  - UptimeRobot
  - Pingdom
  - StatusCake

---

## Custom Domain Configuration (Optional)

If using a custom domain:

### Vercel Configuration
- [ ] Go to Project → Settings → Domains
- [ ] Add custom domain: `www.yourdomain.com`
- [ ] Add apex domain: `yourdomain.com`
- [ ] Configure DNS records as instructed:
  - A Record or CNAME for apex
  - CNAME for www subdomain

### Backend CORS Update
- [ ] Add custom domain to backend CORS:
  ```env
  CORS_ORIGINS=https://your-app.vercel.app,https://www.yourdomain.com,https://yourdomain.com
  ```
- [ ] Restart backend on Render

### SSL Certificate
- [ ] Vercel automatically provisions SSL (wait 24-48 hours)
- [ ] Verify HTTPS works on custom domain
- [ ] HTTP redirects to HTTPS

---

## Rollback Plan

If deployment fails or has critical issues:

### Immediate Rollback
1. Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "⋮" → "Promote to Production"

### Identify Issue
- Check Vercel deployment logs
- Check browser console errors
- Check Network tab for failed API calls
- Check backend logs on Render

### Common Fixes
- Incorrect environment variable → Update in Vercel
- CORS error → Update backend CORS_ORIGINS
- Build failure → Check package.json dependencies
- API timeout → Increase timeout in api.js

---

## Documentation

### Update README.md
- [ ] Add deployment instructions
- [ ] Include environment variable documentation
- [ ] Add link to VERCEL_DEPLOYMENT_GUIDE.md

### Team Communication
- [ ] Share Vercel URL with team
- [ ] Document environment variables
- [ ] Share admin credentials (securely)
- [ ] Update project documentation

---

## Final Verification

### Acceptance Criteria
- [ ] All pages load without errors
- [ ] All API endpoints working
- [ ] Admin panel fully functional
- [ ] Client portal working (if applicable)
- [ ] Demo projects accessible
- [ ] Contact form sends data to backend
- [ ] No console errors
- [ ] No CORS errors
- [ ] Responsive on all devices
- [ ] Default admin password changed

### Sign-Off
- [ ] Development team approval
- [ ] QA testing complete
- [ ] Stakeholder review
- [ ] Production launch approved

---

## Maintenance Tasks

### Regular Checks
- [ ] Monitor deployment logs weekly
- [ ] Check error rates in Vercel Analytics
- [ ] Review backend logs for API errors
- [ ] Test critical user flows monthly
- [ ] Update dependencies quarterly

### Security Updates
- [ ] Rotate JWT secret key every 6 months
- [ ] Update admin passwords regularly
- [ ] Review CORS origins quarterly
- [ ] Update NPM packages for security patches

---

## Emergency Contacts

### Services
- **Vercel Support:** https://vercel.com/support
- **Render Support:** https://render.com/docs/support
- **GitHub Support:** https://support.github.com

### Documentation
- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **React Docs:** https://react.dev

---

## Notes

### Known Issues
- Document any known issues or limitations

### Future Improvements
- List planned features or optimizations

### Lessons Learned
- Document deployment challenges and solutions

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Vercel URL:** _______________  
**Custom Domain:** _______________  
**Backend URL:** _______________

---

✅ **PRODUCTION DEPLOYMENT COMPLETE**

Your frontend is successfully deployed and verified!

🎉 **Congratulations!**
