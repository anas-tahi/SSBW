import express from 'express';
import logger from '../logger.ts';

const router = express.Router();

// GET /api/image-proxy?url=<encoded_url> — proxy image from tiendaprado.com
router.get('/image-proxy', async (req, res) => {
  const imageUrl = req.query.url as string;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    logger.info(`Proxying image: ${imageUrl}`);
    
    // Fetch the image from the original URL
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://tiendaprado.com/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    logger.info(`Response status: ${response.status}`);

    if (!response.ok) {
      logger.error(`Failed to fetch image. Status: ${response.status}`);
      return res.status(response.status).json({ error: 'Failed to fetch image', status: response.status });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    logger.info(`Image fetched successfully. Content-Type: ${contentType}, Size: ${imageBuffer.byteLength} bytes`);

    // Return the image with proper headers
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(Buffer.from(imageBuffer));
  } catch (error: any) {
    logger.error(`Image proxy error: ${error.message}`);
    res.status(500).json({ error: 'Failed to proxy image', message: error.message });
  }
});

export default router;
