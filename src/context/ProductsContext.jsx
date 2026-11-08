import { createContext, useContext, useEffect, useState } from 'react'
import { products as catalogProducts } from '../data/catalog'

const ProductsContext = createContext()
const STORAGE_KEY = 'gb_products'
const VERSION_KEY = 'gb_catalog_version'
const CATALOG_VERSION = 'gb-v5'

const loadInitialProducts = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const savedVersion = localStorage.getItem(VERSION_KEY)
    if (savedVersion !== CATALOG_VERSION) {
      localStorage.setItem(VERSION_KEY, CATALOG_VERSION)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          const catalogMap = new Map(catalogProducts.map(p => [p.slug, p]))
          const merged = parsed.map(p => {
            if (catalogMap.has(p.slug)) {
              const cp = catalogMap.get(p.slug)
              return { ...cp, id: p.id, createdAt: p.createdAt }
            }
            return p
          })
          catalogProducts.forEach(cp => {
            if (!merged.find(p => p.slug === cp.slug)) {
              merged.push(cp)
            }
          })
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
          return merged
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogProducts))
      return catalogProducts
    }
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogProducts))
    return catalogProducts
  } catch {
    /* ignore corrupt storage */
  }
  return catalogProducts
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    } catch {
      /* storage may be full or unavailable */
    }
  }, [products])

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
