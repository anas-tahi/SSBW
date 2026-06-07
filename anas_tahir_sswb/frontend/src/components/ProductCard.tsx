import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '../types'
import { useCart } from '../contexts/CartContext'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square overflow-hidden bg-prado-red flex items-center justify-center">
        {product.imagen ? (
          <img 
            src={product.imagen} 
            alt={product.título}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className="hidden w-full h-full flex items-center justify-center text-white p-4 text-center">
          <div>
            <div className="text-4xl mb-2">📦</div>
            <p className="text-sm font-medium">{product.título}</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-prado-dark mb-2 line-clamp-1">
          {product.título}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.descripción}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-prado-red font-bold text-xl">
            €{Number(product.precio).toFixed(2)}
          </span>
          
          <div className="flex gap-2">
            <Link 
              to={`/producto/${product.id}`}
              className="px-3 py-2 text-sm border border-prado-red text-prado-red rounded-lg 
                       hover:bg-prado-red hover:text-white transition-all"
            >
              View
            </Link>
            
            <button 
              onClick={handleAddToCart}
              className="p-2 bg-prado-red text-white rounded-lg 
                       hover:bg-red-700 transition-all"
              title="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
