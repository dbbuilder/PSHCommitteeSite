// Enhanced blog API with CRUD operations and correct data structure
import fs from 'fs'
import path from 'path'
import { withAuth, withCORS } from '../../../lib/middleware'

const blogPath = path.join(process.cwd(), 'data', 'blog.json')

// Helper function to read blog data
function readBlogData() {
  try {
    const data = fs.readFileSync(blogPath, 'utf8')
    const parsed = JSON.parse(data)
    // Handle both array and object with posts property
    return parsed.posts || parsed || []
  } catch (error) {
    console.error('Error reading blog data:', error)
    return []
  }
}

// Helper function to write blog data
function writeBlogData(posts) {
  try {
    // Maintain the original structure with posts wrapper
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
async function handler(req, res) {
  // Debug logging
  console.log('[Blog API] Request method:', req.method)
  console.log('[Blog API] Request headers:', req.headers)
  console.log('[Blog API] User:', req.user)
  
  const { method, body, query } = req

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
      console.log('[Blog API] POST body:', body)
      
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
        author: body.author || (req.user ? req.user.username : 'admin'),
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
}

// Apply authentication middleware with CORS
export default withCORS(withAuth(handler))