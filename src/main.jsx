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
import RemoteSync from './components/RemoteSync.jsx'
import { Toaster } from 'react-hot-toast'

// One-time hard reset of everything this storefront keeps in the browser.
// Bump BOOT_VERSION whenever the bundled catalog/settings must replace cached data.
const BOOT_VERSION = 'gb-v2'
if (localStorage.getItem('gb_boot_version') !== BOOT_VERSION) {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('gb_') || key.startsWith('shoeshop_'))
      .forEach((key) => localStorage.removeItem(key))
  } catch {
    /* ignore */
  }
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
                    <RemoteSync />
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
