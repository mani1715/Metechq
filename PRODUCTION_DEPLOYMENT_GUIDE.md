# 🚀 METECHQ PRODUCTION DEPLOYMENT GUIDE

## System Architecture & Prerequisites
- Python 3.10+
- Node.js 18+ (LTS)
- MongoDB 6.0+ (Atlas or self-hosted)
- Minimum 1GB RAM (2GB+ recommended)
- SSL/TLS Termination (Cloudflare, Nginx, or AWS ALB)

---

## Unified Docker Deployment (Recommended)

The Metechq stack includes full containerization via `docker-compose.yml`:

```bash
# 1. Clone repository
git clone https://github.com/mani1715/Metechq.git
cd Metechq

# 2. Configure production secrets in .env
cp .env.example .env
# Edit .env and supply strong JWT_SECRET, CLIENT_JWT_SECRET, and MONGO_ROOT_PASSWORD

# 3. Launch the full stack
docker-compose up -d --build

# 4. Verify running health status
docker-compose ps
```

---

## Rollback Procedures

If an issue occurs during a production deployment:

### 1. Container Rollback
```bash
# Revert to previous git release tag
git checkout tags/v1.0.0-stable

# Rebuild and restart containers
docker-compose up -d --build
```

### 2. Database Snapshot Restore
```bash
# In MongoDB Atlas: Select cluster -> Backup -> Restore to point-in-time
# For self-hosted:
mongorestore --uri="$MONGO_URL" --drop /backups/backup_YYYYMMDD_HHMMSS/metechq
```

### Deployment Platforms

#### Option 1: Render.com (Recommended)
```yaml
# render.yaml
services:
  - type: web
    name: mspn-dev-api
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn server:app --host 0.0.0.0 --port $PORT --workers 4"
    envVars:
      - key: PYTHON_VERSION
        value: 3.10.0
      - key: MONGODB_URI
        sync: false
      - key: SECRET_KEY
        generateValue: true
      - key: CORS_ORIGINS
        value: https://your-frontend.vercel.app
      - key: TRUST_PROXY
        value: true
      - key: ENVIRONMENT
        value: production
```

#### Option 2: Railway
```toml
# railway.toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn server:app --host 0.0.0.0 --port $PORT --workers 4"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

#### Option 3: Docker + Kubernetes
```dockerfile
# Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8001/health')"

# Run application
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001", "--workers", "4"]
```

```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mspn-dev-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mspn-dev-api
  template:
    metadata:
      labels:
        app: mspn-dev-api
    spec:
      containers:
      - name: api
        image: your-registry/mspn-dev-api:latest
        ports:
        - containerPort: 8001
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: mspn-secrets
              key: mongodb-uri
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: mspn-secrets
              key: secret-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8001
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: mspn-dev-api
spec:
  selector:
    app: mspn-dev-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8001
  type: LoadBalancer
```

### Environment Variables

**Required:**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
SECRET_KEY=your-super-secret-key-min-32-chars
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Optional but Recommended:**
```env
ENVIRONMENT=production
TRUST_PROXY=true
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PER_MINUTE=60
LOG_LEVEL=INFO
SENTRY_DSN=https://your-sentry-dsn
REDIS_URL=redis://your-redis-url
```

### Database Setup (MongoDB Atlas)

1. Create cluster at https://cloud.mongodb.com
2. Create database user
3. Whitelist IP addresses (or allow from anywhere: 0.0.0.0/0)
4. Get connection string
5. Create indexes:

```python
# scripts/create_indexes.py
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os

async def create_indexes():
    client = AsyncIOMotorClient(os.environ['MONGODB_URI'])
    db = client[os.environ['DB_NAME']]
    
    # Users/Admins
    await db.admins.create_index("username", unique=True)
    await db.admins.create_index("email", unique=True)
    await db.clients.create_index("email", unique=True)
    
    # Projects
    await db.projects.create_index("id", unique=True)
    await db.projects.create_index("created_at")
    await db.client_projects.create_index("client_id")
    
    # Blogs
    await db.blogs.create_index("id", unique=True)
    await db.blogs.create_index("slug", unique=True)
    await db.blogs.create_index("published_at")
    
    # Bookings
    await db.bookings.create_index([("date", 1), ("time_slot", 1)])
    
    print("✅ Indexes created successfully")

if __name__ == "__main__":
    asyncio.run(create_indexes())
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)
```json
// vercel.json
{
  "buildCommand": "yarn build",
  "outputDirectory": "build",
  "devCommand": "yarn start",
  "installCommand": "yarn install",
  "framework": "create-react-app",
  "env": {
    "REACT_APP_BACKEND_URL": "https://your-api.onrender.com/api",
    "REACT_APP_API_VERSION": "v1"
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-api.onrender.com/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Option 2: Netlify
```toml
# netlify.toml
[build]
  command = "yarn build"
  publish = "build"

[build.environment]
  REACT_APP_BACKEND_URL = "https://your-api.onrender.com/api"
  REACT_APP_API_VERSION = "v1"

[[redirects]]
  from = "/api/*"
  to = "https://your-api.onrender.com/api/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### Option 3: Docker + Nginx
```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API proxy
    location /api {
        proxy_pass https://your-api.onrender.com;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Pre-Deployment Checklist

### Backend
- [ ] All environment variables set
- [ ] SECRET_KEY is secure (min 32 characters)
- [ ] CORS_ORIGINS configured correctly
- [ ] Database indexes created
- [ ] Health check endpoint working
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Error tracking setup (Sentry)
- [ ] Database backups configured
- [ ] SSL/TLS enabled

### Frontend
- [ ] REACT_APP_BACKEND_URL set correctly
- [ ] Build succeeds without errors
- [ ] No console errors in production build
- [ ] All environment variables set
- [ ] Assets optimized (images, fonts)
- [ ] Meta tags for SEO
- [ ] Analytics configured
- [ ] Error boundary implemented
- [ ] Loading states handled
- [ ] 404 page configured

---

## Monitoring & Logging

### Backend Monitoring
```python
# Add to requirements.txt
sentry-sdk[fastapi]==1.40.0

# In server.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        integrations=[FastApiIntegration()],
        traces_sample_rate=1.0,
        environment=settings.ENVIRONMENT,
    )
```

### Frontend Monitoring
```bash
yarn add @sentry/react
```

```javascript
// src/index.js
import * as Sentry from "@sentry/react";

if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

---

## Performance Optimization

### Backend
1. **Enable caching with Redis:**
```python
# Add to requirements.txt
redis==5.0.1
aioredis==2.0.1

# In config.py
REDIS_URL: Optional[str] = None
CACHE_TTL: int = 300
```

2. **Database connection pooling:**
```python
# In database.py
client = AsyncIOMotorClient(
    mongodb_uri,
    maxPoolSize=50,
    minPoolSize=10,
)
```

3. **Enable compression:**
Already included in middleware (GZipMiddleware)

### Frontend
1. **Code splitting:**
```javascript
// App.js
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
```

2. **Image optimization:**
```bash
yarn add sharp
yarn add @vercel/next-image-optimizer
```

3. **Bundle analysis:**
```bash
yarn add --dev webpack-bundle-analyzer
```

---

## Security Hardening

### Backend
- [x] JWT authentication
- [x] Password hashing (bcrypt)
- [x] HTTPS enforcement
- [x] CORS configured
- [x] Rate limiting
- [x] Security headers
- [ ] Input sanitization
- [ ] SQL injection prevention (N/A - using MongoDB)
- [ ] XSS prevention
- [ ] CSRF protection

### Frontend
- [x] Environment variables for secrets
- [x] No hardcoded credentials
- [x] HTTPS only
- [ ] Content Security Policy
- [ ] Subresource Integrity
- [ ] Secure cookie flags

---

## Backup Strategy

### Database Backups
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backups/backup_$DATE"
tar -czf "/backups/backup_$DATE.tar.gz" "/backups/backup_$DATE"
rm -rf "/backups/backup_$DATE"

# Upload to S3
aws s3 cp "/backups/backup_$DATE.tar.gz" s3://your-bucket/backups/
```

### Automated Backups (MongoDB Atlas)
- Enable continuous backups
- Set retention period (7-30 days)
- Configure snapshot schedule

---

## Cost Optimization

### Free Tier Options
- **Backend:** Render.com (Free - 750 hours/month)
- **Frontend:** Vercel (Free - Unlimited)
- **Database:** MongoDB Atlas (Free - 512MB)
- **Monitoring:** Sentry (Free - 5K events/month)

### Estimated Monthly Costs (Production)
- Backend (Render Pro): $7-25/month
- Frontend (Vercel Pro): $20/month
- Database (Atlas M10): $57/month
- CDN (Cloudflare): Free
- Monitoring (Sentry): $26/month
- **Total:** ~$110-128/month

---

## Post-Deployment

1. **Test all functionality:**
   - Authentication flows
   - CRUD operations
   - File uploads
   - Email sending
   - Booking system

2. **Monitor for 24 hours:**
   - Check logs for errors
   - Monitor response times
   - Watch for rate limit hits
   - Check database connections

3. **Setup alerts:**
   - Uptime monitoring (UptimeRobot)
   - Error tracking (Sentry)
   - Performance degradation
   - Database disk usage

4. **Documentation:**
   - Update README with production URLs
   - Document deployment process
   - Create runbook for common issues
