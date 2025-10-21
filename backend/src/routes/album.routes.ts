import { Router } from 'express'
import * as albumController from '../controllers/album.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

// All album routes require authentication
router.use(authenticate)

// GET /api/albums - List albums
router.get('/', albumController.listAlbums)

// GET /api/albums/:id - Get album with photos
router.get('/:id', albumController.getAlbum)

// POST /api/albums - Create new album
router.post('/', albumController.createAlbum)

// PUT /api/albums/:id - Update album
router.put('/:id', albumController.updateAlbum)

// DELETE /api/albums/:id - Delete album
router.delete('/:id', albumController.deleteAlbum)

// POST /api/albums/:id/photos - Add photos to album
router.post('/:id/photos', albumController.addPhotos)

// DELETE /api/albums/:id/photos/:photoId - Remove photo from album
router.delete('/:id/photos/:photoId', albumController.removePhoto)

export default router
