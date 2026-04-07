import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProducts() {
  try {
    const count = await prisma.producto.count();
    console.log(`Total products in database: ${count}`);
    
    if (count > 0) {
      const products = await prisma.producto.findMany({ take: 5 });
      console.log('First 5 products:');
      products.forEach(p => console.log(`- ${p.título} (${p.precio} EUR)`));
    } else {
      console.log('No products found in database');
    }
  } catch (error) {
    console.error('Error checking products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
