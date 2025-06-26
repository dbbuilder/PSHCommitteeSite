// Test script for document upload functionality
// Run this to test the upload endpoint

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:12500';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'PSH@dm1n!';

async function getAuthToken() {
  console.log('Getting auth token...');
  
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD 
    }),
  });
  
  const result = await response.json();
  
  if (!response.ok || !result.success) {
    throw new Error('Failed to authenticate: ' + (result.message || 'Unknown error'));
  }
  
  return result.token;
}

async function testFileUpload(token) {
  console.log('\nTesting file upload...');
  
  // Create a test PDF file
  const testFilePath = path.join(__dirname, 'test-upload.pdf');
  const testContent = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF');
  fs.writeFileSync(testFilePath, testContent);
  
  try {
    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath), {
      filename: 'test-document.pdf',
      contentType: 'application/pdf',
    });
    
    // Upload file
    const uploadResponse = await fetch(`${API_URL}/api/admin/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...form.getHeaders(),
      },
      body: form,
    });
    
    console.log('Upload response status:', uploadResponse.status);
    
    const uploadResult = await uploadResponse.json();
    console.log('Upload response:', JSON.stringify(uploadResult, null, 2));
    
    if (!uploadResponse.ok) {
      throw new Error('Upload failed: ' + uploadResult.message);
    }
    
    if (uploadResult.warning) {
      console.warn('\n⚠️  Warning:', uploadResult.warning);
    }
    
    return uploadResult;
  } finally {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  }
}

async function testDocumentCreation(token, uploadResult) {
  console.log('\nCreating document record...');
  
  const docResponse = await fetch(`${API_URL}/api/admin/documents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Test Document Upload',
      description: 'This is a test document uploaded via script',
      category: 'Resources',
      filename: uploadResult.filename,
      fileSize: '1 KB',
      blobUrl: uploadResult.blobUrl,
    }),
  });
  
  const docResult = await docResponse.json();
  console.log('Document creation response:', JSON.stringify(docResult, null, 2));
  
  if (!docResponse.ok) {
    throw new Error('Document creation failed: ' + docResult.message);
  }
  
  return docResult;
}

async function runTest() {
  console.log('🧪 Document Upload Test');
  console.log('======================');
  console.log('API URL:', API_URL);
  console.log('');
  
  try {
    // Get auth token
    const token = await getAuthToken();
    console.log('✅ Authentication successful');
    
    // Test file upload
    const uploadResult = await testFileUpload(token);
    console.log('✅ File upload successful');
    
    // Test document creation
    const docResult = await testDocumentCreation(token, uploadResult);
    console.log('✅ Document creation successful');
    
    console.log('\n✅ All tests passed!');
    console.log('\nDocument created with ID:', docResult.data?.id || docResult.id);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Check if required modules are installed
try {
  require.resolve('form-data');
  require.resolve('node-fetch');
} catch (e) {
  console.error('Required modules not found. Please install:');
  console.error('npm install form-data node-fetch');
  process.exit(1);
}

// Run the test
runTest();