import { Photo } from '@/types'

interface PhotoGridProps {
  photos: Photo[]
  onPhotoClick?: (photo: Photo) => void
  onDeletePhoto?: (photo: Photo) => void
}

export default function PhotoGrid({ photos, onPhotoClick, onDeletePhoto }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No photos yet</h3>
        <p className="text-gray-600">Upload your first photo to get started</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="aspect-square bg-gray-200 rounded-lg overflow-hidden group relative"
        >
          <img
            src={photo.thumbnailUrl}
            alt={photo.filename}
            className="w-full h-full object-cover cursor-pointer"
            loading="lazy"
            onClick={() => onPhotoClick?.(photo)}
          />

          {/* Delete button - appears on hover */}
          {onDeletePhoto && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeletePhoto(photo)
              }}
              className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
              title="Delete photo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}

          {/* Favorite indicator */}
          {photo.isFavorite && (
            <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-end p-3 pointer-events-none">
            <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity truncate">
              {photo.filename}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
