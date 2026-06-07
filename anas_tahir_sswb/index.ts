import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import nunjucks from 'nunjucks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import ProductosRouter from './routes/productos.ts';
import UsuariosRouter from './routes/usuarios.ts';
import apiProductosRouter from './routes/api.productos.ts';
import apiImageProxyRouter from './routes/api.image-proxy.ts';

import logger from './logger.ts';

const app = express();
const PORT = process.env.PORT || 3000;

// Nunjucks template engine setup (Tarea 1)
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true,       // auto-reload templates on change (uses chokidar)
});
app.set('view engine', 'njk');

// CORS — needed for React frontend (Tarea 9)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://ssbw-react.onrender.com'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'tienda-prado-session-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(cookieParser());

app.use((req: any, res: any, next) => {
  try {
    const token = req.cookies.access_token;
    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY || 'fallback-secret') as any;
      req.usuario = decoded.usuario;
      req.admin   = decoded.admin;
      req.email   = decoded.email;
      res.locals.usuario = decoded.usuario;   // accesible en las plantillas
      res.locals.admin   = decoded.admin;
      res.locals.email   = decoded.email;
      logger.debug(`Autentificado ${decoded.usuario} admin:${decoded.admin}`);
    } else {
      req.usuario = undefined;
      req.admin   = undefined;
      req.email   = undefined;
      res.locals.usuario = undefined;
      res.locals.admin   = undefined;
      res.locals.email   = undefined;
    }
  } catch (error) {
    logger.debug('Invalid JWT token, clearing cookie');
    res.clearCookie('access_token');
    req.usuario = undefined;
    req.admin   = undefined;
    req.email   = undefined;
    res.locals.usuario = undefined;
    res.locals.admin   = undefined;
    res.locals.email   = undefined;
  }
  next();
});

// Request logging
app.use((req: any, res, next) => {
  logger.debug(`${req.method} ${req.path} - User: ${req.usuario || 'anonymous'}`);
  next();
});

// Static files — url /public/imagenes servida desde carpeta imagenes
app.use('/public/imagenes', express.static('imagenes'));
app.use('/imagenes', express.static('imagenes'));

// API Routes
app.use('/api', apiProductosRouter);
app.use('/api', apiImageProxyRouter);

// MPA Routes (Tarea 4 + Tarea 6)
app.use('/', UsuariosRouter);
app.use('/', ProductosRouter);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Error en ${req.method} ${req.path}:`, err);
  res.status(500).render('error.njk', { title: 'Error', message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

