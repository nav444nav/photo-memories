export default function FavoritesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Favorites</h1>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
        <p className="text-gray-600">Mark photos as favorites to see them here</p>
      </div>
    </div>
  )
}
