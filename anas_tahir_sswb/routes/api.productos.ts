import express from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../logger.ts';

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/user — get current authenticated user
router.get('/user', (req: any, res) => {
  if (req.usuario) {
    res.json({
      success: true,
      data: {
        email: req.email,
        nombre: req.usuario,
        admin: req.admin
      }
    });
  } else {
    res.json({ success: false, data: null });
  }
});

// GET /api/productos — all products with pagination & sorting
// Query params: page, limit, sort (id_asc, id_desc, precio_asc, precio_desc), search, minPrice, maxPrice
router.get('/productos', async (req, res) => {
  try {
    const page   = Math.max(1, Number(req.query.page)  || 1);
    const limit  = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip   = (page - 1) * limit;
    const search = (req.query.search as string) || '';
    const sort   = (req.query.sort as string) || 'id_asc';
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

    const orderBy: any = {
      'id_asc':      { id: 'asc' },
      'id_desc':     { id: 'desc' },
      'precio_asc':  { precio: 'asc' },
      'precio_desc': { precio: 'desc' },
      'titulo_asc':  { título: 'asc' },
      'titulo_desc': { título: 'desc' }
    }[sort] || { id: 'asc' };

    const where: any = {};
    if (search) {
      where.OR = [
        { título:      { contains: search } },
        { descripción: { contains: search } }
      ];
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.precio = {};
      if (minPrice !== undefined) where.precio.gte = minPrice;
      if (maxPrice !== undefined) where.precio.lte = maxPrice;
    }

    const [total, data] = await Promise.all([
      prisma.producto.count({ where }),
      prisma.producto.findMany({ where, orderBy, skip, take: limit })
    ]);

    res.json({
      success: true,
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    logger.error(`API GET /productos: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/productos/:id — single product
router.get('/productos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const producto = await prisma.producto.findUnique({ where: { id } });
    if (!producto) return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    res.json({ success: true, data: producto });
  } catch (error: any) {
    logger.error(`API GET /productos/${req.params.id}: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/productos — create product
router.post('/productos', async (req, res) => {
  try {
    const { título, descripción, precio, imagen } = req.body;
    if (!título || !descripción || precio === undefined || !imagen) {
      return res.status(400).json({ success: false, error: 'Faltan campos requeridos: título, descripción, precio, imagen' });
    }
    const producto = await prisma.producto.create({
      data: { título, descripción, precio: Number(precio), imagen }
    });
    res.status(201).json({ success: true, data: producto });
  } catch (error: any) {
    logger.error(`API POST /productos: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/productos/:id — update product
router.put('/productos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { título, descripción, precio, imagen } = req.body;
    const existing = await prisma.producto.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    const producto = await prisma.producto.update({
      where: { id },
      data: {
        ...(título      && { título }),
        ...(descripción && { descripción }),
        ...(precio      !== undefined && { precio: Number(precio) }),
        ...(imagen      && { imagen })
      }
    });
    res.json({ success: true, data: producto });
  } catch (error: any) {
    logger.error(`API PUT /productos/${req.params.id}: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/productos/:id — delete product
router.delete('/productos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.producto.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    await prisma.producto.delete({ where: { id } });
    res.json({ success: true, message: `Producto ${id} eliminado` });
  } catch (error: any) {
    logger.error(`API DELETE /productos/${req.params.id}: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/carrito — get cart items (Tarea 8 DOM cart)
router.get('/carrito', async (req: any, res) => {
  if (!req.usuario) return res.status(401).json([]);
  try {
    const carrito = req.session.carrito || [];
    if (carrito.length === 0) return res.json([]);
    const ids = carrito.map((item: any) => item.id);
    const productos = await prisma.producto.findMany({ where: { id: { in: ids } } });
    const result = productos.map((p: any) => {
      const item = carrito.find((c: any) => c.id === p.id);
      return { ...p, cantidad: item?.cantidad || 1 };
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/carrito/:id — remove item from cart
router.delete('/carrito/:id', async (req: any, res) => {
  if (!req.usuario) return res.status(401).json({ error: 'No autenticado' });
  try {
    const id = Number(req.params.id);
    req.session.carrito = (req.session.carrito || []).filter((item: any) => item.id !== id);
    const cartCount = req.session.carrito.reduce((s: number, i: any) => s + i.cantidad, 0);
    const cartTotal = 0; // recalculated client-side
    res.json({ success: true, cartCount, cartTotal });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/productos/random — random product for Cuadros component (Tarea 9)
router.get('/random', async (req, res) => {
  try {
    const count = await prisma.producto.count();
    const skip  = Math.floor(Math.random() * count);
    const producto = await prisma.producto.findFirst({ skip });
    res.json({ success: true, data: producto });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
