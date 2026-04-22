import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import express from 'express';

const router = express.Router();

// Initialize Prisma with SQLite adapter
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

// Authentication middleware
function requireAuth(req: any, res: express.Response, next: express.NextFunction) {
  if (!req.email) {
    return res.redirect('/login');
  }
  next();
}

// GET /profile - Display user profile
router.get('/profile', requireAuth, async (req: any, res: express.Response) => {
  try {
    console.log('=== PROFILE ROUTE START ===');
    console.log('Profile route accessed');
    
    // User is authenticated, req.email exists
    const userEmail = req.email;
    
    console.log('User email from req.email:', userEmail);

    console.log('Fetching user data for:', userEmail);

    // Get user data from database - simple query
    const user = await prisma.usuario.findUnique({
      where: { email: userEmail }
    });

    console.log('User data fetched:', user ? 'success' : 'not found');

    if (!user) {
      console.log('User not found in database, redirecting to login');
      return res.redirect('/login');
    }

    console.log('Rendering profile page...');

    // Render profile page
    res.render('profile.njk', {
      user,
      success: req.query.success || null,
      error: req.query.error || null,
      message: req.query.message || null
    });

    console.log('=== PROFILE ROUTE SUCCESS ===');

  } catch (error: any) {
    console.error('=== PROFILE ROUTE ERROR ===');
    console.error('Error loading profile:', error);
    console.error('Error stack:', error.stack);
    res.status(500).send('Server error: ' + error.message);
  }
});

// POST /profile - Update user profile
router.post('/profile', requireAuth, async (req: any, res: express.Response) => {
  try {
    // User is authenticated, req.email exists
    const userEmail = req.email;

    const {
      nombre,
      telefono,
      direccion,
      fecha_nacimiento,
      genero,
      biografia,
      idioma,
      newsletter,
      countryCode
    } = req.body;

    console.log('Profile update request for:', userEmail);
    console.log('Update data:', { nombre, telefono, direccion, genero, idioma, newsletter });

    // Validate required fields
    if (!nombre || nombre.trim().length < 3) {
      return res.redirect('/profile?error=validation&message=El nombre debe tener al menos 3 caracteres');
    }

    // Process phone number with country code
    let fullTelefono = telefono;
    if (telefono && countryCode) {
      // Extract only the digits from phone number (remove any existing country code)
      const phoneDigits = telefono.replace(/\D/g, '').replace(/^(\+?\d{1,3})\s*/, '');
      fullTelefono = `${countryCode} ${phoneDigits}`;
    }

    // Prepare update data
    const updateData: any = {
      nombre: nombre.trim(),
      telefono: fullTelefono || null,
      direccion: direccion?.trim() || null,
      genero: genero || null,
      biografia: biografia?.trim() || null,
      idioma: idioma || 'es',
      newsletter: newsletter === 'on' || newsletter === true,
      actualizado_en: new Date()
    };

    // Handle date of birth
    if (fecha_nacimiento) {
      try {
        // HTML date input sends yyyy-MM-dd format, no need for complex parsing
        updateData.fecha_nacimiento = new Date(fecha_nacimiento + 'T00:00:00.000Z');
      } catch (dateError) {
        console.log('Invalid date format, skipping fecha_nacimiento');
      }
    }

    console.log('Updating user with data:', updateData);

    // Update user in database
    const updatedUser = await prisma.usuario.update({
      where: { email: userEmail },
      data: updateData
    });

    console.log('Profile updated successfully for user:', userEmail);

    // Redirect with success message
    res.redirect('/profile?success=true&message=Tu perfil ha sido actualizado correctamente');

  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.redirect('/profile?error=update&message=No se pudo actualizar tu perfil. Por favor, inténtalo de nuevo.');
  }
});

export default router;
