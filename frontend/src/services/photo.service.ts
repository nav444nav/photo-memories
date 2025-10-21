import api from './api'
import type {
  Photo,
  PhotosResponse,
  PhotoQueryParams,
  SearchQueryParams,
  PhotoUploadResponse,
} from '@/types'

export const photoService = {
  async getPhotos(params?: PhotoQueryParams): Promise<PhotosResponse> {
    const { data } = await api.get<PhotosResponse>('/photos', { params })
    return data
  },

  async getPhoto(id: string): Promise<Photo> {
    const { data } = await api.get<Photo>(`/photos/${id}`)
    return data
  },

  async uploadPhotos(files: File[]): Promise<PhotoUploadResponse> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('photos', file)
    })

    const { data } = await api.post<PhotoUploadResponse>('/photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  async updatePhoto(
    id: string,
    updates: Partial<Photo>
  ): Promise<Photo> {
    const { data } = await api.put<Photo>(`/photos/${id}`, updates)
    return data
  },

  async deletePhoto(id: string): Promise<void> {
    await api.delete(`/photos/${id}`)
  },

  async toggleFavorite(id: string): Promise<Photo> {
    const { data } = await api.post<Photo>(`/photos/${id}/favorite`)
    return data
  },

  async getFavorites(params?: PhotoQueryParams): Promise<PhotosResponse> {
    const { data } = await api.get<PhotosResponse>('/photos/favorites', {
      params,
    })
    return data
  },

  async searchPhotos(params: SearchQueryParams): Promise<PhotosResponse> {
    const { data } = await api.get<PhotosResponse>('/photos/search', {
      params,
    })
    return data
  },

  async addTags(photoId: string, tagIds: string[]): Promise<Photo> {
    const { data } = await api.post<Photo>(`/photos/${photoId}/tags`, {
      tag_ids: tagIds,
    })
    return data
  },

  async removeTag(photoId: string, tagId: string): Promise<void> {
    await api.delete(`/photos/${photoId}/tags/${tagId}`)
  },
}
