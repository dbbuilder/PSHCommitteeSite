// Blog API - Vercel Blob Storage Compatible
import jwt from 'jsonwebtoken'
import { 
  getAllBlogPosts, 
  addBlogPost, 
  updateBlogPost, 
  deleteBlogPost,
  initializeBlogMetadata 
} from '../../../lib/blogBlobStorage'

const JWT_SECRET = process.env.JWT_SECRET || 'psh-advisory-committee-secret-key-change-in-production'

// Initialize blob storage on first request
let initialized = false;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Check authentication
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Unauthorized' })
    return
  }

  try {
    const token = authHeader.substring(7)
    jwt.verify(token, JWT_SECRET)
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' })
    return
  }

  // Initialize blob storage if needed
  if (!initialized) {
    await initializeBlogMetadata();
    initialized = true;
  }

  try {
    if (req.method === 'GET') {
      const posts = await getAllBlogPosts();
      res.status(200).json({ success: true, data: posts })
      return
    }

    if (req.method === 'POST') {
      const { title, content, excerpt, tags, isDraft } = req.body
      
      if (!title || !content) {
        res.status(400).json({ success: false, message: 'Title and content are required' })
        return
      }
      
      const newPost = await addBlogPost({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        excerpt: excerpt || content.substring(0, 150) + '...',
        content,
        author: 'admin',
        tags: tags || [],
        isDraft: isDraft || false
      });
      
      res.status(201).json({ success: true, data: newPost })
      return
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body
      
      if (!id) {
        res.status(400).json({ success: false, message: 'Post ID is required' })
        return
      }
      
      const updatedPost = await updateBlogPost(id, updates);
      
      if (!updatedPost) {
        res.status(404).json({ success: false, message: 'Post not found' })
        return
      }
      
      res.status(200).json({ success: true, data: updatedPost })
      return
    }

    if (req.method === 'DELETE') {
      const { id } = req.body
      
      if (!id) {
        res.status(400).json({ success: false, message: 'Post ID is required' })
        return
      }
      
      const deleted = await deleteBlogPost(id);
      
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Post not found' })
        return
      }
      
      res.status(200).json({ success: true, message: 'Post deleted successfully' })
      return
    }

    res.status(405).json({ success: false, message: 'Method not allowed' })
  } catch (error) {
    console.error('Blog API error:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}