import { Request, Response, NextFunction } from 'express'
import prisma from '../utils/prisma'
import { hashPassword, comparePassword } from '../utils/password'
import { generateToken } from '../utils/jwt'
import { ApiError, AuthRequest, UserResponse } from '../types'

// Helper to convert User to UserResponse
const formatUser = (user: any): UserResponse => ({
  id: user.id,
  email: user.email,
  full_name: user.fullName,
  avatar_url: user.avatarUrl || undefined,
  storage_used: Number(user.storageUsed),
  storage_limit: Number(user.storageLimit),
  created_at: user.createdAt.toISOString(),
  updated_at: user.updatedAt.toISOString(),
})

// POST /api/auth/register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, full_name } = req.body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new ApiError('User with this email already exists', 400, 'EMAIL_EXISTS')
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: full_name,
      },
    })

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    })

    res.status(201).json({
      user: formatUser(user),
      token,
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new ApiError('Invalid email or password', 401, 'INVALID_CREDENTIALS')
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash)

    if (!isValidPassword) {
      throw new ApiError('Invalid email or password', 401, 'INVALID_CREDENTIALS')
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    })

    res.json({
      user: formatUser(user),
      token,
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/auth/me
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    })

    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND')
    }

    res.json(formatUser(user))
  } catch (error) {
    next(error)
  }
}

// PUT /api/auth/profile
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')
    }

    const { full_name, avatar_url } = req.body

    const updates: any = {}
    if (full_name) updates.fullName = full_name
    if (avatar_url !== undefined) updates.avatarUrl = avatar_url

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: updates,
    })

    res.json(formatUser(user))
  } catch (error) {
    next(error)
  }
}
