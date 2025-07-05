const https = require('https');
const fs = require('fs');
const path = require('path');

// URLs for placeholder favicon and apple touch icon
const FAVICON_URL = 'https://fav.farm/🔬';  // Simple microscope emoji favicon
const APPLE_TOUCH_ICON_URL = 'https://fav.farm/🔬?size=180';  // Same icon, larger size

// Create public directory if it doesn't exist
const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('Created public directory');
}

// Function to download file
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(destination);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${destination}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(destination, () => {}); // Delete the file if there's an error
        reject(err);
      });
    }).on('error', reject);
  });
}

async function downloadFavicons() {
  try {
    // Download favicon.ico
    const faviconPath = path.join(publicDir, 'favicon.ico');
    await downloadFile(FAVICON_URL, faviconPath);

    // Download apple-touch-icon.png
    const appleTouchIconPath = path.join(publicDir, 'apple-touch-icon.png');
    await downloadFile(APPLE_TOUCH_ICON_URL, appleTouchIconPath);

    console.log('\nSuccessfully downloaded favicon files!');
  } catch (error) {
    console.error('Error downloading favicon:', error);
    console.log('\nUsing fallback method...');
    
    // Fallback to creating empty files
    try {
      const faviconPath = path.join(publicDir, 'favicon.ico');
      // Create an empty 16x16 transparent GIF as a minimal valid image (GIF header + minimal image data)
      const minimalGif = Buffer.from('47494638396110001000910000000000ffffffcc000000021f908400000021f90401000001002c00000000100010000002024401003b', 'hex');
      fs.writeFileSync(faviconPath, minimalGif);
      console.log(`Created minimal favicon at ${faviconPath}`);
      
      // Copy the same for apple-touch-icon.png
      const appleTouchIconPath = path.join(publicDir, 'apple-touch-icon.png');
      fs.writeFileSync(appleTouchIconPath, minimalGif);
      console.log(`Created minimal apple touch icon at ${appleTouchIconPath}`);
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }
  }
}

downloadFavicons();
