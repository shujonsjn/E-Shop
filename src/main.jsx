import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ReviewProvider } from './context/ReviewContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { Toaster } from 'react-hot-toast'

// One-time reset so the grocery catalog replaces any cached shoe-shop data.
// Auth/account data is intentionally left untouched.
const BOOT_VERSION = 'gb-v1'
if (localStorage.getItem('gb_boot_version') !== BOOT_VERSION) {
  ;[
    'shoeshop_products',
    'shoeshop_cart',
    'shoeshop_catalog_version',
    'shoeshop_content_version',
    'shoeshop_simple_categories',
    'shoeshop_category_menu',
    'homeContent',
    'shoeshop_orders',
  ].forEach((key) => localStorage.removeItem(key))
  localStorage.setItem('gb_boot_version', BOOT_VERSION)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ProductsProvider>
            <SettingsProvider>
              <CartProvider>
                <WishlistProvider>
                  <ReviewProvider>
                    <App />
                    <Toaster
                      position="top-center"
                      toastOptions={{
                        style: {
                          fontSize: '13px',
                          borderRadius: '8px',
                          background: '#222831',
                          color: '#fff',
                        },
                      }}
                    />
                  </ReviewProvider>
                </WishlistProvider>
              </CartProvider>
            </SettingsProvider>
          </ProductsProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
