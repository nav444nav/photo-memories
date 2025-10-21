import { useQuery } from '@tanstack/react-query'
import { photoService } from '@/services/photo.service'
import PhotoGrid from '@/components/gallery/PhotoGrid'
import LoadingSkeleton from '@/components/gallery/LoadingSkeleton'
import { Photo } from '@/types'

export default function GalleryPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['photos'],
    queryFn: () => photoService.getPhotos({ page: 1, limit: 50 }),
  })

  const handlePhotoClick = (photo: Photo) => {
    console.log('Photo clicked:', photo)
    // TODO: Open photo viewer/lightbox
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
        <button className="btn-primary">
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Photos
        </button>
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
