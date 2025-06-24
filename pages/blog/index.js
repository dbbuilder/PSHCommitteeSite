// Public blog listing page
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'

export default function BlogListing() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState(null)
  const [allTags, setAllTags] = useState([])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog')
      const data = await response.json()
      
      // Filter out draft posts
      const publishedPosts = data.filter(post => !post.isDraft)
      setPosts(publishedPosts)
      
      // Extract all unique tags
      const tags = new Set()
      publishedPosts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach(tag => tags.add(tag))
        }
      })
      setAllTags(Array.from(tags))    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter posts by selected tag
  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags && post.tags.includes(selectedTag))
    : posts

  if (loading) {
    return (
      <Layout title="Blog">
        <div className="flex justify-center items-center min-h-screen">
          <div className="spinner"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Blog">
      <div className="bg-wa-blue text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white">News & Updates</h1>
          <p className="text-xl mt-4 text-gray-100">
            Stay informed about the latest developments in permanent supportive housing
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {filteredPosts.length > 0 ? (
              <div className="space-y-8">
                {filteredPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4">
                      <span className="text-sm text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3">
                      <Link href={`/blog/${post.slug}`} className="hover:text-wa-green">
                        {post.title}
                      </Link>
                    </h2>
                    
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="mb-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm mr-2 mb-2 cursor-pointer hover:bg-wa-green hover:text-white transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <Link href={`/blog/${post.slug}`} className="text-wa-blue hover:text-wa-green font-medium">
                      Read More →
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">
                  {selectedTag
                    ? `No posts found with tag "${selectedTag}"`
                    : 'No blog posts available yet. Check back soon!'}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-semibold mb-4">Filter by Tag</h3>
              
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-sm text-wa-blue hover:text-wa-green mb-4"
                >
                  ← Show all posts
                </button>
              )}
              
              <div className="space-y-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedTag === tag
                        ? 'bg-wa-blue text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              
              {allTags.length === 0 && (
                <p className="text-gray-500 text-sm">No tags available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}