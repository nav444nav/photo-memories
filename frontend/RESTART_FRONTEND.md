# How to Restart the Frontend

## The Issue
You were getting a 404 error because the frontend was trying to call the backend API, but the backend wasn't running.

## The Fix
I've created a `.env` file that enables the **Mock API mode**. This allows the frontend to work without needing the backend running.

## Steps to Apply the Fix

### 1. Stop the Current Frontend Server
Press `Ctrl+C` in the terminal where `npm run dev` is running.

### 2. Restart the Frontend
```bash
cd frontend
npm run dev
```

### 3. Verify Mock API is Enabled
When you restart, you should see this message in the browser console:
```
🎭 Mock API enabled - using MSW for API calls
💡 To use real API, set VITE_USE_MOCK_API=false in .env
```

### 4. Test the Gallery Page
- Open http://localhost:5173
- Login (mock credentials will work)
- Navigate to Gallery
- You should see mock photos instead of 404 error

## Environment Configuration

### `.env` file created:
```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK_API=true
VITE_APP_NAME=Photo Memories
```

## Understanding the Setup

### Mock API Mode (Current)
- ✅ Frontend works standalone
- ✅ No backend needed
- ✅ Uses Mock Service Worker (MSW)
- ✅ Perfect for frontend development
- ⚠️ Data is not persisted (resets on refresh)

### Real API Mode (When Backend is Ready)
To switch to the real backend:

1. Start the backend:
```bash
cd backend
npm run dev
```

2. Update frontend `.env`:
```env
VITE_USE_MOCK_API=false
```

3. Restart frontend

## Troubleshooting

### Still Getting 404 After Restart?

**Problem**: `.env` changes not picked up

**Solution**: 
1. Completely stop the frontend (Ctrl+C)
2. Clear browser cache or hard refresh (Ctrl+Shift+R)
3. Restart: `npm run dev`

### Mock API Not Working?

**Check the browser console** for:
- Look for the 🎭 message
- Check for MSW worker registration errors
- Verify the service worker is active

### Want to Use Real Backend?

**Option 1: Start Backend Locally**
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend  
cd frontend
# Edit .env: VITE_USE_MOCK_API=false
npm run dev
```

**Option 2: Connect to Production API**
```bash
# Edit frontend/.env
VITE_API_URL=https://your-production-api.com/api
VITE_USE_MOCK_API=false
```

## Quick Reference

```bash
# Restart frontend with mock API
cd frontend
npm run dev

# Check which mode you're in
# Look for console message in browser:
# 🎭 = Mock API enabled
# No message = Real API mode
```

✅ **You're all set! Just restart the frontend server.**
