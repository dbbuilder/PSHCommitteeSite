#!/usr/bin/env node

/**
 * Development helper script to manage port configuration
 * Default test port range: 12500-12600
 */

const { spawn } = require('child_process');
const readline = require('readline');

const DEFAULT_PORT = 12500;
const PORT_RANGE = { min: 12500, max: 12600 };

// Check if port is in use
async function isPortAvailable(port) {
  const net = require('net');
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

// Find available port in range
async function findAvailablePort() {
  for (let port = PORT_RANGE.min; port <= PORT_RANGE.max; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available ports in range ${PORT_RANGE.min}-${PORT_RANGE.max}`);
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'dev';
  
  console.log('🚀 PSH Committee Site Development Helper');
  console.log(`📍 Port range: ${PORT_RANGE.min}-${PORT_RANGE.max}`);
  console.log('');
  
  try {
    const port = await findAvailablePort();
    console.log(`✅ Found available port: ${port}`);
    
    // Set environment variable
    process.env.PORT = port;
    
    let npmCommand = '';
    let npmArgs = [];
    
    switch (command) {
      case 'dev':
        npmCommand = 'npm';
        npmArgs = ['run', 'dev:default', '--', '-p', port.toString()];
        console.log(`📝 Starting development server on http://localhost:${port}`);
        break;
        
      case 'test':
        // Update playwright to use this port
        process.env.PLAYWRIGHT_TEST_BASE_URL = `http://localhost:${port}`;
        npmCommand = 'npm';
        npmArgs = ['run', 'test'];
        console.log(`🧪 Running tests against http://localhost:${port}`);
        break;
        
      case 'test:ui':
        process.env.PLAYWRIGHT_TEST_BASE_URL = `http://localhost:${port}`;
        npmCommand = 'npm';
        npmArgs = ['run', 'test:ui'];
        console.log(`🎭 Opening Playwright UI for http://localhost:${port}`);
        break;
        
      default:
        console.log('Available commands:');
        console.log('  node dev-helper.js dev      - Start development server');
        console.log('  node dev-helper.js test     - Run Playwright tests');
        console.log('  node dev-helper.js test:ui  - Open Playwright UI');
        process.exit(0);
    }
    
    // Spawn the process
    const child = spawn(npmCommand, npmArgs, {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env }
    });
    
    child.on('close', (code) => {
      process.exit(code);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
