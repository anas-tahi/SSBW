import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Header from '../components/Header';

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-prado-light">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-prado-dark mb-4">Order Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been successfully placed and will be processed shortly.
            You will receive a confirmation email with your order details.
          </p>
          
          <div className="space-y-4">
            <Link to="/" className="btn-primary inline-block w-full">
              Continue Shopping
            </Link>
            <Link to="/profile" className="block text-prado-red hover:text-red-700">
              View Order History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



