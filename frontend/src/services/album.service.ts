import api from './api'
import type {
  Album,
  AlbumWithPhotos,
  AlbumsResponse,
  CreateAlbumData,
  UpdateAlbumData,
  PhotoQueryParams,
} from '@/types'

export const albumService = {
  async getAlbums(): Promise<AlbumsResponse> {
    const { data } = await api.get<AlbumsResponse>('/albums')
    return data
  },

  async getAlbum(
    id: string,
    params?: PhotoQueryParams
  ): Promise<AlbumWithPhotos> {
    const { data } = await api.get<AlbumWithPhotos>(`/albums/${id}`, {
      params,
    })
    return data
  },

  async createAlbum(albumData: CreateAlbumData): Promise<Album> {
    const { data } = await api.post<Album>('/albums', albumData)
    return data
  },

  async updateAlbum(id: string, updates: UpdateAlbumData): Promise<Album> {
    const { data } = await api.put<Album>(`/albums/${id}`, updates)
    return data
  },

  async deleteAlbum(id: string): Promise<void> {
    await api.delete(`/albums/${id}`)
  },

  async addPhotos(albumId: string, photoIds: string[]): Promise<void> {
    await api.post(`/albums/${albumId}/photos`, { photo_ids: photoIds })
  },

  async removePhoto(albumId: string, photoId: string): Promise<void> {
    await api.delete(`/albums/${albumId}/photos/${photoId}`)
  },
}
