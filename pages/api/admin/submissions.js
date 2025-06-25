// Admin submissions API
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'psh-advisory-committee-secret-key-change-in-production'

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Check authentication
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  try {
    const token = authHeader.substring(7)
    jwt.verify(token, JWT_SECRET)
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
    return
  }

  if (req.method === 'GET') {
    try {
      // Import fs here to avoid issues
      const fs = require('fs')
      const path = require('path')
      const submissionsDir = path.join(process.cwd(), 'data', 'submissions')

      // Ensure submissions directory exists
      if (!fs.existsSync(submissionsDir)) {
        fs.mkdirSync(submissionsDir, { recursive: true })
      }

      // Read all submission files
      const files = fs.readdirSync(submissionsDir)
      const submissions = []

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(submissionsDir, file)
          const content = fs.readFileSync(filePath, 'utf8')
          const submission = JSON.parse(content)
          
          // Add metadata from filename
          submission.id = file.replace('.json', '')
          
          // Check if submission has been read (by checking for .read file)
          const readFilePath = path.join(submissionsDir, `${submission.id}.read`)
          submission.read = fs.existsSync(readFilePath)
          
          submissions.push(submission)
        }
      }

      return res.status(200).json({ submissions })
    } catch (error) {
      console.error('Error reading submissions:', error)
      return res.status(500).json({ error: 'Failed to read submissions' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}