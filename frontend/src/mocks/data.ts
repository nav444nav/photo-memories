import type { User, Photo, Album, Tag } from '@/types'

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'demo@example.com',
    full_name: 'Demo User',
    avatar_url: 'https://i.pravatar.cc/150?img=1',
    storage_used: 1234567890, // ~1.2GB
    storage_limit: 5368709120, // 5GB
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-10-21T10:00:00Z',
  },
]

// Mock Photos - using Unsplash for demo images
export const mockPhotos: Photo[] = [
  {
    id: 'photo-1',
    userId: 'user-1',
    filename: 'sunset-beach.jpg',
    originalUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop',
    mediumUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    fileSize: 3145728,
    width: 4000,
    height: 3000,
    format: 'jpg',
    takenAt: '2025-08-15T18:30:00Z',
    uploadedAt: '2025-08-16T10:00:00Z',
    isFavorite: true,
    isArchived: false,
    metadata: {
      camera: 'iPhone 14 Pro',
      aperture: 'f/1.78',
      iso: 100,
    },
  },
  {
    id: 'photo-2',
    userId: 'user-1',
    filename: 'mountain-lake.jpg',
    originalUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
    mediumUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    fileSize: 4234567,
    width: 5000,
    height: 3333,
    format: 'jpg',
    takenAt: '2025-07-20T08:15:00Z',
    uploadedAt: '2025-07-21T14:30:00Z',
    isFavorite: false,
    isArchived: false,
  },
  {
    id: 'photo-3',
    userId: 'user-1',
    filename: 'city-lights.jpg',
    originalUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=200&h=200&fit=crop',
    mediumUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800',
    fileSize: 2876543,
    width: 3840,
    height: 2160,
    format: 'jpg',
    takenAt: '2025-09-10T21:45:00Z',
    uploadedAt: '2025-09-11T09:20:00Z',
    isFavorite: true,
    isArchived: false,
  },
  {
    id: 'photo-4',
    userId: 'user-1',
    filename: 'forest-path.jpg',
    originalUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
    mediumUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    fileSize: 3567890,
    width: 4928,
    height: 3264,
    format: 'jpg',
    takenAt: '2025-06-05T14:20:00Z',
    uploadedAt: '2025-06-06T11:15:00Z',
    isFavorite: false,
    isArchived: false,
  },
  {
    id: 'photo-5',
    userId: 'user-1',
    filename: 'desert-sunset.jpg',
    originalUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1600',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=200&h=200&fit=crop',
    mediumUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800',
    fileSize: 2987654,
    width: 4160,
    height: 2773,
    format: 'jpg',
    takenAt: '2025-05-22T19:30:00Z',
    uploadedAt: '2025-05-23T08:45:00Z',
    isFavorite: true,
    isArchived: false,
  },
  {
    id: 'photo-6',
    userId: 'user-1',
    filename: 'ocean-waves.jpg',
    originalUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1600',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=200&h=200&fit=crop',
    mediumUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
    fileSize: 3456789,
    width: 4032,
    height: 3024,
    format: 'jpg',
    takenAt: '2025-08-30T16:00:00Z',
    uploadedAt: '2025-08-31T10:30:00Z',
    isFavorite: false,
    isArchived: false,
  },
  {
    id: 'photo-7',
    userId: 'user-1',
    filename: 'autumn-leaves.jpg',
    originalUrl: 'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?w=1600',
    thumbnailUrl: 'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?w=200&h=200&fit=crop',
    mediumUrl: 'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?w=800',
    fileSize: 3123456,
    width: 5184,
    height: 3456,
    format: 'jpg',
    takenAt: '2025-10-12T11:20:00Z',
    uploadedAt: '2025-10-13T09:00:00Z',
    isFavorite: false,
    isArchived: false,
  },
  {
    id: 'photo-8',
    userId: 'user-1',
    filename: 'snowy-mountain.jpg',
    originalUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1600',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=200&h=200&fit=crop',
    mediumUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800',
    fileSize: 4098765,
    width: 4896,
    height: 3264,
    format: 'jpg',
    takenAt: '2025-02-18T13:45:00Z',
    uploadedAt: '2025-02-19T15:20:00Z',
    isFavorite: true,
    isArchived: false,
  },
]

// Mock Albums
export const mockAlbums: Album[] = [
  {
    id: 'album-1',
    userId: 'user-1',
    name: 'Summer Vacation 2025',
    description: 'Beach and coastal photos from our summer trip',
    cover_photo_id: 'photo-1',
    cover_photo: {
      thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop',
    },
    is_shared: false,
    photo_count: 3,
    created_at: '2025-08-16T10:00:00Z',
    updated_at: '2025-09-11T09:20:00Z',
  },
  {
    id: 'album-2',
    userId: 'user-1',
    name: 'Nature Photography',
    description: 'Collection of landscape and nature shots',
    cover_photo_id: 'photo-2',
    cover_photo: {
      thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
    },
    is_shared: true,
    share_token: 'abc123xyz',
    photo_count: 4,
    created_at: '2025-06-06T11:15:00Z',
    updated_at: '2025-10-13T09:00:00Z',
  },
  {
    id: 'album-3',
    userId: 'user-1',
    name: 'Urban Exploration',
    description: 'City and architecture photography',
    cover_photo_id: 'photo-3',
    cover_photo: {
      thumbnailUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=200&h=200&fit=crop',
    },
    is_shared: false,
    photo_count: 1,
    created_at: '2025-09-11T09:20:00Z',
    updated_at: '2025-09-11T09:20:00Z',
  },
]

// Mock Tags
export const mockTags: Tag[] = [
  {
    id: 'tag-1',
    userId: 'user-1',
    name: 'vacation',
    color: '#FF5733',
    photo_count: 3,
    created_at: '2025-08-16T10:00:00Z',
  },
  {
    id: 'tag-2',
    userId: 'user-1',
    name: 'nature',
    color: '#33FF57',
    photo_count: 5,
    created_at: '2025-06-06T11:15:00Z',
  },
  {
    id: 'tag-3',
    userId: 'user-1',
    name: 'city',
    color: '#3357FF',
    photo_count: 1,
    created_at: '2025-09-11T09:20:00Z',
  },
  {
    id: 'tag-4',
    userId: 'user-1',
    name: 'favorite',
    color: '#FFD700',
    photo_count: 4,
    created_at: '2025-08-16T10:05:00Z',
  },
]

// Helper to get photos by album
export const getPhotosByAlbum = (albumId: string): Photo[] => {
  const albumPhotoMap: Record<string, string[]> = {
    'album-1': ['photo-1', 'photo-3', 'photo-6'],
    'album-2': ['photo-2', 'photo-4', 'photo-7', 'photo-8'],
    'album-3': ['photo-3'],
  }

  const photoIds = albumPhotoMap[albumId] || []
  return mockPhotos.filter(p => photoIds.includes(p.id))
}

// Helper to get favorite photos
export const getFavoritePhotos = (): Photo[] => {
  return mockPhotos.filter(p => p.isFavorite)
}
