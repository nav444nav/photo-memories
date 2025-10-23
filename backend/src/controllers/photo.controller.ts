import { Response, NextFunction } from 'express'
import { AuthRequest, ApiError } from '../types'
import prisma from '../utils/prisma'

// TODO: Implement file upload with Multer and Sharp
// TODO: Integrate Cloudinary for image storage
// TODO: Add EXIF metadata extraction

export const listPhotos = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50
    const skip = (page - 1) * limit

    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        where: { userId: req.user.userId },
        orderBy: { uploadedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.photo.count({ where: { userId: req.user.userId } }),
    ])

    res.json({
      photos,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
        has_next: skip + limit < total,
        has_prev: page > 1,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getPhoto = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    const photo = await prisma.photo.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
      include: {
        photoTags: {
          include: { tag: true },
        },
      },
    })

    if (!photo) {
      throw new ApiError('Photo not found', 404, 'NOT_FOUND')
    }

    res.json(photo)
  } catch (error) {
    next(error)
  }
}

export const uploadPhotos = async (
  _req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement with Multer + Sharp + Cloudinary
    throw new ApiError('Photo upload not yet implemented', 501, 'NOT_IMPLEMENTED')
  } catch (error) {
    next(error)
  }
}

export const updatePhoto = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    const { filename, is_favorite, is_archived } = req.body
    const updates: any = {}

    if (filename) updates.filename = filename
    if (typeof is_favorite === 'boolean') updates.isFavorite = is_favorite
    if (typeof is_archived === 'boolean') updates.isArchived = is_archived

    const photo = await prisma.photo.update({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
      data: updates,
    })

    res.json(photo)
  } catch (error) {
    next(error)
  }
}

export const deletePhoto = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    // TODO: Delete from Cloudinary as well
    await prisma.photo.delete({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

export const toggleFavorite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    const photo = await prisma.photo.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    })

    if (!photo) {
      throw new ApiError('Photo not found', 404, 'NOT_FOUND')
    }

    const updated = await prisma.photo.update({
      where: { id: req.params.id },
      data: { isFavorite: !photo.isFavorite },
    })

    res.json(updated)
  } catch (error) {
    next(error)
  }
}

export const getFavorites = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    const photos = await prisma.photo.findMany({
      where: {
        userId: req.user.userId,
        isFavorite: true,
      },
      orderBy: { uploadedAt: 'desc' },
    })

    res.json({
      photos,
      pagination: {
        page: 1,
        limit: 50,
        total: photos.length,
        total_pages: 1,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const searchPhotos = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    const query = req.query.q as string

    const photos = await prisma.photo.findMany({
      where: {
        userId: req.user.userId,
        filename: {
          contains: query,
        },
      },
      orderBy: { uploadedAt: 'desc' },
    })

    res.json({
      photos,
      pagination: {
        page: 1,
        limit: 50,
        total: photos.length,
        total_pages: 1,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const addTags = async (
  _req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement tag addition
    throw new ApiError('Not yet implemented', 501, 'NOT_IMPLEMENTED')
  } catch (error) {
    next(error)
  }
}

export const removeTag = async (
  _req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement tag removal
    throw new ApiError('Not yet implemented', 501, 'NOT_IMPLEMENTED')
  } catch (error) {
    next(error)
  }
}
