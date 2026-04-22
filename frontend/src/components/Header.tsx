import { Link } from 'react-router-dom'
import { ShoppingCart, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-dark-800 border-b border-gold-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gold-400">
              Tienda Prado
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-gold-400 transition-colors"
            >
              Inicio
            </Link>
            <Link 
              to="/" 
              className="text-gray-300 hover:text-gold-400 transition-colors"
            >
              Productos
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-300 hover:text-gold-400 transition-colors">
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
            
            <button className="p-2 text-gray-300 hover:text-gold-400 transition-colors">
              <User size={24} />
            </button>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-gray-300 hover:text-gold-400 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gold-500/20">
            <Link 
              to="/" 
              className="block py-2 text-gray-300 hover:text-gold-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              to="/" 
              className="block py-2 text-gray-300 hover:text-gold-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Productos
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
