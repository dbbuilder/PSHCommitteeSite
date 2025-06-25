import formidable from 'formidable';
import { verifyToken } from '../../../lib/auth';
import { uploadFileToBlob } from '../../../lib/blobStorage';
import fs from 'fs';

// Disable body parsing, need to handle file upload
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to generate unique filename
function generateUniqueFilename(originalName) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const extension = originalName.match(/\.[^.]+$/)?.[0] || '';
  const nameWithoutExt = originalName.replace(/\.[^.]+$/, '');
  // Clean filename to remove special characters
  const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '_');
  return `${cleanName}_${timestamp}_${random}${extension}`;
}

export default async function handler(req, res) {
  try {
    // Verify admin authentication
    const authResult = await verifyToken(req);
    if (!authResult.success) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    // Check if blob storage is configured
    const hasBlobStorage = !!process.env.BLOB_READ_WRITE_TOKEN;
    
    if (!hasBlobStorage) {
      return res.status(200).json({ 
        success: true, 
        message: 'File processed (Blob storage not configured - file not persisted)',
        filename: 'demo_file.pdf',
        originalName: 'demo_file.pdf',
        size: 0,
        mimetype: 'application/pdf',
        blobUrl: null,
        warning: 'To enable file uploads, configure BLOB_READ_WRITE_TOKEN in environment variables'
      });
    }

    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Form parse error:', err);
          reject(err);
        } else {
          resolve([fields, files]);
        }
      });
    });

    // Get the uploaded file
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    
    if (!file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'application/rtf'
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid file type. Allowed types: PDF, Word, Excel, PowerPoint, Text, RTF' 
      });
    }

    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(file.originalFilename || 'document');
    
    // Read file buffer
    const fileBuffer = fs.readFileSync(file.filepath);
    
    // Upload to Vercel Blob using buffer directly
    const { put } = await import('@vercel/blob');
    const blob = await put(`documents/files/${uniqueFilename}`, fileBuffer, {
      access: 'public',
      contentType: file.mimetype,
    });
    
    // Clean up temp file
    try {
      fs.unlinkSync(file.filepath);
    } catch (e) {
      // Ignore cleanup errors
    }
    
    // Return success with file info
    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      filename: uniqueFilename,
      originalName: file.originalFilename,
      size: file.size,
      mimetype: file.mimetype,
      blobUrl: blob.url
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload file',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
