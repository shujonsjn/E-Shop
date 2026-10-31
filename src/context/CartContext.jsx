import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { coupons as defaultCoupons } from '../data/catalog'
import { useSettings } from './SettingsContext'

const CartContext = createContext()
const STORAGE_KEY = 'gb_cart'
const COUPON_KEY = 'gb_coupon'

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const { settings } = useSettings()
  const [cartItems, setCartItems] = useState(() => {
    const saved = readJSON(STORAGE_KEY, [])
    return Array.isArray(saved) ? saved : []
  })
  const [coupon, setCoupon] = useState(() => readJSON(COUPON_KEY, null))
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
    } catch {
      /* ignore */
    }
  }, [cartItems])

  useEffect(() => {
    try {
      if (coupon) localStorage.setItem(COUPON_KEY, JSON.stringify(coupon))
      else localStorage.removeItem(COUPON_KEY)
    } catch {
      /* ignore */
    }
  }, [coupon])

  const addToCart = (product, quantity = 1) => {
    const qty = Math.max(1, Math.floor(Number(quantity) || 1))
    const existing = cartItems.find((item) => String(item.id) === String(product.id))
    setCartItems((prev) => {
      const found = prev.find((item) => String(item.id) === String(product.id))
      if (found) {
        return prev.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      }
      return [...prev, { ...product, quantity: qty }]
    })
    toast.success(
      existing
        ? `${product.name} — quantity updated`
        : qty > 1
          ? `Added ${qty} × ${product.name}`
          : `${product.name} added to cart`
    )
  }

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => String(item.id) !== String(id)))
    toast.success('Removed from cart')
  }

  const updateQuantity = (id, quantity) => {
    const qty = Math.floor(Number(quantity) || 0)
    if (qty <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (String(item.id) === String(id) ? { ...item, quantity: qty } : item))
    )
  }

  const increaseQuantity = (id) => {
    const item = cartItems.find((i) => String(i.id) === String(id))
    if (item) updateQuantity(id, item.quantity + 1)
  }

  const decreaseQuantity = (id) => {
    const item = cartItems.find((i) => String(i.id) === String(id))
    if (item) updateQuantity(id, item.quantity - 1)
  }

  const clearCart = () => {
    setCartItems([])
    setCoupon(null)
  }

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + Number(item.price || 0) * item.quantity, 0)

  const getCartCount = () => cartItems.reduce((count, item) => count + item.quantity, 0)

  const getItemQuantity = (id) => {
    const item = cartItems.find((i) => String(i.id) === String(id))
    return item ? item.quantity : 0
  }

  const subtotal = getCartTotal()

  const applyCoupon = (code) => {
    const normalized = String(code || '').trim().toUpperCase()
    const allCoupons = [...(settings?.coupons || []), ...defaultCoupons]
    const found = allCoupons.find((c) => String(c.code || '').toUpperCase() === normalized)
    if (!found) return { ok: false, message: 'Invalid coupon code' }
    if (found.expiryDate) {
      const today = new Date()
      const exp = new Date(found.expiryDate)
      if (exp < new Date(today.toDateString())) {
        return { ok: false, message: 'Coupon expired' }
      }
    }
    if (found.usageLimit && found.usedCount >= found.usageLimit) {
      return { ok: false, message: 'Coupon usage limit reached' }
    }
    const minOrder = found.minOrder || found.min || 0
    if (subtotal < minOrder) {
      return { ok: false, message: `Minimum order ৳${minOrder.toLocaleString()} required` }
    }
    const normalizedCoupon = {
      code: found.code,
      type: found.discountType === 'percent' ? 'percent' : found.discountType === 'fixed' ? 'flat' : found.type,
      value: found.discountValue || found.value,
      min: minOrder,
      label: found.label || (found.discountType === 'percent' ? `${found.discountValue}% off` : `৳${found.discountValue} off`),
    }
    setCoupon(normalizedCoupon)
    return { ok: true, message: `${found.code} applied - ${normalizedCoupon.label}`, coupon: normalizedCoupon }
  }

  const removeCoupon = () => setCoupon(null)

  const discount = useMemo(() => {
    if (!coupon) return 0
    if (coupon.type === 'flat') return Math.min(coupon.value, subtotal)
    if (coupon.type === 'percent') return Math.round((subtotal * coupon.value) / 100)
    return 0
  }, [coupon, subtotal])

  const freeDelivery = coupon?.type === 'shipping'

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)
  const toggleCart = () => setIsCartOpen((open) => !open)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getItemQuantity,
        subtotal,
        coupon,
        applyCoupon,
        removeCoupon,
        discount,
        freeDelivery,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
