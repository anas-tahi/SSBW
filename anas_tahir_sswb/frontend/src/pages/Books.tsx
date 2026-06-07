import Header from '../components/Header';
import ProductCard from '../components/ProductCard';

const booksData = [
  {
    id: 1001,
    título: "The Prado Masterpieces",
    descripción: "New edition of The Prado Masterpieces in a new format and with all the images updated by the Photographic Archive of the Museo Nacional del Prado. Hardcover. 24 x 27.7 cm. 496 pages.",
    precio: 55.00,
    imagen: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400&h=400&fit=crop",
    categoria: "BOOKS"
  },
  {
    id: 1002,
    título: "The Prado Guide (English)",
    descripción: "Official guide to the Prado Museum in English. Complete guide to the museum's collection and history.",
    precio: 35.00,
    imagen: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    categoria: "BOOKS"
  },
  {
    id: 1003,
    título: "The Dauphin's Treasure",
    descripción: "Catalog of the Dauphin's Treasure collection. Detailed study of this important royal collection.",
    precio: 45.00,
    imagen: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=400&fit=crop",
    categoria: "BOOKS"
  },
  {
    id: 1004,
    título: "The Prado Visual Guide",
    descripción: "Visual guide to the Prado Museum's masterpieces with high-quality images.",
    precio: 40.00,
    imagen: "https://images.unsplash.com/photo-1518998053901-5348d3969105?w=400&h=400&fit=crop",
    categoria: "BOOKS"
  },
  {
    id: 1005,
    título: "Paolo Veronese 1528-1588 (English)",
    descripción: "Catalogue published on the occasion of the exhibition Paolo Veronese (1528-1588). Texts by Enrico Maria Dal Pozzolo and Miguel Falomir. Hardcover. 23 x 28.5 cm. 456 pages.",
    precio: 37.00,
    imagen: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=400&fit=crop",
    categoria: "BOOKS"
  },
  {
    id: 1006,
    título: "Anton Raphael Mengs 1728-1779 (English)",
    descripción: "Catalog of the works of Anton Raphael Mengs. Comprehensive study of this important neoclassical painter.",
    precio: 42.00,
    imagen: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
    categoria: "BOOKS"
  },
  {
    id: 1007,
    título: "Juan Muñoz. Stories of Art",
    descripción: "Monograph on the work of Juan Muñoz, one of Spain's most important contemporary artists.",
    precio: 38.00,
    imagen: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=400&fit=crop",
    categoria: "BOOKS"
  },
  {
    id: 1008,
    título: "Guadalupe de México en España",
    descripción: "Study of the influence of the Virgin of Guadalupe in Spanish art and culture.",
    precio: 32.00,
    imagen: "https://images.unsplash.com/photo-1577720643272-265f09367456?w=400&h=400&fit=crop",
    categoria: "BOOKS"
  }
];

export default function Books() {
  return (
    <div className="min-h-screen bg-prado-light">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-prado-dark mb-2">BOOKS</h1>
        <p className="text-gray-600 mb-8">Explore our collection of books about the Prado Museum and its masterpieces</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {booksData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
