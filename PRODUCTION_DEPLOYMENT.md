# Production Deployment Guide

## Current Situation

✅ Local works perfectly (image upload and display)
✅ All code is on branch: `claude/add-neon-tech-011CUV3od9DAWiuWeFkopReA`
⚠️ Render is configured to deploy from `main` branch (which doesn't exist yet)

## Option 1: Deploy from Feature Branch (Recommended - Fastest)

### Step 1: Update Render to Use Your Feature Branch

**In Render Dashboard:**

1. Go to https://dashboard.render.com
2. Find your `photo-memories-api` service
3. Click on the service
4. Go to **Settings** tab
5. Scroll to **Branch** setting
6. Change from `main` to `claude/add-neon-tech-011CUV3od9DAWiuWeFkopReA`
7. Click **Save Changes**

This will trigger an automatic deployment from your feature branch.

### Step 2: Set Environment Variables in Render

Make sure these are configured in Render → Environment:

```bash
# Database (Neon.tech)
DATABASE_URL=postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require

# JWT
JWT_SECRET=[generate with: openssl rand -hex 32]
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=production
PORT=10000

# CORS
FRONTEND_URL=https://your-app.vercel.app

# Cloudinary (REQUIRED for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# File Upload Limits
MAX_FILE_SIZE=20971520
MAX_FILES_PER_UPLOAD=10
DEFAULT_STORAGE_LIMIT=5368709120
```

**🚨 IMPORTANT: You must add Cloudinary credentials for uploads to work!**

### Step 3: Get Cloudinary Credentials

1. Go to https://cloudinary.com
2. Sign up for free account (25GB storage + 25GB bandwidth free)
3. Go to Dashboard
4. Copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
5. Add these to Render environment variables

### Step 4: Set Up Neon Database

1. Go to https://neon.tech
2. Create new project (if you haven't already)
3. Copy the connection string (select "Prisma" format)
4. Add to Render as `DATABASE_URL`

### Step 5: Deploy and Verify

After Render finishes deploying:

1. Check logs: Render Dashboard → Logs tab
2. Visit health endpoint: `https://your-app.onrender.com/health`
3. Should return: `{"status":"ok","timestamp":"..."}`

## Option 2: Merge to Main via GitHub (More Formal)

If you want to use `main` branch properly:

### Step 1: Create Pull Request on GitHub

1. Go to your GitHub repository
2. Click "Pull Requests"
3. Click "New Pull Request"
4. Base: `main` (create it if needed)
5. Compare: `claude/add-neon-tech-011CUV3od9DAWiuWeFkopReA`
6. Create and merge the PR

### Step 2: Push Main Branch

After merging on GitHub:

```bash
git checkout main
git pull origin main
git push origin main
```

### Step 3: Render Will Auto-Deploy

Since render.yaml specifies `branch: main`, Render will automatically deploy.

## Testing Production Upload

Once deployed, test the upload:

### 1. Update Frontend Environment

```bash
cd frontend
# Edit .env or .env.production
VITE_API_URL=https://your-app.onrender.com/api
VITE_USE_MOCK_API=false
```

### 2. Test Upload Flow

1. Build and deploy frontend to Vercel
2. Open your production app
3. Login
4. Go to Gallery
5. Click "Upload Photos"
6. Select an image
7. Upload should work and image should display!

### 3. Verify in Cloudinary

1. Go to Cloudinary Dashboard
2. Click "Media Library"
3. You should see your uploaded images in `photo-memories/[user-id]/` folder

## Troubleshooting Production

### Upload Returns 500 Error

**Check Cloudinary credentials:**
```bash
# In Render logs, you should NOT see:
# "Error: Must supply cloud_name"
# "Error: Invalid API credentials"
```

**Fix:**
- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in Render
- Restart Render service after updating env vars

### Database Connection Fails

**Check Neon connection:**
```bash
# In Render logs, you should NOT see:
# "Error: P1001: Can't reach database"
# "Error: SSL required"
```

**Fix:**
- Ensure `DATABASE_URL` includes `?sslmode=require`
- Verify Neon project is active (not suspended)
- Check connection string is correct

### Images Upload but Don't Display

**Check CORS:**
- Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
- Should be: `https://your-app.vercel.app` (no trailing slash)

**Check Cloudinary URLs:**
- Inspect image src in browser DevTools
- Should be: `https://res.cloudinary.com/...`
- Should NOT be: `blob:...` or `undefined`

### First Deploy Fails - Migration Issues

If you see migration errors:

```bash
# In Render Dashboard → Shell
cd /opt/render/project/src/backend
npx prisma migrate resolve --rolled-back "20251022005512_init"
npx prisma db push
```

Or use the fix script:
```bash
./fix-migration.sh
```

## Quick Checklist

Before deploying to production:

- [ ] Neon.tech database created
- [ ] Neon connection string copied
- [ ] Cloudinary account created (free tier)
- [ ] Cloudinary credentials copied (cloud name, API key, secret)
- [ ] Render service branch updated to feature branch
- [ ] All environment variables set in Render
- [ ] Database migrated (prisma db push)
- [ ] Frontend FRONTEND_URL set in Render
- [ ] Frontend built and deployed to Vercel
- [ ] Backend health check passing

## Environment Variables Quick Reference

### Render Backend

```bash
# REQUIRED
DATABASE_URL=postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require
JWT_SECRET=[random-64-chars]
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# AUTO-SET
NODE_ENV=production
PORT=10000

# SET AFTER FRONTEND DEPLOYED
FRONTEND_URL=https://your-app.vercel.app
```

### Vercel Frontend

```bash
VITE_API_URL=https://your-app.onrender.com/api
VITE_USE_MOCK_API=false
VITE_APP_NAME=Photo Memories
```

## What Happens After Deployment

1. **First Request (Cold Start)**
   - Render wakes up (~30s)
   - Neon wakes up (~300ms)
   - Total: ~30-35s first request

2. **Subsequent Requests**
   - Render: Active
   - Neon: Active
   - Response time: <200ms

3. **After 15min Inactivity**
   - Render: Sleeps (free tier)
   - Neon: Suspends (free tier)
   - Next request: Cold start again

## Cost After Deployment

**Free Tier:**
- Neon: 512MB DB + 191.9 compute hours = $0
- Cloudinary: 25GB storage + 25GB bandwidth = $0
- Render: 750 hours/month = $0
- Vercel: 100GB bandwidth = $0
- **Total: $0/month** 🎉

## Next Steps

1. **Choose deployment option** (Option 1 recommended)
2. **Set up Cloudinary** (required for uploads)
3. **Update Render branch** to `claude/add-neon-tech-011CUV3od9DAWiuWeFkopReA`
4. **Add all environment variables** in Render
5. **Wait for deployment** to complete
6. **Test upload** on production!

---

**Need Help?**
- Render logs: Dashboard → Logs
- Neon logs: Console → Monitoring
- Cloudinary: Media Library to see uploads

Good luck! 🚀
