import { useAuthStore } from '@/store/authStore'

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user)

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const storagePercent = user
    ? (user.storage_used / user.storage_limit) * 100
    : 0

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="grid gap-6">
        {/* User Info */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <p className="font-medium">{user?.full_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Member Since</label>
              <p className="font-medium">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Storage Info */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Storage</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Used</span>
              <span className="font-medium">
                {formatBytes(user?.storage_used || 0)} of{' '}
                {formatBytes(user?.storage_limit || 0)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(storagePercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {storagePercent.toFixed(1)}% used
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
