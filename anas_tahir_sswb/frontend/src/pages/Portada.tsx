import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';

const Portada = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/productos`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data.slice(0, 8)); // Show first 8 products
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

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
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-prado-red"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
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
              <div className="text-4xl mb-4">??</div>
              <h3 className="font-semibold text-prado-dark group-hover:text-prado-red transition-colors">BOOKS</h3>
            </button>
            <button 
              onClick={() => navigate('/exhibitions')}
              className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-prado-red hover:shadow-lg transition-all text-center group"
            >
              <div className="text-4xl mb-4">??</div>
              <h3 className="font-semibold text-prado-dark group-hover:text-prado-red transition-colors">EXHIBITIONS</h3>
            </button>
            <button 
              onClick={() => navigate('/collaborations')}
              className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-prado-red hover:shadow-lg transition-all text-center group"
            >
              <div className="text-4xl mb-4">??</div>
              <h3 className="font-semibold text-prado-dark group-hover:text-prado-red transition-colors">COLLABORATIONS</h3>
            </button>
            <button 
              onClick={() => navigate('/prints')}
              className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-prado-red hover:shadow-lg transition-all text-center group"
            >
              <div className="text-4xl mb-4">???</div>
              <h3 className="font-semibold text-prado-dark group-hover:text-prado-red transition-colors">PRINTS</h3>
            </button>
            <button 
              onClick={() => navigate('/home')}
              className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-prado-red hover:shadow-lg transition-all text-center group"
            >
              <div className="text-4xl mb-4">??</div>
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



