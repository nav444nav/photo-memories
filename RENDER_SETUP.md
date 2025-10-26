# Render Setup Guide - Quick Start

## ✅ Branch Issue Fixed!

The `render.yaml` has been updated to deploy from your feature branch:
```
branch: claude/add-neon-tech-011CUV3od9DAWiuWeFkopReA
```

Render will now automatically deploy from this branch.

## Setup Steps (10 minutes)

### Step 1: Connect Repository to Render

**Option A: Using render.yaml (Recommended)**

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will read `render.yaml` and configure automatically
5. Click **"Apply"**

**Option B: Manual Setup**

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `photo-memories-api`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `claude/add-neon-tech-011CUV3od9DAWiuWeFkopReA`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 2: Set Environment Variables

Go to your service → **Environment** tab and add:

#### Required Variables

```bash
# Database (get from Neon.tech)
DATABASE_URL=postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require

# JWT Secret (generate new one)
JWT_SECRET=<run: openssl rand -hex 32>

# Cloudinary (REQUIRED for image uploads!)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Auto-Set Variables (verify these exist)

```bash
NODE_ENV=production
PORT=10000
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=20971520
MAX_FILES_PER_UPLOAD=10
DEFAULT_STORAGE_LIMIT=5368709120
```

#### Set After Frontend Deployed

```bash
FRONTEND_URL=https://your-app.vercel.app
```

### Step 3: Get Cloudinary Credentials

🚨 **REQUIRED FOR IMAGE UPLOADS!**

1. Go to https://cloudinary.com
2. Click **"Sign Up"** (free tier: 25GB storage)
3. After signup, go to **Dashboard**
4. Copy these 3 values:
   - **Cloud Name** (top of dashboard)
   - **API Key**
   - **API Secret** (click "reveal" button)
5. Add to Render environment variables

### Step 4: Get Neon Database URL

1. Go to https://neon.tech
2. Create project (or use existing)
3. Click **"Connection Details"**
4. Select **"Prisma"** from dropdown
5. Copy the full connection string:
   ```
   postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require
   ```
6. Add to Render as `DATABASE_URL`

### Step 5: Deploy

1. Save all environment variables
2. Render will automatically deploy
3. Wait 3-5 minutes for build
4. Check **Logs** tab for progress

### Step 6: Verify Deployment

1. Once deployed, find your service URL (like `https://photo-memories-api.onrender.com`)
2. Visit: `https://your-service.onrender.com/health`
3. Should see:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-10-26T..."
   }
   ```

## Troubleshooting

### Build Fails - Migration Error

If you see: `Error: P3009 migrate found failed migrations`

**Fix in Render Shell:**

1. Go to Render Dashboard → your service
2. Click **"Shell"** tab
3. Run:
   ```bash
   cd backend
   npx prisma migrate resolve --rolled-back "20251022005512_init"
   npx prisma db push
   ```

Or redeploy with this build command:
```bash
npm install && npx prisma db push --accept-data-loss && npx prisma generate && npm run build
```

### Cloudinary Upload Fails

**Check logs for:**
```
Error: Must supply cloud_name
Error: Invalid API credentials
```

**Fix:**
- Verify all 3 Cloudinary env vars are set
- No typos in credentials
- Restart service after adding env vars

### CORS Error from Frontend

**Error in browser:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS
```

**Fix:**
- Set `FRONTEND_URL` in Render to your exact Vercel URL
- No trailing slash: `https://your-app.vercel.app` ✅
- Not: `https://your-app.vercel.app/` ❌

### Database Connection Fails

**Check logs for:**
```
Error: P1001: Can't reach database server
```

**Fix:**
- Ensure `DATABASE_URL` includes `?sslmode=require`
- Verify Neon project is active
- Check connection string is complete

## Auto-Deployment

✅ **Render will now auto-deploy when you push to your feature branch!**

Every time you push to `claude/add-neon-tech-011CUV3od9DAWiuWeFkopReA`:
1. Render detects the push
2. Runs build command
3. Deploys automatically
4. ~3-5 minutes later, changes are live

## Environment Variables Checklist

Before deploying, make sure you have:

- [ ] `DATABASE_URL` - from Neon.tech
- [ ] `JWT_SECRET` - generate with `openssl rand -hex 32`
- [ ] `CLOUDINARY_CLOUD_NAME` - from Cloudinary dashboard
- [ ] `CLOUDINARY_API_KEY` - from Cloudinary dashboard
- [ ] `CLOUDINARY_API_SECRET` - from Cloudinary dashboard
- [ ] `NODE_ENV=production` - auto-set by render.yaml
- [ ] `PORT=10000` - auto-set by render.yaml
- [ ] `FRONTEND_URL` - set after deploying frontend to Vercel

## Testing Production Uploads

Once Render is deployed:

1. **Update frontend** (for production testing):
   ```bash
   cd frontend
   # Edit .env.production
   VITE_API_URL=https://your-service.onrender.com/api
   VITE_USE_MOCK_API=false
   ```

2. **Deploy frontend to Vercel**
   - Push to GitHub
   - Vercel auto-deploys
   - Get your Vercel URL

3. **Update Render `FRONTEND_URL`**
   - Set to your Vercel URL
   - Restart Render service

4. **Test upload**:
   - Open your Vercel app
   - Login
   - Upload a photo
   - Check Cloudinary dashboard for the uploaded image

## Quick Command Reference

```bash
# Generate JWT secret
openssl rand -hex 32

# Test health endpoint
curl https://your-service.onrender.com/health

# Check if Cloudinary works (from Render shell)
cd backend
node -e "const cloudinary = require('cloudinary').v2; console.log(cloudinary.config())"

# Reset database (from Render shell)
cd backend
npx prisma db push
```

## Free Tier Limits

- **Render**: 750 hours/month, sleeps after 15min inactivity
- **Neon**: 512MB DB, auto-suspends after 5min inactivity
- **Cloudinary**: 25GB storage + 25GB bandwidth
- **Total**: $0/month for MVP! 🎉

## Next Steps

After Render is deployed:

1. ✅ Deploy frontend to Vercel
2. ✅ Test uploads on production
3. ✅ Verify images in Cloudinary dashboard
4. 🎉 You're live!

---

**Need help?** Check the logs in Render Dashboard → Logs tab
