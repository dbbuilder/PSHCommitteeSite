// Migration script to move data from local JSON files to Vercel Blob Storage
// Run this script after deploying to Vercel with BLOB_READ_WRITE_TOKEN configured

import fs from 'fs';
import path from 'path';
import { 
  saveBlogPostsMetadata,
  initializeBlogMetadata
} from '../lib/blogBlobStorage.js';
import { 
  saveEventsMetadata,
  initializeEventsMetadata
} from '../lib/eventsBlobStorage.js';
import { 
  addSubmission,
  initializeSubmissionsMetadata
} from '../lib/submissionsBlobStorage.js';

async function migrateBlogPosts() {
  console.log('Migrating blog posts...');
  const blogPath = path.join(process.cwd(), 'data', 'blog.json');
  
  if (fs.existsSync(blogPath)) {
    try {
      const data = fs.readFileSync(blogPath, 'utf8');
      const parsed = JSON.parse(data);
      const posts = parsed.posts || [];
      
      if (posts.length > 0) {
        await saveBlogPostsMetadata(posts);
        console.log(`✓ Migrated ${posts.length} blog posts to blob storage`);
      } else {
        console.log('No blog posts to migrate');
      }
    } catch (error) {
      console.error('Error migrating blog posts:', error);
    }
  } else {
    console.log('No blog.json file found');
  }
}

async function migrateEvents() {
  console.log('Migrating events...');
  const eventsPath = path.join(process.cwd(), 'data', 'events.json');
  
  if (fs.existsSync(eventsPath)) {
    try {
      const data = fs.readFileSync(eventsPath, 'utf8');
      const parsed = JSON.parse(data);
      const events = parsed.events || [];
      
      if (events.length > 0) {
        await saveEventsMetadata(events);
        console.log(`✓ Migrated ${events.length} events to blob storage`);
      } else {
        console.log('No events to migrate');
      }
    } catch (error) {
      console.error('Error migrating events:', error);
    }
  } else {
    console.log('No events.json file found');
  }
}

async function migrateSubmissions() {
  console.log('Migrating submissions...');
  const submissionsDir = path.join(process.cwd(), 'data', 'submissions');
  
  if (fs.existsSync(submissionsDir)) {
    try {
      const files = fs.readdirSync(submissionsDir);
      let migratedCount = 0;
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(submissionsDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const submission = JSON.parse(content);
          
          // Check if submission has been read
          const readFilePath = path.join(submissionsDir, `${file.replace('.json', '')}.read`);
          submission.read = fs.existsSync(readFilePath);
          
          // Add submission to blob storage
          await addSubmission(submission);
          migratedCount++;
        }
      }
      
      if (migratedCount > 0) {
        console.log(`✓ Migrated ${migratedCount} submissions to blob storage`);
      } else {
        console.log('No submissions to migrate');
      }
    } catch (error) {
      console.error('Error migrating submissions:', error);
    }
  } else {
    console.log('No submissions directory found');
  }
}

async function runMigration() {
  console.log('Starting data migration to Vercel Blob Storage...\n');
  
  // Check if blob token is configured
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN is not configured!');
    console.error('Please set up Vercel Blob Storage and add the token to your environment variables.');
    process.exit(1);
  }
  
  // Initialize all blob storage modules
  await initializeBlogMetadata();
  await initializeEventsMetadata();
  await initializeSubmissionsMetadata();
  
  // Run migrations
  await migrateBlogPosts();
  await migrateEvents();
  await migrateSubmissions();
  
  console.log('\n✅ Migration complete!');
  console.log('Your data is now safely stored in Vercel Blob Storage.');
  console.log('The local JSON files can be removed after verifying the migration.');
}

// Run the migration
runMigration().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});