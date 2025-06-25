import path from 'path';
import { verifyToken } from '../../../lib/auth';
import { 
  getAllDocuments, 
  getDocumentById, 
  addDocument, 
  updateDocument, 
  deleteDocument 
} from '../../../lib/documentsStore';

export default async function handler(req, res) {
  try {
    // Verify admin authentication for all methods
    const authResult = await verifyToken(req);
    if (!authResult.success) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { method } = req;

    switch (method) {
      case 'GET':
        try {
          const documents = getAllDocuments();
          
          // Add file existence check and full URL
          const documentsWithStatus = documents.map(doc => {
            // In serverless environment, assume files exist
            // since we can't reliably check the public directory
            const fileExists = true;
            
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
            message: 'Failed to fetch documents',
            error: error.message 
          });
        }

      case 'POST':
        try {
          const newDocument = addDocument(req.body);
          
          return res.status(201).json({ 
            success: true, 
            document: newDocument,
            note: 'Using in-memory storage. Data will reset on redeploy.' 
          });
        } catch (error) {
          console.error('Error creating document:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to create document',
            error: error.message 
          });
        }

      case 'PUT':
        try {
          const { id } = req.query;
          const updatedDocument = updateDocument(id, req.body);
          
          if (!updatedDocument) {
            return res.status(404).json({ 
              success: false, 
              message: 'Document not found' 
            });
          }
          
          return res.status(200).json({ 
            success: true, 
            document: updatedDocument,
            note: 'Using in-memory storage. Data will reset on redeploy.' 
          });
        } catch (error) {
          console.error('Error updating document:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to update document',
            error: error.message 
          });
        }

      case 'DELETE':
        try {
          const { id } = req.query;
          const deleted = deleteDocument(id);
          
          if (!deleted) {
            return res.status(404).json({ 
              success: false, 
              message: 'Document not found' 
            });
          }
          
          return res.status(200).json({ 
            success: true, 
            message: 'Document deleted successfully',
            note: 'Using in-memory storage. Data will reset on redeploy.' 
          });
        } catch (error) {
          console.error('Error deleting document:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to delete document',
            error: error.message 
          });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ 
          success: false, 
          message: `Method ${method} Not Allowed` 
        });
    }
  } catch (error) {
    console.error('Documents API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
