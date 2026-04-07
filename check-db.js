const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkProducts() {
  try {
    const count = await prisma.producto.count();
    const products = await prisma.producto.findMany({ take: 5 });
    console.log('Total products:', count);
    console.log('Sample products:');
    products.forEach(p => {
      console.log('- ID:', p.id, 'Title:', p.título, 'Price:', p.precio, 'Image:', p.imagen ? 'YES' : 'NO');
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
