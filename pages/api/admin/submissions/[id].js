// Admin submission detail API - Vercel Blob Storage Compatible
import jwt from 'jsonwebtoken'
import { 
  getSubmissionById,
  markSubmissionAsRead,
  updateSubmission,
  deleteSubmission,
  initializeSubmissionsMetadata 
} from '../../../../lib/submissionsBlobStorage'

const JWT_SECRET = process.env.JWT_SECRET || 'psh-advisory-committee-secret-key-change-in-production'

// Initialize blob storage on first request
let initialized = false;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS')
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

  // Initialize blob storage if needed
  if (!initialized) {
    await initializeSubmissionsMetadata();
    initialized = true;
  }

  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const submission = await getSubmissionById(id);
      
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' })
      }

      return res.status(200).json(submission)
    } catch (error) {
      console.error('Error reading submission:', error)
      return res.status(500).json({ error: 'Failed to read submission' })
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { action } = req.body

      if (action === 'toggleRead') {
        const submission = await getSubmissionById(id);
        
        if (!submission) {
          return res.status(404).json({ error: 'Submission not found' })
        }
        
        const updatedSubmission = await updateSubmission(id, { read: !submission.read });
        
        return res.status(200).json({ success: true, submission: updatedSubmission })
      }

      return res.status(400).json({ error: 'Invalid action' })
    } catch (error) {
      console.error('Error updating submission:', error)
      return res.status(500).json({ error: 'Failed to update submission' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const deleted = await deleteSubmission(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Submission not found' })
      }

      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error deleting submission:', error)
      return res.status(500).json({ error: 'Failed to delete submission' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}