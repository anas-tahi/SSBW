// Tarea 3: Script para poblar la BD con datos de productos.json
// Uso: npm run seed  (o: tsx prisma/seed.ts)

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

type ProductoJSON = {
  título: string
  descripción: string
  texto_precio: string
  imagen: string
}

async function Guardar_en_DB(productos: ProductoJSON[]): Promise<void> {
  for (const producto of productos) {
    const título      = producto.título
    const descripción = producto.descripción
    const imagen      = producto.imagen

    // Convierte "30,00 €" → 30.00
    const precio = Number(
      producto.texto_precio
        .replace(/[^\d,]/g, '')   // quita todo excepto dígitos y coma
        .replace(',', '.')        // coma → punto decimal
    )

    try {
      const prod = await prisma.producto.create({
        data: { título, descripción, imagen, precio }
      })
      console.log('✅ Creado:', prod.título, '—', prod.precio, '€')
    } catch (error: any) {
      console.error('❌ Error:', error.message, '—', título)
    }
  }
}

async function main() {
  console.log('🌱 Iniciando seed de la BD...\n')

  // Leer productos.json (desde raíz del proyecto)
  const productosPath = join(__dirname, '..', 'productos.json')
  const productos: ProductoJSON[] = JSON.parse(readFileSync(productosPath, 'utf-8'))
  console.log(`📦 ${productos.length} productos encontrados en productos.json\n`)

  // Limpiar tabla antes de insertar
  await prisma.producto.deleteMany()
  console.log('🗑️  Tabla productos vaciada\n')

  await Guardar_en_DB(productos)

  // Consulta de comprobación — productos con descripción no vacía ordenados por precio
  const muestra = await prisma.producto.findMany({
    where: { descripción: { not: '' } },
    orderBy: { precio: 'asc' },
    take: 5,
    select: { id: true, título: true, precio: true }
  })
  console.log('\n📊 Muestra (5 más baratos con descripción):')
  muestra.forEach(p => console.log(`  #${p.id} ${p.título.trim()} — ${p.precio} €`))

  await prisma.$disconnect()
  console.log('\n✅ Seed completado.')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
