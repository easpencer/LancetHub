const fs = require('fs');
const path = require('path');

/**
 * This script creates a minimal placeholder favicon file for development
 * Since we can't create binary files directly, this creates a dummy file
 */

// Create public directory if it doesn't exist
const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('Created public directory');
}

// Create a simple text file as a placeholder
const faviconPath = path.join(publicDir, 'favicon.ico');
fs.writeFileSync(faviconPath, 'Placeholder favicon file');
console.log(`Created placeholder favicon at ${faviconPath}`);

// Create apple-touch-icon.png placeholder
const appleTouchIconPath = path.join(publicDir, 'apple-touch-icon.png');
fs.writeFileSync(appleTouchIconPath, 'Placeholder apple touch icon');
console.log(`Created placeholder apple touch icon at ${appleTouchIconPath}`);

console.log('\nNOTE: These are just placeholder files.');
console.log('For production, replace them with actual favicon.ico and apple-touch-icon.png files.');
