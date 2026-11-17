import { useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { Plus, Trash2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import AutoSaveNote from '../../components/admin/AutoSaveNote'

const emptyCoupon = {
  code: '',
  discountType: 'percent',
  discountValue: '',
  minOrder: '',
  expiryDate: '',
}

const AdminMarketing = () => {
  const { settings, addCoupon, deleteCoupon } = useSettings()
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [couponForm, setCouponForm] = useState(emptyCoupon)

  const coupons = Array.isArray(settings.coupons) ? settings.coupons : []

  const isExpired = (coupon) => {
    if (!coupon?.expiryDate) return false
    const expiry = new Date(coupon.expiryDate)
    if (Number.isNaN(expiry.getTime())) return false
    return expiry < new Date(new Date().toDateString())
  }

  const handleCouponSubmit = (e) => {
    e.preventDefault()
    const code = couponForm.code.trim().toUpperCase()
    if (!code) {
      toast.error('Coupon code is required')
      return
    }
    if (coupons.some((c) => String(c.code || '').toUpperCase() === code)) {
      toast.error('This coupon code already exists')
      return
    }
    const rawValue = Number(couponForm.discountValue)
    if (!Number.isFinite(rawValue) || rawValue <= 0) {
      toast.error('Enter a discount value greater than 0')
      return
    }
    if (couponForm.discountType === 'percent' && rawValue > 100) {
      toast.error('Percentage discount cannot be more than 100%')
      return
    }
    addCoupon({
      code,
      discountType: couponForm.discountType,
      discountValue: Math.round(rawValue),
      minOrder: Number(couponForm.minOrder || 0),
      expiryDate: couponForm.expiryDate,
    })
    toast.success('Coupon created')
    setShowCouponModal(false)
    setCouponForm(emptyCoupon)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Coupons</h1>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl text-sm text-gray-500">
            Create a coupon to give customers a discount at cart or checkout. Only the coupons
            listed here work — demo coupons are never applied.
          </p>
          <button
            onClick={() => setShowCouponModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Plus size={20} /> Create Coupon
          </button>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td className="px-6 py-4 font-mono font-bold text-blue-600">
                    {coupon.code}
                    {isExpired(coupon) && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
                        <AlertTriangle size={11} /> Expired
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {coupon.discountType === 'percent'
                      ? `${coupon.discountValue}%`
                      : `৳${coupon.discountValue}`}
                  </td>
                  <td className="px-6 py-4">৳{coupon.minOrder || 0}</td>
                  <td className="px-6 py-4">{coupon.expiryDate || '-'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        if (confirm('Delete this coupon? Customers who already applied it will lose the discount at checkout.')) {
                          deleteCoupon(coupon.id)
                          toast.success('Coupon deleted')
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="Delete coupon"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {coupons.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-700 font-medium">No coupons yet</p>
              <p className="mt-1 text-sm text-gray-500">Click Create Coupon to make a discount code.</p>
            </div>
          )}
        </div>
        <AutoSaveNote className="mt-4">
          Coupons save automatically as soon as you create or delete them.
        </AutoSaveNote>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Coupon</h2>
            <form onSubmit={handleCouponSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="EID2026"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Customers type this at cart / checkout. Letters and numbers only.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="percent">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {couponForm.discountType === 'percent' ? 'Value (%)' : 'Value (৳)'}
                  </label>
                  <input
                    type="number"
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    min="1"
                    max={couponForm.discountType === 'percent' ? 100 : undefined}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Min Order (৳)</label>
                <input
                  type="number"
                  value={couponForm.minOrder}
                  onChange={(e) => setCouponForm({ ...couponForm, minOrder: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                  placeholder="0 = no minimum"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={couponForm.expiryDate}
                  onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to keep the coupon valid until you delete it.</p>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCouponModal(false)
                    setCouponForm(emptyCoupon)
                  }}
                  className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMarketing
