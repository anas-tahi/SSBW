import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-dark-800 rounded-xl overflow-hidden card-hover border border-gold-500/10">
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.imagen || '/placeholder.jpg'} 
          alt={product.título}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
          {product.título}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.descripción}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-gold-400 font-bold text-xl">
            ¥{product.precio.toFixed(2)}
          </span>
          
          <div className="flex gap-2">
            <Link 
              to={`/producto/${product.id}`}
              className="px-3 py-2 text-sm border border-gold-500 text-gold-400 rounded-lg 
                       hover:bg-gold-500 hover:text-dark-900 transition-all"
            >
              Ver
            </Link>
            
            <button className="p-2 bg-gold-500 text-dark-900 rounded-lg 
                             hover:bg-gold-400 transition-all">
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
