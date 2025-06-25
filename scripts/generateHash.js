// Script to generate bcrypt hash for a password
const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'PSH@dm1n!';
const saltRounds = 10;

console.log('Generating hash for password:', password);

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  
  console.log('\nGenerated hash:');
  console.log(hash);
  
  console.log('\nEnvironment variable format:');
  console.log(`ADMIN_PASSWORD_HASH = ${hash}`);
  
  // Verify the hash works
  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      console.error('Error verifying hash:', err);
      return;
    }
    console.log('\nHash verification:', result ? '✅ Valid' : '❌ Invalid');
  });
});