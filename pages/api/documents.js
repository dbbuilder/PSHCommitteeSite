import fs from 'fs';
import path from 'path';

// Path to documents data file
const documentsPath = path.join(process.cwd(), 'data', 'documents.json');

// Helper function to read documents
function getDocuments() {
  try {
    const data = fs.readFileSync(documentsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading documents:', error);
    return [];
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const documents = getDocuments();
    
    // Add file existence check and full URL for public access
    const documentsWithStatus = documents.map(doc => {
      const filePath = path.join(process.cwd(), 'public', 'documents', doc.filename);
      const fileExists = fs.existsSync(filePath);
      
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
    
    // Only return documents where files exist
    const availableDocuments = documentsWithStatus.filter(doc => doc.fileExists);
    
    return res.status(200).json({ 
      success: true, 
      documents: availableDocuments 
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch documents' 
    });
  }
}
