import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { photoService } from '@/services/photo.service'
import PhotoGrid from '@/components/gallery/PhotoGrid'
import LoadingSkeleton from '@/components/gallery/LoadingSkeleton'
import { Photo } from '@/types'
import { useRef, useState } from 'react'

export default function GalleryPage() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadProgress, setUploadProgress] = useState<string>('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['photos'],
    queryFn: () => photoService.getPhotos({ page: 1, limit: 50 }),
  })

  const uploadMutation = useMutation({
    mutationFn: (files: File[]) => photoService.uploadPhotos(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] })
      setUploadProgress('Upload successful!')
      setTimeout(() => setUploadProgress(''), 3000)
    },
    onError: (error: any) => {
      setUploadProgress(`Upload failed: ${error.message}`)
      setTimeout(() => setUploadProgress(''), 5000)
    },
  })

  const handlePhotoClick = (photo: Photo) => {
    console.log('Photo clicked:', photo)
    // TODO: Open photo viewer/lightbox
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setUploadProgress(`Uploading ${files.length} ${files.length === 1 ? 'photo' : 'photos'}...`)
      // Convert FileList to File[]
      const fileArray = Array.from(files)
      uploadMutation.mutate(fileArray)
      // Reset input
      e.target.value = ''
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
          {data && (
            <p className="text-sm text-gray-600 mt-1">
              {data.pagination.total} {data.pagination.total === 1 ? 'photo' : 'photos'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {uploadProgress && (
            <span className="text-sm text-gray-600">{uploadProgress}</span>
          )}
          <button
            className="btn-primary"
            onClick={handleUploadClick}
            disabled={uploadMutation.isPending}
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {uploadMutation.isPending ? 'Uploading...' : 'Upload Photos'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Error loading photos</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && <LoadingSkeleton />}

      {/* Photos grid */}
      {data && <PhotoGrid photos={data.photos} onPhotoClick={handlePhotoClick} />}
    </div>
  )
}
