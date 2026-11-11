import { createContext, useContext, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { saveStore, setAdminSignedIn } from '../services/store'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

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
    toast.success('Order placed successfully')
    return newOrder
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) => {
        if (String(order.id) === String(orderId)) {
          const statusNotes = {
            Pending: 'Order received',
            Confirmed: 'Order confirmed',
            Packed: 'Packed',
            Shipped: 'Shipped',
            'Out for Delivery': 'Out for delivery',
            Delivered: 'Delivered',
            Cancelled: 'Order cancelled',
          }
          return {
            ...order,
            status: newStatus,
            statusHistory: [
              ...(order.statusHistory || []),
              { status: newStatus, date: new Date().toISOString(), note: statusNotes[newStatus] },
            ],
          }
        }
        return order
      })
    )
    toast.success('Order status updated')
  }

  const cancelOrder = (orderId) => {
    const order = orders.find((o) => String(o.id) === String(orderId))
    if (!order) return false
    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status)) {
      toast.error('This order can no longer be cancelled')
      return false
    }
    setOrders(
      orders.map((o) =>
        String(o.id) === String(orderId)
          ? {
              ...o,
              status: 'Cancelled',
              statusHistory: [
                ...(o.statusHistory || []),
                { status: 'Cancelled', date: new Date().toISOString(), note: 'Order cancelled' },
              ],
            }
          : o
      )
    )
    toast.success('Order cancelled')
    return true
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
        getUserOrders,
        getOrderById,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
