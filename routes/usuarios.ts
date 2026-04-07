import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcrypt';
import logger from '../logger.js';

// Initialize Prisma Client with SQLite adapter
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

const router = Router();

// Mock users for testing
const mockUsers = [
  {
    email: "admin@tiendaprado.com",
    nombre: "Administrador",
    contraseña: "$2b$12$5u369.7w8k4y6z5q2w8k4y6z5q2", // hashed "admin123"
    admin: true
  },
  {
    email: "usuario@tiendaprado.com", 
    nombre: "Usuario Normal",
    contraseña: "$2b$12$5u369.7w8k4y6z5q2w8k4y6z5q2", // hashed "user123"
    admin: false
  },
  {
    email: "cliente@tiendaprado.com",
    nombre: "Cliente Ejemplo", 
    contraseña: "$2b$12$5u369.7w8k4y6z5q2w8k4y6z5q2", // hashed "cliente123"
    admin: false
  }
];

// Helper function to validate login data
function validateLoginData(data: any) {
  const errors: string[] = [];
  
  if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
    errors.push('Email is required');
  }
  
  if (!data.contraseña || typeof data.contraseña !== 'string' || data.contraseña.trim().length === 0) {
    errors.push('Contraseña is required');
  }
  
  return errors;
}

// GET /login - Show login page
router.get('/login', (req: Request, res: Response) => {
  logger.debug('Rendering login page');
  res.render('login.njk', {
    title: 'Iniciar Sesión - Tienda Prado',
    error: false
  });
});

// POST /login - Process login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, contraseña } = req.body;
    
    logger.debug(`Login attempt for email: ${email}`);
    console.log('🔑 Login data:', { email, hasPassword: !!contraseña });
    
    // Validate input data
    const validationErrors = validateLoginData(req.body);
    if (validationErrors.length > 0) {
      console.log('❌ Login validation errors:', validationErrors);
      return res.render('login.njk', {
        title: 'Iniciar Sesión - Tienda Prado',
        error: true,
        message: validationErrors.join(', ')
      });
    }
    
    // Find user in database
    console.log('🔍 Looking up user in database:', email);
    const usuario = await prisma.usuario.findUnique({
      where: { email: email }
    }) as any;
    
    if (!usuario) {
      console.log('❌ User not found in database:', email);
      logger.warn(`Login failed: User not found: ${email}`);
      return res.render('login.njk', {
        title: 'Iniciar Sesión - Tienda Prado',
        error: true,
        message: 'Email o contraseña incorrectos'
      });
    }
    
    console.log('✅ User found in database:', usuario.email);
    
    // Verify password using bcrypt
    let isPasswordValid;
    try {
      console.log('Verifying password...');
      isPasswordValid = await bcrypt.compare(contraseña, usuario.contraseña);
      console.log('Password verification completed');
    } catch (error: any) {
      console.log('Password verification failed:', error?.message || 'Unknown error');
      isPasswordValid = false;
    }
    
    if (!isPasswordValid) {
      logger.warn(`Login failed: Invalid password: ${email}`);
      return res.render('login.njk', {
        title: 'Iniciar Sesión - Tienda Prado',
        error: true,
        message: 'Email o contraseña incorrectos'
      });
    }
    
    logger.info(`User logged in successfully: ${email}`);
    
    // Create JWT token
    const token = jwt.sign(
      { 
        usuario: usuario.nombre, 
        admin: usuario.admin,
        email: usuario.email
      },
      process.env.SECRET_KEY || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    logger.info(`User logged in successfully: ${email}`);
    
    // Determine redirect URL after login
    const redirectTo = (req.session as any).returnTo || '/';
    
    // Clear returnTo session variable
    delete (req.session as any).returnTo;
    
    // Set HTTP-only cookie with JWT token
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    }).redirect(redirectTo);
    
  } catch (error: any) {
    logger.error(`Login failed for email: ${req.body.email}`, error);
    res.render('login.njk', {
      title: 'Iniciar Sesión - Tienda Prado',
      error: true,
      email: req.body.email
    });
  }
});

// GET /logout - Clear session and redirect
router.get('/logout', (req: Request, res: Response) => {
  logger.debug('User logging out');
  
  // Clear the access token cookie
  res.clearCookie('access_token').redirect('/');
  
  logger.info('User logged out successfully');
});

// Helper function to validate registration data
function validateRegistrationData(data: any) {
  const errors: string[] = [];
  
  if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (!data.nombre || typeof data.nombre !== 'string' || data.nombre.trim().length === 0) {
    errors.push('Name is required');
  } else if (data.nombre.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (!data.contraseña || typeof data.contraseña !== 'string' || data.contraseña.trim().length === 0) {
    errors.push('Password is required');
  } else if (data.contraseña.length < 3) {
    errors.push('Password must be at least 3 characters');
  }
  
  return errors;
}

// GET /register - Show registration page
router.get('/register', (req: Request, res: Response) => {
  logger.debug('Rendering registration page');
  res.render('register.njk', {
    title: 'Registrarse - Tienda Prado',
    error: false,
    success: false
  });
});

// POST /register - Process registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, nombre, contraseña } = req.body;
    
    logger.debug(`Registration attempt for email: ${email}`);
    console.log('📝 Registration data:', { email, nombre, hasPassword: !!contraseña });
    
    // Validate input data
    const validationErrors = validateRegistrationData(req.body);
    if (validationErrors.length > 0) {
      console.log('❌ Validation errors:', validationErrors);
      return res.render('register.njk', {
        title: 'Registrarse - Tienda Prado',
        error: true,
        message: validationErrors.join(', '),
        email: email,
        nombre: nombre
      });
    }
    
    // Check if user already exists
    console.log('🔍 Checking if user exists:', email);
    const existingUser = await prisma.usuario.findUnique({
      where: { email: email }
    });
    
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.render('register.njk', {
        title: 'Registrarse - Tienda Prado',
        error: true,
        message: 'El email ya está registrado',
        email: email,
        nombre: nombre
      });
    }
    
    // Create user with bcrypt password hashing
    console.log('Creating new user...');
    const hashedPassword = await bcrypt.hash(contraseña, 12);
    const usuario = await prisma.usuario.create({
      data: {
        email,
        nombre,
        contraseña: hashedPassword,
        admin: false // New users are not admins by default
      }
    });
    
    console.log('✅ User created successfully:', usuario.email);
    logger.info(`User registered successfully: ${email}`);
    
    // Redirect to login page with success message
    res.render('login.njk', {
      title: 'Iniciar Sesión - Tienda Prado',
      success: true,
      message: '¡Cuenta creada correctamente! Ahora puedes iniciar sesión.',
      email: email
    });
    
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    logger.error(`Registration failed for email: ${req.body.email}`, error);
    res.render('register.njk', {
      title: 'Registrarse - Tienda Prado',
      error: true,
      message: 'Error al crear la cuenta. Por favor, inténtalo de nuevo.',
      email: req.body.email,
      nombre: req.body.nombre
    });
  }
});

// Route GET '/perfil' → render user profile page
router.get('/perfil', async (req: any, res) => {
  try {
    // Try to get email from multiple sources
    const userEmail = req.email || (req.session as any).email || req.session?.email;
    
    console.log('🔍 GET /perfil - Checking email sources:', {
      reqEmail: req.email,
      sessionEmail: (req.session as any).email,
      directSessionEmail: req.session?.email
    });
    
    if (!userEmail) {
      console.log('❌ No email found, redirecting to login');
      return res.redirect('/login');
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: userEmail }
    }) as any;

    if (!usuario) {
      console.log('❌ User not found in database:', userEmail);
      return res.redirect('/login');
    }

    console.log('✅ User found in database:', usuario);

    // Format date for display (YYYY-MM-DD format for input field)
    const formattedDate = usuario.fecha_nacimiento 
      ? new Date(usuario.fecha_nacimiento).toISOString().split('T')[0]
      : '';

    res.render('profile.njk', { 
      title: 'Mi Perfil - Tienda Prado',
      usuario: usuario.nombre,
      email: usuario.email,
      admin: usuario.admin,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      fecha_nacimiento: formattedDate,
      genero: usuario.genero,
      biografia: usuario.biografia,
      idioma: usuario.idioma,
      newsletter: usuario.newsletter,
      success: req.session.successMessage || null
    });
    
    // Clear success message after displaying
    delete req.session.successMessage;
  } catch (error) {
    logger.error('Error loading profile:', error);
    res.status(500).render('error.njk', { 
      title: 'Error',
      message: 'Error al cargar el perfil' 
    });
  }
});

// Route POST '/perfil' → save user profile changes
router.post('/perfil', async (req: any, res) => {
  console.log('🔧 POST /perfil ROUTE HIT! Timestamp:', new Date().toISOString());
  try {
    console.log('📝 Request body:', req.body);
    console.log('🔍 Request headers:', req.headers);
    console.log('🍪 Request cookies:', req.cookies);
    
    // Try to get email from multiple sources
    const userEmail = req.email || (req.session as any).email || req.session?.email;
    
    console.log('🔑 Session email sources:', {
      reqEmail: req.email,
      sessionEmail: (req.session as any).email,
      directSessionEmail: req.session?.email,
      finalUserEmail: userEmail
    });
    
    console.log('🔍 Full session object:', req.session);
    console.log('🔍 Full req object email properties:', {
      'req.email': req.email,
      'req.usuario': req.usuario,
      'req.admin': req.admin
    });
    
    if (!userEmail) {
      console.log('❌ No email in session, redirecting to login');
      return res.redirect('/login');
    }

    // First, verify user exists in database
    console.log('🔍 Checking if user exists in database...');
    const existingUser = await prisma.usuario.findUnique({
      where: { email: userEmail }
    });
    
    if (!existingUser) {
      console.log('❌ User not found in database:', userEmail);
      return res.status(404).render('error.njk', { 
        title: 'Usuario No Encontrado',
        message: 'Tu usuario no fue encontrado en la base de datos. Por favor inicia sesión nuevamente.' 
      });
    }
    
    console.log('✅ User found in database:', existingUser);
    
    const { 
      nombre, 
      email, 
      telefono, 
      direccion, 
      fecha_nacimiento, 
      genero, 
      biografia, 
      idioma, 
      newsletter 
    } = req.body;
    
    console.log('📋 Extracted fields:', { 
      nombre, 
      email, 
      telefono, 
      direccion, 
      fecha_nacimiento, 
      genero, 
      biografia, 
      idioma, 
      newsletter 
    });
    
    // Validate required fields
    if (!nombre || nombre.trim() === '') {
      console.log('❌ Nombre is required but empty');
      return res.status(400).render('error.njk', { 
        title: 'Error de Validación',
        message: 'El nombre es requerido' 
      });
    }
    
    const updateData: any = {};
    // Always update these fields if they exist in the form
    if (nombre !== undefined) {
      updateData.nombre = nombre.trim();
      console.log('✅ Will update nombre:', nombre.trim());
    }
    if (telefono !== undefined) {
      updateData.telefono = telefono.trim() || null;
      console.log('✅ Will update telefono:', telefono.trim() || null);
    }
    if (direccion !== undefined) {
      updateData.direccion = direccion.trim() || null;
      console.log('✅ Will update direccion:', direccion.trim() || null);
    }
    if (fecha_nacimiento !== undefined) {
      updateData.fecha_nacimiento = fecha_nacimiento ? new Date(fecha_nacimiento) : null;
      console.log('✅ Will update fecha_nacimiento:', fecha_nacimiento || null);
    }
    if (genero !== undefined) {
      updateData.genero = genero.trim() || null;
      console.log('✅ Will update genero:', genero.trim() || null);
    }
    if (biografia !== undefined) {
      updateData.biografia = biografia.trim() || null;
      console.log('✅ Will update biografia:', biografia.trim() || null);
    }
    if (idioma !== undefined) {
      updateData.idioma = idioma.trim() || null;
      console.log('✅ Will update idioma:', idioma.trim() || null);
    }
    // Handle newsletter checkbox - always update
    updateData.newsletter = newsletter === 'true';
    console.log('✅ Will update newsletter:', newsletter === 'true');
    
    console.log('📊 Final update data:', updateData);
    
    if (Object.keys(updateData).length === 0) {
      console.log('ℹ️ No changes to update');
      return res.redirect('/perfil');
    }
    
    console.log('💾 Attempting database update...');
    
    const result = await prisma.usuario.update({
      where: { email: userEmail },
      data: updateData
    });
    
    console.log('✅ Database update completed!', result);
    
    // Set success message in session
    req.session.successMessage = '¡Tu perfil ha sido actualizado exitosamente!';
    
    res.redirect('/perfil');
  } catch (error: any) {
    console.log('❌ ERROR in POST /perfil:', error);
    console.log('❌ Error stack:', error.stack);
    logger.error('Error saving profile:', error);
    
    // Handle specific Prisma errors
    let errorMessage = 'Error al guardar los cambios del perfil';
    if (error.code === 'P2025') {
      errorMessage = 'Usuario no encontrado. Por favor inicia sesión nuevamente.';
    } else if (error.message) {
      errorMessage = 'Error al guardar los cambios del perfil: ' + error.message;
    }
    
    res.status(500).render('error.njk', { 
      title: 'Error',
      message: errorMessage
    });
  }
});

export default router;
