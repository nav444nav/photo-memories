# Deployment Quick Reference

Fast reference for common deployment tasks and commands.

## 🔗 Essential URLs

```bash
# Local Development
Frontend:  http://localhost:5173
Backend:   http://localhost:3000
Database:  backend/prisma/dev.db (SQLite)

# Production (fill in after deployment)
Frontend:  https://_____.vercel.app
Backend:   https://_____.onrender.com
Database:  Supabase dashboard

# Service Dashboards
Supabase:  https://app.supabase.com
Render:    https://dashboard.render.com
Vercel:    https://vercel.com/dashboard
```

## 🚀 Deployment Commands

### Initial Setup
```bash
# Generate strong JWT secret
openssl rand -hex 32

# Or with Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Supabase Database

```bash
# Connect to Supabase from local
cd backend
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (view database)
npx prisma studio
```

### Render Backend

```bash
# Manual deployment (usually auto-deploys on git push)
git push origin main

# View logs
# Use Render Dashboard → Service → Logs

# Trigger redeploy
# Render Dashboard → Service → Manual Deploy → Deploy latest commit

# Run migrations on production
# SSH not available on free tier - use Prisma migrate deploy locally
DATABASE_URL="your-supabase-url" npx prisma migrate deploy
```

### Vercel Frontend

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs [deployment-url]

# List deployments
vercel list
```

## 📝 Environment Variables

### Backend (Render)

```bash
# Required
DATABASE_URL          # Supabase connection string
JWT_SECRET           # openssl rand -hex 32
JWT_EXPIRES_IN       # 7d
NODE_ENV             # production
PORT                 # 10000
FRONTEND_URL         # https://your-app.vercel.app

# Optional
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

### Frontend (Vercel)

```bash
# Required
VITE_API_URL         # https://your-api.onrender.com/api
VITE_USE_MOCK_API    # false
VITE_APP_NAME        # Photo Memories

# Optional
VITE_GA_TRACKING_ID
VITE_SENTRY_DSN
```

## 🔄 Common Tasks

### Update Backend Code
```bash
# Make changes
git add .
git commit -m "Update backend"
git push origin main

# Render auto-deploys
# Wait 2-5 minutes
# Check deployment in Render dashboard
```

### Update Frontend Code
```bash
# Make changes
git add .
git commit -m "Update frontend"
git push origin main

# Vercel auto-deploys
# Wait 1-2 minutes
# Check deployment in Vercel dashboard
```

### Update Database Schema
```bash
# 1. Update backend/prisma/schema.prisma

# 2. Create migration
cd backend
npx prisma migrate dev --name your_migration_name

# 3. Test locally
npm run dev

# 4. Deploy migration to production
DATABASE_URL="your-supabase-url" npx prisma migrate deploy

# 5. Redeploy backend
git push origin main
```

### Update Environment Variables

**Render:**
1. Dashboard → Service → Environment
2. Update variable
3. Click "Save Changes"
4. Service redeploys automatically

**Vercel:**
1. Dashboard → Project → Settings → Environment Variables
2. Update variable
3. Redeploy (Deployments → ... → Redeploy)

### Rollback Deployment

**Render:**
1. Dashboard → Service → Deploys
2. Find working deployment
3. Click "..." → Redeploy

**Vercel:**
1. Dashboard → Project → Deployments
2. Find working deployment
3. Click "..." → Promote to Production

### View Logs

**Render:**
```bash
# Real-time logs
Dashboard → Service → Logs (auto-refreshes)
```

**Vercel:**
```bash
# CLI
vercel logs [deployment-url]

# Dashboard
Project → Deployments → [Click deployment] → Function Logs
```

**Supabase:**
```bash
# Database logs
Dashboard → Database → Logs
```

## 🧪 Testing Production

### Health Checks
```bash
# Backend health
curl https://your-api.onrender.com/health

# Should return: {"status":"ok","timestamp":"..."}

# Frontend
curl -I https://your-app.vercel.app

# Should return: 200 OK
```

### Test Authentication
```bash
# Register user
curl -X POST https://your-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "full_name": "Test User"
  }'

# Should return: user object and JWT token

# Login
curl -X POST https://your-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'

# Get current user (with token)
curl https://your-api.onrender.com/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Database Connection
```bash
# From local machine
cd backend
export DATABASE_URL="your-supabase-url"
npx prisma studio

# Opens browser at localhost:5555
# Should show all tables with data
```

## 🐛 Debugging

### Backend Not Responding
```bash
# Check service status
# Render Dashboard → Service → should show "Live"

# Check logs
# Render Dashboard → Service → Logs

# Common issues:
# - Service sleeping (free tier) - first request takes 30s
# - Database connection failed - check DATABASE_URL
# - Build failed - check build logs
```

### Frontend Not Loading
```bash
# Check deployment status
# Vercel Dashboard → Project → should show "Ready"

# Check build logs
# Vercel Dashboard → Deployments → [latest] → Build Logs

# Common issues:
# - TypeScript errors - run npm run build locally
# - Missing env vars - check Vercel settings
# - 404 on routes - check vercel.json rewrites
```

### CORS Errors
```bash
# Symptom: "CORS policy" error in browser console

# Fix:
# 1. Check FRONTEND_URL in Render matches Vercel URL exactly
# 2. Include protocol: https://
# 3. No trailing slash
# 4. Redeploy backend after changing

# Verify:
curl -H "Origin: https://your-app.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://your-api.onrender.com/api/auth/me
```

### Database Connection Issues
```bash
# Test connection locally
cd backend
export DATABASE_URL="your-supabase-url"
npx prisma db pull

# Should download schema successfully

# Common issues:
# - Wrong password in connection string
# - Supabase project paused (inactive > 1 week)
# - Connection limit reached (free tier: 60)
# - Firewall blocking connection
```

## 📊 Monitoring

### Check Service Health
```bash
# Backend uptime
curl https://your-api.onrender.com/health

# Frontend uptime
curl -I https://your-app.vercel.app

# Database status
# Supabase Dashboard → Project → should show "Active"
```

### Resource Usage

**Render:**
- Dashboard → Service → Metrics
- Check: CPU, Memory, Requests

**Vercel:**
- Dashboard → Project → Analytics
- Check: Bandwidth, Function Duration

**Supabase:**
- Dashboard → Settings → Usage
- Check: Database size, Bandwidth, Queries

### Free Tier Limits

```bash
Render:
  - 750 hours/month (1 service always on)
  - 100 GB bandwidth
  - Service sleeps after 15 min inactivity

Vercel:
  - 100 GB bandwidth
  - Unlimited deployments
  - No sleep time

Supabase:
  - 500 MB database
  - 1 GB file storage
  - 2 GB bandwidth
  - Pauses after 1 week inactivity
```

## 🔐 Security

### Rotate JWT Secret
```bash
# 1. Generate new secret
openssl rand -hex 32

# 2. Update in Render
# Dashboard → Service → Environment → JWT_SECRET

# 3. Service redeploys
# All users will need to login again
```

### Database Backup
```bash
# Supabase auto-backups (7 days on free tier)
# Manual backup:

# 1. Export from Supabase
# Dashboard → Database → Backups → Download

# Or use pg_dump
pg_dump "your-supabase-url" > backup.sql

# Restore
psql "your-supabase-url" < backup.sql
```

## 📚 Documentation Links

- **Render:** https://render.com/docs
- **Vercel:** https://vercel.com/docs
- **Supabase:** https://supabase.com/docs
- **Prisma:** https://www.prisma.io/docs
- **Express:** https://expressjs.com
- **React:** https://react.dev
- **Vite:** https://vitejs.dev

## 🆘 Getting Help

1. Check service status pages:
   - Render: https://status.render.com
   - Vercel: https://www.vercel-status.com
   - Supabase: https://status.supabase.com

2. Review logs for specific errors
3. Search documentation
4. Check GitHub issues
5. Community forums (Discord, Reddit)

---

**Last Updated:** 2025-10-22
