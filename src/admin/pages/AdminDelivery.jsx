import { useEffect, useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { Plus, Edit2, Trash2, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import AutoSaveNote from '../../components/admin/AutoSaveNote'

const AdminDelivery = () => {
  const { settings, updateSettings, addDeliveryCharge, updateDeliveryCharge, deleteDeliveryCharge, addDeliverySlot, updateDeliverySlot, deleteDeliverySlot } = useSettings()
  const [showChargeModal, setShowChargeModal] = useState(false)
  const [showSlotModal, setShowSlotModal] = useState(false)
  const [editingCharge, setEditingCharge] = useState(null)
  const [editingSlot, setEditingSlot] = useState(null)
  const [chargeForm, setChargeForm] = useState({ area: '', charge: '' })
  const [slotForm, setSlotForm] = useState({ label: '', enabled: true })
  // The old input saved on every keystroke, so clearing the box wrote 0 and
  // silently switched the free-delivery offer off. Edit a draft and save it.
  const [thresholdDraft, setThresholdDraft] = useState(String(settings.freeDeliveryThreshold ?? 0))

  useEffect(() => {
    setThresholdDraft(String(settings.freeDeliveryThreshold ?? 0))
  }, [settings.freeDeliveryThreshold])

  const deliveryCharges = Array.isArray(settings.deliveryCharges) ? settings.deliveryCharges : []
  const deliverySlots = Array.isArray(settings.deliverySlots) ? settings.deliverySlots : []
  const activeThreshold = Number(settings.freeDeliveryThreshold || 0)

  const saveThreshold = () => {
    const value = Math.max(0, Math.round(Number(thresholdDraft) || 0))
    setThresholdDraft(String(value))
    updateSettings({ freeDeliveryThreshold: value })
    toast.success(
      value > 0
        ? `ফ্রি ডেলিভারি চালু — ৳${value.toLocaleString('en-US')} বা তার বেশি অর্ডারে`
        : 'ফ্রি ডেলিভারি বন্ধ করা হলো (0)'
    )
  }

  const handleChargeSubmit = (e) => {
    e.preventDefault()
    if (editingCharge) {
      updateDeliveryCharge(editingCharge.id, { area: chargeForm.area, charge: Number(chargeForm.charge) })
      toast.success('ডেলিভারি চার্জ আপডেট হয়েছে')
    } else {
      addDeliveryCharge({ area: chargeForm.area, charge: Number(chargeForm.charge) })
      toast.success('ডেলিভারি চার্জ যোগ হয়েছে')
    }
    setShowChargeModal(false)
    setEditingCharge(null)
    setChargeForm({ area: '', charge: '' })
  }

  const handleSlotSubmit = (e) => {
    e.preventDefault()
    if (editingSlot) {
      updateDeliverySlot(editingSlot.id, slotForm)
      toast.success('ডেলিভারি সময়সূচি আপডেট হয়েছে')
    } else {
      addDeliverySlot(slotForm)
      toast.success('ডেলিভারি সময়সূচি যোগ হয়েছে')
    }
    setShowSlotModal(false)
    setEditingSlot(null)
    setSlotForm({ label: '', enabled: true })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">ডেলিভারি ও লজিস্টিকস</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">ফ্রি ডেলিভারি</h2>
        <p className="text-sm text-gray-500 mb-4">
          এই পরিমাণ বা তার বেশি অর্ডারে ডেলিভারি ফ্রি হবে। ০ দিলে অফারটি বন্ধ থাকবে। হোম পেজ ও
          কার্টে এই অফারটি স্বয়ংক্রিয়ভাবে দেখানো হবে।
        </p>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">সর্বনিম্ন অর্ডারের পরিমাণ (৳)</label>
            <input
              type="number"
              min="0"
              value={thresholdDraft}
              onChange={(e) => setThresholdDraft(e.target.value.replace(/[^\d]/g, ''))}
              className="w-48 px-3 py-2 border rounded"
            />
          </div>
          <button
            type="button"
            onClick={saveThreshold}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <Save size={18} /> সেভ করুন
          </button>
          <p className="text-xs text-gray-500 pb-2">
            {activeThreshold > 0
              ? `এখন সক্রিয়: ৳${activeThreshold.toLocaleString('en-US')} বা তার বেশি অর্ডারে ফ্রি ডেলিভারি।`
              : 'এখন বন্ধ (0)। সাইটে ফ্রি ডেলিভারির দাবি দেখানো হচ্ছে না।'}
            <br />
            এই অঙ্কের নিচে থাকলে চেকআউটে নিচের রো অনুযায়ী ডেলিভারি চার্জ যোগ হবে।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Charges */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">ডেলিভারি চার্জ</h2>
            <button onClick={() => { setEditingCharge(null); setChargeForm({ area: '', charge: '' }); setShowChargeModal(true) }} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">
              <Plus size={18} /> যোগ করুন
            </button>
          </div>
          <div className="p-6">
            <p className="mb-4 text-xs text-gray-500">
              &quot;Inside Dhaka&quot; ও &quot;Outside Dhaka&quot; নামের রো দুটি চেকআউটে
              ঢাকা/ঢাকার বাইরের চার্জ হিসেবে ব্যবহৃত হয়।
            </p>
            <div className="space-y-3">
              {deliveryCharges.map((charge) => (
                <div key={charge.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium text-gray-900">{charge.area}</p>
                    <p className="text-sm text-gray-500">৳{charge.charge}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingCharge(charge); setChargeForm({ area: charge.area, charge: charge.charge }); setShowChargeModal(true) }} className="text-blue-600 hover:text-blue-800" title="এডিট"><Edit2 size={18} /></button>
                    <button onClick={() => { if (confirm('এই ডেলিভারি চার্জটি মুছে ফেলবেন?')) { deleteDeliveryCharge(charge.id); toast.success('ডেলিভারি চার্জ মুছে ফেলা হয়েছে') } }} className="text-red-600 hover:text-red-800" title="মুছুন"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
              {deliveryCharges.length === 0 && (
                <p className="text-sm text-gray-500">
                  এখনো কোনো ডেলিভারি চার্জ নেই। “যোগ করুন” চেপে &quot;Inside Dhaka&quot; ও
                  &quot;Outside Dhaka&quot; তৈরি করুন।
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Slots */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">ডেলিভারি সময়সূচি</h2>
            <button onClick={() => { setEditingSlot(null); setSlotForm({ label: '', enabled: true }); setShowSlotModal(true) }} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">
              <Plus size={18} /> যোগ করুন
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {deliverySlots.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium text-gray-900">{slot.label}</p>
                    <p className="text-sm text-gray-500">{slot.enabled !== false ? 'চালু' : 'বন্ধ'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingSlot(slot); setSlotForm({ label: slot.label || '', enabled: slot.enabled !== false }); setShowSlotModal(true) }} className="text-blue-600 hover:text-blue-800" title="এডিট"><Edit2 size={18} /></button>
                    <button onClick={() => { if (confirm('এই ডেলিভারি সময়সূচিটি মুছে ফেলবেন?')) { deleteDeliverySlot(slot.id); toast.success('ডেলিভারি সময়সূচি মুছে ফেলা হয়েছে') } }} className="text-red-600 hover:text-red-800" title="মুছুন"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
              {deliverySlots.length === 0 && (
                <p className="text-sm text-gray-500">
                  এখনো কোনো সময়সূচি নেই। চেকআউটে “পছন্দের ডেলিভারি সময়” দেখাতে যোগ করুন।
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <AutoSaveNote className="mt-6">
        ডেলিভারি চার্জ ও সময়সূচি সাথে সাথে সেভ হয়। ফ্রি ডেলিভারির সীমার জন্য সেভ বাটন লাগবে।
      </AutoSaveNote>

      {showChargeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingCharge ? 'চার্জ এডিট' : 'চার্জ যোগ করুন'}</h2>
            <form onSubmit={handleChargeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">এলাকা</label>
                <input type="text" value={chargeForm.area} onChange={(e) => setChargeForm({ ...chargeForm, area: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">চার্জ (৳)</label>
                <input type="number" value={chargeForm.charge} onChange={(e) => setChargeForm({ ...chargeForm, charge: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">সেভ করুন</button>
                <button type="button" onClick={() => { setShowChargeModal(false); setEditingCharge(null) }} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">বাতিল</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingSlot ? 'সময়সূচি এডিট' : 'সময়সূচি যোগ করুন'}</h2>
            <form onSubmit={handleSlotSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">সময়সূচির নাম</label>
                <input type="text" value={slotForm.label} onChange={(e) => setSlotForm({ ...slotForm, label: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="যেমন সকাল ১০টা - ১২টা" required />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={slotForm.enabled} onChange={(e) => setSlotForm({ ...slotForm, enabled: e.target.checked })} />
                <span className="text-sm">চালু</span>
              </label>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">সেভ করুন</button>
                <button type="button" onClick={() => { setShowSlotModal(false); setEditingSlot(null) }} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">বাতিল</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDelivery
