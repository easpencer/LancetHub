import fs from 'fs';
import path from 'path';

const DATA_DIRECTORY = path.join(process.cwd(), 'data');

export function ensureDataDirectoryExists() {
  // Check if data directory exists, if not create it
  if (!fs.existsSync(DATA_DIRECTORY)) {
    console.log('Creating data directory');
    try {
      fs.mkdirSync(DATA_DIRECTORY, { recursive: true });
    } catch (error) {
      console.error('Failed to create data directory:', error);
      return false;
    }
  }
  
  return true;
}

export function getDataFilePath(filename) {
  return path.join(DATA_DIRECTORY, filename);
}
