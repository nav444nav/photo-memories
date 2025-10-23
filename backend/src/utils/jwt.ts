import jwt, { SignOptions } from 'jsonwebtoken'
import { JWTPayload } from '../types'

export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not defined')
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
  const options: SignOptions = { expiresIn }

  return jwt.sign(payload, secret, options)
}

export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not defined')
  }

  return jwt.verify(token, secret) as JWTPayload
}
