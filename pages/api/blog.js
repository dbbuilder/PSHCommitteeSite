// Public Blog API - Vercel Blob Storage Compatible
import { 
  getAllBlogPosts, 
  getBlogPostBySlug,
  initializeBlogMetadata 
} from '../../lib/blogBlobStorage'

// Initialize blob storage on first request
let initialized = false;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Initialize blob storage if needed
  if (!initialized) {
    await initializeBlogMetadata();
    initialized = true;
  }

  const { method, query } = req
  
  switch (method) {
    case 'GET':
      try {
        // If slug is provided, return single post
        if (query.slug) {
          const post = await getBlogPostBySlug(query.slug);
          if (post && !post.isDraft) {
            res.status(200).json(post)
          } else {
            res.status(404).json({ error: 'Post not found' })
          }
          return
        }
        
        // Get all posts
        let posts = await getAllBlogPosts();
        
        // Filter out drafts for public API
        posts = posts.filter(post => !post.isDraft);
        
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