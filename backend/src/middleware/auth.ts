import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthRequest, JWTPayload, ApiError } from '../types'

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('No token provided', 401, 'UNAUTHORIZED')
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured')
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    }

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError('Invalid token', 401, 'INVALID_TOKEN'))
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError('Token expired', 401, 'TOKEN_EXPIRED'))
    } else {
      next(error)
    }
  }
}
