import formidable from 'formidable';
import { verifyAdminAuth } from '../../../lib/auth';
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
  console.log('Upload handler called:', req.method);
  
  // Set CORS headers immediately
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Verify admin authentication
    const authResult = verifyAdminAuth(req);
    if (!authResult.success) {
      console.log('Authentication failed');
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    console.log('Authentication successful');

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

    console.log('Parsing form...');
    
    // Parse the form with more explicit error handling
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      keepExtensions: true,
    });

    let fields, files;
    try {
      const parsed = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            console.error('Form parse error:', err);
            reject(err);
            return;
          }
          console.log('Form parsed successfully');
          console.log('Fields:', Object.keys(fields));
          console.log('Files:', Object.keys(files));
          resolve({ fields, files });
        });
      });
      
      fields = parsed.fields;
      files = parsed.files;
    } catch (parseError) {
      console.error('Failed to parse form:', parseError);
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to parse upload form: ' + parseError.message
      });
    }

    // Get the uploaded file
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    
    if (!file) {
      console.error('No file in upload');
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    console.log('File received:', {
      originalFilename: file.originalFilename,
      mimetype: file.mimetype,
      size: file.size,
      filepath: file.filepath
    });

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
      console.error('Invalid file type:', file.mimetype);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid file type. Allowed types: PDF, Word, Excel, PowerPoint, Text, RTF' 
      });
    }

    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(file.originalFilename || 'document');
    console.log('Generated filename:', uniqueFilename);
    
    // Read file as buffer
    let fileBuffer;
    try {
      fileBuffer = fs.readFileSync(file.filepath);
      console.log('File read successfully, size:', fileBuffer.length);
    } catch (readError) {
      console.error('Failed to read file:', readError);
      return res.status(500).json({
        success: false,
        message: 'Failed to read uploaded file: ' + readError.message
      });
    }
    
    // Upload to blob storage
    try {
      console.log('Uploading to blob storage...');
      const uploadResult = await uploadFileToBlob(fileBuffer, uniqueFilename, file.mimetype);
      console.log('Upload successful:', uploadResult);
      
      // Clean up temp file
      try {
        fs.unlinkSync(file.filepath);
        console.log('Temp file cleaned up');
      } catch (e) {
        console.warn('Failed to clean up temp file:', e.message);
      }
      
      // Return success response
      const response = {
        success: true,
        message: 'File uploaded successfully',
        filename: uploadResult.filename,
        originalName: file.originalFilename,
        size: file.size,
        mimetype: file.mimetype,
        blobUrl: uploadResult.url
      };
      
      console.log('Sending success response:', response);
      return res.status(200).json(response);
      
    } catch (uploadError) {
      // Clean up temp file even if upload fails
      try {
        fs.unlinkSync(file.filepath);
      } catch (e) {
        console.warn('Failed to clean up temp file:', e.message);
      }
      
      console.error('Blob upload error:', uploadError);
      console.error('Stack trace:', uploadError.stack);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to upload file to blob storage: ' + uploadError.message
      });
    }

  } catch (error) {
    console.error('Upload handler error:', error);
    console.error('Stack trace:', error.stack);
    
    // Always return a valid JSON response
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + (error.message || 'Failed to process upload')
    });
  }
}