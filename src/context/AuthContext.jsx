import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const defaultUsers = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@shoeshop.com',
    password: 'admin123',
    role: 'admin',
    phone: '',
    address: '',
  },
  {
    id: 2,
    name: 'Demo Customer',
    email: 'customer@example.com',
    password: 'demo123',
    role: 'user',
    phone: '01700000000',
    address: 'House 12, Road 5, Dhanmondi, Dhaka',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
]

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
    try {
      const savedUsers = localStorage.getItem('shoeshop_users')
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Make sure the documented demo accounts always exist
          const merged = [...parsed]
          defaultUsers.forEach((demoUser) => {
            if (!merged.some((u) => u.email === demoUser.email)) merged.push(demoUser)
          })
          return merged
        }
      }
    } catch {
      /* ignore */
    }
    localStorage.setItem('shoeshop_users', JSON.stringify(defaultUsers))
    return defaultUsers
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

  useEffect(() => {
    try {
      localStorage.setItem('shoeshop_users', JSON.stringify(users))
    } catch {
      /* ignore */
    }
  }, [users])

  useEffect(() => {
    try {
      localStorage.setItem('shoeshop_orders', JSON.stringify(orders))
    } catch {
      /* ignore */
    }
  }, [orders])

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

  const login = (email, password) => {
    const normalizedEmail = String(email).trim().toLowerCase()
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    )
    if (foundUser) {
      setUser(foundUser)
      toast.success(`Welcome back, ${foundUser.name.split(' ')[0]}`)
      return foundUser
    }
    toast.error('Incorrect email or password')
    return null
  }

  const logout = () => {
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
