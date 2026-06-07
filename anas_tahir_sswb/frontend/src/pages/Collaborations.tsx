import Header from '../components/Header';
import ProductCard from '../components/ProductCard';

const collaborationsData = [
  {
    id: 3001,
    título: "PRADO COLLECTION",
    descripción: "Museo del Prado x NWHR collaboration. Exclusive collection of products inspired by the Prado Museum's masterpieces.",
    precio: 45.00,
    imagen: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    categoria: "COLLABORATIONS"
  },
  {
    id: 3002,
    título: "TOMON HYAKKA COLLECTION",
    descripción: "Museo del Prado x NWHR collaboration. Traditional Japanese designs inspired by Prado artworks.",
    precio: 55.00,
    imagen: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=400&fit=crop",
    categoria: "COLLABORATIONS"
  },
  {
    id: 3003,
    título: "Museo del Prado x HUMA",
    descripción: "Collaboration with HUMA brand creating unique products inspired by the museum's collection.",
    precio: 38.00,
    imagen: "https://images.unsplash.com/photo-1518998053901-5348d3969105?w=400&h=400&fit=crop",
    categoria: "COLLABORATIONS"
  },
  {
    id: 3004,
    título: "Museo del Prado x JOAQUÍN RISUEÑO",
    descripción: "Exclusive collaboration with designer Joaquín Risueño featuring Prado-inspired designs.",
    precio: 42.00,
    imagen: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop",
    categoria: "COLLABORATIONS"
  },
  {
    id: 3005,
    título: "Museo del Prado x MOISÉS NIETO",
    descripción: "Collaboration with Moisés Nieto creating fashion pieces inspired by Prado masterpieces.",
    precio: 65.00,
    imagen: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=400&fit=crop",
    categoria: "COLLABORATIONS"
  },
  {
    id: 3006,
    título: "Museo del Prado x CHUS BURÉS",
    descripción: "Exclusive jewelry collection by Chus Burés inspired by the Prado Museum's art.",
    precio: 120.00,
    imagen: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    categoria: "COLLABORATIONS"
  },
  {
    id: 3007,
    título: "Museo del Prado x FACTUM FOUNDATION",
    descripción: "Collaboration with Factum Foundation creating reproductions and art pieces.",
    precio: 85.00,
    imagen: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop",
    categoria: "COLLABORATIONS"
  },
  {
    id: 3008,
    título: "Museo del Prado x PACCARI",
    descripción: "Exclusive collaboration with PACCARI creating unique chocolate products inspired by art.",
    precio: 25.00,
    imagen: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    categoria: "COLLABORATIONS"
  }
];

export default function Collaborations() {
  return (
    <div className="min-h-screen bg-prado-light">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-prado-dark mb-2">COLLABORATIONS</h1>
        <p className="text-gray-600 mb-8">Exclusive collaborations with renowned designers and brands</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collaborationsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
