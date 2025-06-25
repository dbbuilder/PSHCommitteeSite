// Blog API - Simplified for Vercel
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'psh-advisory-committee-secret-key-change-in-production'

export default function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Verify auth
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  try {
    const token = authHeader.substring(7)
    jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }

  const blogPath = path.join(process.cwd(), 'data', 'blog.json')
  
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(blogPath, 'utf8')
      const parsed = JSON.parse(data)
      const posts = parsed.posts || []
      return res.status(200).json({ success: true, data: posts })
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error reading posts' })
    }
  }
  
  if (req.method === 'POST') {
    try {
      const { title, content, excerpt, tags, isDraft } = req.body
      
      if (!title || !content) {
        return res.status(400).json({ 
          success: false, 
          message: 'Title and content are required' 
        })
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
      
      return res.status(201).json({ success: true, data: newPost })
    } catch (error) {
      console.error('Error creating post:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error creating post' 
      })
    }
  }
  
  return res.status(405).json({ 
    success: false, 
    message: `Method ${req.method} not allowed` 
  })
}

export const config = {
  api: {
    bodyParser: true,
  },
}