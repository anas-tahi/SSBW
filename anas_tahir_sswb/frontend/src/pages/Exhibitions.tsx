import Header from '../components/Header';
import ProductCard from '../components/ProductCard';

const exhibitionsData = [
  {
    id: 2001,
    título: "Paolo Veronese 1528-1588 (English)",
    descripción: "Catalogue published on the occasion of the exhibition Paolo Veronese (1528-1588). Texts by Enrico Maria Dal Pozzolo and Miguel Falomir. Hardcover. 23 x 28.5 cm. 456 pages.",
    precio: 37.00,
    imagen: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=400&fit=crop",
    categoria: "EXHIBITIONS"
  },
  {
    id: 2002,
    título: "Paolo Veronese 1528-1588 (Spanish)",
    descripción: "Catalogue published on the occasion of the exhibition Paolo Veronese (1528-1588). Texts by Enrico Maria Dal Pozzolo and Miguel Falomir. Spanish edition.",
    precio: 37.00,
    imagen: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
    categoria: "EXHIBITIONS"
  },
  {
    id: 2003,
    título: "Guadalupe of Mexico",
    descripción: "Exhibition catalog exploring the influence of the Virgin of Guadalupe in Spanish art.",
    precio: 32.00,
    imagen: "https://images.unsplash.com/photo-1577720643272-265f09367456?w=400&h=400&fit=crop",
    categoria: "EXHIBITIONS"
  },
  {
    id: 2004,
    título: "The Female Perspective III: Queen Isabella Farnese",
    descripción: "Catalog exploring the female perspective in art history, focusing on Queen Isabella Farnese.",
    precio: 28.00,
    imagen: "https://images.unsplash.com/photo-1574359411659-18893a4b7c6f?w=400&h=400&fit=crop",
    categoria: "EXHIBITIONS"
  },
  {
    id: 2005,
    título: "\"Young Man from the Sanuto Family\" silk scarf",
    descripción: "100% italian silk. 90 × 90 cm. Exclusive design. Printed and manufactured in Italy.",
    precio: 175.00,
    imagen: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=400&fit=crop",
    categoria: "EXHIBITIONS"
  },
  {
    id: 2006,
    título: "Veronese candel",
    descripción: "Cerabella, handcrafted manufacturing of high quality candles in Barcelona since 1862.",
    precio: 35.00,
    imagen: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=400&fit=crop",
    categoria: "EXHIBITIONS"
  },
  {
    id: 2007,
    título: "Veronese Candelholder",
    descripción: "Exclusive edition – Venetian glass. Due Zeta for Museo del Prado. 28,5 cm height.",
    precio: 150.00,
    imagen: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    categoria: "EXHIBITIONS"
  },
  {
    id: 2008,
    título: "Veronese earrings",
    descripción: "Exclusive edition – Veronese Collection. Patrizia Corvaglia for the Prado Museum.",
    precio: 100.00,
    imagen: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=400&fit=crop",
    categoria: "EXHIBITIONS"
  }
];

export default function Exhibitions() {
  return (
    <div className="min-h-screen bg-prado-light">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-prado-dark mb-2">EXHIBITIONS</h1>
        <p className="text-gray-600 mb-8">Explore current and past exhibitions at the Prado Museum</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {exhibitionsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}



