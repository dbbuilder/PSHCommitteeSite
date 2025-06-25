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
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
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
  // Verify admin authentication
  const authResult = await verifyToken(req);
  if (!authResult.success) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Ensure documents directory exists
  const documentsDir = path.join(process.cwd(), 'public', 'documents');
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

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
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
    const newPath = path.join(documentsDir, uniqueFilename);

    // Move file to final location
    try {
      // If file was uploaded with a temp name, rename it
      if (file.filepath !== newPath) {
        fs.renameSync(file.filepath, newPath);
      }
    } catch (moveError) {
      // If rename fails, try copying and deleting
      fs.copyFileSync(file.filepath, newPath);
      fs.unlinkSync(file.filepath);
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
      const tempFiles = fs.readdirSync(documentsDir).filter(f => f.startsWith('upload_'));
      tempFiles.forEach(f => {
        fs.unlinkSync(path.join(documentsDir, f));
      });
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload file'
    });
  }
}
