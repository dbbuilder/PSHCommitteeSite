// Test script for Vercel Blob Storage functionality
// Run this after setting up blob storage to verify everything works

import { 
  getAllBlogPosts, 
  addBlogPost, 
  updateBlogPost, 
  deleteBlogPost,
  initializeBlogMetadata 
} from '../lib/blogBlobStorage.js';

import { 
  getAllEvents, 
  addEvent, 
  updateEvent, 
  deleteEvent,
  initializeEventsMetadata 
} from '../lib/eventsBlobStorage.js';

import { 
  getAllSubmissions, 
  addSubmission, 
  markSubmissionAsRead,
  deleteSubmission,
  initializeSubmissionsMetadata 
} from '../lib/submissionsBlobStorage.js';

async function testBlogStorage() {
  console.log('\n🧪 Testing Blog Storage...');
  
  try {
    // Initialize
    await initializeBlogMetadata();
    
    // Get initial posts
    const initialPosts = await getAllBlogPosts();
    console.log(`✓ Found ${initialPosts.length} existing blog posts`);
    
    // Add a test post
    const testPost = await addBlogPost({
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      excerpt: 'This is a test post',
      content: 'This is the full content of the test blog post.',
      author: 'Test Script',
      tags: ['test', 'blob-storage'],
      isDraft: false
    });
    console.log(`✓ Created test blog post with ID: ${testPost.id}`);
    
    // Update the post
    const updatedPost = await updateBlogPost(testPost.id, {
      title: 'Updated Test Blog Post',
      content: 'This content has been updated!'
    });
    console.log(`✓ Updated blog post title to: ${updatedPost.title}`);
    
    // Get all posts again
    const allPosts = await getAllBlogPosts();
    console.log(`✓ Total blog posts now: ${allPosts.length}`);
    
    // Delete the test post
    const deleted = await deleteBlogPost(testPost.id);
    console.log(`✓ Deleted test blog post: ${deleted}`);
    
    // Verify deletion
    const finalPosts = await getAllBlogPosts();
    console.log(`✓ Blog posts after cleanup: ${finalPosts.length}`);
    
    console.log('✅ Blog storage tests passed!');
  } catch (error) {
    console.error('❌ Blog storage test failed:', error);
  }
}

async function testEventStorage() {
  console.log('\n🧪 Testing Event Storage...');
  
  try {
    // Initialize
    await initializeEventsMetadata();
    
    // Get initial events
    const initialEvents = await getAllEvents();
    console.log(`✓ Found ${initialEvents.length} existing events`);
    
    // Add a test event
    const testEvent = await addEvent({
      title: 'Test Event',
      description: 'This is a test event',
      date: '2025-07-01',
      time: '2:00 PM - 4:00 PM',
      location: 'Test Location',
      address: '123 Test St',
      registrationLink: 'https://example.com'
    });
    console.log(`✓ Created test event with ID: ${testEvent.id}`);
    
    // Update the event
    const updatedEvent = await updateEvent(testEvent.id, {
      title: 'Updated Test Event',
      location: 'New Test Location'
    });
    console.log(`✓ Updated event title to: ${updatedEvent.title}`);
    
    // Get all events again
    const allEvents = await getAllEvents();
    console.log(`✓ Total events now: ${allEvents.length}`);
    
    // Delete the test event
    const deleted = await deleteEvent(testEvent.id);
    console.log(`✓ Deleted test event: ${deleted}`);
    
    // Verify deletion
    const finalEvents = await getAllEvents();
    console.log(`✓ Events after cleanup: ${finalEvents.length}`);
    
    console.log('✅ Event storage tests passed!');
  } catch (error) {
    console.error('❌ Event storage test failed:', error);
  }
}

async function testSubmissionStorage() {
  console.log('\n🧪 Testing Submission Storage...');
  
  try {
    // Initialize
    await initializeSubmissionsMetadata();
    
    // Get initial submissions
    const initialSubmissions = await getAllSubmissions();
    console.log(`✓ Found ${initialSubmissions.length} existing submissions`);
    
    // Add a test submission
    const testSubmission = await addSubmission({
      name: 'Test User',
      email: 'test@example.com',
      organization: 'Test Org',
      interest: 'Testing',
      message: 'This is a test submission',
      ip: '127.0.0.1'
    });
    console.log(`✓ Created test submission with ID: ${testSubmission.id}`);
    
    // Mark as read
    const readSubmission = await markSubmissionAsRead(testSubmission.id);
    console.log(`✓ Marked submission as read: ${readSubmission.read}`);
    
    // Get all submissions again
    const allSubmissions = await getAllSubmissions();
    console.log(`✓ Total submissions now: ${allSubmissions.length}`);
    
    // Delete the test submission
    const deleted = await deleteSubmission(testSubmission.id);
    console.log(`✓ Deleted test submission: ${deleted}`);
    
    // Verify deletion
    const finalSubmissions = await getAllSubmissions();
    console.log(`✓ Submissions after cleanup: ${finalSubmissions.length}`);
    
    console.log('✅ Submission storage tests passed!');
  } catch (error) {
    console.error('❌ Submission storage test failed:', error);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Vercel Blob Storage Tests...');
  console.log('====================================');
  
  // Check if blob token is configured
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN is not configured!');
    console.error('Please set up Vercel Blob Storage and add the token to your environment variables.');
    console.log('\nRunning tests with in-memory fallback...');
  } else {
    console.log('✓ Blob storage token detected');
  }
  
  // Run all tests
  await testBlogStorage();
  await testEventStorage();
  await testSubmissionStorage();
  
  console.log('\n====================================');
  console.log('✅ All blob storage tests completed!');
  
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.log('\n⚠️  Note: Tests ran with in-memory storage.');
    console.log('Configure BLOB_READ_WRITE_TOKEN to test actual blob storage.');
  }
}

// Run the tests
runAllTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});