// Node.js script to generate BCrypt hash for PSH@dm1n!
// First run: npm install bcryptjs

const password = 'PSH@dm1n!';
const workFactor = 12;

// Simple inline bcrypt implementation for standalone execution
// This is a simplified version - for production, use the bcryptjs package

function generateSalt(rounds) {
    const chars = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let salt = '$2a$' + (rounds < 10 ? '0' + rounds : rounds) + '$';
    for (let i = 0; i < 22; i++) {
        salt += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return salt;
}

function simpleHash(password, salt) {
    // This is a demonstration - real BCrypt uses Blowfish algorithm
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(salt + password);
    return salt + hash.digest('base64').substring(0, 31);
}

console.log('=== Password Hash Generator for PSHCommitteeSite ===');
console.log(`Password: ${password}`);
console.log(`Work Factor: ${workFactor}`);
console.log('');

try {
    // Try to use real bcryptjs if available
    const bcrypt = require('bcryptjs');
    
    console.log('Using bcryptjs library...');
    const salt = bcrypt.genSaltSync(workFactor);
    const hash = bcrypt.hashSync(password, salt);
    
    console.log('Hash generated successfully!');
    console.log('');
    console.log('BCrypt Hash:');
    console.log(hash);
    console.log('');
    console.log('This is a proper BCrypt hash that can be used with BCrypt.Net-Next in your C# application.');
    
    // Save to file
    const fs = require('fs');
    const output = `PSHCommitteeSite Password Hash
Generated: ${new Date().toISOString()}
Algorithm: BCrypt
Work Factor: ${workFactor}
Hash: ${hash}
`;
    
    fs.writeFileSync('password-hash-bcrypt.txt', output, 'utf8');
    console.log('');
    console.log('Hash saved to: password-hash-bcrypt.txt');
    
} catch (error) {
    console.log('bcryptjs not found. Using simplified demonstration...');
    console.log('To generate a real BCrypt hash, run: npm install bcryptjs');
    console.log('');
    
    const salt = generateSalt(workFactor);
    const hash = simpleHash(password, salt);
    
    console.log('Demonstration Hash (NOT real BCrypt):');
    console.log(hash);
    console.log('');
    console.log('⚠️  This is NOT a real BCrypt hash. Install bcryptjs for proper hashing.');
}
