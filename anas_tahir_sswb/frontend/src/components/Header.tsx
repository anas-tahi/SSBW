import { Link } from 'react-router-dom'
import { ShoppingCart, Search, User, Menu, X, Globe, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { cartCount } = useCart()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-prado-dark text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <a href="https://www.imagebankmuseodelprado.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
            IMAGE BANK
          </a>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe size={16} />
              <span className="cursor-pointer hover:text-gray-300">EN</span>
              <span className="text-gray-400">|</span>
              <a href="/es" className="hover:text-gray-300 transition-colors">ES</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-prado-dark">
              TIENDA PRADO
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-prado-red"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/profile" className="hidden md:flex items-center gap-2 text-prado-dark hover:text-prado-red transition-colors">
                  <User size={20} />
                  <span>{user.nombre}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 text-prado-dark hover:text-prado-red transition-colors"
                >
                  <LogOut size={20} />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-2 text-prado-dark hover:text-prado-red transition-colors">
                <User size={20} />
                <span>Sign in</span>
              </Link>
            )}
            
            <Link to="/cart" className="relative flex items-center gap-2 text-prado-dark hover:text-prado-red transition-colors">
              <ShoppingCart size={20} />
              <span className="hidden md:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-prado-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-prado-dark hover:text-prado-red transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 py-3 border-t border-gray-100">
          <Link to="/books" className="text-prado-dark hover:text-prado-red transition-colors font-medium">
            BOOKS
          </Link>
          <Link to="/exhibitions" className="text-prado-dark hover:text-prado-red transition-colors font-medium">
            EXHIBITIONS
          </Link>
          <Link to="/collaborations" className="text-prado-dark hover:text-prado-red transition-colors font-medium">
            COLLABORATIONS
          </Link>
          <Link to="/prints" className="text-prado-dark hover:text-prado-red transition-colors font-medium">
            PRINTS
          </Link>
          <Link to="/home" className="text-prado-dark hover:text-prado-red transition-colors font-medium">
            HOME
          </Link>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              <Link 
                to="/books" 
                className="py-2 text-prado-dark hover:text-prado-red transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                BOOKS
              </Link>
              <Link 
                to="/exhibitions" 
                className="py-2 text-prado-dark hover:text-prado-red transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                EXHIBITIONS
              </Link>
              <Link 
                to="/collaborations" 
                className="py-2 text-prado-dark hover:text-prado-red transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                COLLABORATIONS
              </Link>
              <Link 
                to="/prints" 
                className="py-2 text-prado-dark hover:text-prado-red transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                PRINTS
              </Link>
              <Link 
                to="/home" 
                className="py-2 text-prado-dark hover:text-prado-red transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                HOME
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="py-2 text-prado-dark hover:text-prado-red transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="py-2 text-prado-dark hover:text-prado-red transition-colors text-left"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="py-2 text-prado-dark hover:text-prado-red transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
