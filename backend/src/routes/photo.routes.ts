import { Router } from 'express'
import * as photoController from '../controllers/photo.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

// All photo routes require authentication
router.use(authenticate)

// GET /api/photos - List photos (with pagination)
router.get('/', photoController.listPhotos)

// GET /api/photos/favorites - Get favorite photos
router.get('/favorites', photoController.getFavorites)

// GET /api/photos/search - Search photos
router.get('/search', photoController.searchPhotos)

// GET /api/photos/:id - Get single photo
router.get('/:id', photoController.getPhoto)

// POST /api/photos - Upload new photos
router.post('/', photoController.uploadPhotos)

// PUT /api/photos/:id - Update photo metadata
router.put('/:id', photoController.updatePhoto)

// DELETE /api/photos/:id - Delete photo
router.delete('/:id', photoController.deletePhoto)

// POST /api/photos/:id/favorite - Toggle favorite
router.post('/:id/favorite', photoController.toggleFavorite)

// POST /api/photos/:id/tags - Add tags to photo
router.post('/:id/tags', photoController.addTags)

// DELETE /api/photos/:id/tags/:tagId - Remove tag from photo
router.delete('/:id/tags/:tagId', photoController.removeTag)

export default router
