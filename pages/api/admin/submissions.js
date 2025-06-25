// Admin submissions API - Vercel Blob Storage Compatible
import jwt from 'jsonwebtoken'
import { 
  getAllSubmissions, 
  getSubmissionById,
  markSubmissionAsRead,
  deleteSubmission,
  initializeSubmissionsMetadata 
} from '../../../lib/submissionsBlobStorage'

const JWT_SECRET = process.env.JWT_SECRET || 'psh-advisory-committee-secret-key-change-in-production'

// Initialize blob storage on first request
let initialized = false;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
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

  if (req.method === 'GET') {
    try {
      const submissions = await getAllSubmissions();
      
      // Sort by date (newest first)
      submissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      
      return res.status(200).json({ submissions })
    } catch (error) {
      console.error('Error reading submissions:', error)
      return res.status(500).json({ error: 'Failed to read submissions' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { id, action } = req.body
      
      if (!id || !action) {
        return res.status(400).json({ error: 'ID and action are required' })
      }
      
      if (action === 'markAsRead') {
        const updatedSubmission = await markSubmissionAsRead(id);
        if (!updatedSubmission) {
          return res.status(404).json({ error: 'Submission not found' })
        }
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
      const { id } = req.body
      
      if (!id) {
        return res.status(400).json({ error: 'Submission ID is required' })
      }
      
      const deleted = await deleteSubmission(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Submission not found' })
      }
      
      return res.status(200).json({ success: true, message: 'Submission deleted successfully' })
    } catch (error) {
      console.error('Error deleting submission:', error)
      return res.status(500).json({ error: 'Failed to delete submission' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}