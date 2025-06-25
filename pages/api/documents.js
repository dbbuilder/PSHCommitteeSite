import { getAllDocuments, initializeMetadata } from '../../lib/blobStorage';

export default async function handler(req, res) {
  // Enable CORS for public access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Initialize metadata on first request if needed
    await initializeMetadata();
    
    const documents = await getAllDocuments();
    
    return res.status(200).json({ 
      success: true, 
      documents: documents 
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch documents',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
