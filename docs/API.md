# Photo Memories - API Documentation

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.photo-memories.com/api`

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require JWT authentication.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## Endpoints

### Authentication

#### POST /auth/register
Create a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
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
    "created_at": "2025-10-21T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login
Login to existing account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET /auth/me
Get current user profile.

**Response** (200):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://...",
  "storage_used": 1234567890,
  "storage_limit": 5368709120,
  "created_at": "2025-10-21T10:00:00Z"
}
```

---

### Photos

#### GET /photos
List user's photos with pagination.

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)
- `sort` (optional): Sort order - `uploaded_asc`, `uploaded_desc`, `taken_asc`, `taken_desc` (default: `uploaded_desc`)

**Response** (200):
```json
{
  "photos": [
    {
      "id": "uuid",
      "filename": "vacation.jpg",
      "original_url": "https://res.cloudinary.com/.../original.jpg",
      "thumbnail_url": "https://res.cloudinary.com/.../thumb.jpg",
      "medium_url": "https://res.cloudinary.com/.../medium.jpg",
      "file_size": 3145728,
      "width": 4000,
      "height": 3000,
      "format": "jpg",
      "is_favorite": false,
      "taken_at": "2025-08-15T14:30:00Z",
      "uploaded_at": "2025-10-21T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 250,
    "total_pages": 5
  }
}
```

#### GET /photos/:id
Get single photo details.

**Response** (200):
```json
{
  "id": "uuid",
  "filename": "vacation.jpg",
  "original_url": "https://...",
  "thumbnail_url": "https://...",
  "medium_url": "https://...",
  "file_size": 3145728,
  "width": 4000,
  "height": 3000,
  "format": "jpg",
  "is_favorite": false,
  "is_archived": false,
  "taken_at": "2025-08-15T14:30:00Z",
  "uploaded_at": "2025-10-21T10:00:00Z",
  "metadata": {
    "camera": "iPhone 14 Pro",
    "aperture": "f/1.78",
    "iso": 100,
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194
    }
  },
  "tags": [
    {
      "id": "uuid",
      "name": "vacation",
      "color": "#FF5733"
    }
  ],
  "albums": [
    {
      "id": "uuid",
      "name": "Summer 2025"
    }
  ]
}
```

#### POST /photos
Upload new photo(s).

**Request**: `multipart/form-data`
- `photos`: File(s) to upload (max 20MB each, max 10 files)

**Response** (201):
```json
{
  "photos": [
    {
      "id": "uuid",
      "filename": "vacation.jpg",
      "original_url": "https://...",
      "thumbnail_url": "https://...",
      "medium_url": "https://...",
      "file_size": 3145728,
      "width": 4000,
      "height": 3000,
      "uploaded_at": "2025-10-21T10:00:00Z"
    }
  ]
}
```

#### PUT /photos/:id
Update photo metadata.

**Request Body**:
```json
{
  "filename": "new-name.jpg",
  "is_favorite": true,
  "is_archived": false
}
```

**Response** (200):
```json
{
  "id": "uuid",
  "filename": "new-name.jpg",
  "is_favorite": true,
  "updated_at": "2025-10-21T11:00:00Z"
}
```

#### DELETE /photos/:id
Delete a photo.

**Response** (204): No content

#### GET /photos/favorites
Get user's favorite photos.

**Query Parameters**: Same as `/photos`

**Response**: Same format as `/photos`

#### GET /photos/search
Search photos.

**Query Parameters**:
- `q` (required): Search query
- `tags` (optional): Comma-separated tag names
- `from_date` (optional): ISO date
- `to_date` (optional): ISO date

**Response** (200): Same format as `/photos`

---

### Albums

#### GET /albums
List user's albums.

**Response** (200):
```json
{
  "albums": [
    {
      "id": "uuid",
      "name": "Summer Vacation",
      "description": "Beach photos from 2025",
      "cover_photo": {
        "thumbnail_url": "https://..."
      },
      "photo_count": 42,
      "is_shared": false,
      "created_at": "2025-06-01T10:00:00Z",
      "updated_at": "2025-08-20T15:30:00Z"
    }
  ]
}
```

#### GET /albums/:id
Get album with all photos.

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response** (200):
```json
{
  "id": "uuid",
  "name": "Summer Vacation",
  "description": "Beach photos from 2025",
  "is_shared": false,
  "share_token": null,
  "created_at": "2025-06-01T10:00:00Z",
  "photos": [
    {
      "id": "uuid",
      "filename": "beach.jpg",
      "thumbnail_url": "https://...",
      "position": 0,
      "added_at": "2025-06-01T10:05:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 42
  }
}
```

#### POST /albums
Create new album.

**Request Body**:
```json
{
  "name": "Summer Vacation",
  "description": "Beach photos from 2025",
  "cover_photo_id": "uuid-optional"
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "name": "Summer Vacation",
  "description": "Beach photos from 2025",
  "is_shared": false,
  "created_at": "2025-10-21T10:00:00Z"
}
```

#### PUT /albums/:id
Update album.

**Request Body**:
```json
{
  "name": "New Name",
  "description": "Updated description",
  "is_shared": true
}
```

**Response** (200):
```json
{
  "id": "uuid",
  "name": "New Name",
  "description": "Updated description",
  "is_shared": true,
  "share_token": "abc123xyz",
  "updated_at": "2025-10-21T11:00:00Z"
}
```

#### DELETE /albums/:id
Delete album (photos remain in library).

**Response** (204): No content

#### POST /albums/:id/photos
Add photos to album.

**Request Body**:
```json
{
  "photo_ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Response** (200):
```json
{
  "added": 3,
  "album_id": "uuid"
}
```

#### DELETE /albums/:id/photos/:photoId
Remove photo from album.

**Response** (204): No content

---

### Tags

#### GET /tags
List user's tags.

**Response** (200):
```json
{
  "tags": [
    {
      "id": "uuid",
      "name": "vacation",
      "color": "#FF5733",
      "photo_count": 42,
      "created_at": "2025-06-01T10:00:00Z"
    }
  ]
}
```

#### POST /tags
Create new tag.

**Request Body**:
```json
{
  "name": "vacation",
  "color": "#FF5733"
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "name": "vacation",
  "color": "#FF5733",
  "created_at": "2025-10-21T10:00:00Z"
}
```

#### PUT /tags/:id
Update tag.

**Request Body**:
```json
{
  "name": "summer-vacation",
  "color": "#00FF00"
}
```

**Response** (200):
```json
{
  "id": "uuid",
  "name": "summer-vacation",
  "color": "#00FF00",
  "updated_at": "2025-10-21T11:00:00Z"
}
```

#### DELETE /tags/:id
Delete tag (removes from all photos).

**Response** (204): No content

#### POST /photos/:id/tags
Add tags to photo.

**Request Body**:
```json
{
  "tag_ids": ["uuid1", "uuid2"]
}
```

**Response** (200):
```json
{
  "photo_id": "uuid",
  "tags": [
    {
      "id": "uuid1",
      "name": "vacation"
    },
    {
      "id": "uuid2",
      "name": "beach"
    }
  ]
}
```

#### DELETE /photos/:id/tags/:tagId
Remove tag from photo.

**Response** (204): No content

---

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Resource retrieved |
| 201 | Created | Resource created |
| 204 | No Content | Resource deleted |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Not allowed |
| 404 | Not Found | Resource doesn't exist |
| 413 | Payload Too Large | File too big |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal error |

### Common Errors

**401 Unauthorized**:
```json
{
  "error": {
    "message": "Invalid or expired token",
    "code": "UNAUTHORIZED"
  }
}
```

**400 Validation Error**:
```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

**413 File Too Large**:
```json
{
  "error": {
    "message": "File size exceeds 20MB limit",
    "code": "FILE_TOO_LARGE",
    "details": {
      "max_size": 20971520,
      "received": 25165824
    }
  }
}
```

**429 Rate Limit**:
```json
{
  "error": {
    "message": "Too many requests",
    "code": "RATE_LIMIT_EXCEEDED",
    "details": {
      "retry_after": 3600
    }
  }
}
```

---

## Rate Limits

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Authentication | 5 requests | 15 minutes |
| Photo Upload | 50 uploads | 1 hour |
| General API | 100 requests | 1 minute |
| Search | 30 requests | 1 minute |

**Rate Limit Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1634567890
```

---

## Pagination

Paginated endpoints return this format:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 250,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

**Query Parameters**:
- `page`: Page number (starts at 1)
- `limit`: Items per page (max 100)

---

## Webhooks (Future)

Future support for webhooks on events:
- `photo.uploaded`
- `photo.deleted`
- `album.created`
- `album.shared`

---

**API Version**: v1
**Last Updated**: 2025-10-21
