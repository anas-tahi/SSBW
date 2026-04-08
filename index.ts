import express from 'express';
import nunjucks from 'nunjucks';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import productosRouter from './routes/productos';
import usuariosRouter from './routes/usuarios';
import profileRouter from './routes/profile';
// import apiProductosRouter from './routes/api.productos';

import logger from './logger.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure Nunjucks with Express
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true,
  noCache: true
});

// Make environment variables available in templates
app.use((req, res, next) => {
  res.locals.env = process.env;
  next();
});

// Enable express.urlencoded middleware for form data
app.use(express.urlencoded({ extended: true }));

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'tienda-prado-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Use cookie-parser middleware
app.use(cookieParser());

// Authentication middleware - reads JWT token from cookie
app.use((req: any, res: any, next) => {
  try {
    const token = req.cookies.access_token;

    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY || 'fallback-secret') as any;

      req.usuario = decoded.usuario;
      req.admin = decoded.admin;
      req.email = decoded.email;

      res.locals.usuario = decoded.usuario;
      res.locals.admin = decoded.admin;
      res.locals.email = decoded.email;

      logger.debug(`User authenticated: ${decoded.usuario} (${decoded.email})`);
    } else {
      req.usuario = undefined;
      req.admin = undefined;
      req.email = undefined;

      res.locals.usuario = undefined;
      res.locals.admin = undefined;
      res.locals.email = undefined;
    }
  } catch (error) {
    logger.debug('Invalid JWT token, clearing cookie');
    res.clearCookie('access_token');

    req.usuario = undefined;
    req.admin = undefined;
    req.email = undefined;

    res.locals.usuario = undefined;
    res.locals.admin = undefined;
    res.locals.email = undefined;
  }

  next();
});

// Middleware to copy session.carrito info into res.locals
app.use((req: any, res, next) => {
  res.locals.total_carrito = req.session.carrito ? req.session.total_carrito || 0 : 0;
  next();
});

// Serve static files from views directory
app.use('/views', express.static(path.join(__dirname, 'views')));

// Serve static images from public/imagenes
app.use('/imagenes', express.static('public/imagenes'));

// Serve static styles
app.use('/views/styles', express.static('views/styles'));

// Request logging middleware
app.use((req: any, res, next) => {
  logger.debug(`${req.method} ${req.path} - IP: ${req.ip} - User: ${req.usuario || 'anonymous'}`);
  next();
});

// API routes
// app.use('/api', apiProductosRouter);

// Productos routes
app.use('/', productosRouter);

// Auth routes
app.use('/', usuariosRouter);

// Profile routes
app.use('/', profileRouter);



// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Error en ${req.method} ${req.path}:`, err);
  res.status(500).render('error.njk', {
    title: 'Error del servidor',
    message: 'Ha ocurrido un error inesperado'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
