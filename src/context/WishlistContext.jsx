import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext()
const STORAGE_KEY = 'gb_wishlist'

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist))
    } catch {
      /* ignore */
    }
  }, [wishlist])

  const isWishlisted = (id) => wishlist.some((item) => String(item) === String(id))

  const toggleWishlist = (product) => {
    const id = product?.id ?? product
    if (isWishlisted(id)) {
      setWishlist((prev) => prev.filter((item) => String(item) !== String(id)))
      toast.success('Removed from wishlist')
      return false
    }
    setWishlist((prev) => [...prev, id])
    toast.success('Saved to wishlist')
    return true
  }

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => String(item) !== String(id)))
  }

  const clearWishlist = () => setWishlist([])

  return (
    <WishlistContext.Provider
      value={{ wishlist, isWishlisted, toggleWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  )
}
