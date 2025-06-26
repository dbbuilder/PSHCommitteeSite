import { verifyAdminAuth } from '../../../lib/auth';
import { 
  getAllDocuments, 
  getDocumentById, 
  addDocument, 
  updateDocument, 
  deleteDocument,
  initializeMetadata
} from '../../../lib/blobStorage';

export default async function handler(req, res) {
  try {
    // Verify admin authentication for all methods
    const authResult = verifyAdminAuth(req);
    if (!authResult.success) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Initialize metadata on first request if needed
    await initializeMetadata();

    const { method } = req;

    switch (method) {
      case 'GET':
        try {
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

      case 'POST':
        try {
          const newDocument = await addDocument(req.body);
          
          return res.status(201).json({ 
            success: true, 
            document: newDocument
          });
        } catch (error) {
          console.error('Error creating document:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to create document',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
          });
        }

      case 'PUT':
        try {
          const { id } = req.query;
          if (!id) {
            return res.status(400).json({ 
              success: false, 
              message: 'Document ID is required' 
            });
          }

          const updatedDocument = await updateDocument(id, req.body);
          
          if (!updatedDocument) {
            return res.status(404).json({ 
              success: false, 
              message: 'Document not found' 
            });
          }
          
          return res.status(200).json({ 
            success: true, 
            document: updatedDocument
          });
        } catch (error) {
          console.error('Error updating document:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to update document',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
          });
        }

      case 'DELETE':
        try {
          const { id } = req.query;
          if (!id) {
            return res.status(400).json({ 
              success: false, 
              message: 'Document ID is required' 
            });
          }

          const deleted = await deleteDocument(id);
          
          if (!deleted) {
            return res.status(404).json({ 
              success: false, 
              message: 'Document not found' 
            });
          }
          
          return res.status(200).json({ 
            success: true, 
            message: 'Document deleted successfully'
          });
        } catch (error) {
          console.error('Error deleting document:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to delete document',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
