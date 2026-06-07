import Header from '../components/Header';
import ProductCard from '../components/ProductCard';

const printsData = [
  {
    id: 4001,
    título: "Print on Demand",
    descripción: "High-quality prints on demand of your favorite Prado Museum masterpieces. Various sizes available.",
    precio: 25.00,
    imagen: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=400&fit=crop",
    categoria: "PRINTS"
  },
  {
    id: 4002,
    título: "Prints and Posters",
    descripción: "Collection of prints and posters featuring famous artworks from the Prado Museum.",
    precio: 18.00,
    imagen: "https://images.unsplash.com/photo-1518998053901-5348d3969105?w=400&h=400&fit=crop",
    categoria: "PRINTS"
  },
  {
    id: 4003,
    título: "Wood Print",
    descripción: "Art prints on high-quality wood, adding a unique texture to your favorite masterpieces.",
    precio: 45.00,
    imagen: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop",
    categoria: "PRINTS"
  },
  {
    id: 4004,
    título: "Puzzle and foldable postcards",
    descripción: "Interactive puzzles and foldable postcards featuring Prado artworks.",
    precio: 15.00,
    imagen: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    categoria: "PRINTS"
  },
  {
    id: 4005,
    título: "Impresiones enmarcadas",
    descripción: "Framed prints ready to hang, featuring the most iconic works from the Prado Museum.",
    precio: 85.00,
    imagen: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=400&fit=crop",
    categoria: "PRINTS"
  },
  {
    id: 4006,
    título: "\"The Garden of Earthly Delights\" (yellow building) Tako",
    descripción: "3D wooden construction kit inspired by Bosch's masterpiece. Yellow building edition.",
    precio: 35.00,
    imagen: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop",
    categoria: "PRINTS"
  },
  {
    id: 4007,
    título: "\"The Garden of Earthly Delights\" (blue building) Tako",
    descripción: "3D wooden construction kit inspired by Bosch's masterpiece. Blue building edition.",
    precio: 35.00,
    imagen: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop",
    categoria: "PRINTS"
  },
  {
    id: 4008,
    título: "\"The Garden of Earthly Delights\" (pink building) Tako",
    descripción: "3D wooden construction kit inspired by Bosch's masterpiece. Pink building edition.",
    precio: 35.00,
    imagen: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop",
    categoria: "PRINTS"
  }
];

export default function Prints() {
  return (
    <div className="min-h-screen bg-prado-light">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-prado-dark mb-2">PRINTS</h1>
        <p className="text-gray-600 mb-8">High-quality prints and reproductions of Prado Museum masterpieces</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {printsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}



