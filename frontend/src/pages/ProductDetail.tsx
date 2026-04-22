import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import type { Product } from '../types'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/productos/${id}`)
      const data = await response.json()
      if (data.success) {
        setProduct(data.data)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-400"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Producto no encontrado</p>
        <Link to="/" className="text-gold-400 hover:text-gold-300 mt-4 inline-block">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-400 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Volver a productos
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square rounded-xl overflow-hidden bg-dark-800">
          <img 
            src={product.imagen || '/placeholder.jpg'} 
            alt={product.título}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <span className="text-gold-400 text-sm font-medium mb-2">
            {product.categoria}
          </span>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            {product.título}
          </h1>
          
          <p className="text-gray-400 mb-6 flex-grow">
            {product.descripción}
          </p>
          
          <div className="flex items-center justify-between mb-6">
            <span className="text-3xl font-bold text-gold-400">
              ¥{product.precio.toFixed(2)}
            </span>
          </div>
          
          <button className="btn-primary flex items-center justify-center gap-2 w-full">
            <ShoppingCart size={20} />
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  )
}
