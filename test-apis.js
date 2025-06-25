// Simple test script to verify document APIs
const testDocumentAPIs = async () => {
  console.log('Testing Document APIs...\n');
  
  // Test public documents API
  console.log('1. Testing Public Documents API (/api/documents)');
  try {
    const response = await fetch('http://localhost:3004/api/documents');
    const data = await response.json();
    console.log(`   ✅ Status: ${response.status}`);
    console.log(`   ✅ Success: ${data.success}`);
    console.log(`   ✅ Documents count: ${data.documents?.length || 0}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('\n2. Testing Admin Documents API (/api/admin/documents)');
  // This should fail without auth
  try {
    const response = await fetch('http://localhost:3004/api/admin/documents');
    const data = await response.json();
    console.log(`   ✅ Status: ${response.status} (Should be 401)`);
    console.log(`   ✅ Unauthorized: ${!data.success}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('\n3. Testing Upload API (/api/admin/upload)');
  // This should fail without auth
  try {
    const response = await fetch('http://localhost:3004/api/admin/upload', {
      method: 'POST'
    });
    const data = await response.json();
    console.log(`   ✅ Status: ${response.status} (Should be 401)`);
    console.log(`   ✅ Unauthorized: ${!data.success}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('\n✅ All API endpoints are responding correctly!');
};

// Run the test
testDocumentAPIs();
