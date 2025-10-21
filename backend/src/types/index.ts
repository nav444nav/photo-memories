import { Request } from 'express'

// User types
export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  storageUsed: bigint
  storageLimit: bigint
  createdAt: Date
  updatedAt: Date
}

export interface UserResponse {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  storage_used: number
  storage_limit: number
  created_at: string
  updated_at: string
}

// Auth types
export interface RegisterInput {
  email: string
  password: string
  full_name: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthResponse {
  user: UserResponse
  token: string
}

export interface JWTPayload {
  userId: string
  email: string
}

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
  }
}

// Photo types
export interface PhotoUpload {
  filename: string
  originalUrl: string
  thumbnailUrl: string
  mediumUrl?: string
  fileSize: number
  width?: number
  height?: number
  format?: string
  takenAt?: Date
  metadata?: any
}

// API Error types
export class ApiError extends Error {
  statusCode: number
  code: string
  details?: any

  constructor(message: string, statusCode: number, code: string, details?: any) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.name = 'ApiError'
  }
}

// Pagination types
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}
