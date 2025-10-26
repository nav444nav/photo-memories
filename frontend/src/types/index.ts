// User types
export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  storage_used: number
  storage_limit: number
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  full_name: string
}

// Photo types
export interface Photo {
  id: string
  userId: string
  filename: string
  originalUrl: string
  thumbnailUrl: string
  mediumUrl?: string
  fileSize: number
  width?: number
  height?: number
  format?: string
  takenAt?: string
  uploadedAt: string
  isFavorite: boolean
  isArchived: boolean
  metadata?: PhotoMetadata
  tags?: Tag[]
  albums?: Album[]
}

export interface PhotoMetadata {
  camera?: string
  aperture?: string
  iso?: number
  focal_length?: string
  exposure_time?: string
  location?: {
    latitude: number
    longitude: number
  }
}

export interface PhotoUploadResponse {
  photos: Photo[]
}

// Album types
export interface Album {
  id: string
  user_id: string
  name: string
  description?: string
  cover_photo_id?: string
  cover_photo?: {
    thumbnail_url: string
  }
  is_shared: boolean
  share_token?: string
  photo_count?: number
  created_at: string
  updated_at: string
}

export interface AlbumWithPhotos extends Album {
  photos: Photo[]
  pagination?: PaginationInfo
}

export interface CreateAlbumData {
  name: string
  description?: string
  cover_photo_id?: string
}

export interface UpdateAlbumData extends Partial<CreateAlbumData> {
  is_shared?: boolean
}

// Tag types
export interface Tag {
  id: string
  user_id: string
  name: string
  color?: string
  photo_count?: number
  created_at: string
}

export interface CreateTagData {
  name: string
  color?: string
}

// Pagination types
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  total_pages: number
  has_next?: boolean
  has_prev?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationInfo
}

export interface PhotosResponse {
  photos: Photo[]
  pagination: PaginationInfo
}

export interface AlbumsResponse {
  albums: Album[]
}

export interface TagsResponse {
  tags: Tag[]
}

// Query parameters
export interface PhotoQueryParams {
  page?: number
  limit?: number
  sort?: 'uploaded_asc' | 'uploaded_desc' | 'taken_asc' | 'taken_desc'
}

export interface SearchQueryParams extends PhotoQueryParams {
  q: string
  tags?: string
  from_date?: string
  to_date?: string
}

// API Error types
export interface ApiError {
  message: string
  code: string
  details?: Record<string, any>
}

export interface ApiErrorResponse {
  error: ApiError
}

// Upload types
export interface UploadProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  photo?: Photo
}

// Store types (for Zustand)
export interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
}

export interface UploadStore {
  uploads: UploadProgress[]
  addUpload: (file: File) => void
  updateUpload: (fileId: string, update: Partial<UploadProgress>) => void
  removeUpload: (fileId: string) => void
  clearCompleted: () => void
}
