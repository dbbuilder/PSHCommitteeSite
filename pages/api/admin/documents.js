import fs from 'fs';
import path from 'path';
import { verifyToken } from '../../../lib/auth';

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

// Helper function to save documents
function saveDocuments(documents) {
  try {
    fs.writeFileSync(documentsPath, JSON.stringify(documents, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving documents:', error);
    return false;
  }
}

export default async function handler(req, res) {
  // Verify admin authentication for all methods
  const authResult = await verifyToken(req);
  if (!authResult.success) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const documents = getDocuments();
        
        // Add file existence check and full URL
        const documentsWithStatus = documents.map(doc => {
          const filePath = path.join(process.cwd(), 'public', 'documents', doc.filename);
          const fileExists = fs.existsSync(filePath);
          
          return {
            ...doc,
            fileExists,
            downloadUrl: `/documents/${doc.filename}`
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
          message: 'Failed to fetch documents' 
        });
      }

    case 'POST':
      try {
        const documents = getDocuments();
        const newDocument = {
          id: Date.now().toString(),
          ...req.body,
          uploadedAt: new Date().toISOString(),
          downloadCount: 0
        };
        
        documents.push(newDocument);
        
        if (saveDocuments(documents)) {
          return res.status(201).json({ 
            success: true, 
            document: newDocument 
          });
        } else {
          throw new Error('Failed to save document');
        }
      } catch (error) {
        console.error('Error creating document:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to create document' 
        });
      }

    case 'PUT':
      try {
        const { id } = req.query;
        const documents = getDocuments();
        const index = documents.findIndex(doc => doc.id === id);
        
        if (index === -1) {
          return res.status(404).json({ 
            success: false, 
            message: 'Document not found' 
          });
        }
        
        documents[index] = {
          ...documents[index],
          ...req.body,
          id: documents[index].id,
          uploadedAt: documents[index].uploadedAt
        };
        
        if (saveDocuments(documents)) {
          return res.status(200).json({ 
            success: true, 
            document: documents[index] 
          });
        } else {
          throw new Error('Failed to update document');
        }
      } catch (error) {
        console.error('Error updating document:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to update document' 
        });
      }

    case 'DELETE':
      try {
        const { id } = req.query;
        const documents = getDocuments();
        const index = documents.findIndex(doc => doc.id === id);
        
        if (index === -1) {
          return res.status(404).json({ 
            success: false, 
            message: 'Document not found' 
          });
        }
        
        // Get the document info before deleting
        const documentToDelete = documents[index];
        
        // Remove from array
        documents.splice(index, 1);
        
        if (saveDocuments(documents)) {
          // Optionally delete the actual file
          // const filePath = path.join(process.cwd(), 'public', 'documents', documentToDelete.filename);
          // if (fs.existsSync(filePath)) {
          //   fs.unlinkSync(filePath);
          // }
          
          return res.status(200).json({ 
            success: true, 
            message: 'Document deleted successfully' 
          });
        } else {
          throw new Error('Failed to delete document');
        }
      } catch (error) {
        console.error('Error deleting document:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to delete document' 
        });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ 
        success: false, 
        message: `Method ${method} Not Allowed` 
      });
  }
}
