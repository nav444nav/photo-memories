# Frontend Feature Backlog

Features to implement later after backend is complete.

## High Priority

### 1. Photo Upload Component
**Status**: Not Started
**Estimated Time**: 4-6 hours

**Tasks:**
- [ ] Create `PhotoUploader` component with drag-and-drop
- [ ] Integrate react-dropzone
- [ ] Add file validation (type, size)
- [ ] Show upload progress bars
- [ ] Display preview thumbnails
- [ ] Handle multiple file uploads
- [ ] Add to upload queue (Zustand store)
- [ ] Show success/error notifications
- [ ] Clear completed uploads

**Files to Create:**
- `src/components/gallery/PhotoUploader.tsx`
- `src/components/gallery/UploadProgress.tsx`
- `src/hooks/usePhotoUpload.ts`

**Dependencies:**
- Backend: `POST /api/photos` endpoint
- Cloudinary integration (backend)

---

### 2. Photo Lightbox/Viewer
**Status**: Not Started
**Estimated Time**: 3-4 hours

**Tasks:**
- [ ] Create `PhotoViewer` component
- [ ] Full-screen overlay with dark background
- [ ] Image zoom in/out controls
- [ ] Next/Previous navigation (arrow keys + buttons)
- [ ] Show photo metadata (filename, date, camera)
- [ ] Download button
- [ ] Delete button with confirmation
- [ ] Toggle favorite button
- [ ] Close on ESC key or backdrop click
- [ ] Smooth transitions

**Files to Create:**
- `src/components/gallery/PhotoViewer.tsx`
- `src/hooks/useKeyboardNav.ts`

**Libraries to Consider:**
- `react-image-lightbox` or custom implementation
- `framer-motion` for animations

---

### 3. Album Creation & Management
**Status**: Not Started
**Estimated Time**: 4-5 hours

**Tasks:**
- [ ] Create `AlbumModal` component (create/edit)
- [ ] Form with name, description fields
- [ ] Cover photo selector
- [ ] Add photos to album (multi-select)
- [ ] Remove photos from album
- [ ] Delete album with confirmation
- [ ] Share album toggle
- [ ] Generate share link
- [ ] Copy share link to clipboard
- [ ] Update `AlbumDetailPage` to show photos

**Files to Create:**
- `src/components/albums/AlbumModal.tsx`
- `src/components/albums/PhotoSelector.tsx`
- `src/components/albums/ShareLink.tsx`

**API Integration:**
- `POST /api/albums`
- `PUT /api/albums/:id`
- `DELETE /api/albums/:id`
- `POST /api/albums/:id/photos`

---

### 4. Search Functionality
**Status**: Not Started
**Estimated Time**: 3-4 hours

**Tasks:**
- [ ] Create `SearchBar` component (header)
- [ ] Search input with debouncing
- [ ] Filter by filename, date, tags
- [ ] Advanced search modal (optional)
- [ ] Search results page
- [ ] Highlight search terms
- [ ] Recent searches
- [ ] Clear search button

**Files to Create:**
- `src/components/common/SearchBar.tsx`
- `src/pages/SearchResultsPage.tsx`
- `src/hooks/useSearch.ts`

**API Integration:**
- `GET /api/photos/search?q=...&tags=...`

---

### 5. Tag Management
**Status**: Not Started
**Estimated Time**: 2-3 hours

**Tasks:**
- [ ] Create `TagManager` component
- [ ] Add tag to photo
- [ ] Create new tags
- [ ] Color picker for tags
- [ ] Remove tag from photo
- [ ] Delete tag globally
- [ ] Filter photos by tag
- [ ] Tag autocomplete

**Files to Create:**
- `src/components/tags/TagManager.tsx`
- `src/components/tags/TagInput.tsx`
- `src/components/tags/ColorPicker.tsx`

**API Integration:**
- `POST /api/tags`
- `PUT /api/tags/:id`
- `DELETE /api/tags/:id`
- `POST /api/photos/:id/tags`

---

## Medium Priority

### 6. Timeline View
**Status**: Not Started
**Estimated Time**: 4-5 hours

**Tasks:**
- [ ] Create `TimelinePage` component
- [ ] Group photos by date (day/month/year)
- [ ] Sticky date headers
- [ ] Infinite scroll or pagination
- [ ] Jump to date functionality
- [ ] Calendar view toggle

**Files to Create:**
- `src/pages/TimelinePage.tsx`
- `src/components/timeline/DateGroup.tsx`
- `src/utils/dateGrouping.ts`

---

### 7. Bulk Operations
**Status**: Not Started
**Estimated Time**: 3-4 hours

**Tasks:**
- [ ] Multi-select mode toggle
- [ ] Checkbox on each photo
- [ ] Select all / Deselect all
- [ ] Bulk actions bar (delete, favorite, add to album, tag)
- [ ] Confirmation dialogs
- [ ] Progress indicators for bulk operations

**Files to Create:**
- `src/components/gallery/SelectionMode.tsx`
- `src/components/gallery/BulkActionsBar.tsx`
- `src/hooks/useSelection.ts`

---

### 8. Photo Editing
**Status**: Not Started
**Estimated Time**: 6-8 hours

**Tasks:**
- [ ] Create `PhotoEditor` component
- [ ] Crop tool
- [ ] Rotate (90°, 180°, 270°)
- [ ] Flip horizontal/vertical
- [ ] Filters (B&W, Sepia, Vintage, etc.)
- [ ] Brightness/Contrast/Saturation sliders
- [ ] Save edited version
- [ ] Revert to original

**Files to Create:**
- `src/components/editor/PhotoEditor.tsx`
- `src/components/editor/CropTool.tsx`
- `src/components/editor/FilterPicker.tsx`

**Libraries:**
- `react-image-crop` or `react-easy-crop`
- Canvas API for filters

---

### 9. Memories / Auto Collections
**Status**: Not Started
**Estimated Time**: 5-6 hours

**Tasks:**
- [ ] Auto-generate collections by date (1 year ago, 2 years ago)
- [ ] Detect birthdays from EXIF dates
- [ ] Group photos by location (if GPS data available)
- [ ] Create "Best of Month/Year" collections
- [ ] Display memories on dashboard

**Files to Create:**
- `src/pages/MemoriesPage.tsx`
- `src/components/memories/MemoryCard.tsx`
- `src/utils/memoryGenerator.ts`

**Backend Requirements:**
- Smart algorithm to select best photos
- Date-based queries

---

## Low Priority / Nice to Have

### 10. Photo Metadata Editor
**Status**: Not Started
**Estimated Time**: 2-3 hours

**Tasks:**
- [ ] Edit filename
- [ ] Edit description
- [ ] Edit date taken
- [ ] View EXIF data
- [ ] Add custom metadata

---

### 11. Trash / Archive
**Status**: Not Started
**Estimated Time**: 2-3 hours

**Tasks:**
- [ ] Trash page showing deleted photos
- [ ] Restore from trash
- [ ] Permanent delete
- [ ] Auto-delete after 30 days
- [ ] Archive functionality

---

### 12. Settings Page
**Status**: Not Started
**Estimated Time**: 3-4 hours

**Tasks:**
- [ ] Account settings
- [ ] Change password
- [ ] Upload preferences (auto-backup, quality)
- [ ] Privacy settings
- [ ] Notification preferences
- [ ] Delete account

---

### 13. Keyboard Shortcuts
**Status**: Not Started
**Estimated Time**: 2 hours

**Tasks:**
- [ ] Add keyboard shortcut support
- [ ] `?` - Show shortcuts help
- [ ] `G` then `G` - Go to Gallery
- [ ] `G` then `A` - Go to Albums
- [ ] `G` then `F` - Go to Favorites
- [ ] `U` - Upload photos
- [ ] Arrow keys - Navigate photos
- [ ] `F` - Toggle favorite
- [ ] `Del` - Delete photo

---

### 14. Notifications/Toast System
**Status**: Not Started
**Estimated Time**: 2-3 hours

**Tasks:**
- [ ] Toast notification component
- [ ] Success messages (upload, delete, etc.)
- [ ] Error messages
- [ ] Warning messages
- [ ] Auto-dismiss timer
- [ ] Close button
- [ ] Stack multiple toasts

**Libraries:**
- `react-hot-toast` or `sonner`

---

### 15. Progressive Web App (PWA)
**Status**: Not Started
**Estimated Time**: 3-4 hours

**Tasks:**
- [ ] Add service worker for offline support
- [ ] Create manifest.json
- [ ] Add to home screen functionality
- [ ] Offline indicator
- [ ] Cache photos for offline viewing
- [ ] Background sync

---

### 16. Performance Optimizations
**Status**: Not Started
**Estimated Time**: 4-5 hours

**Tasks:**
- [ ] Implement virtual scrolling for large galleries
- [ ] Add infinite scroll instead of pagination
- [ ] Optimize image loading (blur placeholder → thumbnail → full)
- [ ] Code splitting by route
- [ ] Lazy load components
- [ ] Prefetch next page
- [ ] Service worker caching strategy

**Libraries:**
- `react-window` or `react-virtualized`
- `react-intersection-observer`

---

### 17. Accessibility Improvements
**Status**: Not Started
**Estimated Time**: 3-4 hours

**Tasks:**
- [ ] Add proper ARIA labels
- [ ] Keyboard navigation for all features
- [ ] Screen reader support
- [ ] Focus management in modals
- [ ] Skip to content link
- [ ] High contrast mode
- [ ] Reduced motion preference

---

### 18. Analytics Integration
**Status**: Not Started
**Estimated Time**: 2 hours

**Tasks:**
- [ ] Add Google Analytics
- [ ] Track page views
- [ ] Track user actions (upload, favorite, share)
- [ ] Error tracking with Sentry

---

## Testing Tasks

### Unit Tests
- [ ] Component tests with Vitest + React Testing Library
- [ ] Service layer tests
- [ ] Utility function tests
- [ ] Store tests (Zustand)
- [ ] Hook tests

### E2E Tests
- [ ] Playwright setup
- [ ] Authentication flow tests
- [ ] Photo upload tests
- [ ] Gallery navigation tests
- [ ] Album management tests

### Performance Tests
- [ ] Lighthouse CI
- [ ] Bundle size monitoring
- [ ] Image loading performance

---

## Documentation Tasks

- [ ] Component documentation with Storybook
- [ ] API client documentation
- [ ] Developer setup guide
- [ ] Contributing guidelines
- [ ] User guide / FAQ

---

## Summary

**Total Estimated Time**: ~60-80 hours for all features

**Suggested Order of Implementation:**
1. Photo Upload (critical for functionality)
2. Photo Viewer/Lightbox (better UX)
3. Album Management (core feature)
4. Search (improves usability)
5. Tag Management (organization)
6. Timeline View (nice visualization)
7. Bulk Operations (power user feature)
8. Everything else based on user feedback

**Next Steps After Backend:**
1. Connect frontend to real API (set `VITE_USE_MOCK_API=false`)
2. Test authentication with real backend
3. Implement Photo Upload component first
4. Iterate based on what works

---

**Last Updated**: 2025-10-21
**Status**: Ready to start after backend is complete
