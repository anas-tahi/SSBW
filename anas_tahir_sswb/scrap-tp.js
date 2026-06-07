// Tarea 2: Web Scraper for Tienda Prado — Impresiones
// Run with: node scrap-tp.js
// Saves: productos.json + downloads images to imagenes/

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createWriteStream } from 'fs';
import { get } from 'https';
import { get as httpGet } from 'http';
import path from 'path';

const BASE_URL = 'https://tiendaprado.com';
const SECTION_URL = 'https://tiendaprado.com/es/385-impresiones?resultsPerPage=999';
const IMAGES_DIR = './imagenes';

// Helper to wait (simulates human behavior)
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate filename from title (as specified in Tarea 2)
const nombre_archivo_desde = (título) =>
  título.replace(/[^a-z0-9]/gi, '_').toLowerCase();

// Download image to local folder
async function descargarImagen(url, filename) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(IMAGES_DIR, filename);
    const file = createWriteStream(fullPath);
    
    const protocol = url.startsWith('https:') ? get : httpGet;
    
    protocol(url, (response) => {
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(fullPath); });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  // Create imagenes folder if it doesn't exist
  if (!existsSync(IMAGES_DIR)) mkdirSync(IMAGES_DIR);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.3'
  });
  const page = await context.newPage();

  console.log('🌐 Navigating to Tienda Prado Impresiones...');

  try {
    await page.goto(SECTION_URL, { timeout: 15000 });
  } catch (error) {
    console.error('❌ Error loading page:', error.message);
    process.exit(1);
  }

  page.once('load', () => console.log('✅ Page loaded'));
  await page.waitForTimeout(3000);

  // Collect all product page links
  const locators_productos = page.locator('.thumbnail-container > a');
  const lista_urls = [];

  for (const loc of await locators_productos.all()) {
    const href = await loc.getAttribute('href');
    if (href) lista_urls.push(href.startsWith('http') ? href : BASE_URL + href);
  }

  console.log(`📦 Found ${lista_urls.length} products. Scraping details...`);

  const productos = [];

  for (let i = 0; i < lista_urls.length; i++) {
    const url = lista_urls[i];
    console.log(`\n[${i + 1}/${lista_urls.length}] ${url}`);

    try {
      await page.goto(url, { timeout: 10000 });
      await page.waitForTimeout(1500);

      // Title
      const título = await page.locator('h1.page-title').innerText().catch(() => '');

      // Description
      const descripción = await page.locator('.product-description').innerText().catch(() => '');

      // Price
      const texto_precio = await page.locator('.current-price').innerText().catch(() => '0,00 €');

      // Image URL
      const imagenUrl = await page.locator('.product-cover img').getAttribute('src').catch(() => '');

      const ext = imagenUrl ? path.extname(imagenUrl.split('?')[0]) || '.jpg' : '.jpg';
      const imagen = nombre_archivo_desde(título.trim()) + ext;

      // Download image
      if (imagenUrl) {
        const fullImgUrl = imagenUrl.startsWith('http') ? imagenUrl : BASE_URL + imagenUrl;
        try {
          await descargarImagen(fullImgUrl, imagen);
          console.log(`  📷 Image saved: ${imagen}`);
        } catch (imgErr) {
          console.warn(`  ⚠️  Could not download image: ${imgErr.message}`);
        }
      }

      productos.push({
        título: título.trim(),
        descripción: descripción.trim(),
        texto_precio: texto_precio.trim(),
        imagen
      });

      console.log(`  ✅ ${título.trim()} — ${texto_precio.trim()}`);

      // Random wait between requests (polite scraping)
      await esperar(1000 + Math.random() * 1000);

    } catch (err) {
      console.error(`  ❌ Error scraping ${url}: ${err.message}`);
    }
  }

  await browser.close();

  // Save productos.json
  writeFileSync('./productos.json', JSON.stringify(productos, null, 2), 'utf-8');
  // Also save to data/ for the seed script
  writeFileSync('./data/products.json',
    JSON.stringify(productos.map(p => ({
      ...p,
      precio: Number(p.texto_precio.replace(/[^\d,]/g, '').replace(',', '.'))
    })), null, 2),
    'utf-8'
  );

  console.log(`\n🎉 Done! Scraped ${productos.length} products.`);
  console.log(`📄 Saved to: productos.json and data/products.json`);
  console.log(`🖼️  Images saved to: ${IMAGES_DIR}/`);
}

main().catch(console.error);
