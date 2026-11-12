import { useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { Plus, Edit2, Trash2, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminMarketing = () => {
  const { settings, addCoupon, updateCoupon, deleteCoupon } = useSettings()
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'percent', discountValue: '', minOrder: '', expiryDate: '', usageLimit: '' })

  const handleCouponSubmit = (e) => {
    e.preventDefault()
    addCoupon({ ...couponForm, discountValue: Number(couponForm.discountValue), minOrder: Number(couponForm.minOrder || 0), usageLimit: Number(couponForm.usageLimit || 0) })
    toast.success('Coupon created')
    setShowCouponModal(false)
    setCouponForm({ code: '', discountType: 'percent', discountValue: '', minOrder: '', expiryDate: '', usageLimit: '' })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Coupons</h1>

      <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-xl text-sm text-gray-500">
              à¦•à§à¦ªà¦¨ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦²à§‡ à¦•à¦¾à¦¸à§à¦Ÿà¦®à¦¾à¦° à¦•à¦¾à¦°à§à¦Ÿ à¦¬à¦¾ à¦šà§‡à¦•à¦†à¦‰à¦Ÿà§‡ à¦•à§‹à¦¡ à¦¬à¦¸à¦¿à¦¯à¦¼à§‡ à¦›à¦¾à¦¡à¦¼ à¦ªà¦¾à¦¬à§‡à¥¤ à¦à¦–à¦¾à¦¨à§‡ à¦¨à¦¾ à¦¥à¦¾à¦•à¦¾ à¦•à§‹à¦¨à§‹ à¦¡à§‡à¦®à§‹ à¦•à§à¦ªà¦¨ à¦†à¦° à¦•à¦¾à¦œ à¦•à¦°à¦¬à§‡ à¦¨à¦¾à¥¤
            </p>
            <button onClick={() => setShowCouponModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"><Plus size={20} /> Create Coupon</button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {settings.coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">{coupon.code}</td>
                    <td className="px-6 py-4">{coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `à§³${coupon.discountValue}`}</td>
                    <td className="px-6 py-4">à§³{coupon.minOrder || 0}</td>
                    <td className="px-6 py-4">{coupon.expiryDate || '-'}</td>
                    <td className="px-6 py-4">{coupon.usedCount || 0}/{coupon.usageLimit || 'âˆž'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => { if (confirm('Delete?')) { deleteCoupon(coupon.id); toast.success('Deleted') } }} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {settings.coupons.length === 0 && <p className="text-center py-8 text-gray-500">No coupons yet</p>}
          </div>
        </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Coupon</h2>
            <form onSubmit={handleCouponSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Coupon Code</label>
                <input type="text" value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={couponForm.discountType} onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })} className="w-full px-3 py-2 border rounded">
                    <option value="percent">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Value</label>
                  <input type="number" value={couponForm.discountValue} onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })} className="w-full px-3 py-2 border rounded" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Min Order (à§³)</label>
                  <input type="number" value={couponForm.minOrder} onChange={(e) => setCouponForm({ ...couponForm, minOrder: e.target.value })} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Usage Limit</label>
                  <input type="number" value={couponForm.usageLimit} onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })} className="w-full px-3 py-2 border rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <input type="date" value={couponForm.expiryDate} onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Create</button>
                <button type="button" onClick={() => setShowCouponModal(false)} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMarketing
