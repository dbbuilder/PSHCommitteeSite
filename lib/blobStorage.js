import { list, put, del, head } from '@vercel/blob';

// Constants for blob storage
const METADATA_KEY = 'documents/metadata.json';
const DOCUMENTS_PREFIX = 'documents/files/';

// Default documents data
const defaultDocuments = [
  {
    "id": "1",
    "title": "Commerce Reports 2023 HD PSH Advisory Committee Final",
    "filename": "Attachment 11_CommerceReports_2023_HD_PSH_Advisory_Committee_Final.pdf",
    "description": "Final report from the 2023 HD PSH Advisory Committee",
    "category": "Reports",
    "uploadedAt": "2024-01-15T10:00:00Z",
    "fileSize": "2.5 MB",
    "downloadCount": 0
  },
  {
    "id": "2",
    "title": "PSH 101 Factsheet",
    "filename": "Attachment 12_PSH 101 Factsheet.pdf",
    "description": "Introduction to Permanent Supportive Housing",
    "category": "Factsheets",
    "uploadedAt": "2024-01-15T10:00:00Z",
    "fileSize": "1.2 MB",
    "downloadCount": 0
  },
  {
    "id": "3",
    "title": "Bill 1724-S.sl",
    "filename": "Attachment 1_ 1724-S.sl.pdf",
    "description": "Senate Bill 1724 - Substitute",
    "category": "Legislation",
    "uploadedAt": "2024-01-15T10:00:00Z",
    "fileSize": "856 KB",
    "downloadCount": 0
  },
  {
    "id": "4",
    "title": "RCW 36.70A.030",
    "filename": "Attachment 2_RCW 36.70A.030.pdf",
    "description": "Revised Code of Washington - Growth Management Act Definitions",
    "category": "Legislation",
    "uploadedAt": "2024-01-15T10:00:00Z",
    "fileSize": "432 KB",
    "downloadCount": 0
  },
  {
    "id": "5",
    "title": "RCW 43.330.425",
    "filename": "Attachment 3_RCW 43.330.425.pdf",
    "description": "Revised Code of Washington - Permanent Supportive Housing",
    "category": "Legislation",
    "uploadedAt": "2024-01-15T10:00:00Z",
    "fileSize": "320 KB",
    "downloadCount": 0
  },
  {
    "id": "6",
    "title": "Implementing Housing First in Permanent Supportive Housing",
    "filename": "Attachment 4_Implementing_Housing_First_in_Permanent_Supportive_Housing.pdf",
    "description": "Guide to implementing Housing First principles in PSH",
    "category": "Guidelines",
    "uploadedAt": "2024-01-15T10:00:00Z",
    "fileSize": "3.1 MB",
    "downloadCount": 0
  },
  {
    "id": "7",
    "title": "All-in Report - Page 45",
    "filename": "Attachment 5_All-in pg. 45.pdf",
    "description": "Excerpt from the All-in Report focusing on PSH strategies",
    "category": "Reports",
    "uploadedAt": "2024-01-15T10:00:00Z",
    "fileSize": "245 KB",
    "downloadCount": 0
  },
  {
    "id": "8",
    "title": "PSH Advisory Committee By-Laws",
    "filename": "Attachment 7_ PSH By-Laws- FINAL (1).pdf",
    "description": "Final by-laws for the PSH Advisory Committee",
    "category": "Governance",
    "uploadedAt": "2024-01-15T10:00:00Z",
    "fileSize": "1.8 MB",
    "downloadCount": 0
  }
];

// In-memory fallback when blob storage is not configured
let memoryStore = null;

// Get documents metadata from blob storage or memory
export async function getDocumentsMetadata() {
  try {
    // Check if we have a blob token
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured, using in-memory storage');
      if (!memoryStore) {
        memoryStore = [...defaultDocuments];
      }
      return memoryStore;
    }

    // Try to fetch metadata from blob storage
    const response = await fetch(`https://blob.vercel-storage.com/${METADATA_KEY}`, {
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok) {
      // If metadata doesn't exist, create it with default documents
      if (response.status === 404) {
        await saveDocumentsMetadata(defaultDocuments);
        return defaultDocuments;
      }
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }

    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error('Error fetching documents metadata:', error);
    // Fall back to memory store
    if (!memoryStore) {
      memoryStore = [...defaultDocuments];
    }
    return memoryStore;
  }
}

// Save documents metadata to blob storage or memory
export async function saveDocumentsMetadata(documents) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured, using in-memory storage');
      memoryStore = documents;
      return true;
    }

    const blob = await put(METADATA_KEY, JSON.stringify(documents, null, 2), {
      access: 'public',
      contentType: 'application/json',
    });

    return true;
  } catch (error) {
    console.error('Error saving documents metadata:', error);
    // Fall back to memory store
    memoryStore = documents;
    return false;
  }
}

// Upload a file to blob storage (updated to handle buffer)
export async function uploadFileToBlob(fileBuffer, filename, mimetype) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN not configured');
    }

    const blob = await put(`${DOCUMENTS_PREFIX}${filename}`, fileBuffer, {
      access: 'public',
      contentType: mimetype || 'application/octet-stream',
    });

    return {
      url: blob.url,
      filename: filename,
    };
  } catch (error) {
    console.error('Error uploading file to blob:', error);
    throw error;
  }
}

// Delete a file from blob storage
export async function deleteFileFromBlob(filename) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN not configured');
      return false;
    }

    await del(`${DOCUMENTS_PREFIX}${filename}`);
    return true;
  } catch (error) {
    console.error('Error deleting file from blob:', error);
    return false;
  }
}

// Get all documents with blob URLs
export async function getAllDocuments() {
  const documents = await getDocumentsMetadata();
  
  // For existing PDFs in public folder, use local URLs
  // For new uploads, they'll have blobUrl property
  return documents.map(doc => ({
    ...doc,
    downloadUrl: doc.blobUrl || `/documents/${doc.filename}`,
    fileExists: true, // Assume all files exist
  }));
}

// Get document by ID
export async function getDocumentById(id) {
  const documents = await getDocumentsMetadata();
  return documents.find(doc => doc.id === id);
}

// Add new document
export async function addDocument(documentData) {
  const documents = await getDocumentsMetadata();
  const newDoc = {
    id: Date.now().toString(),
    ...documentData,
    uploadedAt: new Date().toISOString(),
    downloadCount: 0,
  };
  
  documents.push(newDoc);
  await saveDocumentsMetadata(documents);
  
  return newDoc;
}

// Update document
export async function updateDocument(id, updates) {
  const documents = await getDocumentsMetadata();
  const index = documents.findIndex(doc => doc.id === id);
  
  if (index === -1) {
    return null;
  }
  
  documents[index] = {
    ...documents[index],
    ...updates,
    id: documents[index].id,
    uploadedAt: documents[index].uploadedAt,
  };
  
  await saveDocumentsMetadata(documents);
  return documents[index];
}

// Delete document
export async function deleteDocument(id) {
  const documents = await getDocumentsMetadata();
  const index = documents.findIndex(doc => doc.id === id);
  
  if (index === -1) {
    return false;
  }
  
  const doc = documents[index];
  
  // If it has a blob URL, delete the file from blob storage
  if (doc.blobUrl) {
    await deleteFileFromBlob(doc.filename);
  }
  
  documents.splice(index, 1);
  await saveDocumentsMetadata(documents);
  
  return true;
}

// Initialize metadata if needed (called on first request)
export async function initializeMetadata() {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured');
      if (!memoryStore) {
        memoryStore = [...defaultDocuments];
      }
      return;
    }

    // Check if metadata exists
    const response = await head(METADATA_KEY).catch(err => null);
    if (!response) {
      // Create initial metadata
      await saveDocumentsMetadata(defaultDocuments);
    }
  } catch (error) {
    // If error, initialize memory store
    if (!memoryStore) {
      memoryStore = [...defaultDocuments];
    }
  }
}
