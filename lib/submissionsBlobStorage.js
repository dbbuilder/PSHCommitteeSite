import { list, put, del, head } from '@vercel/blob';

// Constants for blob storage
const SUBMISSIONS_PREFIX = 'submissions/';
const SUBMISSIONS_METADATA_KEY = 'submissions/metadata.json';

// In-memory fallback when blob storage is not configured
let memoryStore = new Map();

// Get all submissions from blob storage or memory
export async function getAllSubmissions() {
  try {
    // Check if we have a blob token
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured for submissions, using in-memory storage');
      return Array.from(memoryStore.values());
    }

    // Try to fetch metadata from blob storage
    const response = await fetch(`https://blob.vercel-storage.com/${SUBMISSIONS_METADATA_KEY}`, {
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // No metadata yet, return empty array
        return [];
      }
      throw new Error(`Failed to fetch submissions metadata: ${response.statusText}`);
    }

    const metadata = await response.json();
    return metadata.submissions || [];
  } catch (error) {
    console.error('Error fetching submissions:', error);
    // Fall back to memory store
    return Array.from(memoryStore.values());
  }
}

// Save submissions metadata to blob storage
async function saveSubmissionsMetadata(submissions) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured for submissions, using in-memory storage');
      // Update memory store
      memoryStore.clear();
      submissions.forEach(sub => memoryStore.set(sub.id, sub));
      return true;
    }

    const blob = await put(SUBMISSIONS_METADATA_KEY, JSON.stringify({ submissions }, null, 2), {
      access: 'public',
      contentType: 'application/json',
    });

    return true;
  } catch (error) {
    console.error('Error saving submissions metadata:', error);
    // Fall back to memory store
    memoryStore.clear();
    submissions.forEach(sub => memoryStore.set(sub.id, sub));
    return false;
  }
}

// Get submission by ID
export async function getSubmissionById(id) {
  const submissions = await getAllSubmissions();
  return submissions.find(sub => sub.id === id);
}

// Add new submission
export async function addSubmission(submissionData) {
  const submissions = await getAllSubmissions();
  const newSubmission = {
    id: Date.now().toString(),
    ...submissionData,
    submittedAt: new Date().toISOString(),
    status: 'new',
    read: false
  };
  
  submissions.push(newSubmission);
  await saveSubmissionsMetadata(submissions);
  
  return newSubmission;
}

// Update submission (e.g., mark as read)
export async function updateSubmission(id, updates) {
  const submissions = await getAllSubmissions();
  const index = submissions.findIndex(sub => sub.id === id);
  
  if (index === -1) {
    return null;
  }
  
  submissions[index] = {
    ...submissions[index],
    ...updates,
    id: submissions[index].id,
    submittedAt: submissions[index].submittedAt,
  };
  
  await saveSubmissionsMetadata(submissions);
  return submissions[index];
}

// Mark submission as read
export async function markSubmissionAsRead(id) {
  return updateSubmission(id, { read: true });
}

// Delete submission
export async function deleteSubmission(id) {
  const submissions = await getAllSubmissions();
  const index = submissions.findIndex(sub => sub.id === id);
  
  if (index === -1) {
    return false;
  }
  
  submissions.splice(index, 1);
  await saveSubmissionsMetadata(submissions);
  
  return true;
}

// Initialize metadata if needed (called on first request)
export async function initializeSubmissionsMetadata() {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured for submissions');
      return;
    }

    // Check if metadata exists
    const response = await head(SUBMISSIONS_METADATA_KEY).catch(err => null);
    if (!response) {
      // Create initial empty metadata
      await saveSubmissionsMetadata([]);
    }
  } catch (error) {
    console.error('Error initializing submissions metadata:', error);
  }
}
