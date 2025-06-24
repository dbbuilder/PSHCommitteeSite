// Script to generate password hash for admin user
// Run with: node scripts/hashPassword.js <password>

const bcrypt = require('bcryptjs')

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    console.log('\nPassword Hash Generated:')
    console.log('========================')
    console.log(`Password: ${password}`)
    console.log(`Hash: ${hash}`)
    console.log('\nAdd this to your .env.local file:')
    console.log(`ADMIN_PASSWORD_HASH=${hash}`)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Get password from command line argument
const password = process.argv[2]

if (!password) {
  console.log('Usage: node scripts/hashPassword.js <password>')
  console.log('Example: node scripts/hashPassword.js admin123')
  process.exit(1)
}

hashPassword(password)