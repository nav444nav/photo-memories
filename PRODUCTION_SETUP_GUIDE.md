# Production Setup Guide - Free Tier Deployment

This guide will help you deploy Photo Memories to production using 100% free services:
- **Supabase** - PostgreSQL database (500MB, 2GB bandwidth/month)
- **Render** - Backend API hosting (750 hours/month)
- **Vercel** - Frontend hosting (100GB bandwidth/month)

**Total Cost: $0/month** for MVP and testing

## Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Vercel    │ ───> │   Render    │ ───> │  Supabase   │
│  (Frontend) │      │  (Backend)  │      │ (Database)  │
└─────────────┘      └─────────────┘      └─────────────┘
```

## Prerequisites

- GitHub account (for deployments)
- Email address (for service signups)
- Your code pushed to GitHub repository

---

## Part 1: Supabase Database Setup (15 minutes)

### Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

### Step 2: Create New Project

1. Click "New Project"
2. Fill in details:
   - **Name**: `photo-memories-db` (or your choice)
   - **Database Password**: Generate a strong password (SAVE THIS!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free
3. Click "Create new project"
4. Wait 2-3 minutes for project to initialize

### Step 3: Get Database Connection String

1. In your Supabase project, click "Project Settings" (gear icon)
2. Click "Database" in the left sidebar
3. Scroll to "Connection string" section
4. Click "URI" tab
5. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
6. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the password from Step 2
7. Save this - you'll need it for backend deployment

### Step 4: Run Database Migrations

**Option A: Using Prisma (Recommended)**

On your local machine:

```bash
# Navigate to backend directory
cd backend

# Create a new .env.production file
cat > .env.production << 'EOF'
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
EOF

# Replace [YOUR-PASSWORD] and [PROJECT-REF] with your actual values
# Edit the file and update the DATABASE_URL

# Run migrations against Supabase
DATABASE_URL=$(cat .env.production | grep DATABASE_URL | cut -d= -f2 | tr -d '"') npx prisma migrate deploy
```

**Option B: Using SQL Directly**

1. In Supabase dashboard, click "SQL Editor" in left sidebar
2. Click "New query"
3. Copy the contents of `backend/prisma/manual_schema_postgres.sql` (we'll create this)
4. Paste into SQL editor
5. Click "Run" or press Cmd/Ctrl + Enter
6. Verify tables were created in "Table Editor"

### Step 5: Verify Database Setup

1. Click "Table Editor" in Supabase sidebar
2. You should see 6 tables:
   - users
   - photos
   - albums
   - album_photos
   - tags
   - photo_tags
3. Click on "users" table - should be empty but have correct columns

✅ **Supabase database is ready!**

---

## Part 2: Backend Deployment to Render (20 minutes)

### Step 1: Prepare Backend for Production

First, ensure your code is ready for production deployment.

1. **Create production Prisma schema** (if not exists):

```bash
cd backend/prisma

# We'll create a PostgreSQL version of the schema
# (Already done - schema.prisma can switch providers)
```

2. **Verify backend build works locally**:

```bash
cd backend
npm run build

# Should create dist/ folder with compiled JS
ls dist/
```

### Step 2: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### Step 3: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your repository:
   - If not connected, click "Connect account" and authorize GitHub
   - Find your `photo-memories` repository
   - Click "Connect"

3. Configure the service:
   - **Name**: `photo-memories-api` (or your choice)
   - **Region**: Same as Supabase (or closest to users)
   - **Branch**: `main` (or your production branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run db:generate && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. Scroll to "Environment Variables" section
5. Click "Add Environment Variable" and add these:

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET = [Generate a random 64-character string]
JWT_EXPIRES_IN = 7d
NODE_ENV = production
PORT = 10000
FRONTEND_URL = https://photo-memories.vercel.app
```

**How to generate JWT_SECRET:**
```bash
# On your local machine
openssl rand -hex 32
# Or
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

6. Click "Create Web Service"
7. Wait 5-10 minutes for first deployment
8. Once deployed, you'll get a URL like: `https://photo-memories-api.onrender.com`

### Step 4: Verify Backend Deployment

1. Visit your Render service URL: `https://photo-memories-api.onrender.com/health`
2. Should see:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-10-22T..."
   }
   ```

3. Test API endpoint:
   ```bash
   curl https://photo-memories-api.onrender.com/health
   ```

✅ **Backend is deployed and running!**

---

## Part 3: Frontend Deployment to Vercel (10 minutes)

### Step 1: Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Sign up with GitHub (recommended)
4. Authorize Vercel to access your repositories

### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Import your `photo-memories` repository
3. Click "Import"

### Step 3: Configure Frontend Build

1. **Framework Preset**: Vite (should auto-detect)
2. **Root Directory**: `frontend` (click Edit → enter `frontend`)
3. **Build Command**: `npm run build` (should auto-fill)
4. **Output Directory**: `dist` (should auto-fill)
5. **Install Command**: `npm install` (should auto-fill)

### Step 4: Environment Variables

Click "Environment Variables" and add:

```
VITE_API_URL = https://photo-memories-api.onrender.com/api
VITE_USE_MOCK_API = false
VITE_APP_NAME = Photo Memories
```

**Replace** `photo-memories-api.onrender.com` with your actual Render URL from Part 2!

### Step 5: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build and deployment
3. Once complete, you'll get a URL like: `https://photo-memories-xxx.vercel.app`

### Step 6: Update Backend CORS

1. Go back to Render dashboard
2. Open your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL = https://photo-memories-xxx.vercel.app
   ```
5. Click "Save Changes"
6. Service will redeploy automatically

✅ **Frontend is deployed!**

---

## Part 4: Testing Production Deployment (15 minutes)

### Step 1: Access Your App

1. Open your Vercel URL in browser: `https://photo-memories-xxx.vercel.app`
2. You should see the login page

### Step 2: Create Production Account

1. Click "Sign Up"
2. Register with:
   - Email: `your-email@example.com`
   - Password: `SecurePass123!`
   - Full Name: `Your Name`
3. Click "Register"

### Step 3: Verify Database

1. Go to Supabase dashboard
2. Click "Table Editor"
3. Click "users" table
4. You should see your newly created user!

### Step 4: Test Authentication Flow

1. Logout from your app
2. Login again with your credentials
3. Should see gallery page
4. Check browser DevTools:
   - Network tab: API calls going to your Render URL
   - Console: No errors
   - Application → Local Storage: Should have `auth-storage` with token

### Step 5: Test API Endpoints

```bash
# Get your JWT token from browser localStorage (auth-storage → state → token)
export TOKEN="your-jwt-token-here"
export API_URL="https://photo-memories-api.onrender.com"

# Test authenticated endpoint
curl -H "Authorization: Bearer $TOKEN" \
     $API_URL/api/auth/me

# Should return your user info
```

✅ **Production deployment is working!**

---

## Part 5: Custom Domain (Optional)

### For Frontend (Vercel)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain: `photos.yourdomain.com`
3. Follow Vercel's DNS configuration instructions
4. Wait for DNS propagation (5-60 minutes)

### For Backend (Render)

1. In Render service settings, go to "Custom Domain"
2. Add: `api.yourdomain.com`
3. Update DNS CNAME record
4. Wait for SSL certificate generation

### Update Environment Variables

After custom domains are working:

**Render** (backend):
```
FRONTEND_URL = https://photos.yourdomain.com
```

**Vercel** (frontend):
```
VITE_API_URL = https://api.yourdomain.com/api
```

---

## Troubleshooting

### Backend Issues

**Build fails on Render:**
- Check build logs for specific error
- Verify `backend/package.json` scripts are correct
- Ensure `backend/tsconfig.json` exists
- Try manual build locally: `npm run build`

**Database connection fails:**
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure password in connection string is correct
- Check Supabase logs in "Database" → "Logs"

**API returns 500 errors:**
- Check Render logs: Service → "Logs" tab
- Look for Prisma connection errors
- Verify all environment variables are set
- Check if migrations were run

### Frontend Issues

**Build fails on Vercel:**
- Check build logs for TypeScript errors
- Verify all dependencies in `frontend/package.json`
- Try local build: `cd frontend && npm run build`
- Check Vercel logs for specific errors

**API calls fail (CORS errors):**
- Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check Render backend is running: visit `/health` endpoint
- Open browser console for specific CORS error message
- Ensure Render service redeployed after env var change

**Login fails with 401:**
- Check Network tab for actual error response
- Verify backend is accessible from Vercel URL
- Check if user exists in Supabase database
- Try creating new account to test registration

**Environment variables not working:**
- Remember to prefix with `VITE_` for frontend vars
- Redeploy after changing environment variables
- Check Vercel deployment logs for env var values (masked)

### Database Issues

**Tables don't exist:**
- Run migrations manually using Prisma
- Or run the SQL script directly in Supabase SQL Editor
- Check Supabase "Table Editor" to confirm tables

**Can't connect to Supabase:**
- Verify project is active (not paused)
- Check connection string format
- Ensure password is URL-encoded if it contains special chars
- Try connecting with Prisma Studio locally

---

## Monitoring & Maintenance

### Render (Backend)

- **Logs**: Service → "Logs" tab (real-time)
- **Metrics**: Service → "Metrics" tab (CPU, memory, requests)
- **Sleep**: Free tier sleeps after 15 min inactivity (first request takes 30s)
- **Deploy**: Auto-deploys on git push to main branch

### Vercel (Frontend)

- **Analytics**: Project → "Analytics" (page views, performance)
- **Logs**: Deployment → "Function Logs"
- **Deployments**: Every git push creates preview deployment
- **Production**: Assign deployment to production domain

### Supabase (Database)

- **Usage**: Project → "Settings" → "Usage" (check storage, bandwidth)
- **Logs**: "Database" → "Logs" (query logs, errors)
- **Backups**: Free tier has daily backups (7 day retention)
- **Studio**: Visual database editor for managing data

---

## Cost Management

### Free Tier Limits

**Supabase:**
- ✅ 500 MB database storage
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth/month
- ✅ 50,000 monthly active users
- ⚠️ Auto-pause after 1 week inactivity

**Render:**
- ✅ 750 hours/month (enough for 1 service always on)
- ✅ Automatic SSL
- ✅ Custom domains
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ 100 GB bandwidth/month

**Vercel:**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited preview deployments
- ✅ Automatic SSL
- ✅ Custom domains
- ✅ Serverless functions (hobby plan)

### When to Upgrade

**Supabase** ($25/month):
- When you exceed 500 MB database
- Need more than 2 GB bandwidth
- Want daily backups with 30 day retention
- Need point-in-time recovery

**Render** ($7/month):
- Don't want service to sleep
- Need more compute power
- Exceed 100 GB bandwidth

**Vercel** ($20/month):
- Exceed 100 GB bandwidth
- Need team collaboration
- Want advanced analytics
- Need commercial usage

---

## Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (64+ characters)
- [ ] Enable Supabase Row Level Security (RLS)
- [ ] Add rate limiting to backend
- [ ] Set up monitoring and alerts
- [ ] Configure CORS properly (don't use *)
- [ ] Use environment variables (never commit secrets)
- [ ] Enable HTTPS only (auto on Render/Vercel)
- [ ] Set secure cookie policies
- [ ] Review Supabase auth settings

---

## Next Steps After Deployment

1. **Implement Photo Upload**
   - Set up Cloudinary account (free tier: 25 GB)
   - Add upload endpoints to backend
   - Create upload UI in frontend

2. **Add Remaining Features** (from FEATURE_BACKLOG.md)
   - Photo lightbox viewer
   - Album creation
   - Tag management
   - Search functionality

3. **Monitoring**
   - Set up error tracking (Sentry, LogRocket)
   - Add analytics (Google Analytics, Plausible)
   - Configure uptime monitoring

4. **Performance**
   - Add caching layer (Redis)
   - Optimize images (Sharp, Cloudinary transforms)
   - Add CDN for static assets

5. **Scaling**
   - Move to paid tiers when needed
   - Add database indexes
   - Implement pagination
   - Add background job processing

---

## Quick Reference

### URLs After Deployment

```bash
Frontend:  https://photo-memories-xxx.vercel.app
Backend:   https://photo-memories-api.onrender.com
Database:  Managed in Supabase dashboard
```

### Essential Commands

```bash
# Local development
cd backend && npm run dev
cd frontend && npm run dev

# Deploy backend
git push origin main  # Auto-deploys to Render

# Deploy frontend
git push origin main  # Auto-deploys to Vercel

# Database migrations
cd backend
npx prisma migrate deploy  # Production
npx prisma migrate dev     # Development

# View production logs
# Render: Dashboard → Service → Logs
# Vercel: Dashboard → Project → Deployments → Function Logs
```

### Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

**Deployment Complete!** 🎉

Your Photo Memories app is now live on production-grade infrastructure, all on free tiers.

Next: Follow Part 1-5 in order, then test thoroughly before sharing with users!
