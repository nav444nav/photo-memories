import { Response, NextFunction } from 'express'
import { AuthRequest, ApiError } from '../types'
import prisma from '../utils/prisma'

export const listTags = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    const tags = await prisma.tag.findMany({
      where: { userId: req.user.userId },
      include: {
        _count: {
          select: { photoTags: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedTags = tags.map(tag => ({
      ...tag,
      photo_count: tag._count.photoTags,
    }))

    res.json({ tags: formattedTags })
  } catch (error) {
    next(error)
  }
}

export const createTag = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    const { name, color } = req.body

    if (!name) {
      throw new ApiError('Tag name is required', 400, 'VALIDATION_ERROR')
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        color: color || '#999999',
        userId: req.user.userId,
      },
    })

    res.status(201).json(tag)
  } catch (error) {
    next(error)
  }
}

export const updateTag = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    const { name, color } = req.body
    const updates: any = {}

    if (name) updates.name = name
    if (color) updates.color = color

    const tag = await prisma.tag.update({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
      data: updates,
    })

    res.json(tag)
  } catch (error) {
    next(error)
  }
}

export const deleteTag = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')

    await prisma.tag.delete({
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
