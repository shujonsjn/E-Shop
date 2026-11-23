import { useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AutoSaveNote from '../../components/admin/AutoSaveNote'

// Neutral inline placeholder — never a bundled demo photo.
const IMAGE_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="#f3f4f6"/><path d="M14 32l7-8 5 5 4-4 4 7z" fill="#d1d5db"/><circle cx="18" cy="17" r="3" fill="#d1d5db"/></svg>'
  )

// Stored status values must stay English (they are shared with the storefront
// and the database). Only the option label is Bengali.
const statusOptions = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']

const statusLabels = {
  Pending: 'অপেক্ষমাণ',
  Confirmed: 'কনফার্মড',
  Packed: 'প্যাক করা হয়েছে',
  Shipped: 'শিপড',
  'Out for Delivery': 'ডেলিভারির পথে',
  Delivered: 'ডেলিভারি সম্পন্ন',
  Cancelled: 'বাতিল',
}

const AdminOrders = () => {
  const { orders, updateOrderStatus, deleteOrder } = useAuth()
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Orders can arrive from older devices, from the cloud or from a migration
  // with missing optional fields. Never let one partial row blank the page.
  const paymentLabel = (order) => {
    const method = order?.paymentMethod
    if (!method) return '—'
    return method === 'cod' ? 'ক্যাশ অন ডেলিভারি' : String(method).toUpperCase()
  }

  const paymentLabelLong = (order) => {
    const method = order?.paymentMethod
    if (!method) return '—'
    return method === 'cod' ? 'ক্যাশ অন ডেলিভারি' : String(method).toUpperCase()
  }

  const formatDate = (value) => {
    if (!value) return '—'
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-GB')
  }

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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">অর্ডার</h1>
          <p className="text-gray-500 mt-1">কাস্টমারদের অর্ডার দেখুন ও পরিচালনা করুন</p>
        </div>
      </div>
      <AutoSaveNote className="mb-6">
        স্ট্যাটাস বদলালেই সাথে সাথে সেভ হয়। অর্ডার মুছে ফেলা আর ফেরানো যায় না; শিপমেন্টের
        আগের অর্ডার মুছলে স্টক নিজে থেকে ফিরে যায়।
      </AutoSaveNote>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">অর্ডার আইডি</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">কাস্টমার</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">মোট</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">পেমেন্ট</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">স্ট্যাটাস</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">তারিখ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">কাজ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 text-gray-900">#{order.id}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-gray-900">{order.userName || order.shippingAddress?.fullName || 'অতিথি'}</p>
                    <p className="text-sm text-gray-500">
                      {order.userEmail || order.shippingAddress?.phone || order.phone || ''}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-900">৳{order.total ?? 0}</td>
                <td className="px-6 py-4 text-gray-600">{paymentLabel(order)}</td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status] || status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-600">{formatDate(order.createdAt)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-800"
                      title="অর্ডার দেখুন"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `অর্ডার #${order.id} মুছে ফেলবেন? এটি আর ফেরানো যাবে না। শিপমেন্টের আগের অর্ডারের স্টক নিজে থেকে ফিরে যাবে।`
                          )
                        ) {
                          deleteOrder(order.id)
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="অর্ডার মুছুন"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">এখনো কোনো অর্ডার নেই</div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{`অর্ডারের বিস্তারিত - #${selectedOrder.id}`}</h2>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700" aria-label="বন্ধ করুন">
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">কাস্টমারের তথ্য</h3>
                  <div className="bg-gray-50 p-3 rounded space-y-1 text-sm">
                    <p><span className="font-medium">নাম:</span> {selectedOrder.shippingAddress?.fullName || selectedOrder.userName || '—'}</p>
                    <p><span className="font-medium">মোবাইল:</span> {selectedOrder.shippingAddress?.phone || selectedOrder.phone || '—'}</p>
                    {selectedOrder.shippingAddress?.division && <p><span className="font-medium">বিভাগ:</span> {selectedOrder.shippingAddress.division}</p>}
                    {selectedOrder.shippingAddress?.district && <p><span className="font-medium">জেলা:</span> {selectedOrder.shippingAddress.district}</p>}
                    {selectedOrder.shippingAddress?.upazila && <p><span className="font-medium">থানা/উপজেলা:</span> {selectedOrder.shippingAddress.upazila}</p>}
                    {!selectedOrder.shippingAddress?.division && selectedOrder.shippingAddress?.city && <p><span className="font-medium">শহর:</span> {selectedOrder.shippingAddress.city}</p>}
                    <p><span className="font-medium">ঠিকানা:</span> {selectedOrder.shippingAddress?.address || '—'}</p>
                    {selectedOrder.deliverySlot && (
                      <p><span className="font-medium">পছন্দের ডেলিভারি সময়:</span> {selectedOrder.deliverySlot}</p>
                    )}
                    {selectedOrder.orderNotes && (
                      <p><span className="font-medium">নোট:</span> {selectedOrder.orderNotes}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">পণ্য</h3>
                  <div className="space-y-2">
                    {(selectedOrder.items || []).map((item, index) => (
                      <div key={`${item.id ?? index}-${item.size || ''}`} className="flex gap-3 bg-gray-50 p-3 rounded">
                        <img
                          src={item.image || IMAGE_PLACEHOLDER}
                          alt={item.name || 'পণ্য'}
                          className="w-12 h-12 object-cover rounded"
                          onError={(event) => {
                            event.currentTarget.src = IMAGE_PLACEHOLDER
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.size ? `সাইজ: ${item.size} | ` : ''}পরিমাণ: {item.quantity || 1}
                          </p>
                        </div>
                        <span className="text-gray-900">
                          ৳{(item.price || 0) * (item.quantity || 1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">পেমেন্টের তথ্য</h3>
                  <div className="bg-gray-50 p-3 rounded space-y-1 text-sm">
                    <p><span className="font-medium">পেমেন্ট মেথড:</span> {paymentLabelLong(selectedOrder)}</p>
                    <p><span className="font-medium">সাবটোটাল:</span> ৳{selectedOrder.subtotal ?? 0}</p>
                    <p><span className="font-medium">ডেলিভারি চার্জ:</span> ৳{selectedOrder.deliveryCharge ?? 0}</p>
                    <p className="font-bold"><span className="font-medium">মোট:</span> ৳{selectedOrder.total ?? 0}</p>
                    {selectedOrder.paymentMethod !== 'cod' && selectedOrder.paymentDetails && (
                      <>
                        <p><span className="font-medium">প্রেরকের নম্বর:</span> {selectedOrder.paymentDetails.senderNumber}</p>
                        <p><span className="font-medium">ট্রানজেকশন আইডি:</span> {selectedOrder.paymentDetails.transactionId}</p>
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
