// Simple upload endpoint without formidable for testing
import { verifyToken } from '../../../lib/auth';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Verify admin authentication
    const authResult = await verifyToken(req);
    if (!authResult.success) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ 
        success: false, 
        message: 'Method not allowed' 
      });
    }

    // For this simple test, just return success
    return res.status(200).json({
      success: true,
      message: 'Simple upload endpoint working',
      method: req.method,
      contentType: req.headers['content-type'],
      bodySize: req.body ? JSON.stringify(req.body).length : 0,
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    });

  } catch (error) {
    console.error('Simple upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error: ' + error.message
    });
  }
}