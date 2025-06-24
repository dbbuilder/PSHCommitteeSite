// Simple icon generator - creates placeholder icons
const fs = require('fs');
const path = require('path');

// Create a simple 1x1 pixel transparent PNG
const createPlaceholderPNG = (size) => {
  // PNG header for a 1x1 transparent image
  const png = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width: 1
    0x00, 0x00, 0x00, 0x01, // height: 1
    0x08, 0x06, // bit depth: 8, color type: 6 (RGBA)
    0x00, 0x00, 0x00, // compression, filter, interlace
    0x1F, 0x15, 0xC4, 0x89, // CRC
    0x00, 0x00, 0x00, 0x0A, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x78, 0x9C, 0x62, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
    0xE5, 0x27, 0xDE, 0xFC, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  return png;
};

// Create ICO file (contains 16x16 and 32x32 icons)
const createICO = () => {
  // Simple ICO header
  const ico = Buffer.from([
    0x00, 0x00, // Reserved
    0x01, 0x00, // Type: 1 (ICO)
    0x02, 0x00, // Number of images: 2
    
    // First image (16x16)
    0x10, // Width: 16
    0x10, // Height: 16
    0x00, // Color palette
    0x00, // Reserved
    0x01, 0x00, // Color planes: 1
    0x20, 0x00, // Bits per pixel: 32
    0x30, 0x01, 0x00, 0x00, // Size of image data
    0x16, 0x00, 0x00, 0x00, // Offset to image data
    
    // Second image (32x32)
    0x20, // Width: 32
    0x20, // Height: 32
    0x00, // Color palette
    0x00, // Reserved
    0x01, 0x00, // Color planes: 1
    0x20, 0x00, // Bits per pixel: 32
    0x30, 0x05, 0x00, 0x00, // Size of image data
    0x46, 0x01, 0x00, 0x00, // Offset to image data
  ]);
  
  // Add minimal image data
  const imageData = Buffer.alloc(2000);
  return Buffer.concat([ico, imageData]);
};

const publicDir = path.join(__dirname, '..', 'public');

// Generate PNG files
const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 }
];

sizes.forEach(({ name, size }) => {
  const filePath = path.join(publicDir, name);
  fs.writeFileSync(filePath, createPlaceholderPNG(size));
  console.log(`Created ${name}`);
});

// Generate favicon.ico
const icoPath = path.join(publicDir, 'favicon.ico');
fs.writeFileSync(icoPath, createICO());
console.log('Created favicon.ico');

console.log('\nAll icon files generated successfully!');
console.log('Note: These are placeholder icons. For production, replace with proper branded icons.');