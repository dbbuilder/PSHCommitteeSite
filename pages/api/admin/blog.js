// Enhanced blog API with CRUD operations - Fixed for Vercel
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

const blogPath = path.join(process.cwd(), 'data', 'blog.json')
const JWT_SECRET = process.env.JWT_SECRET || 'psh-advisory-committee-secret-key-change-in-production'

// Helper function to verify auth token
function verifyAuth(req) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}

// Helper function to read blog data
function readBlogData() {
  try {
    const data = fs.readFileSync(blogPath, 'utf8')
    const parsed = JSON.parse(data)
    return parsed.posts || parsed || []
  } catch (error) {
    console.error('Error reading blog data:', error)
    return []
  }
}

// Helper function to write blog data
function writeBlogData(posts) {
  try {
    const data = { posts }
    fs.writeFileSync(blogPath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing blog data:', error)
    return false
  }
}

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
export default async function handler(req, res) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Verify authentication
  const user = verifyAuth(req)
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - Please login to access this resource'
    })
  }

  const { method, body, query } = req

  try {
    switch (method) {
      case 'GET':
        // Get all posts or single post by ID
        const posts = readBlogData()
        
        if (query.id) {
          const post = posts.find(p => p.id === query.id || p.id === parseInt(query.id))
          if (post) {
            return res.status(200).json({ success: true, data: post })
          } else {
            return res.status(404).json({ success: false, message: 'Post not found' })
          }
        }
        
        return res.status(200).json({ success: true, data: posts })

      case 'POST':
        // Create new post
        const allPosts = readBlogData()
        
        // Validate required fields
        if (!body.title || !body.content) {
          return res.status(400).json({
            success: false,
            message: 'Title and content are required'
          })
        }        
        // Generate new post with unique ID
        const newId = Date.now().toString()
        const newPost = {
          id: newId,
          title: body.title,
          slug: body.slug || generateSlug(body.title),
          excerpt: body.excerpt || body.content.substring(0, 150) + '...',
          content: body.content,
          author: body.author || (user ? user.username : 'admin'),
          date: new Date().toISOString(),
          publishedAt: body.publishedAt || new Date().toISOString().split('T')[0],
          tags: body.tags || [],
          isDraft: body.isDraft || false
        }
        
        allPosts.push(newPost)
        
        if (writeBlogData(allPosts)) {
          return res.status(201).json({ success: true, data: newPost })
        } else {
          return res.status(500).json({ success: false, message: 'Failed to save post' })
        }

      case 'PUT':
        // Update existing post
        if (!query.id) {
          return res.status(400).json({ success: false, message: 'Post ID is required' })
        }
        
        const postsToUpdate = readBlogData()
        const postIndex = postsToUpdate.findIndex(p => p.id === query.id || p.id === parseInt(query.id))
        
        if (postIndex === -1) {
          return res.status(404).json({ success: false, message: 'Post not found' })
        }
        
        // Update post fields
        postsToUpdate[postIndex] = {
          ...postsToUpdate[postIndex],
          ...body,
          id: postsToUpdate[postIndex].id, // Preserve ID
          slug: body.slug || (body.title ? generateSlug(body.title) : postsToUpdate[postIndex].slug),
          updatedAt: new Date().toISOString()
        }
        
        if (writeBlogData(postsToUpdate)) {
          return res.status(200).json({ success: true, data: postsToUpdate[postIndex] })
        } else {
          return res.status(500).json({ success: false, message: 'Failed to update post' })
        }
      case 'DELETE':
        // Delete post
        if (!query.id) {
          return res.status(400).json({ success: false, message: 'Post ID is required' })
        }
        
        const postsToDelete = readBlogData()
        const filteredPosts = postsToDelete.filter(p => p.id !== query.id && p.id !== parseInt(query.id))
        
        if (filteredPosts.length === postsToDelete.length) {
          return res.status(404).json({ success: false, message: 'Post not found' })
        }
        
        if (writeBlogData(filteredPosts)) {
          return res.status(200).json({ success: true, message: 'Post deleted successfully' })
        } else {
          return res.status(500).json({ success: false, message: 'Failed to delete post' })
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` })
    }
  } catch (error) {
    console.error('Blog API error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}