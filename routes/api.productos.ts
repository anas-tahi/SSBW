import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import logger from '../logger.js';

// Initialize Prisma Client with SQLite adapter
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

// Extend Express Request type to include our custom properties
declare global {
  namespace Express {
    interface Request {
      usuario?: any;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    carrito?: any;
    total_carrito?: number;
  }
}

const router = Router();

// API RESTful endpoints for products table
// GET /api/productos - Get all products with pagination, sorting, and filtering
router.get('/api/productos', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const sort = req.query.sort as string || 'id_asc';
    const search = req.query.search as string || '';
    const category = req.query.category as string || '';
    const minPrice = parseFloat(req.query.minPrice as string) || 0;
    const maxPrice = parseFloat(req.query.maxPrice as string) || 999999;

    logger.debug(`API: GET /api/productos - page: ${page}, limit: ${limit}, sort: ${sort}, search: "${search}", category: "${category}", minPrice: ${minPrice}, maxPrice: ${maxPrice}`);

    // Build where clause for filtering
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        {
          título: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          descripción: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    if (category) {
      whereClause.categoria = category;
    }

    if (minPrice > 0 || maxPrice < 999999) {
      whereClause.precio = {
        gte: minPrice,
        lte: maxPrice
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.producto.count({
      where: whereClause
    });

    // Get products with pagination
    const productos = await prisma.producto.findMany({
      where: whereClause,
      orderBy: sort === 'precio_asc' ? { precio: 'asc' } : 
             sort === 'precio_desc' ? { precio: 'desc' } :
             sort === 'titulo_asc' ? { título: 'asc' } :
             sort === 'titulo_desc' ? { título: 'desc' } :
             sort === 'id_asc' ? { id: 'asc' } : { id: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      omit: { descripción: true } // Don't include description for list view
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    logger.info(`API: Found ${productos.length} products, page ${page} of ${totalPages}`);

    res.json({
      success: true,
      data: productos,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
        totalItems: totalCount,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    logger.error('Error in GET /api/productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los productos',
      error: error.message
    });
  }
});

// GET /api/productos/:id - Get single product by ID
router.get('/api/productos/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }

    const producto = await prisma.producto.findUnique({
      where: { id: id }
    });

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    logger.info(`API: Product found: ${producto.título} (ID: ${id})`);

    res.json({
      success: true,
      data: producto
    });

  } catch (error) {
    logger.error('Error in GET /api/productos/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el producto',
      error: error.message
    });
  }
});

// POST /api/productos - Create new product
router.post('/api/productos', async (req: Request, res: Response) => {
  try {
    const { título, descripción, precio, imagen, categoria } = req.body;

    // Validation
    if (!título || título.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'El título debe tener al menos 3 caracteres'
      });
    }

    if (!precio || parseFloat(precio) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser mayor que 0'
      });
    }

    if (!categoria) {
      return res.status(400).json({
        success: false,
        message: 'La categoría es requerida'
      });
    }

    const nuevoProducto = await prisma.producto.create({
      data: {
        título: título.trim(),
        descripción: descripción?.trim() || '',
        precio: parseFloat(precio),
        imagen: imagen || '',
        categoria: categoria
      }
    });

    logger.info(`API: Product created: ${nuevoProducto.título}`);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: nuevoProducto
    });

  } catch (error) {
    logger.error('Error in POST /api/productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el producto',
      error: error.message
    });
  }
});

// PUT /api/productos/:id - Update existing product
router.put('/api/productos/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { título, descripción, precio, imagen, categoria } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }

    // Check if product exists
    const productoExistente = await prisma.producto.findUnique({
      where: { id: id }
    });

    if (!productoExistente) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Validation
    if (!título || título.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'El título debe tener al menos 3 caracteres'
      });
    }

    if (!precio || parseFloat(precio) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser mayor que 0'
      });
    }

    if (!categoria) {
      return res.status(400).json({
        success: false,
        message: 'La categoría es requerida'
      });
    }

    const productoActualizado = await prisma.producto.update({
      where: { id: id },
      data: {
        título: título.trim(),
        descripción: descripción?.trim() || '',
        precio: parseFloat(precio),
        imagen: imagen || productoExistente.imagen,
        categoria: categoria || productoExistente.categoria,
        actualizado_en: new Date()
      }
    });

    logger.info(`API: Product updated: ${productoActualizado.título}`);

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: productoActualizado
    });

  } catch (error) {
    logger.error('Error in PUT /api/productos/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el producto',
      error: error.message
    });
  }
});

// DELETE /api/productos/:id - Delete product
router.delete('/api/productos/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }

    // Check if product exists
    const productoExistente = await prisma.producto.findUnique({
      where: { id: id }
    });

    if (!productoExistente) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Check if product is in any active carts
    const activeCarts = await prisma.carrito.findMany({
      where: {
        items: {
          some: {
            producto: { id: id }
          }
        }
      }
    });

    if (activeCarts.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar un producto que está en un carrito activo'
      });
    }

    await prisma.producto.delete({
      where: { id: id }
    });

    logger.info(`API: Product deleted: ID ${id}`);

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });

  } catch (error) {
    logger.error('Error in DELETE /api/productos/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el producto',
      error: error.message
    });
  }
});

export default router;
