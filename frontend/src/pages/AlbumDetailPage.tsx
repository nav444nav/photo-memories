import { useParams } from 'react-router-dom'

export default function AlbumDetailPage() {
  const { id } = useParams()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Album Details</h1>
      <p className="text-gray-600">Album ID: {id}</p>
      <div className="mt-6 bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">Album photos will be displayed here</p>
      </div>
    </div>
  )
}
