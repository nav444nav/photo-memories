import { Response, NextFunction } from 'express'
import { AuthRequest, ApiError } from '../types'
import prisma from '../utils/prisma'
import cloudinary from '../config/cloudinary'
import sharp from 'sharp'

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
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    const files = req.files as Express.Multer.File[]
    if (!files || files.length === 0) {
      throw new ApiError('No files uploaded', 400, 'BAD_REQUEST')
    }

    // Check user storage limit
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    })

    if (!user) throw new ApiError('User not found', 404, 'NOT_FOUND')

    const totalFileSize = files.reduce((sum, file) => sum + file.size, 0)
    if (user.storageUsed + BigInt(totalFileSize) > user.storageLimit) {
      throw new ApiError('Storage limit exceeded', 400, 'STORAGE_LIMIT_EXCEEDED')
    }

    // Upload each file to Cloudinary
    const uploadedPhotos = await Promise.all(
      files.map(async (file) => {
        try {
          // Get image metadata
          const metadata = await sharp(file.buffer).metadata()

          // Upload original to Cloudinary
          const uploadResult = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: `photo-memories/${req.user!.userId}`,
                resource_type: 'image',
                transformation: [
                  { quality: 'auto:good' },
                  { fetch_format: 'auto' },
                ],
              },
              (error, result) => {
                if (error) reject(error)
                else resolve(result)
              }
            )
            uploadStream.end(file.buffer)
          })

          // Generate thumbnail URL (Cloudinary automatic transformation)
          const thumbnailUrl = cloudinary.url(uploadResult.public_id, {
            width: 300,
            height: 300,
            crop: 'fill',
            quality: 'auto:good',
            fetch_format: 'auto',
          })

          // Generate medium URL
          const mediumUrl = cloudinary.url(uploadResult.public_id, {
            width: 1200,
            height: 1200,
            crop: 'limit',
            quality: 'auto:good',
            fetch_format: 'auto',
          })

          // Create photo record in database
          return await prisma.photo.create({
            data: {
              userId: req.user!.userId,
              filename: file.originalname,
              originalUrl: uploadResult.secure_url,
              thumbnailUrl,
              mediumUrl,
              fileSize: BigInt(file.size),
              width: metadata.width,
              height: metadata.height,
              format: metadata.format,
              metadata: {
                cloudinary_public_id: uploadResult.public_id,
                cloudinary_version: uploadResult.version,
              },
            },
          })
        } catch (error) {
          console.error('Error uploading file:', file.originalname, error)
          throw new ApiError(
            `Failed to upload ${file.originalname}`,
            500,
            'UPLOAD_FAILED'
          )
        }
      })
    )

    // Update user storage
    await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        storageUsed: {
          increment: BigInt(totalFileSize),
        },
      },
    })

    res.status(201).json({
      photos: uploadedPhotos,
      count: uploadedPhotos.length,
    })
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

    // Get photo to retrieve Cloudinary public_id
    const photo = await prisma.photo.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    })

    if (!photo) {
      throw new ApiError('Photo not found', 404, 'NOT_FOUND')
    }

    // Delete from Cloudinary
    if (photo.metadata && typeof photo.metadata === 'object' && 'cloudinary_public_id' in photo.metadata) {
      const publicId = (photo.metadata as any).cloudinary_public_id
      try {
        await cloudinary.uploader.destroy(publicId)
      } catch (error) {
        console.error('Failed to delete from Cloudinary:', error)
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete from database
    await prisma.photo.delete({
      where: {
        id: req.params.id,
      },
    })

    // Update user storage
    await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        storageUsed: {
          decrement: photo.fileSize,
        },
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
