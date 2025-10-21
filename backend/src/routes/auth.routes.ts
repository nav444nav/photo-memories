import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth'
import { validateRegister, validateLogin } from '../middleware/validate'

const router = Router()

// POST /api/auth/register - Register new user
router.post('/register', validateRegister, authController.register)

// POST /api/auth/login - Login user
router.post('/login', validateLogin, authController.login)

// GET /api/auth/me - Get current user (protected)
router.get('/me', authenticate, authController.getMe)

// PUT /api/auth/profile - Update user profile (protected)
router.put('/profile', authenticate, authController.updateProfile)

export default router
