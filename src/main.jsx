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
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { pullStore } from './services/store'
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

const renderApp = () =>
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </React.StrictMode>,
  )

// Returning visitors render straight from the cached store, so a slow or down
// Supabase never blocks the first paint. The fresh copy arrives through the
// `gb:remote` event that RemoteSync listens to. A first-ever visit has no cache
// to show, so it waits for the pull (with a safety timeout) to avoid flashing
// bundled defaults.
let rendered = false
const start = () => {
  if (rendered) return
  rendered = true
  renderApp()
}

const hasCache = Boolean(localStorage.getItem('gb_settings'))
const bootPull = pullStore().catch(() => [])
bootPull.then((keys) => {
  if (Array.isArray(keys) && keys.length > 0) {
    window.dispatchEvent(new CustomEvent('gb:remote', { detail: keys }))
    if (keys.some((key) => key === 'categories' || key === 'brands' || key === 'pages')) {
      window.dispatchEvent(new Event('storage'))
    }
  }
  start()
})
if (hasCache) start()
const timeout = new Promise((resolve) => setTimeout(resolve, 6000))
Promise.race([bootPull, timeout]).finally(start)

