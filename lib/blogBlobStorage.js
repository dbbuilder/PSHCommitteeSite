import { list, put, del, head } from '@vercel/blob';

// Constants for blob storage
const BLOG_METADATA_KEY = 'blog/metadata.json';

// Default blog posts data
const defaultBlogPosts = [
  {
    "id": "1",
    "title": "Welcome to the PSH Advisory Committee",
    "slug": "welcome-to-the-psh-advisory-committee",
    "excerpt": "Learn about our mission to improve permanent supportive housing in Washington State...",
    "content": "The Permanent Supportive Housing (PSH) Advisory Committee was established to provide guidance and recommendations on the development and implementation of permanent supportive housing programs across Washington State.\n\nOur committee brings together experts from various fields including housing providers, social services, healthcare, and individuals with lived experience of homelessness.\n\n## Our Goals\n\n- Develop best practices for PSH implementation\n- Advise on policy recommendations\n- Foster collaboration between stakeholders\n- Ensure housing solutions are person-centered and effective\n\nWe meet monthly to discuss current challenges, review programs, and work towards our shared vision of ending homelessness through permanent supportive housing solutions.",
    "author": "PSH Committee",
    "date": "2024-01-15T10:00:00Z",
    "publishedAt": "2024-01-15",
    "tags": ["announcement", "committee", "housing"],
    "isDraft": false
  }
];

// In-memory fallback when blob storage is not configured
let memoryStore = null;

// Get blog posts metadata from blob storage or memory
export async function getBlogPostsMetadata() {
  try {
    // Check if we have a blob token
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured for blog, using in-memory storage');
      if (!memoryStore) {
        memoryStore = [...defaultBlogPosts];
      }
      return memoryStore;
    }

    // Try to fetch metadata from blob storage
    const response = await fetch(`https://blob.vercel-storage.com/${BLOG_METADATA_KEY}`, {
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok) {
      // If metadata doesn't exist, create it with default posts
      if (response.status === 404) {
        await saveBlogPostsMetadata(defaultBlogPosts);
        return defaultBlogPosts;
      }
      throw new Error(`Failed to fetch blog metadata: ${response.statusText}`);
    }

    const metadata = await response.json();
    return metadata.posts || metadata; // Handle both formats
  } catch (error) {
    console.error('Error fetching blog posts metadata:', error);
    // Fall back to memory store
    if (!memoryStore) {
      memoryStore = [...defaultBlogPosts];
    }
    return memoryStore;
  }
}

// Save blog posts metadata to blob storage or memory
export async function saveBlogPostsMetadata(posts) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured for blog, using in-memory storage');
      memoryStore = posts;
      return true;
    }

    const blob = await put(BLOG_METADATA_KEY, JSON.stringify({ posts }, null, 2), {
      access: 'public',
      contentType: 'application/json',
    });

    return true;
  } catch (error) {
    console.error('Error saving blog posts metadata:', error);
    // Fall back to memory store
    memoryStore = posts;
    return false;
  }
}

// Get all blog posts
export async function getAllBlogPosts() {
  const posts = await getBlogPostsMetadata();
  return posts;
}

// Get blog post by ID
export async function getBlogPostById(id) {
  const posts = await getBlogPostsMetadata();
  return posts.find(post => post.id === id);
}

// Get blog post by slug
export async function getBlogPostBySlug(slug) {
  const posts = await getBlogPostsMetadata();
  return posts.find(post => post.slug === slug);
}

// Add new blog post
export async function addBlogPost(postData) {
  const posts = await getBlogPostsMetadata();
  const newPost = {
    id: Date.now().toString(),
    ...postData,
    date: new Date().toISOString(),
    publishedAt: new Date().toISOString().split('T')[0],
  };
  
  posts.push(newPost);
  await saveBlogPostsMetadata(posts);
  
  return newPost;
}

// Update blog post
export async function updateBlogPost(id, updates) {
  const posts = await getBlogPostsMetadata();
  const index = posts.findIndex(post => post.id === id);
  
  if (index === -1) {
    return null;
  }
  
  posts[index] = {
    ...posts[index],
    ...updates,
    id: posts[index].id,
    date: posts[index].date,
  };
  
  await saveBlogPostsMetadata(posts);
  return posts[index];
}

// Delete blog post
export async function deleteBlogPost(id) {
  const posts = await getBlogPostsMetadata();
  const index = posts.findIndex(post => post.id === id);
  
  if (index === -1) {
    return false;
  }
  
  posts.splice(index, 1);
  await saveBlogPostsMetadata(posts);
  
  return true;
}

// Initialize metadata if needed (called on first request)
export async function initializeBlogMetadata() {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured for blog');
      if (!memoryStore) {
        memoryStore = [...defaultBlogPosts];
      }
      return;
    }

    // Check if metadata exists
    const response = await head(BLOG_METADATA_KEY).catch(err => null);
    if (!response) {
      // Create initial metadata
      await saveBlogPostsMetadata(defaultBlogPosts);
    }
  } catch (error) {
    // If error, initialize memory store
    if (!memoryStore) {
      memoryStore = [...defaultBlogPosts];
    }
  }
}
