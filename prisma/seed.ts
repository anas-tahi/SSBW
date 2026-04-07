import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Read products from JSON file
    const productsPath = join(__dirname, '..', 'data', 'products.json');
    const productsData = JSON.parse(readFileSync(productsPath, 'utf-8'));
    
    console.log(`📦 Found ${productsData.length} products to seed`);
    
    // Clear existing products
    await prisma.producto.deleteMany();
    console.log('🧹 Cleared existing products');
    
    // Insert products
    for (const product of productsData) {
      await prisma.producto.create({
        data: {
          título: product.título,
          descripción: product.descripción,
          precio: product.precio,
          imagen: product.imagen
        }
      });
      console.log(`✅ Inserted: ${product.título}`);
    }
    
    console.log(`🎉 Successfully seeded ${productsData.length} products!`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from database');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
