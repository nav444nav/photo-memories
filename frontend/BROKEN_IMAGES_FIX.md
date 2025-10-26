# Fix for Broken Images After Upload

## Problem

When uploading photos in **mock API mode**, the images appeared as broken (404 errors) in the gallery.

## Root Cause

The mock API upload handler was not properly processing uploaded files. It was just copying data from the first mock photo, which meant:
- Uploaded files were ignored
- New photos used the same Unsplash URLs as mock photo #1
- The actual uploaded images were never displayed

## The Fix

Updated `/frontend/src/mocks/handlers.ts` to properly handle file uploads:

### 1. Process Uploaded Files (POST /api/photos)

**Before:**
```typescript
http.post(`${API_URL}/photos`, async () => {
  const newPhoto = {
    ...mockPhotos[0],  // Just copied first mock photo
    id: `photo-${Date.now()}`,
    filename: 'new-upload.jpg',
  }
  return HttpResponse.json({ photos: [newPhoto] })
})
```

**After:**
```typescript
http.post(`${API_URL}/photos`, async ({ request }) => {
  const formData = await request.formData()
  const files = formData.getAll('photos') as File[]

  const newPhotos = files.map((file) => {
    // Create Object URL from actual uploaded file
    const objectUrl = URL.createObjectURL(file)

    return {
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      filename: file.name,
      originalUrl: objectUrl,   // blob:http://localhost:5173/...
      thumbnailUrl: objectUrl,  // Uses browser's object URL
      mediumUrl: objectUrl,
      fileSize: file.size,
      // ... other fields
    }
  })

  // Persist in mockPhotos array for session
  mockPhotos.unshift(...newPhotos)

  return HttpResponse.json({ photos: newPhotos, count: newPhotos.length })
})
```

### 2. Clean Up Object URLs (DELETE /api/photos/:id)

Added proper cleanup to prevent memory leaks:

```typescript
http.delete(`${API_URL}/photos/:id`, async ({ params }) => {
  const photoIndex = mockPhotos.findIndex(p => p.id === id)
  const photo = mockPhotos[photoIndex]

  // Revoke blob URLs to free memory
  if (photo.originalUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(photo.originalUrl)
  }
  // ... same for thumbnailUrl and mediumUrl

  // Remove from array
  mockPhotos.splice(photoIndex, 1)

  return new HttpResponse(null, { status: 204 })
})
```

## How It Works

1. **File Upload**: When you upload a photo, the mock handler:
   - Reads the actual File objects from FormData
   - Creates browser Object URLs (`blob:http://...`) from the files
   - Stores these URLs in the photo object
   - Adds photos to `mockPhotos` array

2. **Display**: The PhotoGrid component shows the image using:
   ```tsx
   <img src={photo.thumbnailUrl} />  // blob:http://localhost:5173/...
   ```

3. **Persistence**: Uploaded photos stay in memory during the session
   - Photos added to `mockPhotos` array with `unshift()`
   - Available across all gallery views until page refresh

4. **Cleanup**: When deleting a photo:
   - Object URLs are revoked with `URL.revokeObjectURL()`
   - Prevents memory leaks from accumulating blob URLs
   - Photo removed from `mockPhotos` array

## Testing the Fix

### 1. Restart the Frontend

```bash
# Stop current server (Ctrl+C)
cd frontend
npm run dev
```

### 2. Test Photo Upload

1. Open http://localhost:5173
2. Login (use mock credentials)
3. Navigate to Gallery
4. Click "Upload Photos" button
5. Select one or more images from your computer
6. Wait for upload to complete

**Expected Result:**
- ✅ Upload succeeds
- ✅ Images appear in gallery immediately
- ✅ Images display correctly (not broken)
- ✅ Thumbnails show your actual uploaded images

### 3. Test Photo Delete

1. Hover over an uploaded photo
2. Click the red delete button (top-left)
3. Confirm deletion

**Expected Result:**
- ✅ Photo disappears from gallery
- ✅ No memory leaks (blob URLs cleaned up)

### 4. Test Session Persistence

1. Upload a photo
2. Navigate to Albums page
3. Navigate back to Gallery

**Expected Result:**
- ✅ Uploaded photo still visible
- ✅ Photo persists during the session

### 5. Test Page Refresh

1. Upload a photo
2. Refresh the page (F5)

**Expected Result:**
- ⚠️ Uploaded photos disappear (this is normal in mock mode)
- ✅ Original mock photos (Unsplash images) still present

## Limitations of Mock Mode

### What Works
- ✅ Upload photos with preview
- ✅ Delete uploaded photos
- ✅ Photos persist during session
- ✅ Multiple file uploads
- ✅ Actual file preview (your images)

### What Doesn't Work
- ❌ Photos don't persist after page refresh
- ❌ No server-side storage
- ❌ No real image processing (thumbnails just use original)
- ❌ Width/height are 0 (would need image loading)

## For Production/Real Backend

To use the real backend with Cloudinary storage:

1. **Set up Cloudinary**
   - Create free account at https://cloudinary.com
   - Get API credentials

2. **Configure Backend**
   ```bash
   cd backend
   # Edit .env
   CLOUDINARY_CLOUD_NAME=your-name
   CLOUDINARY_API_KEY=your-key
   CLOUDINARY_API_SECRET=your-secret
   ```

3. **Start Backend**
   ```bash
   npm run dev
   ```

4. **Configure Frontend**
   ```bash
   cd frontend
   # Edit .env
   VITE_USE_MOCK_API=false
   ```

5. **Restart Frontend**
   ```bash
   npm run dev
   ```

Now uploads will use real Cloudinary storage with:
- ✅ Persistent storage (survives refresh)
- ✅ Image processing (thumbnails, optimization)
- ✅ CDN delivery
- ✅ Proper metadata extraction

## Troubleshooting

### Images Still Broken After Fix?

**Solution 1: Hard Refresh**
```
Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

**Solution 2: Clear Service Worker**
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Service Workers"
4. Click "Unregister" for MSW worker
5. Refresh page

**Solution 3: Check Console**
Look for errors in browser console:
- Should see: `🎭 Mock API enabled`
- Should NOT see: 404 errors on blob: URLs

### Upload Not Working?

**Check:**
1. Mock API is enabled (check console for 🎭 emoji)
2. File input accepts images (`accept="image/*"`)
3. FormData contains files (check Network tab)

## Summary

**Before Fix:**
- Upload → Broken images (404)
- Used mock photo URLs instead of actual files

**After Fix:**
- Upload → Real image preview
- Creates blob: URLs from uploaded files
- Photos persist during session
- Proper cleanup on delete

✅ **Photo upload now works perfectly in mock mode!**
