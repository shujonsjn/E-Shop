import { useAuth } from '../../context/AuthContext'

const AdminUsers = () => {
  const { orders } = useAuth()

  // The old page listed `users`, which only contains accounts registered on this
  // device. Real customers (especially guests) exist in the orders table, so
  // build the list from orders and aggregate per phone number.
  const byKey = new Map()
  orders.forEach((order) => {
    const phone = String(
      order.shippingAddress?.phone || order.phone || order.userPhone || ''
    ).trim()
    const email = String(order.userEmail || '').trim()
    const name =
      order.shippingAddress?.fullName || order.userName || (email ? email.split('@')[0] : '')
    const key = phone || email || name || `order-${order.id}`
    const existing = byKey.get(key) || {
      key,
      name: name || 'Guest',
      phone: phone || '-',
      email: email || '-',
      orders: 0,
      total: 0,
      lastOrder: null,
    }
    existing.name = existing.name === 'Guest' && name ? name : existing.name
    existing.orders += 1
    if (order.status !== 'Cancelled') existing.total += Number(order.total) || 0
    const date = order.createdAt ? new Date(order.createdAt) : null
    if (date && !Number.isNaN(date.getTime())) {
      if (!existing.lastOrder || date > existing.lastOrder) existing.lastOrder = date
    }
    byKey.set(key, existing)
  })

  const customers = [...byKey.values()].sort(
    (a, b) => (b.lastOrder?.getTime() || 0) - (a.lastOrder?.getTime() || 0)
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">কাস্টমার</h1>
        <p className="text-gray-500 mt-1">
          অর্ডার থেকে তৈরি কাস্টমার তালিকা — ফোন নম্বর অনুযায়ী একসাথে দেখানো হচ্ছে।
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">নাম</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">মোবাইল</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ইমেইল</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">অর্ডার</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">মোট খরচ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">শেষ অর্ডার</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.key}>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {customer.name === 'Guest' ? 'অতিথি' : customer.name}
                </td>
                <td className="px-6 py-4 text-gray-700">{customer.phone}</td>
                <td className="px-6 py-4 text-gray-500">{customer.email}</td>
                <td className="px-6 py-4 text-gray-700">{customer.orders}</td>
                <td className="px-6 py-4 text-gray-900">৳{customer.total.toLocaleString('en-US')}</td>
                <td className="px-6 py-4 text-gray-500">
                  {customer.lastOrder ? customer.lastOrder.toLocaleDateString('en-GB') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-700 font-medium">এখনো কোনো কাস্টমার নেই</p>
            <p className="mt-1 text-sm text-gray-500">প্রথম অর্ডার এলে এখানে কাস্টমার দেখা যাবে।</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers
