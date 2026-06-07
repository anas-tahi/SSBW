import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, CreditCard } from 'lucide-react'
import Header from '../components/Header'
import type { Product } from '../types'
import { useCart } from '../contexts/CartContext'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
    }
  }

  const handleComprar = () => {
    handleAddToCart()
    navigate('/cart')
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/productos/${id}`)
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-prado-red"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Product not found</p>
        <Link to="/" className="text-prado-red hover:text-red-700 mt-4 inline-block">
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-prado-light">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-prado-red mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to products
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-white border border-gray-200">
            <img 
              src={product.imagen || '/placeholder.jpg'} 
              alt={product.título}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-prado-red text-sm font-medium mb-2 uppercase">
              {product.categoria}
            </span>
            
            <h1 className="text-3xl font-bold text-prado-dark mb-4">
              {product.título}
            </h1>
            
            <p className="text-gray-600 mb-6 flex-grow">
              {product.descripción}
            </p>
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold text-prado-red">
                €{product.precio.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="btn-primary flex items-center justify-center gap-2 flex-1"
              >
                <ShoppingCart size={20} />
                Añadir
              </button>
              <button
                onClick={handleComprar}
                className="flex items-center justify-center gap-2 flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all font-medium"
              >
                <CreditCard size={20} />
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}





