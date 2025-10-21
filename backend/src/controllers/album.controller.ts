import { Response, NextFunction } from 'express'
import { AuthRequest, ApiError } from '../types'
import prisma from '../utils/prisma'

export const listAlbums = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    const albums = await prisma.album.findMany({
      where: { userId: req.user.userId },
      include: {
        _count: {
          select: { albumPhotos: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Format response to match frontend expectations
    const formattedAlbums = albums.map(album => ({
      ...album,
      photo_count: album._count.albumPhotos,
    }))

    res.json({ albums: formattedAlbums })
  } catch (error) {
    next(error)
  }
}

export const getAlbum = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    const album = await prisma.album.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
      include: {
        albumPhotos: {
          include: { photo: true },
          orderBy: { position: 'asc' },
        },
      },
    })

    if (!album) {
      throw new ApiError('Album not found', 404, 'NOT_FOUND')
    }

    res.json({
      ...album,
      photos: album.albumPhotos.map(ap => ap.photo),
    })
  } catch (error) {
    next(error)
  }
}

export const createAlbum = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    const { name, description, cover_photo_id } = req.body

    const album = await prisma.album.create({
      data: {
        name,
        description,
        coverPhotoId: cover_photo_id,
        userId: req.user.userId,
      },
    })

    res.status(201).json(album)
  } catch (error) {
    next(error)
  }
}

export const updateAlbum = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    const { name, description, is_shared } = req.body
    const updates: any = {}

    if (name) updates.name = name
    if (description !== undefined) updates.description = description
    if (typeof is_shared === 'boolean') updates.isShared = is_shared

    const album = await prisma.album.update({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
      data: updates,
    })

    res.json(album)
  } catch (error) {
    next(error)
  }
}

export const deleteAlbum = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    await prisma.album.delete({
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

export const addPhotos = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    const { photo_ids } = req.body

    if (!Array.isArray(photo_ids) || photo_ids.length === 0) {
      throw new ApiError('photo_ids must be a non-empty array', 400, 'VALIDATION_ERROR')
    }

    // Create album-photo relationships
    await Promise.all(
      photo_ids.map((photoId, index) =>
        prisma.albumPhoto.create({
          data: {
            albumId: req.params.id,
            photoId,
            position: index,
          },
        })
      )
    )

    res.json({ added: photo_ids.length, album_id: req.params.id })
  } catch (error) {
    next(error)
  }
}

export const removePhoto = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    await prisma.albumPhoto.delete({
      where: {
        albumId_photoId: {
          albumId: req.params.id,
          photoId: req.params.photoId,
        },
      },
    })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
