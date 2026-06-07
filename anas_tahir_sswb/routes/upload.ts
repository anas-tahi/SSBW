import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import logger from '../logger.ts';

const router = Router();

// Local disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'imagenes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
  }
});

// POST /upload/imagen
router.post('/imagen', upload.single('imagen'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }
    const url = `/public/imagenes/${req.file.filename}`;
    logger.info(`Imagen subida: ${url}`);
    res.json({ success: true, url });
  } catch (error: any) {
    logger.error('Error subiendo imagen:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
