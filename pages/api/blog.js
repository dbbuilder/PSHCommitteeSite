import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const { method, query } = req
  const blogPath = path.join(process.cwd(), 'data', 'blog.json')
  
  switch (method) {
    case 'GET':
      try {
        const blogData = fs.readFileSync(blogPath, 'utf8')
        const data = JSON.parse(blogData)
        let posts = data.posts || []
        
        // If slug is provided, return single post
        if (query.slug) {
          const post = posts.find(p => p.slug === query.slug)
          if (post) {
            res.status(200).json(post)
          } else {
            res.status(404).json({ error: 'Post not found' })
          }
          return
        }
        
        // Sort by date (newest first)
        posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        
        // Apply limit if specified
        if (query.limit) {
          posts = posts.slice(0, parseInt(query.limit))
        }
        
        res.status(200).json(posts)
      } catch (error) {
        console.error('Blog API error:', error)
        res.status(500).json({ error: 'Failed to fetch blog posts', details: error.message })
      }
      break
      
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
