import { useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { Plus, Edit2, Trash2, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminMarketing = () => {
  const { settings, addCoupon, updateCoupon, deleteCoupon, addFlashSale, deleteFlashSale, addComboOffer, deleteComboOffer } = useSettings()
  const [activeTab, setActiveTab] = useState('coupons')
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [showFlashModal, setShowFlashModal] = useState(false)
  const [showComboModal, setShowComboModal] = useState(false)
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'percent', discountValue: '', minOrder: '', expiryDate: '', usageLimit: '' })
  const [flashForm, setFlashForm] = useState({ title: '', discountPercent: '', startDate: '', endDate: '', productIds: [] })
  const [comboForm, setComboForm] = useState({ title: '', products: [], comboPrice: '' })

  const handleCouponSubmit = (e) => {
    e.preventDefault()
    addCoupon({ ...couponForm, discountValue: Number(couponForm.discountValue), minOrder: Number(couponForm.minOrder || 0), usageLimit: Number(couponForm.usageLimit || 0) })
    toast.success('Coupon created')
    setShowCouponModal(false)
    setCouponForm({ code: '', discountType: 'percent', discountValue: '', minOrder: '', expiryDate: '', usageLimit: '' })
  }

  const handleFlashSubmit = (e) => {
    e.preventDefault()
    addFlashSale({ ...flashForm, discountPercent: Number(flashForm.discountPercent), active: true })
    toast.success('Flash sale created')
    setShowFlashModal(false)
    setFlashForm({ title: '', discountPercent: '', startDate: '', endDate: '', productIds: [] })
  }

  const handleComboSubmit = (e) => {
    e.preventDefault()
    addComboOffer({ ...comboForm, comboPrice: Number(comboForm.comboPrice), active: true })
    toast.success('Combo offer created')
    setShowComboModal(false)
    setComboForm({ title: '', products: [], comboPrice: '' })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Marketing & Promotions</h1>

      <div className="flex gap-2 mb-6 border-b">
        {['coupons', 'flash', 'combo'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 font-medium ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
            {tab === 'coupons' ? 'Coupons' : tab === 'flash' ? 'Flash Sales' : 'Combo Offers'}
          </button>
        ))}
      </div>

      {activeTab === 'coupons' && (
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Coupons</h2>
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
                    <td className="px-6 py-4">{coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `৳${coupon.discountValue}`}</td>
                    <td className="px-6 py-4">৳{coupon.minOrder || 0}</td>
                    <td className="px-6 py-4">{coupon.expiryDate || '-'}</td>
                    <td className="px-6 py-4">{coupon.usedCount || 0}/{coupon.usageLimit || '∞'}</td>
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
      )}

      {activeTab === 'flash' && (
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Flash Sales</h2>
            <button onClick={() => setShowFlashModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"><Plus size={20} /> Add Flash Sale</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settings.flashSales.map((sale) => (
              <div key={sale.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{sale.title}</h3>
                  <button onClick={() => { if (confirm('Delete?')) { deleteFlashSale(sale.id); toast.success('Deleted') } }} className="text-red-600"><Trash2 size={18} /></button>
                </div>
                <p className="text-2xl font-bold text-red-600 mb-2">{sale.discountPercent}% OFF</p>
                <p className="text-sm text-gray-500">{sale.startDate} - {sale.endDate}</p>
              </div>
            ))}
          </div>
          {settings.flashSales.length === 0 && <p className="text-center py-8 text-gray-500">No flash sales yet</p>}
        </div>
      )}

      {activeTab === 'combo' && (
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Combo Offers</h2>
            <button onClick={() => setShowComboModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"><Plus size={20} /> Add Combo</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.comboOffers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{offer.title}</h3>
                  <button onClick={() => { if (confirm('Delete?')) { deleteComboOffer(offer.id); toast.success('Deleted') } }} className="text-red-600"><Trash2 size={18} /></button>
                </div>
                <p className="text-xl font-bold text-green-600">৳{offer.comboPrice}</p>
              </div>
            ))}
          </div>
          {settings.comboOffers.length === 0 && <p className="text-center py-8 text-gray-500">No combo offers yet</p>}
        </div>
      )}

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
                  <label className="block text-sm font-medium mb-1">Min Order (৳)</label>
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

      {/* Flash Sale Modal */}
      {showFlashModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Flash Sale</h2>
            <form onSubmit={handleFlashSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={flashForm.title} onChange={(e) => setFlashForm({ ...flashForm, title: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount %</label>
                <input type="number" value={flashForm.discountPercent} onChange={(e) => setFlashForm({ ...flashForm, discountPercent: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input type="date" value={flashForm.startDate} onChange={(e) => setFlashForm({ ...flashForm, startDate: e.target.value })} className="w-full px-3 py-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input type="date" value={flashForm.endDate} onChange={(e) => setFlashForm({ ...flashForm, endDate: e.target.value })} className="w-full px-3 py-2 border rounded" required />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Create</button>
                <button type="button" onClick={() => setShowFlashModal(false)} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Combo Modal */}
      {showComboModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Combo Offer</h2>
            <form onSubmit={handleComboSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={comboForm.title} onChange={(e) => setComboForm({ ...comboForm, title: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Combo Price (৳)</label>
                <input type="number" value={comboForm.comboPrice} onChange={(e) => setComboForm({ ...comboForm, comboPrice: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Create</button>
                <button type="button" onClick={() => setShowComboModal(false)} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMarketing
