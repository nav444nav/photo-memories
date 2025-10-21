import api from './api'
import type { Tag, TagsResponse, CreateTagData } from '@/types'

export const tagService = {
  async getTags(): Promise<TagsResponse> {
    const { data } = await api.get<TagsResponse>('/tags')
    return data
  },

  async createTag(tagData: CreateTagData): Promise<Tag> {
    const { data } = await api.post<Tag>('/tags', tagData)
    return data
  },

  async updateTag(id: string, updates: Partial<CreateTagData>): Promise<Tag> {
    const { data } = await api.put<Tag>(`/tags/${id}`, updates)
    return data
  },

  async deleteTag(id: string): Promise<void> {
    await api.delete(`/tags/${id}`)
  },
}
