# Photo Memories - Backend API

Express + TypeScript + Prisma backend for Photo Memories application.

## Tech Stack

- **Node.js** 18+ - Runtime environment
- **Express** 5.x - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM for PostgreSQL
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Sharp** - Image processing (TODO: implement)
- **Multer** - File uploads (TODO: implement)

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── controllers/        # Route controllers
│   │   ├── auth.controller.ts    ✓ Implemented
│   │   ├── photo.controller.ts   ⚠️  Partial (no upload)
│   │   ├── album.controller.ts   ✓ Implemented
│   │   └── tag.controller.ts     ✓ Implemented
│   ├── middleware/         # Express middleware
│   │   ├── auth.ts         # JWT authentication
│   │   ├── errorHandler.ts # Global error handler
│   │   ├── notFoundHandler.ts
│   │   └── validate.ts     # Input validation
│   ├── routes/             # API routes
│   │   ├── auth.routes.ts
│   │   ├── photo.routes.ts
│   │   ├── album.routes.ts
│   │   └── tag.routes.ts
│   ├── services/           # Business logic (TODO)
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   │   ├── prisma.ts       # Prisma client
│   │   ├── jwt.ts          # JWT utilities
│   │   └── password.ts     # Password hashing
│   └── index.ts            # Express app entry point
├── .env.example
├── .env
├── tsconfig.json
├── package.json
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (or Supabase account)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database URL and secrets
nano .env
```

### Database Setup

**Option 1: Local PostgreSQL**

```bash
# Create database
createdb photo_memories

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/photo_memories?schema=public"

# Run migrations
npm run db:migrate

# (Optional) Seed database
npm run db:seed
```

**Option 2: Supabase (Recommended)**

1. Create project at [supabase.com](https://supabase.com)
2. Get connection string from Settings → Database
3. Update `DATABASE_URL` in `.env`:
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```
4. Run migrations:
```bash
npm run db:migrate
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Server will start at http://localhost:3000
```

### Production Build

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## API Endpoints

### Authentication

#### POST /api/auth/register
Register new user.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Response** (201):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "storage_used": 0,
    "storage_limit": 5368709120,
    "created_at": "2025-10-21T10:00:00Z",
    "updated_at": "2025-10-21T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/login
Login existing user.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200): Same as register

#### GET /api/auth/me
Get current user (requires auth).

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  ...
}
```

#### PUT /api/auth/profile
Update user profile (requires auth).

**Request**:
```json
{
  "full_name": "Jane Doe",
  "avatar_url": "https://..."
}
```

### Photos

All photo endpoints require authentication (`Authorization: Bearer <token>`).

#### GET /api/photos
List user's photos (paginated).

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 50)

**Response** (200):
```json
{
  "photos": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "total_pages": 2,
    "has_next": true,
    "has_prev": false
  }
}
```

#### GET /api/photos/:id
Get single photo with details.

#### POST /api/photos
**⚠️ TODO**: Upload photos (not yet implemented)

#### PUT /api/photos/:id
Update photo metadata.

#### DELETE /api/photos/:id
Delete photo.

#### POST /api/photos/:id/favorite
Toggle favorite status.

#### GET /api/photos/favorites
Get all favorite photos.

#### GET /api/photos/search
Search photos by filename.

**Query Parameters**:
- `q` - Search query

### Albums

All album endpoints require authentication.

#### GET /api/albums
List user's albums.

#### GET /api/albums/:id
Get album with all photos.

#### POST /api/albums
Create new album.

**Request**:
```json
{
  "name": "Summer Vacation",
  "description": "Beach photos"
}
```

#### PUT /api/albums/:id
Update album.

#### DELETE /api/albums/:id
Delete album (photos remain).

#### POST /api/albums/:id/photos
Add photos to album.

**Request**:
```json
{
  "photo_ids": ["uuid1", "uuid2"]
}
```

#### DELETE /api/albums/:id/photos/:photoId
Remove photo from album.

### Tags

All tag endpoints require authentication.

#### GET /api/tags
List user's tags.

#### POST /api/tags
Create new tag.

**Request**:
```json
{
  "name": "vacation",
  "color": "#FF5733"
}
```

#### PUT /api/tags/:id
Update tag.

#### DELETE /api/tags/:id
Delete tag.

## Database Schema

See `prisma/schema.prisma` for complete schema.

### Main Tables

- **users** - User accounts
- **photos** - Photo metadata and URLs
- **albums** - Photo collections
- **album_photos** - Many-to-many relationship
- **tags** - User-defined tags
- **photo_tags** - Many-to-many relationship

### Indexes

Optimized queries on:
- `photos(userId, uploadedAt DESC)`
- `photos(userId, takenAt DESC)`
- `photos(userId, isFavorite)`

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"

# Frontend (CORS)
FRONTEND_URL="http://localhost:5173"

# Cloudinary (for image storage)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# File Upload
MAX_FILE_SIZE=20971520  # 20MB
MAX_FILES_PER_UPLOAD=10
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm start            # Start production server
npm run lint         # Type check
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema without migration
npm run db:seed      # Seed database (TODO)
```

## TODO - Not Yet Implemented

### High Priority

1. **Photo Upload with Multer + Sharp**
   - File upload endpoint
   - Image resizing (thumbnail, medium, large)
   - Upload to Cloudinary
   - EXIF metadata extraction
   - File validation

2. **Cloudinary Integration**
   - Upload images to Cloudinary
   - Get optimized URLs
   - Delete images on photo delete

3. **Database Seeding**
   - Create seed data script
   - Sample users and photos

### Medium Priority

4. **Enhanced Search**
   - Search by tags
   - Search by date range
   - Search by metadata

5. **Rate Limiting**
   - Limit API requests per IP
   - Limit uploads per user

6. **Input Validation**
   - More comprehensive validation
   - Sanitize inputs

7. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests

### Low Priority

8. **Advanced Features**
   - Face detection integration
   - Auto-tagging with AI
   - Shared album tokens
   - Email verification
   - Password reset

## Error Handling

All errors return JSON:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` - Missing/invalid token
- `INVALID_CREDENTIALS` - Wrong email/password
- `EMAIL_EXISTS` - Email already registered
- `VALIDATION_ERROR` - Invalid input
- `NOT_FOUND` - Resource not found
- `NOT_IMPLEMENTED` - Feature not yet implemented

## Security

- Passwords hashed with bcryptjs (10 rounds)
- JWT tokens with 7-day expiry
- CORS enabled for frontend only
- SQL injection protection (Prisma)
- Input validation on all endpoints
- Row-level security (user isolation)

## Development Tips

### Prisma Studio

```bash
npm run db:studio
# Opens GUI at http://localhost:5555
```

### Database Migrations

```bash
# Create new migration
npm run db:migrate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma Client after schema changes
npm run db:generate
```

### Testing with cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get user (replace TOKEN)
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## Deployment

### Render (Recommended)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set environment variables
5. Build command: `npm install && npm run build`
6. Start command: `npm start`
7. Deploy

### Railway

Similar to Render, just connect repo and set env vars.

### Self-Hosted

```bash
# On server
git clone <repo>
cd backend
npm install
npm run build

# Setup systemd service or use PM2
pm2 start dist/index.js --name photo-api
```

## Troubleshooting

### Prisma Client errors

```bash
npm run db:generate
```

### Port already in use

```bash
lsof -ti:3000 | xargs kill -9
```

### Database connection errors

- Check DATABASE_URL is correct
- Verify PostgreSQL is running
- Check firewall rules for Supabase

## License

MIT

---

**Status**: ✅ Auth fully implemented | ⚠️ Photo upload pending | ✅ Albums & Tags implemented
