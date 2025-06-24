import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const submissionsDir = path.join(process.cwd(), 'data', 'submissions');

export default async function handler(req, res) {
  // Verify authentication
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const filePath = path.join(submissionsDir, `${id}.json`);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const submission = JSON.parse(content);
      submission.id = id;

      // Check if submission has been read
      const readFilePath = path.join(submissionsDir, `${id}.read`);
      submission.read = fs.existsSync(readFilePath);

      return res.status(200).json(submission);
    } catch (error) {
      console.error('Error reading submission:', error);
      return res.status(500).json({ error: 'Failed to read submission' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { action } = req.body;

      if (action === 'toggleRead') {
        const readFilePath = path.join(submissionsDir, `${id}.read`);
        
        if (fs.existsSync(readFilePath)) {
          // Mark as unread
          fs.unlinkSync(readFilePath);
        } else {
          // Mark as read
          fs.writeFileSync(readFilePath, new Date().toISOString());
        }

        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: 'Invalid action' });
    } catch (error) {
      console.error('Error updating submission:', error);
      return res.status(500).json({ error: 'Failed to update submission' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const filePath = path.join(submissionsDir, `${id}.json`);
      const readFilePath = path.join(submissionsDir, `${id}.read`);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      // Delete the submission file
      fs.unlinkSync(filePath);

      // Delete the read marker if it exists
      if (fs.existsSync(readFilePath)) {
        fs.unlinkSync(readFilePath);
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting submission:', error);
      return res.status(500).json({ error: 'Failed to delete submission' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}