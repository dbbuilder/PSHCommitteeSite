// Create new blog post page
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout'

export default function NewBlogPost() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    isDraft: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      
      // Process tags
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push('/admin/blog')
      } else {
        setError(data.message || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Layout title="Create New Blog Post">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
          <Link href="/admin/blog" className="text-wa-blue hover:text-wa-green">
            ← Back to Blog Posts
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-wa-blue focus:border-wa-blue"
                placeholder="Enter post title"
              />
            </div>
            {/* Excerpt */}
            <div className="mb-6">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows="3"
                value={formData.excerpt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-wa-blue focus:border-wa-blue"
                placeholder="Brief description of the post (leave empty to auto-generate)"
              />
            </div>

            {/* Content */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content * (Markdown supported)
              </label>
              <textarea
                id="content"
                name="content"
                rows="15"
                required
                value={formData.content}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-wa-blue focus:border-wa-blue font-mono text-sm"
                placeholder="Write your post content here..."
              />
              <p className="mt-2 text-sm text-gray-500">
                You can use Markdown for formatting. Headers: #, Bold: **text**, Links: [text](url)
              </p>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-wa-blue focus:border-wa-blue"
                placeholder="news, updates, housing"
              />
            </div>

            {/* Draft Checkbox */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isDraft"
                  checked={formData.isDraft}
                  onChange={handleChange}
                  className="mr-2 text-wa-blue focus:ring-wa-blue"
                />
                <span className="text-sm text-gray-700">Save as draft</span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Link href="/admin/blog" className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white bg-wa-blue rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}