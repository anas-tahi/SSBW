import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import Header from '../components/Header';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <div className="min-h-screen bg-prado-light">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-prado-dark mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link 
              to="/" 
              className="btn-primary inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0">
                  <img
                    src={item.imagen || '/placeholder.jpg'}
                    alt={item.título}
                    className="w-24 h-24 object-cover rounded"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-prado-dark">{item.título}</h3>
                    <p className="text-prado-red font-bold">€{item.precio.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                      className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.cantidad}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                      className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-prado-dark">
                      €{(item.precio * item.cantidad).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Subtotal ({cartCount} items)</span>
                <span className="text-xl font-bold text-prado-dark">€{cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600">Shipping</span>
                <span className="text-prado-dark">Free</span>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-prado-dark">Total</span>
                  <span className="text-2xl font-bold text-prado-red">€{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link 
                to="/checkout" 
                className="btn-primary block text-center mb-4"
              >
                Proceed to Checkout
              </Link>

              <Link 
                to="/" 
                className="block text-center text-prado-red hover:text-red-700"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
