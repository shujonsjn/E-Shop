import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileBottomNav from './components/MobileBottomNav'
import WhatsAppFloat from './components/WhatsAppFloat'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Track from './pages/Track'
import MyOrders from './pages/MyOrders'
import Wishlist from './pages/Wishlist'
import Account from './pages/Account'
import Brands from './pages/Brands'
import BrandDetail from './pages/BrandDetail'
import ContentPage from './pages/ContentPage'
import NotFound from './pages/NotFound'

// Admin
import AdminLayout from './admin/layout/AdminLayout'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminProducts from './admin/pages/AdminProducts'
import AdminProductForm from './admin/pages/AdminProductForm'
import AdminCategories from './admin/pages/AdminCategories'
import AdminOrders from './admin/pages/AdminOrders'
import AdminUsers from './admin/pages/AdminUsers'
import AdminStaff from './admin/pages/AdminStaff'
import AdminReviews from './admin/pages/AdminReviews'
import AdminDelivery from './admin/pages/AdminDelivery'
import AdminMarketing from './admin/pages/AdminMarketing'
import AdminPayments from './admin/pages/AdminPayments'
import AdminAccounts from './admin/pages/AdminAccounts'
import AdminReports from './admin/pages/AdminReports'
import AdminSiteContent from './admin/pages/AdminSiteContent'
import AdminHomeLayout from './admin/pages/AdminHomeLayout'
import AdminPages from './admin/pages/AdminPages'
import AdminBrands from './admin/pages/AdminBrands'

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow pb-14 lg:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Shop */}
          <Route path="/shop" element={<Products />} />
          <Route path="/collections/:categorySlug" element={<Products />} />
          <Route path="/collections/:categorySlug/:subSlug" element={<Products />} />
          <Route path="/search" element={<Products />} />
          <Route path="/offer-zone" element={<Products />} />

          {/* Products */}
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Cart & checkout */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />

          {/* Tracking */}
          <Route path="/track" element={<Track />} />
          <Route path="/track/:orderId" element={<Track />} />
          <Route path="/order-tracking/:orderId" element={<Track />} />

          {/* Auth & account */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/my/orders" element={<MyOrders />} />
          <Route path="/my/wishlists" element={<Wishlist />} />
          <Route path="/my-orders" element={<MyOrders />} />

          {/* Brands & content */}
          <Route path="/brands" element={<Brands />} />
          <Route path="/brand/:slug" element={<BrandDetail />} />
          <Route path="/page/:slug" element={<ContentPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="home-layout" element={<AdminHomeLayout />} />
            <Route path="pages" element={<AdminPages />} />
            <Route path="site-content" element={<AdminSiteContent />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AdminProductForm />} />
            <Route path="products/edit/:id" element={<AdminProductForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="delivery" element={<AdminDelivery />} />
            <Route path="marketing" element={<AdminMarketing />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="accounts" element={<AdminAccounts />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      <MobileBottomNav />
      <WhatsAppFloat />
    </div>
  )
}

export default App
