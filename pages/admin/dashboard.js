// Admin dashboard page
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalEvents: 0,
    totalSubmissions: 0,
    totalDocuments: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchStats()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken')
    
    if (!token) {
      router.push('/admin/login')
      return
    }

    try {      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        router.push('/admin/login')
        return
      }

      setUser(data.user)
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/admin/login')
    }
  }

  const fetchStats = async () => {
    const token = localStorage.getItem('adminToken')
    
    if (!token) {
      setLoading(false)
      return
    }

    try {
      // Fetch real statistics from all endpoints
      const headers = { 'Authorization': `Bearer ${token}` }
      
      // Fetch blog posts count
      const blogResponse = await fetch('/api/admin/blog', { headers })
      const blogData = await blogResponse.json()
      const totalPosts = blogData.success && blogData.data ? blogData.data.length : 0
      
      // Fetch events count
      const eventsResponse = await fetch('/api/admin/events', { headers })
      const eventsData = await eventsResponse.json()
      const totalEvents = eventsData.success && eventsData.data ? eventsData.data.length : 0
      
      // Fetch submissions count
      const submissionsResponse = await fetch('/api/admin/submissions', { headers })
      const submissionsData = await submissionsResponse.json()
      const totalSubmissions = submissionsData.submissions ? submissionsData.submissions.length : 0
      
      // Fetch documents count
      const documentsResponse = await fetch('/api/admin/documents', { headers })
      const documentsData = await documentsResponse.json()
      const totalDocuments = documentsData.success && documentsData.data ? documentsData.data.length : 0
      
      setStats({
        totalPosts,
        totalEvents,
        totalSubmissions,
        totalDocuments
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Set to 0 on error
      setStats({
        totalPosts: 0,
        totalEvents: 0,
        totalSubmissions: 0,
        totalDocuments: 0
      })
    } finally {
      setLoading(false)
    }
  }
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <Layout title="Admin Dashboard">
        <div className="flex justify-center items-center min-h-screen">
          <div className="spinner"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <div className="bg-wa-blue text-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm">Welcome, {user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Dashboard Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Blog Posts</h3>
              <p className="text-3xl font-bold text-wa-blue">{stats.totalPosts}</p>
              <Link href="/admin/blog" className="text-sm text-wa-green hover:underline mt-2 inline-block">
                Manage Posts →
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Events</h3>
              <p className="text-3xl font-bold text-wa-blue">{stats.totalEvents}</p>
              <Link href="/admin/events" className="text-sm text-wa-green hover:underline mt-2 inline-block">
                Manage Events →
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Form Submissions</h3>
              <p className="text-3xl font-bold text-wa-blue">{stats.totalSubmissions}</p>
              <Link href="/admin/submissions" className="text-sm text-wa-green hover:underline mt-2 inline-block">
                View Submissions →
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Documents</h3>
              <p className="text-3xl font-bold text-wa-blue">{stats.totalDocuments}</p>
              <Link href="/admin/documents" className="text-sm text-wa-green hover:underline mt-2 inline-block">
                Manage Documents →
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/blog/new" className="btn-primary text-center">
                Create New Blog Post
              </Link>
              <Link href="/admin/events/new" className="btn-secondary text-center">
                Add New Event
              </Link>
              <Link href="/admin/documents/upload" className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-all duration-200 font-medium text-center">
                Upload Document
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}