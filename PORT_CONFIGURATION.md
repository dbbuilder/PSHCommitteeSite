# Port Configuration for Development & Testing

## Overview

To avoid port conflicts on development machines, this project is configured to use ports in the **12500-12600** range.

## Quick Start

### Windows
```cmd
# Start development server
dev.bat

# Run tests
dev.bat test

# Open Playwright UI
dev.bat test:ui
```

### Mac/Linux
```bash
# Start development server
npm run dev

# Run tests
npm run test

# Open Playwright UI
npm run test:ui
```

## Configuration Details

### Default Ports
- **Development Server**: 12500
- **Test Range**: 12500-12600

### Port Selection
The `dev-helper.js` script automatically finds an available port in the configured range.

### Manual Port Selection
```bash
# Specific port
npm run dev:default -- -p 12501

# Using environment variable
PORT=12502 npm run dev:default
```

## Files Updated

1. **`package.json`**
   - `dev` script now uses port 12500
   - Added `dev:default` for standard port
   - Added `dev:test` for test port

2. **`playwright.config.js`**
   - Base URL: `http://localhost:12500`
   - Web server configured for port 12500

3. **`.env.test`**
   - Sets PORT=12500 for test environment

4. **`scripts/dev-helper.js`**
   - Automatically finds available ports
   - Manages port configuration

5. **`dev.bat`**
   - Windows helper script

## Benefits

- ✅ No more "Port in use" errors
- ✅ Consistent test environment
- ✅ Multiple instances can run simultaneously
- ✅ Isolated from other local services

## Troubleshooting

### Port Still in Use?
```bash
# Check what's using the port (Windows)
netstat -ano | findstr :12500

# Kill process (Windows)
taskkill /PID <process_id> /F
```

### Change Port Range
Edit `scripts/dev-helper.js`:
```javascript
const PORT_RANGE = { min: 12500, max: 12600 };
```

## Testing

```bash
# Test the APIs on new port
node test-apis.js

# Run Playwright tests
npm run test
```

## Production

Production deployments are not affected. Vercel will assign its own ports.
