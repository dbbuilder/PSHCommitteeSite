// Test endpoint to verify basic functionality
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

    // Return test response
    return res.status(200).json({
      success: true,
      message: 'Upload endpoint is working',
      timestamp: new Date().toISOString(),
      method: req.method,
      headers: req.headers,
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      nodeVersion: process.version
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return res.status(500).json({
      success: false,
      message: 'Test endpoint error: ' + error.message
    });
  }
}