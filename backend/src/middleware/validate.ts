import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../types'

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 8
}

export const validateRegister = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { email, password, full_name } = req.body

  const errors: Record<string, string> = {}

  if (!email) {
    errors.email = 'Email is required'
  } else if (!validateEmail(email)) {
    errors.email = 'Invalid email format'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 8 characters'
  }

  if (!full_name) {
    errors.full_name = 'Full name is required'
  } else if (full_name.length < 2) {
    errors.full_name = 'Full name must be at least 2 characters'
  }

  if (Object.keys(errors).length > 0) {
    return next(new ApiError('Validation failed', 400, 'VALIDATION_ERROR', errors))
  }

  next()
}

export const validateLogin = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body

  const errors: Record<string, string> = {}

  if (!email) {
    errors.email = 'Email is required'
  }

  if (!password) {
    errors.password = 'Password is required'
  }

  if (Object.keys(errors).length > 0) {
    return next(new ApiError('Validation failed', 400, 'VALIDATION_ERROR', errors))
  }

  next()
}
