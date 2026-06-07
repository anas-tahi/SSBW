import express from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../logger.ts';

const prisma = new PrismaClient();
const router = express.Router();

// GET / — portada with all products
router.get('/', async (req, res) => {
  try {
    const cards = await prisma.producto.findMany({
      omit: { descripción: true }
    });
    res.render('portada.njk', { title: 'Tienda Prado — Impresiones', cards, productos: cards });
  } catch (error: any) {
    logger.error(`Error en portada: ${error.message}`);
    res.status(500).send(`Error: ${error.message}`);
  }
});

// GET /producto/:id — detalle page
router.get('/producto/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const producto = await prisma.producto.findUnique({ where: { id } });
    if (!producto) return res.status(404).render('error.njk', { title: '404', message: 'Producto no encontrado' });
    res.render('detalle.njk', { title: producto.título, producto });
  } catch (error: any) {
    logger.error(`Error en detalle: ${error.message}`);
    res.status(500).send(`Error: ${error.message}`);
  }
});

// GET /buscar — search
router.get('/buscar', async (req: any, res) => {
  try {
    const busqueda = (req.query.busqueda as string) || '';
    const cards = busqueda
      ? await prisma.producto.findMany({
          where: {
            OR: [
              { título: { contains: busqueda } },
              { descripción: { contains: busqueda } }
            ]
          }
        })
      : await prisma.producto.findMany({ omit: { descripción: true } });
    res.render('portada.njk', { title: `Búsqueda: ${busqueda}`, cards, productos: cards, busqueda });
  } catch (error: any) {
    logger.error(`Error en búsqueda: ${error.message}`);
    res.status(500).send(`Error: ${error.message}`);
  }
});

// POST /al-carrito/:id — add to cart
router.post('/al-carrito/:id', async (req: any, res) => {
  const id = Number(req.params.id);
  const cantidad = Number(req.body.cantidad) || 1;
  logger.debug(`Al carrito: producto ${id}, cantidad ${cantidad}`);

  if (cantidad > 0) {
    if (!req.session.carrito) {
      req.session.carrito = [];
    }
    const existing = req.session.carrito.find((item: any) => item.id === id);
    if (existing) {
      existing.cantidad += cantidad;
    } else {
      req.session.carrito.push({ id, cantidad });
    }
    res.locals.total_carrito = req.session.carrito.reduce(
      (sum: number, item: any) => sum + item.cantidad, 0
    );
    logger.debug(`Carrito: ${res.locals.total_carrito} items`);
  }
  res.redirect(`/producto/${id}`);
});

// GET /carrito — show cart page
router.get('/carrito', async (req: any, res) => {
  try {
    const carrito = req.session.carrito || [];
    if (carrito.length === 0) {
      return res.render('carrito.njk', { title: 'Carrito de Compras', carrito: [] });
    }
    
    const ids = carrito.map((item: any) => item.id);
    const productos = await prisma.producto.findMany({
      where: { id: { in: ids } }
    });
    
    const carritoItems = carrito.map((item: any) => {
      const producto = productos.find(p => p.id === item.id);
      return producto ? { ...producto, cantidad: item.cantidad } : null;
    }).filter(Boolean);
    
    res.render('carrito.njk', { title: 'Carrito de Compras', carrito: carritoItems });
  } catch (error: any) {
    logger.error(`Error en carrito: ${error.message}`);
    res.status(500).send(`Error: ${error.message}`);
  }
});

// POST /carrito/eliminar/:id — remove from cart
router.post('/carrito/eliminar/:id', async (req: any, res) => {
  const id = Number(req.params.id);
  if (req.session.carrito) {
    req.session.carrito = req.session.carrito.filter((item: any) => item.id !== id);
  }
  res.redirect('/carrito');
});

// GET /pago — show payment/checkout page
router.get('/pago', async (req: any, res) => {
  try {
    if (!req.session.carrito || req.session.carrito.length === 0) {
      return res.redirect('/carrito');
    }
    
    const ids = req.session.carrito.map((item: any) => item.id);
    const productos = await prisma.producto.findMany({
      where: { id: { in: ids } }
    });
    
    const carritoItems = req.session.carrito.map((item: any) => {
      const producto = productos.find(p => p.id === item.id);
      return producto ? { ...producto, cantidad: item.cantidad } : null;
    }).filter(Boolean);
    
    const subtotal = carritoItems.reduce((sum: number, item: any) => sum + (item.precio * item.cantidad), 0);
    const iva = subtotal * 0.21;
    const total = subtotal + iva;
    
    res.render('modern-pago.njk', { 
      title: 'Finalizar Compra', 
      carrito: carritoItems,
      subtotal,
      iva,
      total
    });
  } catch (error: any) {
    logger.error(`Error en pago: ${error.message}`);
    res.status(500).send(`Error: ${error.message}`);
  }
});

// POST /pago/procesar — process payment
router.post('/pago/procesar', async (req: any, res) => {
  try {
    // Here you would integrate with a real payment gateway
    // For now, we'll just clear the cart and redirect to receipt
    
    if (!req.session.carrito || req.session.carrito.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío' });
    }
    
    // Store cart items for receipt
    const ids = req.session.carrito.map((item: any) => item.id);
    const productos = await prisma.producto.findMany({
      where: { id: { in: ids } }
    });
    
    const carritoItems = req.session.carrito.map((item: any) => {
      const producto = productos.find(p => p.id === item.id);
      return producto ? { ...producto, cantidad: item.cantidad } : null;
    }).filter(Boolean);
    
    // Store order details in session for receipt
    req.session.orden = {
      id: Date.now(),
      fecha: new Date(),
      items: carritoItems,
      subtotal: carritoItems.reduce((sum: number, item: any) => sum + (item.precio * item.cantidad), 0),
      iva: carritoItems.reduce((sum: number, item: any) => sum + (item.precio * item.cantidad), 0) * 0.21,
      total: carritoItems.reduce((sum: number, item: any) => sum + (item.precio * item.cantidad), 0) * 1.21
    };
    
    // Clear the cart
    req.session.carrito = [];
    
    // Redirect to receipt page
    res.redirect('/recibo');
  } catch (error: any) {
    logger.error(`Error procesando pago: ${error.message}`);
    res.status(500).json({ error: 'Error procesando el pago' });
  }
});

// GET /recibo — show receipt page
router.get('/recibo', async (req: any, res) => {
  try {
    const orden = req.session.orden;
    if (!orden) {
      // If no order in session, show a message instead of redirecting
      return res.render('factura-simple.njk', { 
        title: 'Recibo de Compra', 
        orden: null,
        usuario: req.usuario 
      });
    }
    
    res.render('factura-simple.njk', { 
      title: 'Recibo de Compra', 
      orden,
      usuario: req.usuario 
    });
  } catch (error: any) {
    logger.error(`Error en recibo: ${error.message}`);
    res.status(500).send(`Error: ${error.message}`);
  }
});


// GET /api/productos — get all products for React frontend
router.get('/api/productos', async (req, res) => {
  try {
    const productos = await prisma.producto.findMany();
    // Add full image URLs
    const productosWithUrls = productos.map(p => ({
      ...p,
      imagen: p.imagen ? `http://localhost:3000/imagenes/${encodeURIComponent(p.imagen)}` : null
    }));
    res.json({ success: true, data: productosWithUrls });
  } catch (error: any) {
    logger.error(`Error en API productos: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/productos/:id — get single product for React frontend
router.get('/api/productos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const producto = await prisma.producto.findUnique({ where: { id } });
    if (!producto) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    // Add full image URL
    const productoWithUrl = {
      ...producto,
      imagen: producto.imagen ? `http://localhost:3000/imagenes/${encodeURIComponent(producto.imagen)}` : null
    };
    res.json({ success: true, data: productoWithUrl });
  } catch (error: any) {
    logger.error(`Error en API producto: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

