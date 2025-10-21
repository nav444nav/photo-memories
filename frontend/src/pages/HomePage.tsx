import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Photo Memories
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Store, organize, and share your precious moments
      </p>
      <div className="space-x-4">
        <Link to="/login" className="btn-primary">
          Login
        </Link>
        <Link to="/register" className="btn-secondary">
          Sign Up
        </Link>
      </div>
    </div>
  )
}
