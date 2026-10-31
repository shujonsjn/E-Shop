import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const OrderTracking = () => {
  const { orderId } = useParams()
  const { orders } = useAuth()
  const order = orders.find((o) => o.id === parseInt(orderId))

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-xl text-gray-600">Order not found</p>
        <Link to="/my-orders" className="mt-4 text-gray-900 hover:underline">
          Back to My Orders
        </Link>
      </div>
    )
  }

  const statusSteps = [
    { key: 'Pending', label: 'Order Placed' },
    { key: 'Confirmed', label: 'Confirmed' },
    { key: 'Packed', label: 'Packed' },
    { key: 'Shipped', label: 'Shipped' },
    { key: 'Out for Delivery', label: 'Out for Delivery' },
    { key: 'Delivered', label: 'Delivered' }
  ]

  const currentStatusIndex = statusSteps.findIndex((step) => step.key === order.status)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/my-orders" className="flex items-center text-gray-700 hover:text-gray-900 mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Back to My Orders
      </Link>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Tracking</h1>
        <p className="text-gray-600">Order ID: #{order.id}</p>
        <p className="text-gray-600">
          Date: {new Date(order.createdAt).toLocaleString('en-GB')}
        </p>
      </div>

      {/* Status Timeline */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStatusIndex
            const isCurrent = index === currentStatusIndex
            return (
              <div key={step.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}
                  >
                    {isCompleted ? <Check size={20} /> : index + 1}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`w-0.5 h-12 ${
                        index < currentStatusIndex ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3
                    className={`font-semibold ${
                      isCompleted ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </h3>
                  {isCurrent && (
                    <p className="text-sm text-green-600 mt-1">Current Status</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
        <div className="space-y-3 mb-4">
          {order.items.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex gap-3 pb-3 border-b">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
              </div>
              <span className="text-gray-900">৳{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>৳{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Delivery Charge</span>
            <span>৳{order.deliveryCharge}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-gray-900 text-lg">
            <span>Total</span>
            <span>৳{order.total}</span>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h2>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-medium">Name:</span> {order.shippingAddress.fullName}</p>
          <p><span className="font-medium">Mobile:</span> {order.shippingAddress.phone}</p>
          {order.shippingAddress.division && <p><span className="font-medium">Division:</span> {order.shippingAddress.division}</p>}
          {order.shippingAddress.district && <p><span className="font-medium">District:</span> {order.shippingAddress.district}</p>}
          {order.shippingAddress.upazila && <p><span className="font-medium">Thana/Upazila:</span> {order.shippingAddress.upazila}</p>}
          {!order.shippingAddress.division && order.shippingAddress.city && <p><span className="font-medium">City:</span> {order.shippingAddress.city}</p>}
          <p><span className="font-medium">Address:</span> {order.shippingAddress.address}</p>
          <p><span className="font-medium">Payment Method:</span> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}</p>
        </div>
      </div>
    </div>
  )
}

export default OrderTracking
