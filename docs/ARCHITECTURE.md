# Photo Memories - Architecture Diagram

## System Architecture (Visual)

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER DEVICES                              │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Desktop    │  │    Tablet    │  │    Mobile    │            │
│  │   Browser    │  │    Browser   │  │    Browser   │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       CDN LAYER (Vercel Edge)                       │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Static Assets: HTML, CSS, JS bundles                      │   │
│  │  Global distribution, automatic caching                    │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React SPA on Vercel)                   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Components Layer                                            │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │  │
│  │  │  Gallery │ │ Uploader │ │  Albums  │ │  Viewer  │       │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  State Management (Zustand + React Query)                   │  │
│  │  - User state  - Photos cache  - Upload queue              │  │
│  └─────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  API Client Layer                                           │  │
│  │  - Axios instance  - JWT token handling  - Error handling  │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (JSON)
                              │ Authorization: Bearer <JWT>
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   BACKEND (Express.js on Render)                    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                            │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │  │
│  │  │   CORS   │ │   Auth   │ │   Rate   │ │  Logger  │       │  │
│  │  │          │ │   JWT    │ │  Limit   │ │          │       │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Routes Layer                                                │  │
│  │  /auth  /photos  /albums  /tags  /search                    │  │
│  └─────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Controllers Layer                                           │  │
│  │  - Request validation                                        │  │
│  │  - Business logic delegation                                │  │
│  │  - Response formatting                                       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Services Layer                                              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │  │
│  │  │   User   │ │  Photo   │ │  Album   │ │  Upload  │       │  │
│  │  │ Service  │ │ Service  │ │ Service  │ │ Service  │       │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                    │                           │
                    │                           │
        ┌───────────┴─────────┐    ┌───────────┴──────────┐
        ▼                     ▼    ▼                      ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   DATABASE       │  │  IMAGE STORAGE   │  │  IMAGE PROCESSOR │
│   (Supabase)     │  │  (Cloudinary)    │  │  (Sharp)         │
│                  │  │                  │  │                  │
│  PostgreSQL      │  │  Object Storage  │  │  - Resize        │
│  - users         │  │  + CDN           │  │  - Compress      │
│  - photos        │  │  + Transform     │  │  - Format conv   │
│  - albums        │  │  + Optimize      │  │  - EXIF extract  │
│  - tags          │  │                  │  │                  │
│                  │  │  Auto WebP       │  │  In-memory proc  │
│  Row-level       │  │  Global CDN      │  │  Fast (50ms)     │
│  security        │  │  URL transforms  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

## Request Flow Examples

### Photo Upload Flow

```
1. User selects files
   │
   ▼
2. Frontend validates (type, size)
   │
   ▼
3. POST /api/photos with multipart/form-data
   │
   ▼
4. Backend receives file
   │
   ├─→ 5a. Sharp creates thumbnail (200x200)
   │   ├─→ Upload to Cloudinary
   │   └─→ Get thumbnail URL
   │
   ├─→ 5b. Sharp creates medium (800px)
   │   ├─→ Upload to Cloudinary
   │   └─→ Get medium URL
   │
   └─→ 5c. Upload original to Cloudinary
       └─→ Get original URL
   │
   ▼
6. Extract EXIF metadata
   │
   ▼
7. Save to database
   {
     filename, original_url, thumbnail_url,
     medium_url, file_size, width, height,
     metadata: { camera, date, location }
   }
   │
   ▼
8. Return photo object to frontend
   │
   ▼
9. Frontend updates gallery
```

### Gallery View Flow

```
1. User opens gallery page
   │
   ▼
2. GET /api/photos?page=1&limit=50
   │
   ▼
3. Backend queries database
   SELECT id, thumbnail_url, filename
   FROM photos
   WHERE user_id = ?
   ORDER BY uploaded_at DESC
   LIMIT 50 OFFSET 0
   │
   ▼
4. Return photo list
   │
   ▼
5. Frontend renders grid
   │
   ▼
6. Lazy load images as user scrolls
   - Load thumbnail_url first (fast)
   - Swap to medium_url when in viewport
   │
   ▼
7. User clicks photo
   │
   ▼
8. Open viewer with original_url (full res)
```

### Search Flow

```
1. User types search query
   │
   ▼
2. GET /api/photos/search?q=vacation&tags=beach
   │
   ▼
3. Backend builds query
   SELECT * FROM photos
   WHERE user_id = ?
   AND (
     filename ILIKE '%vacation%'
     OR metadata->>'description' ILIKE '%vacation%'
   )
   AND id IN (
     SELECT photo_id FROM photo_tags
     WHERE tag_id IN (
       SELECT id FROM tags WHERE name = 'beach'
     )
   )
   │
   ▼
4. Return results
   │
   ▼
5. Display in gallery
```

## Data Storage Strategy

### Database (PostgreSQL)
- User accounts and auth
- Photo metadata (filename, URLs, size, dimensions)
- Albums and relationships
- Tags and relationships
- EXIF data as JSONB
- Search indexes

**Size**: ~1KB per photo metadata
**Example**: 10,000 photos = ~10MB

### Object Storage (Cloudinary)
- Original photos
- Generated thumbnails (200x200)
- Generated medium size (800px)
- Auto-optimized WebP versions

**Size per photo**:
- Original: ~3MB (average)
- Thumbnail: ~15KB
- Medium: ~100KB
- Total: ~3.1MB per photo

**Example**: 1000 photos = ~3.1GB storage

### CDN Caching Strategy
- Thumbnails: Cache 7 days
- Medium: Cache 30 days
- Original: Cache 90 days
- Cache-Control headers set by Cloudinary

## Scaling Considerations

### Current Architecture (0-1000 users)
- Single backend instance (Render)
- Shared database (Supabase)
- CDN for static assets (Cloudinary)
- Cost: ~$0-130/month

### Next Scale (1000-10000 users)
- Multiple backend instances (load balanced)
- Dedicated database with replicas
- Separate job queue for image processing
- Redis for caching
- Cost: ~$300-500/month

### Large Scale (10000+ users)
- Kubernetes cluster
- Microservices (auth, photos, albums)
- Message queue (RabbitMQ/SQS)
- CDN with edge computing
- Multi-region deployment
- Cost: ~$1000+/month

## Security Architecture

```
┌─────────────────┐
│  User Browser   │
└────────┬────────┘
         │
         │ 1. HTTPS only
         │
         ▼
┌─────────────────────────────────┐
│  Vercel Edge (Frontend)         │
│  - CSP headers                  │
│  - HSTS                         │
│  - X-Frame-Options              │
└────────┬────────────────────────┘
         │
         │ 2. JWT in Authorization header
         │
         ▼
┌─────────────────────────────────┐
│  Render (Backend)               │
│  ┌──────────────────────────┐  │
│  │  Auth Middleware         │  │
│  │  - Verify JWT signature  │  │
│  │  - Check expiry          │  │
│  │  - Extract user_id       │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  Rate Limiter            │  │
│  │  - 100 req/min per IP    │  │
│  │  - 50 uploads/hour       │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  File Validator          │  │
│  │  - Check magic bytes     │  │
│  │  - Max 20MB size         │  │
│  │  - Allow: jpg,png,webp   │  │
│  └──────────────────────────┘  │
└────────┬────────────────────────┘
         │
         │ 3. Query with user_id filter
         │
         ▼
┌─────────────────────────────────┐
│  Supabase (Database)            │
│  - Row Level Security (RLS)     │
│  - SSL connections only         │
│  - Encrypted at rest            │
└─────────────────────────────────┘
```

## Performance Optimizations

### Frontend
1. Code splitting by route
2. Lazy load images (Intersection Observer)
3. Virtual scrolling for 1000+ photos
4. Service Worker for offline
5. Compress images before upload
6. Debounce search input
7. Optimistic UI updates

### Backend
1. Database connection pooling
2. Query result caching
3. Pagination (limit 50 per page)
4. Async image processing
5. Gzip/Brotli compression
6. CDN for static assets
7. Database indexes on common queries

### Database Indexes
```sql
CREATE INDEX idx_photos_user_uploaded ON photos(user_id, uploaded_at DESC);
CREATE INDEX idx_photos_user_taken ON photos(user_id, taken_at DESC);
CREATE INDEX idx_photos_favorite ON photos(user_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX idx_albums_user ON albums(user_id);
CREATE INDEX idx_photo_tags_photo ON photo_tags(photo_id);
CREATE INDEX idx_photo_tags_tag ON photo_tags(tag_id);
```

## Monitoring & Observability

### Metrics to Track
- API response times (p50, p95, p99)
- Error rates by endpoint
- Database query times
- Image upload success rate
- Storage usage per user
- Active users (DAU, MAU)
- Photo upload volume

### Tools
- Sentry: Error tracking
- Vercel Analytics: Frontend performance
- Render Metrics: Backend performance
- Supabase Dashboard: Database metrics
- Google Analytics: User behavior

## Disaster Recovery

### Backup Strategy
- Database: Daily automated backups (Supabase)
- Images: Redundant storage (Cloudinary)
- Code: Git repository (GitHub)
- Config: Environment variables documented

### Recovery Plan
1. Database failure: Restore from backup (< 1 hour)
2. Backend failure: Redeploy from Git (< 10 min)
3. Frontend failure: Redeploy from Git (< 5 min)
4. Image storage failure: Cloudinary has redundancy

---

**Last Updated**: 2025-10-21
