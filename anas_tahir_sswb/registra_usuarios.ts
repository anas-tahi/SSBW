// Tarea 6: Script para registrar usuarios de prueba y comprobar autentificación
// Uso: tsx registra_usuarios.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

const usuarios_prueba = [
  {
    email: 'admin@tiendaprado.com',
    nombre: 'Administrador',
    contraseña_plana: 'admin123',
    admin: true
  },
  {
    email: 'usuario@tiendaprado.com',
    nombre: 'Usuario Normal',
    contraseña_plana: 'user123',
    admin: false
  },
  {
    email: 'cliente@tiendaprado.com',
    nombre: 'Cliente Ejemplo',
    contraseña_plana: 'cliente123',
    admin: false
  }
];

async function registrar() {
  console.log('📝 Registrando usuarios de prueba...\n');

  for (const u of usuarios_prueba) {
    // Hashear contraseña
    const contraseña = await bcrypt.hash(u.contraseña_plana, SALT_ROUNDS);

    try {
      const usuario = await prisma.usuario.upsert({
        where: { email: u.email },
        update: { contraseña, nombre: u.nombre, admin: u.admin },
        create: { email: u.email, nombre: u.nombre, contraseña, admin: u.admin }
      });
      console.log(`✅ Registrado: ${usuario.email} (admin: ${usuario.admin})`);
    } catch (error: any) {
      console.error(`❌ Error registrando ${u.email}:`, error.message);
    }
  }
}

async function comprobar() {
  console.log('\n🔍 Comprobando autentificación...\n');

  for (const u of usuarios_prueba) {
    try {
      const usuario = await prisma.usuario.findUnique({ where: { email: u.email } });

      if (!usuario) {
        console.log(`❌ Usuario no encontrado: ${u.email}`);
        continue;
      }

      const ok = await bcrypt.compare(u.contraseña_plana, usuario.contraseña);
      if (ok) {
        console.log(`✅ Autentificación correcta: ${u.email} con contraseña "${u.contraseña_plana}"`);
      } else {
        console.log(`❌ Contraseña incorrecta para: ${u.email}`);
      }
    } catch (error: any) {
      console.error(`❌ Error comprobando ${u.email}:`, error.message);
    }
  }
}

await registrar();
await comprobar();
await prisma.$disconnect();
console.log('\n✅ Listo.');
