import { createContext, useContext, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { saveStore, setAdminSignedIn } from '../services/store'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  cancelOrderRemote,
  decrementStockRemote,
  fetchOrders,
  insertOrder,
  pushOrderUpdate,
  trackOrderRemote,
} from '../services/commerce'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// No built-in accounts. A live store must not ship with a known password, and
// the demo customer box used to advertise one right on the login page.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('shoeshop_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  const [users, setUsers] = useState(() => {
    const demoEmails = new Set(['customer@example.com'])
    const isOldDemoAdmin = (u) =>
      u && u.email === 'admin@shoeshop.com' && u.role === 'admin' && u.password === 'admin123'
    try {
      const savedUsers = localStorage.getItem('shoeshop_users')
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers)
        if (Array.isArray(parsed)) {
          // Strip the old hard-coded demo accounts from any device that still
          // has them cached, so they cannot be used to sign in anymore.
          const cleaned = parsed.filter(
            (u) => u && !demoEmails.has(String(u.email).toLowerCase()) && !isOldDemoAdmin(u)
          )
          if (cleaned.length !== parsed.length) {
            try {
              localStorage.setItem('shoeshop_users', JSON.stringify(cleaned))
            } catch {
              /* ignore */
            }
          }
          return cleaned
        }
      }
    } catch {
      /* ignore */
    }
    return []
  })

  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem('shoeshop_orders')
      return savedOrders ? JSON.parse(savedOrders) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('shoeshop_user', JSON.stringify(user))
    } catch {
      /* ignore */
    }
  }, [user])

  // Restore (or drop) the secure admin session. Without a Supabase session a
  // cached "admin" local user is cleared, so the panel cannot be entered with
  // a stale localStorage flag alone.
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAdminSignedIn(true)
      return
    }
    let alive = true

    const applySession = (session) => {
      if (!alive) return
      const su = session?.user
      if (su) {
        const role = su.app_metadata?.role === 'admin' ? 'admin' : 'user'
        setAdminSignedIn(role === 'admin')
        setUser((prev) => {
          if (prev && prev.email === su.email && prev.role === role) return prev
          return {
            id: su.id,
            name: su.user_metadata?.name || 'Admin',
            email: su.email,
            role,
            phone: '',
            address: '',
          }
        })
      } else {
        setAdminSignedIn(false)
        setUser((prev) => (prev && (prev.role === 'admin' || prev.role === 'staff') ? null : prev))
      }
    }

    supabase.auth
      .getSession()
      .then(({ data }) => applySession(data.session))
      .catch(() => {})
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) =>
      applySession(session)
    )

    return () => {
      alive = false
      subscription?.subscription?.unsubscribe()
    }
  }, [])

  const firstUsersSave = useRef(true)
  const firstOrdersSave = useRef(true)

  useEffect(() => {
    if (firstUsersSave.current) {
      firstUsersSave.current = false
      return
    }
    saveStore('users', users)
  }, [users])

  useEffect(() => {
    if (firstOrdersSave.current) {
      firstOrdersSave.current = false
      return
    }
    saveStore('orders', orders)
  }, [orders])

  useEffect(() => {
    const reload = (event) => {
      const keys = event?.detail
      if (Array.isArray(keys) && keys.length > 0 && !keys.some((k) => k === 'orders' || k === 'users')) return
      try {
        const savedOrders = localStorage.getItem('shoeshop_orders')
        if (savedOrders) setOrders(JSON.parse(savedOrders))
        const savedUsers = localStorage.getItem('shoeshop_users')
        if (savedUsers) setUsers(JSON.parse(savedUsers))
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('gb:remote', reload)
    return () => window.removeEventListener('gb:remote', reload)
  }, [])

  // The admin panel needs every customer's order, not just the ones placed in
  // this browser. RLS only returns them for an authenticated admin session.
  useEffect(() => {
    if (!supabase || user?.role !== 'admin') return undefined
    let alive = true

    const load = async () => {
      const cloud = await fetchOrders()
      if (!alive || !cloud) return
      setOrders((prev) => {
        const cloudIds = new Set(cloud.map((order) => String(order.id)))
        const localOnly = prev.filter((order) => !cloudIds.has(String(order.id)))
        return [...cloud, ...localOnly].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )
      })
    }

    load()

    let channel
    try {
      channel = supabase
        .channel('admin-orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => load())
        .subscribe()
    } catch {
      channel = null
    }

    return () => {
      alive = false
      try {
        if (channel) supabase.removeChannel(channel)
      } catch {
        /* ignore */
      }
    }
  }, [user?.role])

  const register = (name, email, password, phone = '') => {
    const normalizedEmail = String(email).trim().toLowerCase()
    const existingUser = users.find((u) => u.email.toLowerCase() === normalizedEmail)
    if (existingUser) {
      toast.error('An account with this email already exists')
      return false
    }
    const newUser = {
      id: Date.now(),
      name,
      email: normalizedEmail,
      password,
      phone,
      address: '',
      role: 'user',
      createdAt: new Date().toISOString(),
    }
    setUsers([...users, newUser])
    setUser(newUser)
    toast.success('Registration successful')
    return true
  }

  const login = async (email, password) => {
    const normalizedEmail = String(email).trim().toLowerCase()

    // Secure path: admins authenticate against Supabase Auth, and the session
    // JWT is what allows their RLS-protected writes.
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        })
        if (!error && data?.user) {
          const role = data.user.app_metadata?.role === 'admin' ? 'admin' : 'user'
          const secureUser = {
            id: data.user.id,
            name: data.user.user_metadata?.name || 'Admin',
            email: data.user.email,
            role,
            phone: '',
            address: '',
          }
          setAdminSignedIn(role === 'admin')
          setUser(secureUser)
          toast.success(`Welcome back, ${secureUser.name.split(' ')[0]}`)
          return secureUser
        }
      } catch {
        /* fall through to the local customer accounts */
      }

      // A local admin/staff record must never be enough to sign in when the
      // backend is connected — that would only produce silent write failures.
      const privileged = users.find(
        (u) =>
          u.email.toLowerCase() === normalizedEmail &&
          (u.role === 'admin' || u.role === 'staff')
      )
      if (privileged) {
        toast.error('This admin account uses the secure password. Please use the Supabase login.')
        return null
      }
    }

    const foundUser = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    )
    if (foundUser) {
      setAdminSignedIn(false)
      setUser(foundUser)
      toast.success(`Welcome back, ${foundUser.name.split(' ')[0]}`)
      return foundUser
    }
    toast.error('Incorrect email or password')
    return null
  }

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {})
    }
    setAdminSignedIn(false)
    setUser(null)
    localStorage.removeItem('shoeshop_user')
    toast.success('Logged out successfully')
  }

  const updateProfile = (updates) => {
    if (!user) return false
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    setUsers((prev) =>
      prev.map((u) => (String(u.id) === String(user.id) ? { ...u, ...updates } : u))
    )
    toast.success('Profile updated')
    return true
  }

  const placeOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      userId: user?.id,
      userName: orderData.fullName || user?.name,
      userEmail: user?.email,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      statusHistory: [
        { status: 'Pending', date: new Date().toISOString(), note: 'Order received' },
      ],
    }
    setOrders([newOrder, ...orders])
    // The customer keeps a local copy (works offline, no account needed); the
    // cloud copy is what the admin panel and /track read.
    insertOrder(newOrder)
      .then((result) => {
        if (result.ok) decrementStockRemote(newOrder.items)
      })
      .catch(() => {})
    toast.success('Order placed successfully')
    return newOrder
  }

  const updateOrderStatus = (orderId, newStatus) => {
    const current = orders.find((order) => String(order.id) === String(orderId))
    if (!current) return
    const statusNotes = {
      Pending: 'Order received',
      Confirmed: 'Order confirmed',
      Packed: 'Packed',
      Shipped: 'Shipped',
      'Out for Delivery': 'Out for delivery',
      Delivered: 'Delivered',
      Cancelled: 'Order cancelled',
    }
    const updated = {
      ...current,
      status: newStatus,
      statusHistory: [
        ...(current.statusHistory || []),
        { status: newStatus, date: new Date().toISOString(), note: statusNotes[newStatus] },
      ],
    }
    setOrders(orders.map((order) => (String(order.id) === String(orderId) ? updated : order)))
    pushOrderUpdate(updated).catch(() => {})
    toast.success('Order status updated')
  }

  const cancelOrder = (orderId) => {
    const order = orders.find((o) => String(o.id) === String(orderId))
    if (!order) return false
    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status)) {
      toast.error('This order can no longer be cancelled')
      return false
    }
    const cancelled = {
      ...order,
      status: 'Cancelled',
      statusHistory: [
        ...(order.statusHistory || []),
        { status: 'Cancelled', date: new Date().toISOString(), note: 'Order cancelled' },
      ],
    }
    setOrders(orders.map((o) => (String(o.id) === String(orderId) ? cancelled : o)))
    // A signed-in admin updates the row directly; customers use the id + phone
    // RPC so the cloud copy (and the admin panel) changes too.
    if (user?.role === 'admin') {
      pushOrderUpdate(cancelled).catch(() => {})
    } else if (cancelled.shippingAddress?.phone) {
      cancelOrderRemote(cancelled.id, cancelled.shippingAddress.phone).catch(() => {})
    }
    toast.success('Order cancelled')
    return true
  }

  // Guest cancellation for orders that only exist in the cloud (placed on
  // another device). Requires the phone number used at checkout.
  const cancelOrderByPhone = async (orderId, phone) => {
    const result = await cancelOrderRemote(orderId, phone)
    if (result === 'cancelled') {
      setOrders((prev) =>
        prev.map((o) =>
          String(o.id) === String(orderId) ? { ...o, status: 'Cancelled' } : o
        )
      )
      toast.success('Order cancelled')
      return true
    }
    if (result === 'locked') toast.error('This order can no longer be cancelled')
    return false
  }

  // Pulls the latest status for orders saved on this device (customers have no
  // Supabase login, so the id + phone RPC is the only way to read them back).
  const refreshOrders = async () => {
    const candidates = orders.filter((order) => order?.shippingAddress?.phone)
    if (candidates.length === 0) return
    const results = await Promise.all(
      candidates.map((order) => trackOrderRemote(order.id, order.shippingAddress.phone))
    )
    const updates = new Map()
    results.forEach(({ order }) => {
      if (order) updates.set(String(order.id), order)
    })
    if (updates.size === 0) return
    setOrders((prev) =>
      prev.map((order) =>
        updates.has(String(order.id)) ? { ...order, ...updates.get(String(order.id)) } : order
      )
    )
  }

  const getUserOrders = () => {
    if (!user) return []
    return orders.filter((order) => String(order.userId) === String(user.id))
  }

  const getOrderById = (orderId) =>
    orders.find((order) => String(order.id) === String(orderId))

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        orders,
        register,
        login,
        logout,
        updateProfile,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        cancelOrderByPhone,
        refreshOrders,
        getUserOrders,
        getOrderById,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
