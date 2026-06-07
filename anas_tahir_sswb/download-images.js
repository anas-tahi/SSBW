// Script to download images from tiendaprado.com
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read productos.json to get image filenames
const productosPath = path.join(__dirname, 'productos.json');
const productos = JSON.parse(fs.readFileSync(productosPath, 'utf-8'));

// Base URL for tiendaprado.com images
const BASE_URL = 'https://tiendaprado.com/uploads/products/';

// Create imagenes directory if it doesn't exist
const imagenesDir = path.join(__dirname, 'imagenes');
if (!fs.existsSync(imagenesDir)) {
  fs.mkdirSync(imagenesDir, { recursive: true });
}

// Function to download an image
function downloadImage(filename) {
  return new Promise((resolve, reject) => {
    const imageUrl = `${BASE_URL}${filename}`;
    const outputPath = path.join(imagenesDir, filename);
    
    console.log(`Downloading: ${filename}`);
    
    const protocol = imageUrl.startsWith('https') ? https : http;
    
    protocol.get(imageUrl, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve();
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(outputPath, () => {}); // Delete partial file
          console.error(`❌ Error saving ${filename}:`, err.message);
          reject(err);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        const redirectUrl = response.headers.location;
        console.log(`Following redirect to: ${redirectUrl}`);
        downloadImageFromUrl(redirectUrl, filename)
          .then(resolve)
          .catch(reject);
      } else {
        console.error(`❌ Failed to download ${filename}: Status ${response.statusCode}`);
        reject(new Error(`Status ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.error(`❌ Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
}

function downloadImageFromUrl(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const outputPath = path.join(imagenesDir, filename);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve();
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(outputPath, () => {});
          console.error(`❌ Error saving ${filename}:`, err.message);
          reject(err);
        });
      } else {
        console.error(`❌ Failed to download ${filename}: Status ${response.statusCode}`);
        reject(new Error(`Status ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.error(`❌ Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
}

// Get unique image filenames
const imageFiles = [...new Set(productos.map(p => p.imagen))];

console.log(`Found ${imageFiles.length} unique images to download\n`);

// Download all images
async function downloadAll() {
  let successCount = 0;
  let failCount = 0;
  
  for (const filename of imageFiles) {
    try {
      await downloadImage(filename);
      successCount++;
    } catch (error) {
      failCount++;
      console.error(`Failed to download ${filename}`);
    }
    
    // Add a small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n✅ Download complete: ${successCount} succeeded, ${failCount} failed`);
}

downloadAll().catch(console.error);