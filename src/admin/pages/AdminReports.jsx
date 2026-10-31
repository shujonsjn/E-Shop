import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductsContext'
import { BarChart3, TrendingUp, Users, Package } from 'lucide-react'

const AdminReports = () => {
  const { orders, users } = useAuth()
  const { products } = useProducts()

  const deliveredOrders = orders.filter((o) => o.status === 'Delivered')
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + (o.total || 0), 0)

  // Best selling products
  const productSales = {}
  orders.forEach((order) => {
    if (order.items) {
      order.items.forEach((item) => {
        const key = item.id || item.name
        if (!productSales[key]) {
          productSales[key] = { name: item.name, quantity: 0, revenue: 0 }
        }
        productSales[key].quantity += item.quantity || 1
        productSales[key].revenue += (item.price || 0) * (item.quantity || 1)
      })
    }
  })
  const bestSelling = Object.values(productSales).sort((a, b) => b.quantity - a.quantity).slice(0, 10)

  // Customer insights
  const ordersByCustomer = {}
  orders.forEach((order) => {
    const key = order.userId || order.userEmail
    if (!ordersByCustomer[key]) {
      ordersByCustomer[key] = { name: order.userName, count: 0, total: 0 }
    }
    ordersByCustomer[key].count += 1
    ordersByCustomer[key].total += order.total || 0
  })
  const topCustomers = Object.values(ordersByCustomer).sort((a, b) => b.count - a.count).slice(0, 10)

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Delivered Revenue</p>
              <p className="text-2xl font-bold text-green-600">৳{totalRevenue}</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
            </div>
            <BarChart3 className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Customers</p>
              <p className="text-2xl font-bold text-purple-600">{users.filter((u) => u.role !== 'admin').length}</p>
            </div>
            <Users className="text-purple-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Products</p>
              <p className="text-2xl font-bold text-orange-600">{products.length}</p>
            </div>
            <Package className="text-orange-600" size={32} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Best Selling Products</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {bestSelling.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">{idx + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.quantity} sold</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">৳{product.revenue}</p>
                </div>
              ))}
              {bestSelling.length === 0 && <p className="text-center text-gray-500 py-4">No data yet</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Top Customers</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topCustomers.map((customer, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">{idx + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.count} orders</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">৳{customer.total}</p>
                </div>
              ))}
              {topCustomers.length === 0 && <p className="text-center text-gray-500 py-4">No data yet</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminReports
