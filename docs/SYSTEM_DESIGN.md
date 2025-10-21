# Photo Memories - System Design Document

## 1. Project Overview

**Photo Memories** is a modern, cloud-based photo management application inspired by Google Photos, Flickr, and Apple Photos. The app focuses on providing a seamless experience for storing, organizing, and sharing personal photo collections.

### Vision
Build a feature-rich, scalable photo management platform using free/low-cost technologies that delivers professional-grade user experience.

---

## 2. Core Requirements & Features

### 2.1 Must-Have Features (MVP - Phase 1)
- **Photo Upload**: Drag-and-drop, multiple file upload support
- **Gallery View**: Responsive grid layout with lazy loading
- **Albums**: Create, organize, and manage photo albums
- **Basic Search**: Search by filename, date, tags
- **Photo Viewer**: Full-screen view with zoom, next/prev navigation
- **User Authentication**: Secure login/signup
- **Responsive Design**: Mobile-first approach
- **Image Optimization**: Auto-resize and compress uploads

### 2.2 Nice-to-Have Features (Phase 2)
- **Timeline View**: Chronological photo organization by date
- **Favorites/Likes**: Mark favorite photos
- **Tags & Labels**: Manual and auto-tagging
- **Sharing**: Share albums via links
- **Trash/Archive**: Soft delete with recovery option
- **Face Detection**: AI-powered face recognition
- **Smart Search**: Search by objects, colors, scenes
- **Bulk Operations**: Select multiple photos for batch actions
- **Photo Editing**: Basic filters, crop, rotate
- **Memories**: Auto-generated collections (birthdays, trips)

### 2.3 Future Enhancements (Phase 3)
- **Collaborative Albums**: Multi-user shared albums
- **Social Features**: Comments, reactions
- **Mobile Apps**: iOS/Android native apps
- **RAW Format Support**: Professional photography support
- **Video Support**: Upload and play videos
- **Advanced Analytics**: Storage usage, upload statistics

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  React SPA + TailwindCSS + Vite                  │  │
│  │  - Responsive Gallery Component                  │  │
│  │  - Photo Upload with Progress                    │  │
│  │  - Album Management UI                           │  │
│  │  - Image Viewer (React Image Gallery)            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   API LAYER                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Node.js + Express.js                            │  │
│  │  - Authentication (JWT)                          │  │
│  │  - Photo CRUD endpoints                          │  │
│  │  - Album management                              │  │
│  │  - Image processing (Sharp)                      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   DATABASE LAYER         │  │   STORAGE LAYER          │
│  ┌────────────────────┐  │  │  ┌────────────────────┐  │
│  │  PostgreSQL        │  │  │  │  Cloudinary /      │  │
│  │  (Supabase)        │  │  │  │  Cloudflare R2     │  │
│  │  - User data       │  │  │  │  - Original images │  │
│  │  - Photo metadata  │  │  │  │  - Thumbnails      │  │
│  │  - Albums          │  │  │  │  - Optimized files │  │
│  │  - Tags            │  │  │  └────────────────────┘  │
│  └────────────────────┘  │  └──────────────────────────┘
└──────────────────────────┘
```

### 3.2 Data Flow

1. **Upload Flow**:
   ```
   User selects photo → Client validates → Upload to backend →
   Image processing (resize, compress) → Store original in cloud →
   Generate thumbnails → Save metadata to DB → Return success
   ```

2. **View Flow**:
   ```
   User opens gallery → Fetch metadata from DB →
   Load thumbnail URLs → Display grid → Lazy load as user scrolls
   ```

3. **Search Flow**:
   ```
   User searches → Query DB with filters →
   Return matching metadata → Display results
   ```

---

## 4. Technology Stack (Free/Low-Cost)

### 4.1 Frontend
| Technology | Purpose | Cost | Why? |
|------------|---------|------|------|
| **React** | UI Framework | Free | Industry standard, huge ecosystem |
| **Vite** | Build tool | Free | Fast dev experience, optimized builds |
| **TailwindCSS** | Styling | Free | Rapid UI development, responsive |
| **React Query** | Data fetching | Free | Caching, state management |
| **React Image Gallery** | Photo viewer | Free | Professional image viewing |
| **React Dropzone** | File uploads | Free | Drag-and-drop support |
| **Zustand** | State management | Free | Lightweight, simple |

### 4.2 Backend
| Technology | Purpose | Cost | Why? |
|------------|---------|------|------|
| **Node.js** | Runtime | Free | JavaScript full-stack |
| **Express.js** | Web framework | Free | Simple, flexible API |
| **Multer** | File uploads | Free | Multipart form handling |
| **Sharp** | Image processing | Free | Fast, efficient resizing |
| **Passport.js** | Authentication | Free | OAuth + JWT support |
| **Prisma** | ORM | Free | Type-safe database access |

### 4.3 Database
| Option | Storage | Cost | Limits | Decision |
|--------|---------|------|--------|----------|
| **Supabase** | PostgreSQL | Free | 500MB DB, 1GB bandwidth | ✅ **RECOMMENDED** - Generous free tier, auth built-in |
| **PlanetScale** | MySQL | Free | 5GB storage | Good alternative |
| **MongoDB Atlas** | NoSQL | Free | 512MB storage | Smaller limits |

### 4.4 Image Storage & CDN
| Option | Storage | Cost | Limits | Decision |
|--------|---------|------|--------|----------|
| **Cloudinary** | Cloud storage | Free | 25GB storage, 25GB bandwidth | ✅ **RECOMMENDED** - Auto-optimization, transformations |
| **Cloudflare R2** | Object storage | Free | 10GB storage, free egress | Good for large files |
| **Vercel Blob** | Object storage | Free | 100GB bandwidth | Limited storage |
| **AWS S3** | Object storage | Paid | ~$0.023/GB | Only if scale requires |

**Decision: Cloudinary** - Built-in image transformations, CDN, generous free tier

### 4.5 Deployment
| Component | Platform | Cost | Limits | Why? |
|-----------|----------|------|--------|------|
| **Frontend** | Vercel | Free | Unlimited sites, 100GB bandwidth | ✅ Auto-deploy, edge network |
| **Backend** | Render | Free | 512MB RAM, sleeps after 15min | ✅ Easy Node.js deployment |
| **Alternative Backend** | Railway | Free | 500 hours/month | Good alternative |
| **Database** | Supabase | Free | Included | Already chosen above |

### 4.6 Additional Services
| Service | Purpose | Cost | Why? |
|---------|---------|------|------|
| **GitHub Actions** | CI/CD | Free | Auto-testing, deployment |
| **Sentry** | Error tracking | Free | 5K errors/month |
| **Google Analytics** | Usage analytics | Free | User insights |
| **Cloudflare** | DNS + CDN | Free | Performance boost |

---

## 5. Database Schema

### 5.1 Core Tables

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  storage_used BIGINT DEFAULT 0,
  storage_limit BIGINT DEFAULT 5368709120, -- 5GB
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  medium_url TEXT,
  file_size BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  format VARCHAR(10), -- jpg, png, etc.
  taken_at TIMESTAMP,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  is_favorite BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  metadata JSONB, -- EXIF data
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Albums table
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cover_photo_id UUID REFERENCES photos(id) ON DELETE SET NULL,
  is_shared BOOLEAN DEFAULT false,
  share_token VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Album Photos junction table
CREATE TABLE album_photos (
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  added_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (album_id, photo_id)
);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7), -- hex color
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Photo Tags junction table
CREATE TABLE photo_tags (
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (photo_id, tag_id)
);

-- Indexes for performance
CREATE INDEX idx_photos_user_id ON photos(user_id);
CREATE INDEX idx_photos_uploaded_at ON photos(uploaded_at DESC);
CREATE INDEX idx_photos_taken_at ON photos(taken_at DESC);
CREATE INDEX idx_albums_user_id ON albums(user_id);
CREATE INDEX idx_album_photos_album_id ON album_photos(album_id);
CREATE INDEX idx_album_photos_photo_id ON album_photos(photo_id);
```

---

## 6. API Endpoints Design

### 6.1 Authentication
```
POST   /api/auth/register       - Create new user
POST   /api/auth/login          - Login and get JWT
POST   /api/auth/logout         - Logout
GET    /api/auth/me             - Get current user
PUT    /api/auth/profile        - Update profile
```

### 6.2 Photos
```
GET    /api/photos              - List all photos (paginated)
GET    /api/photos/:id          - Get photo details
POST   /api/photos              - Upload new photo(s)
PUT    /api/photos/:id          - Update photo metadata
DELETE /api/photos/:id          - Delete photo
POST   /api/photos/:id/favorite - Toggle favorite
GET    /api/photos/favorites    - Get favorite photos
GET    /api/photos/search       - Search photos
```

### 6.3 Albums
```
GET    /api/albums              - List all albums
GET    /api/albums/:id          - Get album with photos
POST   /api/albums              - Create new album
PUT    /api/albums/:id          - Update album
DELETE /api/albums/:id          - Delete album
POST   /api/albums/:id/photos   - Add photos to album
DELETE /api/albums/:id/photos/:photoId - Remove photo from album
```

### 6.4 Tags
```
GET    /api/tags                - List all tags
POST   /api/tags                - Create new tag
PUT    /api/tags/:id            - Update tag
DELETE /api/tags/:id            - Delete tag
```

---

## 7. Image Processing Strategy

### 7.1 Upload Pipeline
1. **Client-side validation**: File type, size (max 20MB)
2. **Server receives**: Original file
3. **Generate variants**:
   - **Thumbnail**: 200x200px (for grid)
   - **Medium**: 800px wide (for preview)
   - **Large**: 1600px wide (for full view)
   - **Original**: Keep as backup
4. **Upload to Cloudinary**: All variants
5. **Extract metadata**: EXIF data (camera, location, date)
6. **Save to database**: URLs and metadata

### 7.2 Optimization Settings
- Format: Convert to WebP (smaller, modern)
- Quality: 80% (good balance)
- Progressive JPEG: Yes (better perceived loading)
- Lazy loading: Thumbnails first, full-res on demand

---

## 8. Security Considerations

### 8.1 Authentication
- JWT tokens with 7-day expiry
- Refresh token rotation
- Password hashing: bcrypt (10 rounds)
- Email verification required

### 8.2 File Upload Security
- Validate file types: JPEG, PNG, WebP only
- Scan file headers (magic bytes)
- Max file size: 20MB
- Rate limiting: 50 uploads/hour per user
- Virus scanning (ClamAV if needed)

### 8.3 Access Control
- Photos: Private by default
- Albums: Owner only, or shared via token
- API: All endpoints require authentication
- CORS: Whitelist frontend domain

### 8.4 Data Privacy
- HTTPS only
- No EXIF location data exposed by default
- User data deletion compliance (GDPR)
- Encrypted connections to database

---

## 9. Performance Optimization

### 9.1 Frontend
- Code splitting by route
- Image lazy loading
- Virtual scrolling for large galleries
- Service Worker for offline support
- Compress assets (Gzip/Brotli)

### 9.2 Backend
- Database query optimization (indexes)
- Response caching (Redis if needed)
- Pagination (limit 50 photos per request)
- Async image processing
- CDN for static assets

### 9.3 Database
- Connection pooling
- Query caching
- Materialized views for stats
- Regular VACUUM and ANALYZE

---

## 10. Deployment Strategy

### 10.1 Development Workflow
```
Local Dev → GitHub → CI/CD → Staging → Production
```

### 10.2 Environments

| Environment | Frontend | Backend | Database | Purpose |
|-------------|----------|---------|----------|---------|
| **Development** | localhost:5173 | localhost:3000 | Local/Supabase dev | Local testing |
| **Staging** | staging.vercel.app | staging.render.com | Supabase staging | Pre-production |
| **Production** | vercel.app | render.com | Supabase prod | Live app |

### 10.3 CI/CD Pipeline (GitHub Actions)
```yaml
1. On push to main:
   - Run tests
   - Build frontend
   - Build backend
   - Deploy to staging

2. On release tag:
   - Run full test suite
   - Build optimized bundles
   - Deploy to production
   - Run smoke tests
```

---

## 11. Cost Analysis

### 11.1 Free Tier Limits
| Service | Monthly Limit | Estimated Usage | Status |
|---------|---------------|-----------------|--------|
| Cloudinary | 25GB storage, 25GB bandwidth | 10GB, 15GB | ✅ Safe |
| Supabase | 500MB DB, 1GB bandwidth | 200MB, 500MB | ✅ Safe |
| Vercel | 100GB bandwidth | 20GB | ✅ Safe |
| Render | 750 hours, 512MB RAM | 720 hours | ✅ Safe |

**Total Cost: $0/month** for MVP (up to ~100 active users)

### 11.2 When to Pay?
- **Cloudinary**: Upgrade at ~1000 users ($0/month → $99/month)
- **Supabase**: Upgrade at 500MB DB full ($25/month)
- **Render**: Upgrade to prevent sleep ($7/month)
- **Total at scale**: ~$130/month for 1000+ users

---

## 12. Phase Roadmap

### Phase 1 (Weeks 1-3): MVP Foundation
- [ ] Setup project structure
- [ ] Database schema and migrations
- [ ] User authentication (signup/login)
- [ ] Photo upload with processing
- [ ] Gallery grid view
- [ ] Basic album management
- [ ] Photo viewer component
- [ ] Deploy to staging

### Phase 2 (Weeks 4-6): Enhanced Features
- [ ] Advanced search and filters
- [ ] Tags management
- [ ] Favorites functionality
- [ ] Timeline view
- [ ] Sharing functionality
- [ ] Trash/Archive
- [ ] Performance optimization

### Phase 3 (Weeks 7-8): Polish & Scale
- [ ] Face detection integration
- [ ] Smart search (AI-powered)
- [ ] Photo editing tools
- [ ] Analytics dashboard
- [ ] Mobile PWA optimization
- [ ] Load testing and optimization

---

## 13. Inspiration from Great Photo Apps

### From Google Photos
- ✅ Auto-organization by date
- ✅ Smart search
- ✅ Unlimited storage (we use free tier)
- ✅ Face grouping (Phase 3)

### From Flickr
- ✅ Albums and collections
- ✅ High-quality storage
- ✅ Tags and organization
- ✅ Social features (Phase 3)

### From Apple Photos
- ✅ Memories auto-creation
- ✅ Moments view
- ✅ Clean, minimal UI
- ✅ Fast, responsive experience

### From Unsplash
- ✅ Beautiful grid layout
- ✅ High-quality image display
- ✅ Clean, modern design
- ✅ Easy navigation

---

## 14. Success Metrics

### 14.1 Technical Metrics
- Page load time: < 2 seconds
- Image upload time: < 5 seconds (5MB photo)
- Gallery scroll: 60fps
- API response time: < 200ms (p95)
- Uptime: > 99.5%

### 14.2 User Metrics
- User registration rate
- Photos uploaded per user
- Daily active users (DAU)
- Average session duration
- Feature adoption rate

---

## 15. Next Steps

1. ✅ Review and approve this system design
2. Initialize project structure
3. Setup development environment
4. Create database schema in Supabase
5. Setup Cloudinary account
6. Implement authentication
7. Build photo upload feature
8. Create gallery UI
9. Deploy MVP to staging

---

**Document Version**: 1.0
**Last Updated**: 2025-10-21
**Status**: Draft - Awaiting Approval
