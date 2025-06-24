// Individual blog post page
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'

export default function BlogPost() {
  const router = useRouter()
  const { slug } = router.query
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog?slug=${slug}`)
      if (response.ok) {
        const data = await response.json()
        // Don't show draft posts
        if (!data.isDraft) {
          setPost(data)
        } else {
          router.push('/blog')
        }
      } else {
        router.push('/blog')
      }    } catch (error) {
      console.error('Error fetching post:', error)
      router.push('/blog')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="flex justify-center items-center min-h-screen">
          <div className="spinner"></div>
        </div>
      </Layout>
    )
  }

  if (!post) {
    return (
      <Layout title="Post Not Found">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog" className="text-wa-blue hover:text-wa-green">
            ← Back to Blog
          </Link>
        </div>
      </Layout>
    )
  }
  return (
    <Layout title={post.title}>
      {/* Hero Section */}
      <div className="bg-wa-blue text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <Link href="/blog" className="text-gray-300 hover:text-white mb-4 inline-block">
              ← Back to Blog
            </Link>
            <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex items-center text-gray-300 space-x-4">
              <span>By {post.author}</span>
              <span>•</span>
              <span>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-lg shadow-md p-8">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-6">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm mr-2 hover:bg-wa-green hover:text-white transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Post Content */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-wa-blue" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-wa-blue" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-4 mb-2 text-wa-blue" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="mb-4 list-disc list-inside space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="mb-4 list-decimal list-inside space-y-2" {...props} />,
                  li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                  a: ({node, ...props}) => <a className="text-wa-blue hover:text-wa-green underline" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-wa-green pl-4 my-4 italic text-gray-600" {...props} />
                  ),
                  code: ({node, inline, ...props}) => 
                    inline ? (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props} />
                    ) : (
                      <code className="block bg-gray-100 p-4 rounded-md overflow-x-auto text-sm" {...props} />
                    ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Link href="/blog" className="text-wa-blue hover:text-wa-green">
              ← All Posts
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}