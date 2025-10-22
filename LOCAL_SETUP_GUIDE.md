# Local Setup Guide - Step by Step

This guide will help you get the Photo Memories app running locally on your machine with a real database.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Git
- Terminal/Command Prompt

## Quick Start - Complete Setup

### Step 1: Clone and Navigate

```bash
# If you haven't cloned the repo yet
git clone <your-repo-url>
cd photo-memories

# Or if you already have it
cd photo-memories
git pull origin claude/photo-app-system-design-011CUMAKiaPhdfvpzovpxo3D
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Generate Prisma Client and run migrations
npm run db:generate
npm run db:migrate

# When prompted for migration name, enter: "init"

# Start the backend server
npm run dev
```

**Expected Output:**
```
✓ Generated Prisma Client
✓ Migration applied successfully
🚀 Server running on http://localhost:3000
✅ Database connected successfully
```

**Backend is now running on:** `http://localhost:3000`

### Step 3: Frontend Setup

Open a **NEW terminal window** (keep backend running):

```bash
# Navigate to frontend from project root
cd frontend

# Install dependencies
npm install

# Update .env to use real backend (disable mock API)
# Change VITE_USE_MOCK_API=true to VITE_USE_MOCK_API=false
```

**Edit `frontend/.env`:**
```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK_API=false  # ← Change this to false

# App Configuration
VITE_APP_NAME=Photo Memories
```

```bash
# Start the frontend development server
npm run dev
```

**Expected Output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Frontend is now running on:** `http://localhost:5173`

### Step 4: Test the Full Stack

1. **Open browser:** `http://localhost:5173`

2. **Create an account:**
   - Click "Sign Up" or navigate to `/register`
   - Email: `test@example.com`
   - Password: `password123`
   - Full Name: `Test User`
   - Click "Register"

3. **Verify authentication:**
   - You should be redirected to `/gallery`
   - Check browser console - should NOT see "🎭 Mock API enabled"
   - Should see empty gallery (no photos yet)

4. **Test API connection:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Refresh the page
   - You should see API calls to `localhost:3000/api/auth/me` and `localhost:3000/api/photos`
   - Status should be `200 OK`

### Step 5: Verify Database

```bash
# In backend directory, open Prisma Studio to view database
npm run db:studio
```

This will open `http://localhost:5555` where you can:
- See your registered user in the `users` table
- View all database tables
- Manually add/edit/delete data

## Troubleshooting

### Backend Issues

**Port 3000 already in use:**
```bash
# Edit backend/.env and change PORT
PORT=3001

# Then update frontend/.env
VITE_API_URL=http://localhost:3001/api
```

**Database migration fails:**
```bash
# Try pushing schema instead
npm run db:push
```

**Prisma Client not generated:**
```bash
# Manually generate
npx prisma generate
```

### Frontend Issues

**Still seeing Mock API:**
- Double-check `frontend/.env` has `VITE_USE_MOCK_API=false`
- Restart Vite dev server after changing .env

**API calls failing (CORS errors):**
- Make sure backend is running on `http://localhost:3000`
- Check backend console for CORS errors
- Verify `FRONTEND_URL=http://localhost:5173` in `backend/.env`

**Login fails with 401:**
- Clear browser localStorage: DevTools → Application → Local Storage → Clear All
- Try registering a new account

## What's Working Now

✅ **Backend API:**
- User registration and login
- JWT authentication
- Photo listing (empty for now)
- Album and tag endpoints

✅ **Frontend:**
- Authentication flow (register, login, logout)
- Protected routes
- Photo gallery page
- Albums page
- Tags page
- Profile page

⏳ **Not Yet Implemented:**
- Photo upload (needs Cloudinary integration)
- Album creation UI
- Tag management UI
- Photo editing
- Search functionality

See `frontend/FEATURE_BACKLOG.md` for complete list of pending features.

## Database Schema

Your SQLite database (`backend/dev.db`) includes:

- **users** - User accounts with auth credentials
- **photos** - Photo metadata and URLs
- **albums** - Photo album collections
- **album_photos** - Many-to-many relationship
- **tags** - Custom tags
- **photo_tags** - Many-to-many relationship

## Next Steps

Once local setup is working:

1. **Test the authentication flow** - Register, login, logout
2. **Verify database persistence** - Data should survive server restarts
3. **Check API endpoints** - Use Postman or curl to test API directly
4. **Review KNOWN_ISSUES.md** - See what's being tracked
5. **Move to production setup** - Supabase + Render + Vercel deployment

## Quick Commands Reference

```bash
# Backend (in /backend directory)
npm run dev          # Start dev server
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma Client
npm run build        # Build for production
npm run start        # Start production server

# Frontend (in /frontend directory)
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Type check
```

## Environment Variables

**Backend** (`backend/.env`):
```bash
DATABASE_URL="file:./dev.db"              # SQLite database
JWT_SECRET="dev-secret-key-..."           # Change in production!
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"      # For CORS
```

**Frontend** (`frontend/.env`):
```bash
VITE_API_URL=http://localhost:3000/api    # Backend API URL
VITE_USE_MOCK_API=false                   # Use real backend
VITE_APP_NAME=Photo Memories
```

## Success Checklist

- [ ] Backend installed and running on port 3000
- [ ] Database migrations completed successfully
- [ ] Frontend installed and running on port 5173
- [ ] Can register a new user account
- [ ] Can login with registered account
- [ ] Can see authenticated user's name in navbar
- [ ] Can logout successfully
- [ ] API calls visible in Network tab going to localhost:3000
- [ ] Prisma Studio shows user data in database
- [ ] No console errors in browser

Once all checked, you're ready for **production setup**!

---

**Need help?** Check `KNOWN_ISSUES.md` for tracked issues or `SETUP_GUIDE.md` for alternative setup methods.
