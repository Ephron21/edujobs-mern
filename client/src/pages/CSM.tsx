import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

type Stats = {
  applicantsCount: number
  studentsCount: number
  recentApplicants: any[]
  recentStudents: any[]
  statusBreakdown?: any
}

function Sidebar() {
  const link = ({ isActive }: { isActive: boolean }) => `block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive?'bg-gray-100 dark:bg-gray-800':''}`
  return (
    <aside className="w-56 shrink-0 border-r min-h-[70vh] p-4">
      <h3 className="font-semibold mb-3">CSM</h3>
      <nav className="space-y-1 text-sm">
        <NavLink className={link} to="/csm">Dashboard</NavLink>
        <NavLink className={link} to="/admin/applicants">Applicants</NavLink>
        <NavLink className={link} to="/admin/files">Files</NavLink>
        <NavLink className={link} to="/admin/students">Students</NavLink>
      </nav>
    </aside>
  )
}

export default function CSM() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem('admin_token')
        if (!token) {
          setError('No authentication token found')
          return
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001'
        const response = await fetch(`${apiUrl}/api/admin/stats`, { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${response.status}`)
        }

        const data = await response.json()
        console.log('Stats data:', data)
        
        // Handle the response structure from the backend
        if (data.success && data.data) {
          setStats(data.data)
        } else {
          // Fallback for direct data response
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        setError(error.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  function logout() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    window.location.href = '/login'
  }

  return (
    <div className="flex gap-6">
      <Sidebar />
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
          <button onClick={logout} className="px-3 py-2 text-sm border rounded hover:bg-gray-100">
            Logout
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        {loading && <p className="text-gray-600">Loading...</p>}
        
        {!loading && !error && stats && (
          <>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border rounded bg-white shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Applications</div>
                <div className="text-3xl font-bold text-blue-600">{stats.applicantsCount}</div>
              </div>
              <div className="p-4 border rounded bg-white shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Users</div>
                <div className="text-3xl font-bold text-green-600">{stats.studentsCount}</div>
              </div>
              <div className="p-4 border rounded bg-white shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Files</div>
                <div className="text-3xl font-bold text-gray-400">—</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 border rounded shadow-sm">
                <h3 className="font-semibold mb-3">Recent Applications</h3>
                {stats.recentApplicants.length > 0 ? (
                  <ul className="text-sm space-y-2">
                    {stats.recentApplicants.map((app: any) => (
                      <li key={app._id} className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium">{app.firstName} {app.lastName}</span>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {app.status}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No applications yet</p>
                )}
              </div>
              
              <div className="bg-white p-4 border rounded shadow-sm">
                <h3 className="font-semibold mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <NavLink 
                    to="/admin/applicants" 
                    className="block px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                  >
                    View All Applications
                  </NavLink>
                  <NavLink 
                    to="/admin/files" 
                    className="block px-3 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100"
                  >
                    Manage Files
                  </NavLink>
                  <NavLink 
                    to="/admin/students" 
                    className="block px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded hover:bg-purple-100"
                  >
                    Student Management
                  </NavLink>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )}