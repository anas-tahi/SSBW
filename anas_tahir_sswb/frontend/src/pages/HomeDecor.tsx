import Header from '../components/Header';
import ProductCard from '../components/ProductCard';

const homeData = [
  {
    id: 5001,
    título: "Decor",
    descripción: "Home decor items inspired by Prado Museum masterpieces. Still life collection, wooden figures, and decorative wall systems.",
    precio: 35.00,
    imagen: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    categoria: "HOME"
  },
  {
    id: 5002,
    título: "Still life collection box",
    descripción: "Complete collection of tin plates featuring still life paintings from the Prado Museum.",
    precio: 85.00,
    imagen: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=400&fit=crop",
    categoria: "HOME"
  },
  {
    id: 5003,
    título: "\"Still life with artichokes\" tin plate",
    descripción: "Decorative tin plate featuring still life with artichokes from the Prado collection.",
    precio: 18.00,
    imagen: "https://images.unsplash.com/photo-1518998053901-5348d3969105?w=400&h=400&fit=crop",
    categoria: "HOME"
  },
  {
    id: 5004,
    título: "Large wooden Menina",
    descripción: "Handcrafted wooden Menina figure, a classic symbol of the Prado Museum.",
    precio: 45.00,
    imagen: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=400&fit=crop",
    categoria: "HOME"
  },
  {
    id: 5005,
    título: "Small wooden Menina",
    descripción: "Handcrafted wooden Menina figure in various colors. Perfect for home decoration.",
    precio: 25.00,
    imagen: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=400&fit=crop",
    categoria: "HOME"
  },
  {
    id: 5006,
    título: "\"Las Meninas\" IXXI decorative wall system",
    descripción: "Modern wall system featuring Velázquez's masterpiece Las Meninas. Create your own art arrangement.",
    precio: 120.00,
    imagen: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=400&fit=crop",
    categoria: "HOME"
  },
  {
    id: 5007,
    título: "\"The Garden of Earthly Delights\" IXXI decorative wall system",
    descripción: "IXXI wall system featuring Bosch's masterpiece. Available in different panel configurations.",
    precio: 150.00,
    imagen: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop",
    categoria: "HOME"
  },
  {
    id: 5008,
    título: "Table",
    descripción: "Tableware and dining items inspired by Prado Museum artworks. Elegant designs for your home.",
    precio: 55.00,
    imagen: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    categoria: "HOME"
  }
];

export default function HomeDecor() {
  return (
    <div className="min-h-screen bg-prado-light">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-prado-dark mb-2">HOME</h1>
        <p className="text-gray-600 mb-8">Home decor and lifestyle products inspired by the Prado Museum collection</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {homeData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}



