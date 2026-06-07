import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, CreditCard, MapPin, User } from 'lucide-react';
import Header from '../components/Header';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'Spain',
    tarjeta: '',
    expiracion: '',
    cvv: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate checkout process
    setTimeout(() => {
      clearCart();
      navigate('/checkout-success');
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-prado-light">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link to="/" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-prado-light">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-prado-dark mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-prado-dark mb-4 flex items-center gap-2">
                <User size={20} />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-prado-red"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-prado-red"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-prado-red"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-prado-dark mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-prado-red"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-prado-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-prado-red"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="pais"
                    value={formData.pais}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-prado-red"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-prado-dark mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Payment Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="tarjeta"
                    value={formData.tarjeta}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-prado-red"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiration</label>
                    <input
                      type="text"
                      name="expiracion"
                      value={formData.expiracion}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-prado-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-prado-red"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-prado-dark mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.imagen || '/placeholder.jpg'}
                      alt={item.título}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-prado-dark text-sm">{item.título}</h3>
                      <p className="text-gray-600 text-sm">Qty: {item.cantidad}</p>
                    </div>
                    <p className="font-bold text-prado-dark">
                      €{(item.precio * item.cantidad).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>€{(cartTotal * 0.21).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold text-prado-dark">
                    <span>Total</span>
                    <span>€{(cartTotal * 1.21).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full btn-primary mt-6"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>

              <Link
                to="/cart"
                className="block text-center text-prado-red hover:text-red-700 mt-4"
              >
                Return to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



