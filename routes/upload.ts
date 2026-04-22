import { Router, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { uploadImage, deleteImage } from '../services/cloudinary';
import logger from '../logger.js';

const router = Router();

// Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/temp/');
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter - only allow images
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPEG, PNG, WebP, GIF)'));
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// POST /api/upload/image - Upload image to Cloudinary
router.post('/api/upload/image', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen'
      });
    }

    logger.info(`Uploading image: ${req.file.originalname}`);
    
    // Upload to Cloudinary
    const folder = req.body.folder || 'tienda-prado/products';
    const result = await uploadImage(req.file.path, folder);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al subir la imagen',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Imagen subida exitosamente',
      data: {
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        format: result.format
      }
    });

  } catch (error: any) {
    logger.error('Error in image upload:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la imagen',
      error: error.message
    });
  }
});

// DELETE /api/upload/image/:publicId - Delete image from Cloudinary
router.delete('/api/upload/image/:publicId', async (req: Request, res: Response) => {
  try {
    const publicId = req.params.publicId as string;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'ID de imagen requerido'
      });
    }

    const result = await deleteImage(publicId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar la imagen',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Imagen eliminada exitosamente'
    });

  } catch (error: any) {
    logger.error('Error deleting image:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la imagen',
      error: error.message
    });
  }
});

// POST /api/upload/base64 - Upload base64 image
router.post('/api/upload/base64', async (req: Request, res: Response) => {
  try {
    const { image, folder = 'tienda-prado/products' } = req.body;
    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Datos de imagen base64 requeridos'
      });
    }

    logger.info('Uploading base64 image');
    
    const result = await uploadImage(image, folder);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al subir la imagen',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Imagen subida exitosamente',
      data: {
        url: result.url,
        publicId: result.publicId
      }
    });

  } catch (error: any) {
    logger.error('Error in base64 upload:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la imagen',
      error: error.message
    });
  }
});

export default router;
