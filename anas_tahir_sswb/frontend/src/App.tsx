import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Portada from './pages/Portada'
import Tarea9 from './pages/Tarea9'
import CarouselPage from './pages/CarouselPage'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import Books from './pages/Books'
import Exhibitions from './pages/Exhibitions'
import Collaborations from './pages/Collaborations'
import Prints from './pages/Prints'
import HomeDecor from './pages/HomeDecor'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/"          element={<Portada />} />
          <Route path="/tarea9"    element={<Tarea9 />} />
          <Route path="/carousel"  element={<CarouselPage />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/cart"      element={<Cart />} />
          <Route path="/profile"   element={<Profile />} />
          <Route path="/books"     element={<Books />} />
          <Route path="/exhibitions" element={<Exhibitions />} />
          <Route path="/collaborations" element={<Collaborations />} />
          <Route path="/prints"    element={<Prints />} />
          <Route path="/home"      element={<HomeDecor />} />
          <Route path="/checkout"  element={<Checkout />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App



