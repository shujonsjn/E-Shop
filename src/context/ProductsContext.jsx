import { createContext, useContext, useEffect, useState } from 'react'
import { products as catalogProducts } from '../data/catalog'
import { saveStore } from '../services/store'

const ProductsContext = createContext()
const STORAGE_KEY = 'gb_products'

const readSavedProducts = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === null) return null
    const parsed = JSON.parse(saved)
    // An empty list is valid data ("the shop has no products yet"), so it must
    // not be treated as "nothing stored" and replaced with the demo catalog.
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

// The shop starts empty. The bundled demo catalog is only used when the admin
// explicitly clicks "Import from Catalog" — otherwise products the admin never
// created (or already deleted) would keep coming back after every reload.
const loadInitialProducts = () => {
  const saved = readSavedProducts()
  if (saved) return saved
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
  } catch {
    /* ignore */
  }
  return []
}

export const useProducts = () => {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(loadInitialProducts)

  useEffect(() => {
    saveStore('products', products)
  }, [products])

  useEffect(() => {
    const reload = (event) => {
      const keys = event?.detail
      if (Array.isArray(keys) && keys.length > 0 && !keys.includes('products')) return
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        const parsed = saved ? JSON.parse(saved) : null
        if (Array.isArray(parsed)) setProducts(parsed)
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('gb:remote', reload)
    return () => window.removeEventListener('gb:remote', reload)
  }, [])

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      gallery: product.gallery?.length ? product.gallery : [product.image].filter(Boolean),
    }
    setProducts((prev) => [newProduct, ...prev])
    return newProduct
  }

  const updateProduct = (id, updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) =>
        String(p.id) === String(id) ? { ...p, ...updatedProduct, id: p.id } : p
      )
    )
  }

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)))
  }

  // Explicit admin action: load the bundled demo catalog (replaces current list).
  const importCatalog = () => {
    const restored = catalogProducts.map((p) => ({ ...p }))
    setProducts(restored)
    return restored
  }

  const getProductById = (id) => products.find((p) => String(p.id) === String(id))

  const getProductBySlug = (slug) => products.find((p) => p.slug === slug)

  const getProduct = (slugOrId) =>
    products.find((p) => p.slug === slugOrId) || getProductById(slugOrId)

  const getProductsByCategory = (categorySlug) =>
    products.filter((p) => p.category === categorySlug)

  const getProductsBySubcategory = (categorySlug, subSlug) =>
    products.filter((p) => p.category === categorySlug && p.subcategory === subSlug)

  const getProductsByBrand = (brandName) =>
    products.filter((p) => (p.brand || '').toLowerCase() === String(brandName).toLowerCase())

  const searchProducts = (query) => {
    const q = String(query || '').trim().toLowerCase()
    if (!q) return products
    const words = q.split(/\s+/)
    return products.filter((p) => {
      const haystack = [p.name, p.name_bn, p.category, p.subcategory, p.brand, p.unit, ...(p.tags || [])]
        .join(' ')
        .toLowerCase()
      return words.every((word) => haystack.includes(word))
    })
  }

  const getRelatedProducts = (product, limit = 8) => {
    if (!product) return []
    const siblings = products.filter(
      (p) => String(p.id) !== String(product.id) && p.category === product.category
    )
    const rest = products.filter(
      (p) => String(p.id) !== String(product.id) && p.category !== product.category
    )
    return [...siblings, ...rest].slice(0, limit)
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        importCatalog,
        getProductById,
        getProductBySlug,
        getProduct,
        getProductsByCategory,
        getProductsBySubcategory,
        getProductsByBrand,
        searchProducts,
        getRelatedProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}
