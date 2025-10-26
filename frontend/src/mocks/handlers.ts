import { http, HttpResponse, delay } from 'msw'
import type { AuthResponse, PhotosResponse, AlbumsResponse, TagsResponse } from '@/types'
import { mockUsers, mockPhotos, mockAlbums, mockTags, getPhotosByAlbum, getFavoritePhotos } from './data'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Simulate network delay
const DELAY_MS = 500

// In-memory session storage
let currentUser = mockUsers[0]
const mockToken = 'mock-jwt-token-12345'

export const handlers = [
  // AUTH ENDPOINTS

  // POST /api/auth/register
  http.post(`${API_URL}/auth/register`, async ({ request }) => {
    await delay(DELAY_MS)
    const body = await request.json() as { email: string; password: string; full_name: string }

    const newUser = {
      ...mockUsers[0],
      id: `user-${Date.now()}`,
      email: body.email,
      full_name: body.full_name,
      created_at: new Date().toISOString(),
    }

    const response: AuthResponse = {
      user: newUser,
      token: mockToken,
    }

    return HttpResponse.json(response, { status: 201 })
  }),

  // POST /api/auth/login
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    await delay(DELAY_MS)
    const body = await request.json() as { email: string; password: string }

    // Simple mock validation - accept demo@example.com with any password
    if (body.email === 'demo@example.com') {
      const response: AuthResponse = {
        user: currentUser,
        token: mockToken,
      }
      return HttpResponse.json(response)
    }

    // Invalid credentials
    return HttpResponse.json(
      { error: { message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' } },
      { status: 401 }
    )
  }),

  // GET /api/auth/me
  http.get(`${API_URL}/auth/me`, async () => {
    await delay(DELAY_MS)
    return HttpResponse.json(currentUser)
  }),

  // PUT /api/auth/profile
  http.put(`${API_URL}/auth/profile`, async ({ request }) => {
    await delay(DELAY_MS)
    const updates = await request.json() as Partial<typeof currentUser>
    currentUser = { ...currentUser, ...updates, updated_at: new Date().toISOString() }
    return HttpResponse.json(currentUser)
  }),

  // PHOTO ENDPOINTS

  // GET /api/photos
  http.get(`${API_URL}/photos`, async ({ request }) => {
    await delay(DELAY_MS)
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const sort = url.searchParams.get('sort') || 'uploaded_desc'

    let photos = [...mockPhotos]

    // Apply sorting
    if (sort === 'uploaded_desc') {
      photos.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
    } else if (sort === 'uploaded_asc') {
      photos.sort((a, b) => new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime())
    }

    // Pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedPhotos = photos.slice(start, end)

    const response: PhotosResponse = {
      photos: paginatedPhotos,
      pagination: {
        page,
        limit,
        total: photos.length,
        total_pages: Math.ceil(photos.length / limit),
        has_next: end < photos.length,
        has_prev: page > 1,
      },
    }

    return HttpResponse.json(response)
  }),

  // GET /api/photos/:id
  http.get(`${API_URL}/photos/:id`, async ({ params }) => {
    await delay(DELAY_MS)
    const { id } = params
    const photo = mockPhotos.find(p => p.id === id)

    if (!photo) {
      return HttpResponse.json(
        { error: { message: 'Photo not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    return HttpResponse.json(photo)
  }),

  // POST /api/photos (upload)
  http.post(`${API_URL}/photos`, async ({ request }) => {
    await delay(1500) // Longer delay for uploads

    try {
      const formData = await request.formData()
      const files = formData.getAll('photos') as File[]

      if (files.length === 0) {
        return HttpResponse.json(
          { error: { message: 'No files uploaded', code: 'BAD_REQUEST' } },
          { status: 400 }
        )
      }

      // Create photo objects from uploaded files
      const newPhotos = files.map((file) => {
        // Create object URL from the file for preview
        const objectUrl = URL.createObjectURL(file)

        return {
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: currentUser.id,
          filename: file.name,
          originalUrl: objectUrl,
          thumbnailUrl: objectUrl,
          mediumUrl: objectUrl,
          fileSize: file.size,
          width: 0, // Would need to read image to get actual dimensions
          height: 0,
          format: file.type.split('/')[1] || 'jpg',
          takenAt: new Date().toISOString(),
          uploadedAt: new Date().toISOString(),
          isFavorite: false,
          isArchived: false,
          metadata: {},
        }
      })

      // Add to mock photos array for persistence during session
      mockPhotos.unshift(...newPhotos)

      return HttpResponse.json({ photos: newPhotos, count: newPhotos.length }, { status: 201 })
    } catch (error) {
      console.error('Mock upload error:', error)
      return HttpResponse.json(
        { error: { message: 'Upload failed', code: 'UPLOAD_ERROR' } },
        { status: 500 }
      )
    }
  }),

  // PUT /api/photos/:id
  http.put(`${API_URL}/photos/:id`, async ({ params, request }) => {
    await delay(DELAY_MS)
    const { id } = params
    const updates = await request.json() as Record<string, any>
    const photo = mockPhotos.find(p => p.id === id)

    if (!photo) {
      return HttpResponse.json(
        { error: { message: 'Photo not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    const updatedPhoto = { ...photo, ...updates, updated_at: new Date().toISOString() }
    return HttpResponse.json(updatedPhoto)
  }),

  // DELETE /api/photos/:id
  http.delete(`${API_URL}/photos/:id`, async ({ params }) => {
    await delay(DELAY_MS)
    const { id } = params
    const photoIndex = mockPhotos.findIndex(p => p.id === id)

    if (photoIndex === -1) {
      return HttpResponse.json(
        { error: { message: 'Photo not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    const photo = mockPhotos[photoIndex]

    // Clean up object URLs to prevent memory leaks
    if (photo.originalUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(photo.originalUrl)
    }
    if (photo.thumbnailUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(photo.thumbnailUrl)
    }
    if (photo.mediumUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(photo.mediumUrl)
    }

    // Remove from mock photos array
    mockPhotos.splice(photoIndex, 1)

    return new HttpResponse(null, { status: 204 })
  }),

  // POST /api/photos/:id/favorite
  http.post(`${API_URL}/photos/:id/favorite`, async ({ params }) => {
    await delay(DELAY_MS)
    const { id } = params
    const photo = mockPhotos.find(p => p.id === id)

    if (!photo) {
      return HttpResponse.json(
        { error: { message: 'Photo not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    const updatedPhoto = { ...photo, is_favorite: !photo.is_favorite }
    return HttpResponse.json(updatedPhoto)
  }),

  // GET /api/photos/favorites
  http.get(`${API_URL}/photos/favorites`, async () => {
    await delay(DELAY_MS)
    const favorites = getFavoritePhotos()

    const response: PhotosResponse = {
      photos: favorites,
      pagination: {
        page: 1,
        limit: 50,
        total: favorites.length,
        total_pages: 1,
      },
    }

    return HttpResponse.json(response)
  }),

  // GET /api/photos/search
  http.get(`${API_URL}/photos/search`, async ({ request }) => {
    await delay(DELAY_MS)
    const url = new URL(request.url)
    const query = url.searchParams.get('q') || ''

    const results = mockPhotos.filter(photo =>
      photo.filename.toLowerCase().includes(query.toLowerCase())
    )

    const response: PhotosResponse = {
      photos: results,
      pagination: {
        page: 1,
        limit: 50,
        total: results.length,
        total_pages: 1,
      },
    }

    return HttpResponse.json(response)
  }),

  // ALBUM ENDPOINTS

  // GET /api/albums
  http.get(`${API_URL}/albums`, async () => {
    await delay(DELAY_MS)
    const response: AlbumsResponse = {
      albums: mockAlbums,
    }
    return HttpResponse.json(response)
  }),

  // GET /api/albums/:id
  http.get(`${API_URL}/albums/:id`, async ({ params }) => {
    await delay(DELAY_MS)
    const { id } = params
    const album = mockAlbums.find(a => a.id === id)

    if (!album) {
      return HttpResponse.json(
        { error: { message: 'Album not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    const photos = getPhotosByAlbum(id as string)

    const albumWithPhotos = {
      ...album,
      photos,
      pagination: {
        page: 1,
        limit: 50,
        total: photos.length,
        total_pages: 1,
      },
    }

    return HttpResponse.json(albumWithPhotos)
  }),

  // POST /api/albums
  http.post(`${API_URL}/albums`, async ({ request }) => {
    await delay(DELAY_MS)
    const body = await request.json() as { name: string; description?: string }

    const newAlbum = {
      id: `album-${Date.now()}`,
      user_id: currentUser.id,
      name: body.name,
      description: body.description,
      is_shared: false,
      photo_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return HttpResponse.json(newAlbum, { status: 201 })
  }),

  // PUT /api/albums/:id
  http.put(`${API_URL}/albums/:id`, async ({ params, request }) => {
    await delay(DELAY_MS)
    const { id } = params
    const updates = await request.json() as Record<string, any>
    const album = mockAlbums.find(a => a.id === id)

    if (!album) {
      return HttpResponse.json(
        { error: { message: 'Album not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    const updatedAlbum = { ...album, ...updates, updated_at: new Date().toISOString() }
    return HttpResponse.json(updatedAlbum)
  }),

  // DELETE /api/albums/:id
  http.delete(`${API_URL}/albums/:id`, async ({ params }) => {
    await delay(DELAY_MS)
    const { id } = params
    const album = mockAlbums.find(a => a.id === id)

    if (!album) {
      return HttpResponse.json(
        { error: { message: 'Album not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    return new HttpResponse(null, { status: 204 })
  }),

  // POST /api/albums/:id/photos
  http.post(`${API_URL}/albums/:albumId/photos`, async () => {
    await delay(DELAY_MS)
    return HttpResponse.json({ added: 1, album_id: 'album-1' })
  }),

  // DELETE /api/albums/:albumId/photos/:photoId
  http.delete(`${API_URL}/albums/:albumId/photos/:photoId`, async () => {
    await delay(DELAY_MS)
    return new HttpResponse(null, { status: 204 })
  }),

  // TAG ENDPOINTS

  // GET /api/tags
  http.get(`${API_URL}/tags`, async () => {
    await delay(DELAY_MS)
    const response: TagsResponse = {
      tags: mockTags,
    }
    return HttpResponse.json(response)
  }),

  // POST /api/tags
  http.post(`${API_URL}/tags`, async ({ request }) => {
    await delay(DELAY_MS)
    const body = await request.json() as { name: string; color?: string }

    const newTag = {
      id: `tag-${Date.now()}`,
      user_id: currentUser.id,
      name: body.name,
      color: body.color || '#999999',
      photo_count: 0,
      created_at: new Date().toISOString(),
    }

    return HttpResponse.json(newTag, { status: 201 })
  }),

  // PUT /api/tags/:id
  http.put(`${API_URL}/tags/:id`, async ({ params, request }) => {
    await delay(DELAY_MS)
    const { id } = params
    const updates = await request.json() as Record<string, any>
    const tag = mockTags.find(t => t.id === id)

    if (!tag) {
      return HttpResponse.json(
        { error: { message: 'Tag not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    const updatedTag = { ...tag, ...updates }
    return HttpResponse.json(updatedTag)
  }),

  // DELETE /api/tags/:id
  http.delete(`${API_URL}/tags/:id`, async ({ params }) => {
    await delay(DELAY_MS)
    const { id } = params
    const tag = mockTags.find(t => t.id === id)

    if (!tag) {
      return HttpResponse.json(
        { error: { message: 'Tag not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    return new HttpResponse(null, { status: 204 })
  }),
]
