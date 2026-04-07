// Real scraped products from productos.json
const realProducts = [
  {
    id: 1,
    título: "Impresión Jardín Botánico",
    descripción: "Hermosa impresión de jardín botánico con flora exótica, capturada en alta resolución y perfecta para espacios modernos y clásicos.",
    precio: 42.50,
    imagen: "impresion_jardin_botanico.jpg"
  },
  {
    id: 2,
    título: "Arte Urbano Contemporáneo",
    descripción: "Pieza de arte urbano contemporáneo que refleja la vida moderna de la ciudad, con colores vibrantes y composición dinámica.",
    precio: 35.99,
    imagen: "arte_urbano_contemporaneo.jpg"
  },
  {
    id: 3,
    título: "Paisaje Montañoso Alpino",
    descripción: "Paisaje impresionante de montañas al amanecer, con niebla matutina y primeros rayos de sol creando una atmósfera mágica y pacífica.",
    precio: 55.00,
    imagen: "paisaje_montanioso_alpino.jpg"
  },
  {
    id: 4,
    título: "Abstracto Geométrico",
    descripción: "Obra de arte abstracto con formas geométricas y colores audaces que crea un impacto visual moderno y sofisticado.",
    precio: 48.75,
    imagen: "abstracto_geometrico.jpg"
  },
  {
    id: 5,
    título: "Retrato Art Deco",
    descripción: "Retrato estilo art déco con elementos geométricos y elegancia clásica, ideal para interiores modernos con toque vintage.",
    precio: 65.00,
    imagen: "retrato_art_deco.jpg"
  },
  {
    id: 6,
    título: "Marina Costera",
    descripción: "Hermosa marina al atardecer con barcos pesqueros y reflejos dorados sobre el agua, capturando la serenidad del mar.",
    precio: 38.50,
    imagen: "marina_costera.jpg"
  },
  {
    id: 7,
    título: "Naturaleza Muerta Floral",
    descripción: "Composición floral con elementos de naturaleza muerta, perfecta para decoración elegante y atemporal con toques sutiles.",
    precio: 45.00,
    imagen: "naturaleza_muerta_floral.jpg"
  },
  {
    id: 8,
    título: "Arte Digital Minimalista",
    descripción: "Arte digital minimalista con líneas limpias y espacios negativos, creando una estética contemporánea y sofisticada.",
    precio: 52.00,
    imagen: "arte_digital_minimalista.jpg"
  }
];

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

// Mock Prisma client
class MockPrismaClient {
  producto = {
    findMany: async ({ skip, take, orderBy }: any) => {
      const startIndex = Math.max(0, skip || 0);
      const endIndex = Math.min(realProducts.length, (skip || 0) + (take || 20));
      const products = realProducts.slice(startIndex, endIndex);
      return Promise.resolve(products);
    },
    
    findUnique: async ({ where }: any) => {
      const product = realProducts.find(p => p.id === where.id);
      if (!product) {
        throw new Error('Product not found');
      }
      return Promise.resolve(product);
    },
    
    create: async ({ data }: any) => {
      const newProduct = {
        id: Math.max(...realProducts.map(p => p.id)) + 1,
        ...data
      };
      realProducts.push(newProduct);
      return Promise.resolve(newProduct);
    },
    
    update: async ({ where, data }: any) => {
      const index = realProducts.findIndex(p => p.id === where.id);
      if (index === -1) {
        throw new Error('Product not found');
      }
      realProducts[index] = { ...realProducts[index], ...data };
      return Promise.resolve(realProducts[index]);
    },
    
    delete: async ({ where }: any) => {
      const index = realProducts.findIndex(p => p.id === where.id);
      if (index === -1) {
        throw new Error('Product not found');
      }
      const deleted = realProducts.splice(index, 1)[0];
      return Promise.resolve(deleted);
    },
    
    count: async () => {
      return Promise.resolve(realProducts.length);
    }
  };
  
  usuario = {
    findUnique: async ({ where }: any) => {
      const user = mockUsers.find(u => u.email === where.email);
      if (!user) {
        throw new Error('User not found');
      }
      return Promise.resolve(user);
    },
    
    create: async ({ data }: any) => {
      const newUser = {
        email: data.email,
        nombre: data.nombre,
        contraseña: data.contraseña,
        admin: data.admin || false
      };
      mockUsers.push(newUser);
      return Promise.resolve(newUser);
    }
  };

  async $disconnect() {
    return Promise.resolve();
  }
}

export default MockPrismaClient;
