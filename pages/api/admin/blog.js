// Blog API - Vercel Compatible
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'psh-advisory-committee-secret-key-change-in-production'

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

  // Import fs here to avoid issues
  const fs = require('fs')
  const path = require('path')
  const blogPath = path.join(process.cwd(), 'data', 'blog.json')

  try {
    if (req.method === 'GET') {
      const data = fs.readFileSync(blogPath, 'utf8')
      const parsed = JSON.parse(data)
      const posts = parsed.posts || []
      res.status(200).json({ success: true, data: posts })
      return
    }

    if (req.method === 'POST') {
      const { title, content, excerpt, tags, isDraft } = req.body
      
      if (!title || !content) {
        res.status(400).json({ success: false, message: 'Title and content are required' })
        return
      }
      
      const data = fs.readFileSync(blogPath, 'utf8')
      const parsed = JSON.parse(data)
      const posts = parsed.posts || []
      
      const newPost = {
        id: Date.now().toString(),
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        excerpt: excerpt || content.substring(0, 150) + '...',
        content,
        author: 'admin',
        date: new Date().toISOString(),
        publishedAt: new Date().toISOString().split('T')[0],
        tags: tags || [],
        isDraft: isDraft || false
      }
      
      posts.push(newPost)
      fs.writeFileSync(blogPath, JSON.stringify({ posts }, null, 2))
      
      res.status(201).json({ success: true, data: newPost })
      return
    }

    res.status(405).json({ success: false, message: 'Method not allowed' })
  } catch (error) {
    console.error('Blog API error:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}