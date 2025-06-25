// Test script to verify API endpoints
const fs = require('fs')
const path = require('path')

// Read admin credentials from .env.local
const envPath = path.join(__dirname, '..', '.env.local')
let adminUsername = 'admin'
let adminPassword = 'admin123'

try {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const lines = envContent.split('\n')
  lines.forEach(line => {
    if (line.startsWith('ADMIN_USERNAME=')) {
      adminUsername = line.split('=')[1].trim()
    }
    if (line.startsWith('ADMIN_PASSWORD=')) {
      adminPassword = line.split('=')[1].trim()
    }
  })
} catch (error) {
  console.log('Using default admin credentials')
}

const baseUrl = 'http://localhost:3000'

async function getAuthToken() {
  try {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: adminUsername,
        password: adminPassword
      })
    })

    const data = await response.json()
    
    if (data.success && data.token) {
      console.log('✅ Login successful')
      return data.token
    } else {
      console.error('❌ Login failed:', data.message)
      return null
    }
  } catch (error) {
    console.error('❌ Login error:', error.message)
    return null
  }
}
async function testEndpoint(token, method, endpoint, body = null) {
  console.log(`\nTesting ${method} ${endpoint}`)
  
  try {
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
    
    if (body) {
      options.body = JSON.stringify(body)
    }
    
    const response = await fetch(`${baseUrl}${endpoint}`, options)
    const data = await response.json()
    
    console.log(`Status: ${response.status}`)
    console.log('Response:', JSON.stringify(data, null, 2))
    
    return { success: response.ok, data }
  } catch (error) {
    console.error('❌ Request error:', error.message)
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('🚀 Starting API tests...\n')
  
  // Get auth token
  const token = await getAuthToken()
  if (!token) {
    console.error('Cannot proceed without auth token')
    process.exit(1)
  }
  
  // Test auth endpoint
  await testEndpoint(token, 'GET', '/api/admin/test-auth')
  
  // Test blog endpoints
  const newPost = {
    title: 'Test Blog Post',
    content: 'This is a test blog post content.',
    tags: ['test', 'api'],
    isDraft: true
  }
  
  const createResult = await testEndpoint(token, 'POST', '/api/admin/blog', newPost)
  
  if (createResult.success && createResult.data.data) {
    const postId = createResult.data.data.id
    
    // Test GET single post
    await testEndpoint(token, 'GET', `/api/admin/blog?id=${postId}`)
    
    // Test UPDATE
    await testEndpoint(token, 'PUT', `/api/admin/blog?id=${postId}`, {
      title: 'Updated Test Blog Post'
    })
    
    // Test DELETE
    await testEndpoint(token, 'DELETE', `/api/admin/blog?id=${postId}`)
  }
  
  // Test events endpoints
  const newEvent = {
    title: 'Test Event',
    description: 'This is a test event',
    date: '2025-07-01',
    time: '2:00 PM',
    location: 'Test Location'
  }
  
  const eventResult = await testEndpoint(token, 'POST', '/api/admin/events', newEvent)
  
  if (eventResult.success && eventResult.data.data) {
    const eventId = eventResult.data.data.id
    
    // Test DELETE
    await testEndpoint(token, 'DELETE', `/api/admin/events?id=${eventId}`)
  }
  
  console.log('\n✅ Tests completed!')
}

// Run tests
runTests().catch(console.error)