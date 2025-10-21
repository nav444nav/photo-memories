import { useQuery } from '@tanstack/react-query'
import { albumService } from '@/services/album.service'
import { Link } from 'react-router-dom'

export default function AlbumsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['albums'],
    queryFn: () => albumService.getAlbums(),
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Albums</h1>
          {data && (
            <p className="text-sm text-gray-600 mt-1">
              {data.albums.length} {data.albums.length === 1 ? 'album' : 'albums'}
            </p>
          )}
        </div>
        <button className="btn-primary">
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Album
        </button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      )}

      {data && data.albums.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No albums yet</h3>
          <p className="text-gray-600 mb-4">Create your first album to organize photos</p>
          <button className="btn-primary">Create Album</button>
        </div>
      )}

      {data && data.albums.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.albums.map((album) => (
            <Link
              key={album.id}
              to={`/albums/${album.id}`}
              className="card hover:shadow-lg transition-shadow"
            >
              {/* Cover photo */}
              <div className="aspect-video bg-gray-200 overflow-hidden">
                {album.cover_photo?.thumbnail_url ? (
                  <img
                    src={album.cover_photo.thumbnail_url}
                    alt={album.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Album info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{album.name}</h3>
                {album.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{album.description}</p>
                )}
                <p className="text-sm text-gray-500">
                  {album.photo_count || 0} {album.photo_count === 1 ? 'photo' : 'photos'}
                </p>
                {album.is_shared && (
                  <span className="inline-block mt-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                    Shared
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
