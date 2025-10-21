import { create } from 'zustand'
import type { UploadStore, UploadProgress } from '@/types'

export const useUploadStore = create<UploadStore>((set) => ({
  uploads: [],

  addUpload: (file: File) => {
    const upload: UploadProgress = {
      file,
      progress: 0,
      status: 'pending',
    }
    set((state) => ({
      uploads: [...state.uploads, upload],
    }))
  },

  updateUpload: (fileName: string, update: Partial<UploadProgress>) => {
    set((state) => ({
      uploads: state.uploads.map((upload) =>
        upload.file.name === fileName ? { ...upload, ...update } : upload
      ),
    }))
  },

  removeUpload: (fileName: string) => {
    set((state) => ({
      uploads: state.uploads.filter((upload) => upload.file.name !== fileName),
    }))
  },

  clearCompleted: () => {
    set((state) => ({
      uploads: state.uploads.filter(
        (upload) => upload.status !== 'success' && upload.status !== 'error'
      ),
    }))
  },
}))
