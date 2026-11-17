import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductsContext'

const AdminDashboard = () => {
  const { orders } = useAuth()
  const { products } = useProducts()

  // Cancelled orders are not sales. Only count the rest for revenue, and derive
  // customer count from those orders (the local `users` list is device-only and
  // would always show 0 on a fresh admin browser).
  const paidOrders = orders.filter((o) => o.status !== 'Cancelled')
  const totalRevenue = paidOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0)
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length
  const customers = new Set(
    paidOrders
      .map((o) => String(o.shippingAddress?.phone || o.phone || o.userEmail || o.userId || ''))
      .filter(Boolean)
  ).size

  const stats = [
    { title: 'Total Orders', value: orders.length, icon: ShoppingBag },
    { title: 'Total Sales', value: `৳${totalRevenue.toLocaleString('en-US')}`, icon: DollarSign },
    { title: 'Customers', value: customers, icon: Users },
    { title: 'Total Products', value: products.length, icon: Package },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="bg-[#EF4A23]/10 p-3 rounded-lg">
                  <Icon className="text-[#EF4A23]" size={22} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between pb-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">#{order.id}</p>
                  <p className="text-sm text-gray-500">{order.userName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">৳{order.total}</p>
                  <p className="text-sm text-gray-500">{order.status}</p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-gray-500 text-center py-4">No orders yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Pending</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Confirmed</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {orders.filter((o) => o.status === 'Confirmed').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Delivered</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                {orders.filter((o) => o.status === 'Delivered').length}
              </span>
            </div>
          </div>
        </div>
    </div>
  </div>
  )
}

export default AdminDashboard
