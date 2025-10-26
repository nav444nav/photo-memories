# Photo Memories - Complete Setup Guide

Step-by-step guide to set up and run Photo Memories on your local machine or production environment.

## Prerequisites

- Node.js 18+ and npm
- Git
- PostgreSQL 14+ OR Neon.tech account (recommended)
- Cloudinary account (free tier) for image storage

---

## Option 1: Local Development with SQLite (Quickest)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd photo-memories

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Backend

```bash
cd backend

# Update .env file
# DATABASE_URL is already set to SQLite: "file:./dev.db"
# JWT_SECRET and other settings are configured

# Run Prisma migrations
npm run db:migrate

# This creates dev.db SQLite file
```

### 3. Start Backend

```bash
npm run dev
# Server runs at http://localhost:3000
```

### 4. Start Frontend

```bash
cd ../frontend

# Switch from mock API to real backend
# Edit .env file:
# VITE_USE_MOCK_API=false

npm run dev
# Frontend runs at http://localhost:5173
```

### 5. Test the Application

- Open http://localhost:5173
- Click "Sign Up"
- Register a new account
- Login and test features

---

## Option 2: Production Setup with Neon.tech (Recommended)

### 1. Create Neon.tech Project

1. Go to [neon.tech](https://neon.tech)
2. Create free account (sign up with GitHub recommended)
3. Click "New Project"
4. Fill in details:
   - **Name**: photo-memories
   - **PostgreSQL Version**: 16 (latest)
   - **Region**: Choose closest to you
5. Project is created instantly!

### 2. Get Database Connection String

1. In Neon dashboard, you'll see "Connection Details"
2. Select "Prisma" from the connection type dropdown
3. Copy the connection string
4. It looks like:
   ```
   postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require
   ```
5. The password is already included in the string

### 3. Configure Backend

```bash
cd backend

# Edit .env file
nano .env

# Update DATABASE_URL:
DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require"

# Save and exit
```

### 4. Update Prisma Schema

```bash
# Edit prisma/schema.prisma
nano prisma/schema.prisma

# Change datasource from sqlite to postgresql:
datasource db {
  provider = "postgresql"  # Change from "sqlite"
  url      = env("DATABASE_URL")
}

# Save and exit
```

### 5. Run Migrations

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Or use db:push for quicker setup
npm run db:push
```

### 6. Verify Database

1. Go to Neon dashboard → **Tables**
2. You should see tables: users, photos, albums, tags, etc.
3. Check that indexes are created
4. Or use Prisma Studio: `npm run db:studio`

### 7. Start Application

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Open http://localhost:5173
```

---

## Option 3: Manual Database Setup (If Prisma Fails)

If Prisma migrations fail due to network issues:

### 1. Use SQL Script

```bash
cd backend

# Connect to your PostgreSQL database
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Run the manual schema
\i prisma/manual_schema.sql

# Exit
\q
```

### 2. Generate Prisma Client

```bash
npm run db:generate
```

### 3. Start Backend

```bash
npm run dev
```

---

## Cloudinary Setup (For Photo Upload)

### 1. Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account (25GB storage + bandwidth)
3. Verify email

### 2. Get API Credentials

1. Go to **Dashboard**
2. Copy:
   - Cloud Name
   - API Key
   - API Secret

### 3. Configure Backend

```bash
cd backend

# Edit .env
nano .env

# Update Cloudinary settings:
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Save and restart backend
```

---

## Environment Variables Reference

### Backend (.env)

```bash
# Database
DATABASE_URL="postgresql://..." # or "file:./dev.db" for SQLite

# JWT
JWT_SECRET="your-super-secret-key-min-32-characters"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"

# Frontend (CORS)
FRONTEND_URL="http://localhost:5173"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# File Upload
MAX_FILE_SIZE=20971520  # 20MB
MAX_FILES_PER_UPLOAD=10

# Storage
DEFAULT_STORAGE_LIMIT=5368709120  # 5GB
```

### Frontend (.env)

```bash
# API
VITE_API_URL="http://localhost:3000/api"
VITE_USE_MOCK_API="false"  # Set to "true" to use mock data

# App
VITE_APP_NAME="Photo Memories"
```

---

## Testing the Full Stack

### 1. Test Backend API

```bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'

# Login (copy the token from response)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get current user (replace YOUR_TOKEN)
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Test Frontend

1. Open http://localhost:5173
2. Click "Sign Up"
3. Fill in registration form
4. Should redirect to /gallery
5. Check that profile shows your name (top right)
6. Try navigating to Albums, Favorites
7. Logout and login again

---

## Common Issues & Solutions

### Issue: Prisma Engine Download Fails

**Error**: `403 Forbidden` when downloading Prisma engines

**Solution**:
1. Check internet connection
2. Try different network (VPN/proxy)
3. Use manual SQL script (Option 3)
4. Pre-download engines:
   ```bash
   npx prisma generate --data-proxy
   ```

### Issue: Database Connection Fails

**Error**: `Can't reach database server`

**Solution**:
1. Check DATABASE_URL is correct
2. Verify password has no special chars
3. Check Supabase project is running
4. Test connection:
   ```bash
   psql "YOUR_DATABASE_URL"
   ```

### Issue: CORS Errors

**Error**: `Access to fetch blocked by CORS policy`

**Solution**:
1. Check backend FRONTEND_URL matches frontend URL
2. Restart backend after .env changes
3. Check browser console for exact error

### Issue: JWT Token Invalid

**Error**: `Invalid token` or `Token expired`

**Solution**:
1. Check JWT_SECRET is same in .env
2. Logout and login again
3. Check token in localStorage (DevTools → Application)

### Issue: Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port in .env
PORT=3001
```

---

## Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new **Web Service**
4. Connect repository
5. Configure:
   - **Name**: photo-memories-api
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**: Add all from .env
6. Deploy

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import Git repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: Add from .env
4. Deploy

### Update Frontend API URL

After backend is deployed:

```bash
# In frontend/.env
VITE_API_URL="https://your-app.onrender.com/api"
VITE_USE_MOCK_API="false"
```

Redeploy frontend.

---

## Verification Checklist

- [ ] Backend starts without errors
- [ ] Database connection works
- [ ] Health check returns 200: `curl http://localhost:3000/health`
- [ ] Can register new user
- [ ] Can login
- [ ] JWT token works
- [ ] Frontend connects to backend
- [ ] Can see profile data
- [ ] Can navigate between pages
- [ ] Logout works
- [ ] Protected routes redirect to login

---

## Next Steps

After setup is complete:

1. **Implement Photo Upload**
   - Add Multer middleware
   - Integrate Sharp for image processing
   - Upload to Cloudinary
   - Extract EXIF metadata

2. **Frontend Features**
   - Photo upload component
   - Photo lightbox/viewer
   - Album creation modal
   - Search functionality

3. **Testing**
   - Write unit tests
   - Add E2E tests
   - Test with real images

4. **Production**
   - Add monitoring (Sentry)
   - Setup CI/CD
   - Add analytics
   - Performance optimization

---

## Support

For issues:
1. Check KNOWN_ISSUES.md
2. Review logs: `npm run dev` output
3. Check browser console for frontend errors
4. Check Supabase logs for database errors

---

**Last Updated**: 2025-10-22
**Version**: 1.0
