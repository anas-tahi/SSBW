import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import logger from '../logger.js';
import { PDFGenerator } from '../utils/pdf-generator.js';
import fs from 'fs';
import path from 'path';

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

// Route GET '/' → render portada.njk with product cards
router.get('/', async (req: Request, res: Response) => {
  try {
    logger.debug('Loading homepage products');
    // Get all products without description for card display
    const productos = await prisma.producto.findMany({
      omit: { descripción: true }
    });
    
    logger.info(`Loaded ${productos.length} products for homepage`);
    res.render('portada.njk', {
      title: 'Tienda Prado → Impresiones',
      productos: productos
    });
  } catch (error: any) {
    logger.error('Error loading products:', error);
    res.status(500).render('portada.njk', {
      title: 'Tienda Prado → Impresiones',
      productos: [],
      error: 'Error al cargar los productos'
    });
  }
});

// Route GET '/producto/:id' → render detalle.njk with full product info
router.get('/producto/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    logger.debug(`Loading product detail for ID: ${id}`);
    
    if (isNaN(id)) {
      logger.warn(`Invalid product ID: ${req.params.id}`);
      return res.status(400).render('error.njk', {
        title: 'Error',
        message: 'ID de producto inválido'
      });
    }
    
    const producto = await prisma.producto.findUnique({
      where: { id: id }
    });
    
    if (!producto) {
      logger.warn(`Product not found: ID ${id}`);
      return res.status(404).render('error.njk', {
        title: 'Producto no encontrado',
        message: 'El producto solicitado no existe'
      });
    }
    
    logger.info(`Product loaded: ${producto.título} (ID: ${id})`);
    res.render('detalle.njk', {
      title: producto.título + ' - Tienda Prado',
      producto: producto
    });
  } catch (error: any) {
    logger.error('Error loading product:', error);
    res.status(500).render('error.njk', {
      title: 'Error',
      message: 'Error al cargar el producto'
    });
  }
});

// Route GET '/buscar' → search by title or description using Prisma full-text search
router.get('/buscar', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    logger.debug(`Search query: "${query}"`);
    
    if (!query || query.trim() === '') {
      logger.warn('Empty search query');
      return res.render('buscar.njk', {
        title: 'Buscar - Tienda Prado',
        productos: [],
        query: '',
        message: 'Por favor ingresa un término de búsqueda'
      });
    }
    
    // Search products using full-text search
    const productos = await prisma.producto.findMany({
      where: {
        OR: [
          {
            título: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            descripción: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      }
    });
    
    logger.info(`Search results: ${productos.length} products found for "${query}"`);
    res.render('buscar.njk', {
      title: `Resultados de búsqueda: "${query}" - Tienda Prado`,
      productos: productos,
      query: query
    });
  } catch (error: any) {
    logger.error('Error searching products:', error);
    res.status(500).render('buscar.njk', {
      title: 'Buscar - Tienda Prado',
      productos: [],
      query: req.query.q || '',
      error: 'Error al realizar la búsqueda'
    });
  }
});

// Route POST '/al-carrito/:id' → add product to cart
router.post('/al-carrito/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const cantidad = parseInt(req.body.cantidad as string) || 1; // Default to 1 if not provided
    
    logger.debug(`Adding to cart - Product ID: ${id}, Quantity: ${cantidad}`);
    
    // Validate inputs
    if (isNaN(id) || cantidad <= 0) {
      logger.warn(`Invalid cart data - ID: ${id}, Quantity: ${cantidad}`);
      return res.redirect('/');
    }
    
    // Get product info
    const producto = await prisma.producto.findUnique({
      where: { id: id }
    });
    
    if (!producto) {
      logger.error(`Product not found for cart: ID ${id}`);
      return res.redirect('/');
    }
    
    // Initialize cart if it doesn't exist
    if (!(req.session as any).carrito) {
      (req.session as any).carrito = [];
      logger.debug('Cart initialized');
    }
    
    // Check if product is already in cart
    const existingItem = (req.session as any).carrito.find((item: any) => item.id === id);
    
    if (existingItem) {
      // Update quantity if already in cart
      existingItem.cantidad += cantidad;
      logger.info(`Updated cart item: ${producto.título}, new quantity: ${existingItem.cantidad}`);
    } else {
      // Add new item to cart
      (req.session as any).carrito.push({
        id: id,
        cantidad: cantidad,
        título: producto.título,
        precio: parseFloat(producto.precio.toString()),
        imagen: producto.imagen
      });
      logger.info(`Added to cart: ${producto.título}, quantity: ${cantidad}`);
    }
    
    // Compute total cart items
    (req.session as any).total_carrito = (req.session as any).carrito.reduce((total: number, item: any) => total + item.cantidad, 0);
    res.locals.total_carrito = (req.session as any).total_carrito;
    
    logger.info(`Cart total items: ${req.session.total_carrito}`);
    
    // Redirect back to home page
    res.redirect('/');
    
  } catch (error: any) {
    logger.error('Error adding to cart:', error);
    res.redirect('/');
  }
});

// Route GET '/contacto' → render contact page
router.get('/contacto', (req: Request, res: Response) => {
  try {
    logger.debug('Loading contact page');
    res.render('contacto.njk', {
      title: 'Contacto - Tienda Prado'
    });
  } catch (error: any) {
    logger.error('Error loading contact page:', error);
    res.status(500).render('error.njk', {
      title: 'Error',
      message: 'Error al cargar la página de contacto'
    });
  }
});

// Route POST '/contacto' → handle contact form submission
router.post('/contacto', (req: Request, res: Response) => {
  try {
    logger.info('Contact form submitted:', req.body);
    
    // Here you would typically:
    // 1. Validate form data
    // 2. Send email notification
    // 3. Save to database
    // 4. Send confirmation to user
    
    res.render('contacto.njk', {
      title: 'Contacto - Tienda Prado',
      success: '¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.',
      formData: req.body
    });
  } catch (error: any) {
    logger.error('Error processing contact form:', error);
    res.status(500).render('contacto.njk', {
      title: 'Contacto - Tienda Prado',
      error: 'Error al enviar el mensaje. Por favor intenta de nuevo.'
    });
  }
});

// Route POST '/carrito/eliminar/:id' → remove product from cart
router.post('/carrito/eliminar/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    
    logger.debug(`Removing from cart - Product ID: ${id}`);
    
    if (isNaN(id)) {
      logger.warn(`Invalid product ID for removal: ${id}`);
      return res.redirect('/carrito');
    }
    
    // Get cart from session
    const carrito = (req.session as any).carrito || [];
    
    // Remove product from cart
    const initialLength = carrito.length;
    (req.session as any).carrito = carrito.filter((item: any) => item.id !== id);
    
    if ((req.session as any).carrito.length < initialLength) {
      logger.info(`Product removed from cart: ID ${id}`);
      
      // Update total cart items
      (req.session as any).total_carrito = (req.session as any).carrito.reduce((total: number, item: any) => total + item.cantidad, 0);
      res.locals.total_carrito = (req.session as any).total_carrito;
      
      logger.info(`Cart total items after removal: ${(req.session as any).total_carrito}`);
    } else {
      logger.warn(`Product not found in cart for removal: ID ${id}`);
    }
    
    res.redirect('/carrito');
    
  } catch (error: any) {
    logger.error('Error removing from cart:', error);
    res.redirect('/carrito');
  }
});

// Test route
router.get('/test-cart', (req: Request, res: Response) => {
  console.log('🧪 TEST ROUTE HIT!');
  res.json({ message: 'Test route working!', session: req.session });
});

// Route GET '/carrito' → render cart page (requires login)
router.get('/carrito', async (req: Request, res: Response) => {
  console.log('🛒 CART ROUTE HIT!');
  
  // Check if user is logged in
  if (!req.usuario) {
    logger.warn('Unauthorized access to cart page - redirecting to login');
    return res.redirect('/login?redirect=/carrito');
  }
  
  try {
    logger.debug('Loading cart page');
    const carritoSession = (req.session as any).carrito || [];
    console.log('🛒 Cart session:', carritoSession);
    logger.debug(`Cart session data: ${JSON.stringify(carritoSession)}`);
    logger.debug(`Cart length: ${carritoSession.length}`);

    // Fetch full product data
    const productos = [];
    for (const item of carritoSession) {
      logger.debug(`Processing cart item: ${JSON.stringify(item)}`);
      const prod = await prisma.producto.findUnique({
        where: { id: item.id }
      });

      if (prod) {
        productos.push({
          id: prod.id,
          titulo: prod.título,
          descripcion: prod.descripción,
          precio: Number(prod.precio),
          imagen: prod.imagen,
          cantidad: item.cantidad
        });
        logger.debug(`Added product to cart display: ${prod.título}`);
      } else {
        logger.warn(`Product not found in database: ID ${item.id}`);
      }
    }

    logger.debug(`Final cart products array: ${JSON.stringify(productos)}`);

    // Calculate totals
    const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const iva = subtotal * 0.21;
    const envio = 5;
    const total = subtotal + iva + envio;

    logger.debug(`Cart totals - Subtotal: ${subtotal}, IVA: ${iva}, Envio: ${envio}, Total: ${total}`);
    console.log('🛒 Final products array:', productos);
    console.log('🛒 Rendering cart with:', { carrito: productos, subtotal, iva, envio, total });

    res.render('carrito.njk', {
      carrito: productos,
      subtotal,
      iva,
      envio,
      total
    });

  } catch (error: any) {
    logger.error(error.message);
    res.status(500).send("Error en el carrito");
  }
});

// Route GET '/pago' → render payment page (requires login)
router.get('/pago', async (req: any, res: Response) => {
  try {
    logger.debug('Loading payment page');
    
    // Check if user is logged in
    if (!req.usuario) {
      logger.warn('Unauthorized access to payment page - redirecting to login');
      return res.redirect('/login?redirect=/pago');
    }
    
    const userEmail = req.email || (req.session as any).email || req.session?.email;
    
    // Get cart from session or create demo cart
    let carrito = (req.session as any).carrito || [];
    
    if (carrito.length === 0) {
      // Create demo cart for testing
      carrito = [{
        id: 1,
        nombre: 'Producto Demo',
        precio: 99.99,
        cantidad: 1,
        descripcion: 'Producto de ejemplo para testing'
      }];
      logger.info('Created demo cart for testing');
    }
    
    // Calculate totals
    const subtotal = carrito.reduce((total: number, item: any) => total + (item.precio * item.cantidad), 0);
    const iva = subtotal * 0.21;
    const envio = subtotal > 50 ? 0 : 4.99;
    const total = subtotal + iva + envio;
    
    // Get user data for form pre-filling
    let usuario = null;
    
    if (userEmail) {
      usuario = await prisma.usuario.findUnique({
        where: { email: userEmail }
      }) as any;
    }
    
    res.render('modern-pago.njk', {
      carrito,
      subtotal: subtotal.toFixed(2),
      iva: iva.toFixed(2),
      envio: envio.toFixed(2),
      total: total.toFixed(2),
      direccion: usuario?.direccion || '',
      nombre: usuario?.nombre || '',
      email: userEmail
    });
    
  } catch (error: any) {
    logger.error('Error loading payment page:', error);
    res.status(500).render('error.njk', {
      title: 'Error',
      message: 'Error al cargar la página de pago'
    });
  }
});

// Route POST '/procesar-pago' → process payment
router.post('/procesar-pago', async (req: any, res: Response) => {
  try {
    logger.info('Processing payment...');
    console.log('📝 Payment form data:', req.body);
    
    // Allow guest checkout - don't require login
    const userEmail = req.email || (req.session as any).email || req.session?.email || 'guest@example.com';
    
    // Get form data
    const {
      titular,
      numero_tarjeta,
      fecha_expiracion,
      cvv,
      codigo_postal,
      direccion_facturacion
    } = req.body;
    
    // Basic validation
    if (!titular || !numero_tarjeta || !fecha_expiracion || !cvv) {
      return res.status(400).render('error.njk', {
        title: 'Error de Validación',
        message: 'Todos los campos de pago son requeridos'
      });
    }
    
    // Get current cart or create default cart for demo
    let carrito = (req.session as any).carrito || [];
    
    if (carrito.length === 0) {
      // Create a demo cart item for testing
      carrito = [{
        id: 1,
        nombre: 'Producto Demo',
        precio: 99.99,
        cantidad: 1,
        descripcion: 'Producto de ejemplo para testing'
      }];
    }
    
    // Calculate totals
    const subtotal = carrito.reduce((total: number, item: any) => total + (item.precio * item.cantidad), 0);
    const iva = subtotal * 0.21;
    const envio = subtotal > 50 ? 0 : 4.99;
    const total = subtotal + iva + envio;
    
    // Generate invoice number
    const invoiceNumber = 'INV-' + Date.now().toString().slice(-8);
    
    // Get user data (skip for guest users)
    let usuario = null;
    if (userEmail !== 'guest@example.com') {
      try {
        usuario = await prisma.usuario.findUnique({
          where: { email: userEmail }
        }) as any;
      } catch (error) {
        logger.warn('User lookup failed, proceeding as guest:', error);
      }
    }
    
    // Prepare invoice data
    const invoiceData = {
      invoiceNumber,
      customerName: titular,
      customerEmail: userEmail,
      customerAddress: direccion_facturacion || usuario?.direccion || '',
      items: carrito.map((item: any) => ({
        title: item.nombre || item.título || 'Producto',
        quantity: item.cantidad || 1,
        price: item.precio || 0,
        subtotal: (item.precio || 0) * (item.cantidad || 1)
      })),
      subtotal,
      iva,
      envio,
      total,
      date: new Date()
    };
    
    // Generate PDF invoice
    logger.info('Generating PDF invoice...');
    const pdfBuffer = await PDFGenerator.generateInvoice(invoiceData);
    
    // Save PDF to file system (optional)
    const invoicesDir = './invoices';
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }
    
    const invoicePath = `${invoicesDir}/factura-${invoiceNumber}.pdf`;
    fs.writeFileSync(invoicePath, pdfBuffer);
    
    // Log payment (in real app, this would integrate with payment gateway)
    logger.info(`Payment processed for user: ${userEmail}, amount: ${total}, invoice: ${invoiceNumber}`);
    
    // Clear cart after successful payment
    (req.session as any).carrito = [];
    (req.session as any).total_carrito = 0;
    
    // Store invoice info in session for factura page
    const sessionInvoiceData = {
      invoiceNumber,
      total: total.toFixed(2),
      customerName: titular,
      items_count: carrito.length,
      items: carrito,
      cardholder: titular,
      card_last4: numero_tarjeta.slice(-4),
      payment_date: new Date(),
      subtotal: subtotal.toFixed(2),
      iva: iva.toFixed(2),
      envio: envio.toFixed(2)
    };
    
    (req.session as any).lastInvoice = sessionInvoiceData;
    
    console.log('💾 Invoice data stored in session:', sessionInvoiceData);
    logger.info(`Invoice stored in session: ${invoiceNumber}`);
    
    // Redirect to factura page
    res.redirect(`/factura-simple?invoice=${invoiceNumber}`);
    
  } catch (error: any) {
    logger.error('Error processing payment:', error);
    res.status(500).render('error.njk', {
      title: 'Error',
      message: 'Error al procesar el pago'
    });
  }
});

// Route GET '/descargar-factura' → download invoice HTML
router.get('/descargar-factura', async (req: any, res: Response) => {
  try {
    const invoiceInfo = (req.session as any).lastInvoice;
    
    console.log('🔍 GET /descargar-factura - Debug info:', {
      hasInvoiceInfo: !!invoiceInfo,
      invoiceNumber: invoiceInfo?.invoiceNumber,
      email: req.email,
      subtotalType: typeof invoiceInfo?.subtotal,
      subtotalValue: invoiceInfo?.subtotal,
      totalType: typeof invoiceInfo?.total,
      totalValue: invoiceInfo?.total
    });
    
    // Create demo invoice if no session data exists
    let invoiceData;
    if (invoiceInfo && invoiceInfo.invoiceNumber) {
      invoiceData = {
        invoiceNumber: invoiceInfo.invoiceNumber,
        customerName: invoiceInfo.customerName,
        customerEmail: req.email || 'guest@example.com',
        items: invoiceInfo.items || [],
        subtotal: parseFloat(invoiceInfo.subtotal) || 0,
        iva: parseFloat(invoiceInfo.iva) || 0,
        envio: parseFloat(invoiceInfo.envio) || 0,
        total: parseFloat(invoiceInfo.total) || 0,
        date: invoiceInfo.payment_date || new Date(),
        cardholder: invoiceInfo.cardholder,
        card_last4: invoiceInfo.card_last4
      };
      console.log('📄 Using session invoice data for download');
    } else {
      // Create demo invoice for download
      invoiceData = {
        invoiceNumber: 'DEMO-' + Date.now().toString().slice(-6),
        customerName: 'Demo Customer',
        customerEmail: req.email || 'guest@example.com',
        items: [{
          nombre: 'Producto Demo',
          cantidad: 1,
          precio: 99.99,
          subtotal: 99.99
        }],
        subtotal: 82.64,
        iva: 17.35,
        envio: 0,
        total: 99.99,
        date: new Date(),
        cardholder: 'Demo Customer',
        card_last4: '1234'
      };
      console.log('📄 Creating demo invoice for download');
    }
    
    logger.info('Generating PDF invoice for download:', invoiceData.invoiceNumber);
    console.log('📄 Invoice data for PDF:', {
      invoiceNumber: invoiceData.invoiceNumber,
      customerName: invoiceData.customerName,
      customerEmail: invoiceData.customerEmail,
      itemsCount: invoiceData.items?.length || 0,
      subtotal: invoiceData.subtotal,
      total: invoiceData.total,
      hasItems: !!invoiceData.items
    });
    
    try {
      // Generate PDF using Puppeteer
      const pdfBuffer = await PDFGenerator.generateInvoice(invoiceData);
      console.log('✅ PDF generated successfully, size:', pdfBuffer.length);
      
      // Check if it's a real PDF (binary) or fallback HTML
      const isPDF = pdfBuffer.length > 1000 && pdfBuffer[0] === 0x25; // % character
      
      if (isPDF) {
        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="factura-${invoiceData.invoiceNumber}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        console.log('📄 Sending as PDF file');
      } else {
        // Set headers for HTML download (fallback)
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="factura-${invoiceData.invoiceNumber}.html"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        console.log('📄 Sending as HTML file (fallback)');
      }
      
      res.send(pdfBuffer);
      
      logger.info(`Invoice downloaded: ${invoiceData.invoiceNumber} by ${req.email || 'guest'}`);
      console.log('✅ Invoice sent for download');
    } catch (pdfError) {
      console.error('❌ PDF generation failed:', pdfError);
      
      // Fallback: send as text if PDF generation fails
      const textContent = `
FACTURA ${invoiceData.invoiceNumber}
===============================================
Cliente: ${invoiceData.customerName || 'N/A'}
Email: ${invoiceData.customerEmail}
Fecha: ${new Date(invoiceData.date).toLocaleDateString('es-ES')}

PRODUCTOS:
${invoiceData.items?.map((item: any) => 
  `- ${item.nombre}: ${item.cantidad} x €${item.precio} = €${(item.precio * item.cantidad).toFixed(2)}`
).join('\n') || 'No hay productos'}

RESUMEN:
Subtotal: €${invoiceData.subtotal}
IVA (21%): €${invoiceData.iva}
Envío: €${invoiceData.envio}
TOTAL: €${invoiceData.total}

===============================================
Tienda Prado - www.tiendaprado.com
      `.trim();
      
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="factura-${invoiceData.invoiceNumber}.txt"`);
      res.send(textContent);
      
      console.log('⚠️ Fallback to text format sent');
    }
    
  } catch (error: any) {
    console.error('❌ Error downloading invoice:', error);
    logger.error('Error downloading invoice:', error);
    res.status(500).send(`
      <h1>Error de Descarga</h1>
      <p>Error al descargar la factura: ${error.message}</p>
      <p><a href="/factura-simple">Volver a la factura</a></p>
    `);
  }
});

// Route GET '/payment-thank-you' → show thank you page
router.get('/payment-thank-you', (req: any, res: Response) => {
  try {
    res.render('payment-thank-you.njk', {
      title: 'Payment Successful - Thank You'
    });
  } catch (error: any) {
    logger.error('Error loading thank you page:', error);
    res.status(500).render('error.njk', {
      title: 'Error',
      message: 'Error al cargar la página de agradecimiento'
    });
  }
});

// Route GET '/factura' → display invoice page
router.get('/factura', async (req: any, res: Response) => {
  try {
    const invoiceNumber = req.query.invoice as string;
    const lastInvoice = (req.session as any).lastInvoice;
    
    // If no invoice in session and no invoice number provided, redirect to home
    if (!lastInvoice && !invoiceNumber) {
      return res.redirect('/');
    }
    
    // Use session data or provided invoice number
    const invoiceData = lastInvoice || { invoiceNumber };
    
    // If user is logged in, get user info
    let userInfo = {};
    if (req.usuario) {
      userInfo = {
        usuario: req.usuario,
        email: req.email
      };
    }
    
    logger.info(`Displaying invoice: ${invoiceData.invoiceNumber}`);
    
    res.render('factura.njk', {
      title: `Factura ${invoiceData.invoiceNumber} - Tienda Prado`,
      invoice_number: invoiceData.invoiceNumber,
      total: invoiceData.total,
      carrito: { items: invoiceData.items || [] },
      cardholder: invoiceData.cardholder,
      card_last4: invoiceData.card_last4,
      payment_date: invoiceData.payment_date,
      ...userInfo
    });
    
  } catch (error: any) {
    logger.error('Error displaying factura:', error);
    res.status(500).render('error.njk', {
      title: 'Error',
      message: 'Error al cargar la factura'
    });
  }
});

// Route GET '/factura-simple' → display simple invoice page
router.get('/factura-simple', async (req: any, res: Response) => {
  try {
    const invoiceNumber = req.query.invoice as string;
    const lastInvoice = (req.session as any).lastInvoice;
    
    console.log('🔍 GET /factura-simple - Full debug info:', {
      invoiceNumber,
      lastInvoice: lastInvoice ? 'EXISTS' : 'NULL',
      sessionId: req.sessionID,
      hasSession: !!req.session,
      sessionData: req.session ? Object.keys(req.session) : 'NO SESSION'
    });
    
    // Always create a demo invoice for any request
    const demoInvoice = {
      invoiceNumber: invoiceNumber || 'DEMO-' + Date.now().toString().slice(-6),
      total: '99.99',
      customerName: 'Demo Customer',
      items: [{
        nombre: 'Producto Demo',
        cantidad: 1,
        precio: 99.99
      }],
      cardholder: 'Demo Customer',
      card_last4: '1234',
      payment_date: new Date(),
      subtotal: '82.64',
      iva: '17.35',
      envio: '0.00'
    };
    
    // Use session data if available, otherwise use demo data
    let invoiceData = demoInvoice;
    if (lastInvoice && lastInvoice.invoiceNumber) {
      invoiceData = lastInvoice;
      console.log('📄 Using session invoice data');
    } else {
      console.log('📄 Using demo invoice data');
    }
    
    console.log('📄 Final invoice data:', {
      invoiceNumber: invoiceData.invoiceNumber,
      hasItems: invoiceData.items ? invoiceData.items.length : 0,
      total: invoiceData.total,
      cardholder: invoiceData.cardholder,
      card_last4: invoiceData.card_last4
    });
    
    // Generate HTML directly instead of using template
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Factura ${invoiceData.invoiceNumber} - Tienda Prado</title>
          <style>
              body { 
                  font-family: Arial, sans-serif; 
                  margin: 40px; 
                  background: linear-gradient(135deg, #0a0a0f, #1a1a2e, #16213e);
                  color: #f0f0f0;
              }
              .invoice { 
                  background: linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(26, 26, 46, 0.9), rgba(22, 33, 62, 0.9));
                  backdrop-filter: blur(20px);
                  padding: 40px; 
                  border-radius: 20px; 
                  max-width: 900px; 
                  margin: 0 auto;
                  border: 1px solid rgba(201, 168, 76, 0.2);
                  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
              }
              .header { 
                  text-align: center; 
                  border-bottom: 2px solid rgba(201, 168, 76, 0.3); 
                  padding-bottom: 20px; 
                  margin-bottom: 30px; 
              }
              .title { 
                  font-size: 2.5rem; 
                  font-weight: 700; 
                  background: linear-gradient(135deg, #c9a84c, #e8d070);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  margin: 0; 
              }
              .subtitle { color: #b8b8d1; font-size: 1.2rem; margin: 5px 0; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
              .info-section { 
                  background: rgba(255, 255, 255, 0.05); 
                  padding: 20px; 
                  border-radius: 15px; 
                  border: 1px solid rgba(255, 255, 255, 0.1);
              }
              .info-title { color: #c9a84c; font-weight: 600; margin-bottom: 15px; font-size: 1.1rem; }
              .info-item { margin-bottom: 8px; color: #f0f0f0; }
              table { 
                  width: 100%; 
                  border-collapse: collapse; 
                  margin: 30px 0; 
                  background: rgba(255, 255, 255, 0.02);
                  border-radius: 15px;
                  overflow: hidden;
              }
              th { 
                  background: rgba(201, 168, 76, 0.2); 
                  color: #f0f0f0; 
                  padding: 15px; 
                  text-align: left; 
                  font-weight: 600; 
              }
              td { 
                  padding: 15px; 
                  color: #f0f0f0; 
                  border-bottom: 1px solid rgba(255, 255, 255, 0.05); 
              }
              .totals { display: flex; justify-content: flex-end; margin-top: 30px; }
              .totals-section { 
                  background: rgba(201, 168, 76, 0.1); 
                  padding: 20px 30px; 
                  border-radius: 15px; 
                  border: 1px solid rgba(201, 168, 76, 0.3); 
                  min-width: 300px; 
              }
              .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; color: #f0f0f0; }
              .grand-total { 
                  font-size: 1.3rem; 
                  font-weight: 700; 
                  color: #c9a84c; 
                  margin-top: 15px; 
                  padding-top: 15px; 
                  border-top: 2px solid rgba(201, 168, 76, 0.3); 
              }
              .action-buttons { display: flex; gap: 20px; justify-content: center; margin-top: 40px; }
              .btn { 
                  padding: 15px 30px; 
                  text-decoration: none; 
                  border-radius: 25px; 
                  font-size: 1.1rem; 
                  font-weight: 600; 
                  cursor: pointer; 
                  transition: all 0.3s ease; 
                  display: inline-flex; 
                  align-items: center; 
                  gap: 10px;
                  border: none;
              }
              .btn-download { 
                  background: linear-gradient(135deg, #c9a84c, #e8d070); 
                  color: #0a0a0f; 
              }
              .btn-download:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(201, 168, 76, 0.3); }
              .btn-back { 
                  background: rgba(255, 255, 255, 0.1); 
                  color: #f0f0f0; 
                  border: 1px solid rgba(255, 255, 255, 0.2);
              }
              .btn-back:hover { background: rgba(255, 255, 255, 0.2); transform: translateY(-2px); }
          </style>
      </head>
      <body>
          <div class="invoice">
              <div class="header">
                  <h1 class="title">FACTURA</h1>
                  <p class="subtitle">Número: ${invoiceData.invoiceNumber}</p>
              </div>
              
              <div class="info-grid">
                  <div class="info-section">
                      <h3 class="info-title">Información del Cliente</h3>
                      <div class="info-item"><strong>Nombre:</strong> ${invoiceData.cardholder || 'N/A'}</div>
                      <div class="info-item"><strong>Email:</strong> ${req.email || 'N/A'}</div>
                      <div class="info-item"><strong>Tarjeta:</strong> **** **** **** ${invoiceData.card_last4 || 'N/A'}</div>
                  </div>
                  
                  <div class="info-section">
                      <h3 class="info-title">Detalles de la Factura</h3>
                      <div class="info-item"><strong>Fecha:</strong> ${invoiceData.payment_date ? new Date(invoiceData.payment_date).toLocaleDateString() : new Date().toLocaleDateString()}</div>
                      <div class="info-item"><strong>Método de Pago:</strong> Tarjeta de Crédito</div>
                      <div class="info-item"><strong>Estado:</strong> Pagado</div>
                  </div>
              </div>
              
              <table>
                  <thead>
                      <tr>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Precio Unitario</th>
                          <th>Subtotal</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${invoiceData.items && invoiceData.items.length > 0 ? invoiceData.items.map(item => `
                          <tr>
                              <td>${item.nombre || 'Producto'}</td>
                              <td>${item.cantidad || 1}</td>
                              <td>€${(item.precio || 0).toFixed(2)}</td>
                              <td>€${((item.precio || 0) * (item.cantidad || 1)).toFixed(2)}</td>
                          </tr>
                      `).join('') : '<tr><td colspan="4" style="text-align: center;">No hay productos</td></tr>'}
                  </tbody>
              </table>
              
              ${invoiceData.total ? `
              <div class="totals">
                  <div class="totals-section">
                      <div class="total-row"><span>Subtotal:</span><span>€${(parseFloat(invoiceData.total) * 0.79).toFixed(2)}</span></div>
                      <div class="total-row"><span>IVA (21%):</span><span>€${(parseFloat(invoiceData.total) * 0.21).toFixed(2)}</span></div>
                      <div class="total-row"><span>Envío:</span><span>€0.00</span></div>
                      <div class="total-row grand-total"><span>Total:</span><span>€${invoiceData.total}</span></div>
                  </div>
              </div>
              ` : ''}
              
              <div class="action-buttons">
                  <a href="/descargar-factura" class="btn btn-download">
                      <i class="bi bi-download"></i>
                      Descargar PDF
                  </a>
                  <a href="/" class="btn btn-back">
                      <i class="bi bi-house"></i>
                      Volver a la Tienda
                  </a>
              </div>
          </div>
      </body>
      </html>
    `;
    
    console.log('✅ Invoice HTML generated successfully');
    logger.info(`Displaying simple invoice: ${invoiceData.invoiceNumber}`);
    
    res.send(html);
    
  } catch (error: any) {
    console.error('❌ Error displaying factura-simple:', error);
    console.error('❌ Error stack:', error.stack);
    logger.error('Error displaying factura-simple:', error);
    
    // Send a simple error response
    res.status(500).send(`
      <h1>Invoice Error</h1>
      <p>There was an error loading the invoice: ${error.message}</p>
      <p><a href="/">Go back to home</a></p>
    `);
  }
});

// Real-time search API
router.get('/api/search', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string || '').trim();
    
    if (query.length < 1) {
      return res.json([]);
    }
    
    logger.info('Real-time search query:', query);
    
    // Search products that start with the query in title or description (case-insensitive)
    const products = await prisma.producto.findMany({
      where: {
        OR: [
          {
            título: {
              startsWith: query,
              mode: 'insensitive'
            }
          },
          {
            descripción: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        id: true,
        título: true,
        precio: true,
        imagen: true,
        descripción: true
      },
      orderBy: [
        {
          título: 'asc'
        }
      ],
      take: 10 // Limit to 10 results for performance
    });
    
    console.log(`🔍 Found ${products.length} products for "${query}"`);
    
    res.json(products);
  } catch (error: any) {
    console.error('❌ Real-time search error:', error);
    logger.error('Real-time search error:', error);
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
});

// Simple test route to check if basic routing works
router.get('/factura-simple-debug', (req: any, res: Response) => {
  try {
    console.log('🧪 Simple debug test - basic routing');
    res.send(`
      <h1>Debug Test Successful</h1>
      <p>Invoice Number: {{ req.query.invoice || 'None' }}</p>
      <p>Session ID: {{ req.sessionID || 'None' }}</p>
      <p>Has Session: {{ !!req.session }}</p>
      <p>User: {{ req.usuario || 'Not logged in' }}</p>
      <p><a href="/factura-test">Test Template</a></p>
      <p><a href="/factura-simple">Try Invoice Page</a></p>
    `);
  } catch (error: any) {
    console.error('❌ Debug test error:', error);
    res.status(500).send('Debug test error: ' + error.message);
  }
});

// Simple test without templates
router.get('/factura-raw', (req: any, res: Response) => {
  try {
    console.log('🧪 Testing without templates...');
    
    const invoiceNumber = req.query.invoice || 'RAW-123456';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Invoice {{ invoiceNumber }}</title>
          <style>
              body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
              .invoice { background: white; padding: 40px; border-radius: 10px; max-width: 800px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
              .title { font-size: 28px; font-weight: bold; color: #333; margin: 0; }
              .info { margin: 20px 0; }
              .btn { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 5px; display: inline-block; }
          </style>
      </head>
      <body>
          <div class="invoice">
              <div class="header">
                  <h1 class="title">FACTURA</h1>
                  <p>Número: {{ invoiceNumber }}</p>
              </div>
              <div class="info">
                  <p><strong>Cliente:</strong> Test User</p>
                  <p><strong>Tarjeta:</strong> **** **** **** 1234</p>
                  <p><strong>Fecha:</strong> {{ new Date().toLocaleDateString() }}</p>
              </div>
              <div class="info">
                  <h3>Productos</h3>
                  <p>Producto Demo - €99.99</p>
              </div>
              <div class="info">
                  <p><strong>Total:</strong> €99.99</p>
              </div>
              <a href="/descargar-factura" class="btn">Descargar Factura</a>
              <a href="/" class="btn" style="background: #6c757d;">Volver a Tienda</a>
          </div>
      </body>
      </html>
    `;
    
    console.log('✅ Raw HTML test successful');
    res.send(html);
    
  } catch (error: any) {
    console.error('❌ Raw test error:', error);
    res.status(500).send('Raw test error: ' + error.message);
  }
});

// Test route with minimal template
router.get('/factura-minimal', (req: any, res: Response) => {
  try {
    console.log('🧪 Testing minimal template...');
    
    const testData = {
      invoice_number: req.query.invoice || 'MINIMAL-123456',
      total: '99.99',
      cardholder: 'Test User',
      card_last4: '1234',
      payment_date: new Date(),
      carrito: { 
        items: [{
          nombre: 'Test Product',
          precio: 99.99
        }]
      }
    };
    
    console.log('📄 Rendering minimal template with data:', testData);
    
    res.render('factura-minimal.njk', testData);
  } catch (error: any) {
    console.error('❌ Minimal template error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).send('Minimal template error: ' + error.message);
  }
});

export default router;
