import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import OfflineIndicator from './components/OfflineIndicator';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import OrderConfirmation from './pages/OrderConfirmation';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminLogin from './pages/AdminLogin';
import AdminRoute from './components/AdminRoute';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import AdminCookies from './pages/admin/AdminCookies';
function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="bg-white text-black dark:bg-slate-900 dark:text-white transition-colors duration-300">
        <OfflineIndicator />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            } />
            <Route path="/admin/customers" element={
              <AdminRoute>
                <AdminCustomers />
              </AdminRoute>
            } />
            <Route path='/terms' element={<Terms />} />
            <Route path='/privacy' element={<Privacy />} />
            <Route path="/admin/cookies" element={
              <AdminRoute>
                <AdminCookies />
              </AdminRoute>
            } />
            <Route path="*" element={<div className="text-center py-20">Page Not Found</div>} />
          </Routes>
        </main>
        <Footer />
        <CartSidebar />
      </div>
    </Router>
  );
}

export default App;