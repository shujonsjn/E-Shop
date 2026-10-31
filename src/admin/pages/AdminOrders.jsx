import { useState } from 'react'
import { Eye } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useAuth()
  const [selectedOrder, setSelectedOrder] = useState(null)

  const statusOptions = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Packed': 'bg-purple-100 text-purple-800',
      'Shipped': 'bg-indigo-100 text-indigo-800',
      'Out for Delivery': 'bg-orange-100 text-orange-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">Manage and track customer orders</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 text-gray-900">#{order.id}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-gray-900">{order.userName}</p>
                    <p className="text-sm text-gray-500">{order.userEmail}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-900">৳{order.total}</td>
                <td className="px-6 py-4 text-gray-600">{order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod.toUpperCase()}</td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-GB')}</td>
                <td className="px-6 py-4">
                  <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:text-blue-800">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">No orders yet</div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Order Details - #{selectedOrder.id}</h2>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                  <div className="bg-gray-50 p-3 rounded space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.shippingAddress.fullName}</p>
                    <p><span className="font-medium">Mobile:</span> {selectedOrder.shippingAddress.phone}</p>
                    {selectedOrder.shippingAddress.division && <p><span className="font-medium">Division:</span> {selectedOrder.shippingAddress.division}</p>}
                    {selectedOrder.shippingAddress.district && <p><span className="font-medium">District:</span> {selectedOrder.shippingAddress.district}</p>}
                    {selectedOrder.shippingAddress.upazila && <p><span className="font-medium">Thana/Upazila:</span> {selectedOrder.shippingAddress.upazila}</p>}
                    {!selectedOrder.shippingAddress.division && selectedOrder.shippingAddress.city && <p><span className="font-medium">City:</span> {selectedOrder.shippingAddress.city}</p>}
                    <p><span className="font-medium">Address:</span> {selectedOrder.shippingAddress.address}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Products</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-3 bg-gray-50 p-3 rounded">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                        </div>
                        <span className="text-gray-900">৳{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Payment Information</h3>
                  <div className="bg-gray-50 p-3 rounded space-y-1 text-sm">
                    <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : selectedOrder.paymentMethod.toUpperCase()}</p>
                    <p><span className="font-medium">Subtotal:</span> ৳{selectedOrder.subtotal}</p>
                    <p><span className="font-medium">Delivery Charge:</span> ৳{selectedOrder.deliveryCharge}</p>
                    <p className="font-bold"><span className="font-medium">Total:</span> ৳{selectedOrder.total}</p>
                    {selectedOrder.paymentMethod !== 'cod' && selectedOrder.paymentDetails && (
                      <>
                        <p><span className="font-medium">Sender Number:</span> {selectedOrder.paymentDetails.senderNumber}</p>
                        <p><span className="font-medium">Transaction ID:</span> {selectedOrder.paymentDetails.transactionId}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders
