import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';

const featuredProducts = [
  {
    id: 1001,
    título: "The Prado Masterpieces",
    descripción: "New edition of The Prado Masterpieces in a new format and with all the images updated by the Photographic Archive of the Museo Nacional del Prado.",
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
    descripción: "Catalogue published on the occasion of the exhibition Paolo Veronese (1528-1588).",
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

const Portada = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-prado-light">
      <Header />
      
      {/* Hero Banner */}
      <div className="relative h-96 bg-prado-dark flex items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://via.placeholder.com/1920x400/c8102e/ffffff?text=Prado+Museum"
            alt="Prado Museum"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">TIENDA PRADO</h1>
          <p className="text-xl text-gray-200">Official Store of the Museo Nacional del Prado</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Featured Products Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-prado-dark">Featured Products</h2>
          <p className="text-gray-600 mb-8">Discover our most popular items</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-prado-dark">Browse by Category</h2>
          <p className="text-gray-600 mb-8">Explore our curated collections</p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <button 
              onClick={() => navigate('/books')}
              className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-prado-red hover:shadow-lg transition-all text-center group"
            >
              <div className="text-4xl mb-4">📚</div>
              <h3 className="font-semibold text-prado-dark group-hover:text-prado-red transition-colors">BOOKS</h3>
            </button>
            <button 
              onClick={() => navigate('/exhibitions')}
              className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-prado-red hover:shadow-lg transition-all text-center group"
            >
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-semibold text-prado-dark group-hover:text-prado-red transition-colors">EXHIBITIONS</h3>
            </button>
            <button 
              onClick={() => navigate('/collaborations')}
              className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-prado-red hover:shadow-lg transition-all text-center group"
            >
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-semibold text-prado-dark group-hover:text-prado-red transition-colors">COLLABORATIONS</h3>
            </button>
            <button 
              onClick={() => navigate('/prints')}
              className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-prado-red hover:shadow-lg transition-all text-center group"
            >
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className="font-semibold text-prado-dark group-hover:text-prado-red transition-colors">PRINTS</h3>
            </button>
            <button 
              onClick={() => navigate('/home')}
              className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-prado-red hover:shadow-lg transition-all text-center group"
            >
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="font-semibold text-prado-dark group-hover:text-prado-red transition-colors">HOME</h3>
            </button>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-prado-red text-white rounded-lg p-8 mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="mb-6">Stay updated with new arrivals and exclusive offers</p>
            <div className="flex gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-3 rounded text-prado-dark w-full max-w-md focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-prado-dark text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-prado-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-4">TIENDA PRADO</h3>
              <p className="text-gray-400 text-sm">Official store of the Museo Nacional del Prado</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Customer Service</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Information</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Tienda Prado. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portada;
