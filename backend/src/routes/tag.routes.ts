import { Router } from 'express'
import * as tagController from '../controllers/tag.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

// All tag routes require authentication
router.use(authenticate)

// GET /api/tags - List tags
router.get('/', tagController.listTags)

// POST /api/tags - Create new tag
router.post('/', tagController.createTag)

// PUT /api/tags/:id - Update tag
router.put('/:id', tagController.updateTag)

// DELETE /api/tags/:id - Delete tag
router.delete('/:id', tagController.deleteTag)

export default router
