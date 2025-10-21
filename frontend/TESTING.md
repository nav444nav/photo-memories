# Testing Guide - Photo Memories Frontend

This guide explains how to test the frontend application with the mock API.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

The app will start at `http://localhost:5173` with **mock API enabled by default**.

## Mock API Status

When you open the app, check the browser console. You should see:

```
🎭 Mock API enabled - using MSW for API calls
💡 To use real API, set VITE_USE_MOCK_API=false in .env
```

## Test Credentials

**Email**: `demo@example.com`
**Password**: Any password (mock API accepts any password for this email)

## Testing Scenarios

### 1. Authentication Flow

**Test Registration:**
1. Navigate to `/register`
2. Fill in the form:
   - Full Name: Your Name
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
3. Click "Sign up"
4. You should be redirected to `/gallery`
5. User data will be created in memory

**Test Login:**
1. Navigate to `/login`
2. Enter email: `demo@example.com`
3. Enter any password
4. Click "Sign in"
5. Should redirect to `/gallery`
6. Check top right for user avatar and name

**Test Invalid Login:**
1. Enter email: `wrong@example.com`
2. Enter any password
3. Should see error: "Invalid email or password"

**Test Logout:**
1. Click the logout icon (top right)
2. Should redirect to `/login`
3. Try accessing `/gallery` - should redirect to `/login`

### 2. Gallery Page

**View Photos:**
1. Login and navigate to `/gallery`
2. Should see 8 sample photos in a responsive grid
3. Photos should have:
   - Thumbnail images from Unsplash
   - Hover effect (dark overlay + filename)
   - Favorite indicator (heart icon) on some photos

**Loading State:**
1. Refresh the page
2. Should see animated skeleton loaders (gray boxes)
3. After ~500ms, photos should appear

**Photo Count:**
- Check header shows "8 photos"

**Responsive Grid:**
- Mobile (< 640px): 2 columns
- Tablet (640-768px): 3 columns
- Desktop (768-1024px): 4 columns
- Large (> 1024px): 5 columns

### 3. Albums Page

**View Albums:**
1. Navigate to `/albums`
2. Should see 3 albums:
   - Summer Vacation 2025 (3 photos)
   - Nature Photography (4 photos, shared)
   - Urban Exploration (1 photo)

**Album Cards:**
- Each card shows:
  - Cover photo
  - Album name
  - Description
  - Photo count
  - "Shared" badge (if shared)

**Click Album:**
1. Click on any album card
2. Should navigate to `/albums/:id`
3. Currently shows placeholder (album detail to be implemented)

### 4. Favorites Page

**View Favorites:**
1. Navigate to `/favorites`
2. Should see 4 favorite photos:
   - Sunset Beach
   - City Lights
   - Desert Sunset
   - Snowy Mountain

**Empty State:**
- If mock data had no favorites, would show:
  - Heart icon
  - "No favorites yet" message

### 5. Profile Page

**View Profile:**
1. Navigate to `/profile` or click user avatar
2. Should see:
   - Full Name: Demo User
   - Email: demo@example.com
   - Member Since: Jan 15, 2025

**Storage Info:**
- Shows storage used: ~1.2 GB of 5 GB
- Progress bar: ~23% filled
- Percentage displayed

### 6. Navigation

**Desktop Navigation:**
- Top bar shows: Photo Memories logo, Gallery, Albums, Favorites
- User menu on right (avatar, name, logout)
- Active page highlighted with blue background

**Mobile Navigation:**
- Bottom bar with 3 icons: Gallery, Albums, Favorites
- Touch-friendly tap targets
- Active state highlighted

### 7. Error Handling

**Network Error Simulation:**
To test error handling, you can modify `handlers.ts`:

```typescript
// In any handler, add:
return HttpResponse.json(
  { error: { message: 'Server error', code: 'ERROR' } },
  { status: 500 }
)
```

Then you should see error messages in the UI.

### 8. Protected Routes

**Test Route Protection:**
1. Logout (click logout icon)
2. Try to access:
   - `/gallery` - redirects to `/login`
   - `/albums` - redirects to `/login`
   - `/favorites` - redirects to `/login`
   - `/profile` - redirects to `/login`

**Test Public Routes:**
1. While logged out:
   - `/` - Home page (accessible)
   - `/login` - Login page (accessible)
   - `/register` - Register page (accessible)
2. While logged in:
   - `/login` - redirects to `/gallery`
   - `/register` - redirects to `/gallery`

### 9. React Query Integration

**Check React Query DevTools:**
1. Install React Query DevTools:
```bash
npm install -D @tanstack/react-query-devtools
```

2. Add to `App.tsx`:
```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// In your component:
<ReactQueryDevtools initialIsOpen={false} />
```

3. Open the app and you'll see a floating React Query icon
4. Click it to see:
   - Active queries (photos, albums, favorites)
   - Query status (fetching, success, error)
   - Cached data
   - Refetch capabilities

**Test Caching:**
1. Navigate to `/gallery` (data fetched)
2. Navigate to `/albums` (new data fetched)
3. Go back to `/gallery` (data served from cache instantly)
4. Wait 5 minutes (stale time), then revisit - refetch happens

### 10. Network Simulation

**Check Network Tab:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate around the app
4. You should see:
   - No actual HTTP requests to localhost:3000
   - MSW intercepts requests in the service worker
   - Check Console tab for MSW logs

**Simulated Delay:**
All API responses have a 500ms delay (configured in `handlers.ts`) to simulate real network conditions.

## Mock Data Details

### Photos (8 total)
1. Sunset Beach - Favorite ⭐
2. Mountain Lake
3. City Lights - Favorite ⭐
4. Forest Path
5. Desert Sunset - Favorite ⭐
6. Ocean Waves
7. Autumn Leaves
8. Snowy Mountain - Favorite ⭐

### Albums (3 total)
1. **Summer Vacation 2025**
   - 3 photos
   - Not shared
   - Cover: Sunset Beach

2. **Nature Photography**
   - 4 photos
   - Shared (token: abc123xyz)
   - Cover: Mountain Lake

3. **Urban Exploration**
   - 1 photo
   - Not shared
   - Cover: City Lights

### Tags (4 total)
- vacation (red)
- nature (green)
- city (blue)
- favorite (gold)

### User
- Name: Demo User
- Email: demo@example.com
- Storage: 1.2GB / 5GB
- Member since: Jan 15, 2025

## Switching Between Mock and Real API

**Use Mock API (default):**
```bash
# In .env file:
VITE_USE_MOCK_API=true
```

**Use Real Backend:**
```bash
# In .env file:
VITE_USE_MOCK_API=false
VITE_API_URL=http://localhost:3000/api
```

Then restart the dev server:
```bash
npm run dev
```

## Common Issues

### Issue: Photos not loading
**Solution**: Check browser console for errors. MSW service worker should be registered.

### Issue: "Failed to fetch" errors
**Solution**:
1. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check that `public/mockServiceWorker.js` exists

### Issue: Infinite loading
**Solution**: Check if MSW is initialized. Look for console log "🎭 Mock API enabled"

### Issue: TypeScript errors
**Solution**: Run `npm run lint` to check for type errors

## Performance Testing

**Lighthouse Audit:**
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit for:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

**Expected Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 100
- SEO: 90+

## Next Steps for Testing

After basic testing, you can:

1. **Add more mock data** in `src/mocks/data.ts`
2. **Modify responses** in `src/mocks/handlers.ts`
3. **Test error scenarios** by changing status codes
4. **Simulate slow network** by increasing `DELAY_MS`
5. **Test offline mode** by using service worker offline cache

## Running Tests (Future)

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## Debugging Tips

**Enable verbose MSW logging:**
```typescript
// In src/mocks/browser.ts
worker.start({
  onUnhandledRequest: 'warn', // Shows warnings for unhandled requests
})
```

**Check MSW status:**
Open console and run:
```javascript
navigator.serviceWorker.getRegistrations()
```

**Clear service worker:**
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister())
})
```

Then hard refresh the page.

---

## Summary

The mock API provides a complete development environment for the frontend without requiring a backend server. All features are fully functional with realistic data and network simulation.

**Happy Testing! 🚀**
