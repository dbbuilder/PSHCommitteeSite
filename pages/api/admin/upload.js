import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import { verifyToken } from '../../../lib/auth';

// Disable body parsing, need to handle file upload
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to ensure directory exists
function ensureDirectoryExists(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating directory:', error);
  }
}

// Helper function to generate unique filename
function generateUniqueFilename(originalName) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const extension = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, extension);
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

    // In production/Vercel, we should use external storage (S3, Cloudinary, etc.)
    // For now, we'll try to use the public directory or temp directory
    const isProduction = process.env.NODE_ENV === 'production';
    const documentsDir = isProduction 
      ? '/tmp/documents' 
      : path.join(process.cwd(), 'public', 'documents');
    
    ensureDirectoryExists(documentsDir);

    const form = formidable({
      uploadDir: documentsDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      filter: function ({ name, originalFilename, mimetype }) {
        // Accept only certain file types
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
        return allowedTypes.includes(mimetype);
      }
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

    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(file.originalFilename || 'document');
    
    // In production, you would upload to cloud storage here
    if (isProduction) {
      console.warn('File uploaded to temp directory. In production, use cloud storage like S3 or Vercel Blob.');
      
      // For now, we'll just return success with the filename
      // In a real app, you'd upload to S3, Cloudinary, etc. here
      return res.status(200).json({
        success: true,
        message: 'File processed successfully (production mode - implement cloud storage)',
        filename: uniqueFilename,
        originalName: file.originalFilename,
        size: file.size,
        mimetype: file.mimetype,
        note: 'In production, files should be uploaded to cloud storage'
      });
    }

    // In development, save to public/documents
    const newPath = path.join(documentsDir, uniqueFilename);

    // Move file to final location
    try {
      // If file was uploaded with a temp name, rename it
      if (file.filepath !== newPath) {
        fs.renameSync(file.filepath, newPath);
      }
    } catch (moveError) {
      console.error('Error moving file:', moveError);
      // If rename fails, try copying and deleting
      try {
        fs.copyFileSync(file.filepath, newPath);
        fs.unlinkSync(file.filepath);
      } catch (copyError) {
        console.error('Error copying file:', copyError);
        throw copyError;
      }
    }

    // Return success with file info
    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      filename: uniqueFilename,
      originalName: file.originalFilename,
      size: file.size,
      mimetype: file.mimetype
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up any partially uploaded files
    try {
      const tempDir = process.env.NODE_ENV === 'production' ? '/tmp/documents' : path.join(process.cwd(), 'public', 'documents');
      if (fs.existsSync(tempDir)) {
        const tempFiles = fs.readdirSync(tempDir).filter(f => f.startsWith('upload_'));
        tempFiles.forEach(f => {
          try {
            fs.unlinkSync(path.join(tempDir, f));
          } catch (e) {
            // Ignore cleanup errors
          }
        });
      }
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload file',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
