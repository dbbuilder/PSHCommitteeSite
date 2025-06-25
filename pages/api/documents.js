import { getAllDocuments } from '../../lib/documentsStore';

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
    const documents = getAllDocuments();
    
    // Add file existence check and full URL for public access
    const documentsWithStatus = documents.map(doc => {
      // In production/serverless, assume all files exist
      const fileExists = true;
      
      return {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        category: doc.category,
        filename: doc.filename,
        fileSize: doc.fileSize,
        uploadedAt: doc.uploadedAt,
        downloadUrl: `/documents/${doc.filename}`,
        fileExists
      };
    });
    
    return res.status(200).json({ 
      success: true, 
      documents: documentsWithStatus 
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch documents',
      error: error.message 
    });
  }
}
