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
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    // Check if blob storage is configured
    const hasBlobStorage = !!process.env.BLOB_READ_WRITE_TOKEN;
    
    if (!hasBlobStorage) {
      console.warn('Blob storage not configured - returning demo response');
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

    // Parse the form
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    let fields, files;
    try {
      [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            console.error('Form parse error:', err);
            reject(err);
          } else {
            resolve([fields, files]);
          }
        });
      });
    } catch (parseError) {
      console.error('Failed to parse form:', parseError);
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to parse upload form',
        error: parseError.message 
      });
    }

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
    let fileBuffer;
    try {
      fileBuffer = fs.readFileSync(file.filepath);
    } catch (readError) {
      console.error('Failed to read file:', readError);
      return res.status(500).json({
        success: false,
        message: 'Failed to read uploaded file',
        error: readError.message
      });
    }
    
    try {
      // Upload to Vercel Blob using the existing uploadFileToBlob function
      console.log('Uploading file to blob storage:', uniqueFilename);
      const uploadResult = await uploadFileToBlob(fileBuffer, uniqueFilename, file.mimetype);
      
      // Clean up temp file
      try {
        fs.unlinkSync(file.filepath);
      } catch (e) {
        console.warn('Failed to clean up temp file:', e.message);
      }
      
      // Return success with file info
      const response = {
        success: true,
        message: 'File uploaded successfully',
        filename: uploadResult.filename,
        originalName: file.originalFilename,
        size: file.size,
        mimetype: file.mimetype,
        blobUrl: uploadResult.url
      };
      
      console.log('Upload successful:', response);
      return res.status(200).json(response);
      
    } catch (uploadError) {
      // Clean up temp file even if upload fails
      try {
        fs.unlinkSync(file.filepath);
      } catch (e) {
        console.warn('Failed to clean up temp file:', e.message);
      }
      
      console.error('Blob upload error:', uploadError);
      
      // Return error response
      return res.status(500).json({
        success: false,
        message: 'Failed to upload file to blob storage',
        error: uploadError.message,
        details: process.env.NODE_ENV === 'development' ? uploadError.stack : undefined
      });
    }

  } catch (error) {
    console.error('Upload handler error:', error);
    
    // Always return a valid JSON response
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload file',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}