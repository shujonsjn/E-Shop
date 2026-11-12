import { lazy, Suspense, useEffect } from 'react'
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

// Admin is split into its own chunks so shoppers never download the panel.
const AdminLayout = lazy(() => import('./admin/layout/AdminLayout'))
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'))
const AdminProducts = lazy(() => import('./admin/pages/AdminProducts'))
const AdminProductForm = lazy(() => import('./admin/pages/AdminProductForm'))
const AdminCategories = lazy(() => import('./admin/pages/AdminCategories'))
const AdminOrders = lazy(() => import('./admin/pages/AdminOrders'))
const AdminUsers = lazy(() => import('./admin/pages/AdminUsers'))
const AdminStaff = lazy(() => import('./admin/pages/AdminStaff'))
const AdminReviews = lazy(() => import('./admin/pages/AdminReviews'))
const AdminDelivery = lazy(() => import('./admin/pages/AdminDelivery'))
const AdminMarketing = lazy(() => import('./admin/pages/AdminMarketing'))
const AdminPayments = lazy(() => import('./admin/pages/AdminPayments'))
const AdminAccounts = lazy(() => import('./admin/pages/AdminAccounts'))
const AdminReports = lazy(() => import('./admin/pages/AdminReports'))
const AdminSiteContent = lazy(() => import('./admin/pages/AdminSiteContent'))
const AdminHomeLayout = lazy(() => import('./admin/pages/AdminHomeLayout'))
const AdminPages = lazy(() => import('./admin/pages/AdminPages'))
const AdminBrands = lazy(() => import('./admin/pages/AdminBrands'))

const RouteFallback = () => (
  <div className="container-gb py-12 text-center text-sm text-ink-muted">Loading…</div>
)

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
        <Suspense fallback={<RouteFallback />}>
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
        </Suspense>
      </main>
      {!isAdmin && <Footer />}
      <MobileBottomNav />
      <WhatsAppFloat />
    </div>
  )
}

export default App
