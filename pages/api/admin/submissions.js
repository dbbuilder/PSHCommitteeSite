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

  if (req.method === 'GET') {
    try {
      // Ensure submissions directory exists
      if (!fs.existsSync(submissionsDir)) {
        fs.mkdirSync(submissionsDir, { recursive: true });
      }

      // Read all submission files
      const files = fs.readdirSync(submissionsDir);
      const submissions = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(submissionsDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const submission = JSON.parse(content);
          
          // Add metadata from filename
          submission.id = file.replace('.json', '');
          
          // Check if submission has been read (by checking for .read file)
          const readFilePath = path.join(submissionsDir, `${submission.id}.read`);
          submission.read = fs.existsSync(readFilePath);
          
          submissions.push(submission);
        }
      }

      return res.status(200).json({ submissions });
    } catch (error) {
      console.error('Error reading submissions:', error);
      return res.status(500).json({ error: 'Failed to read submissions' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}