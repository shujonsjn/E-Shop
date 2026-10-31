import { useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminDelivery = () => {
  const { settings, addDeliveryCharge, updateDeliveryCharge, deleteDeliveryCharge, addDeliverySlot, updateDeliverySlot, deleteDeliverySlot } = useSettings()
  const [showChargeModal, setShowChargeModal] = useState(false)
  const [showSlotModal, setShowSlotModal] = useState(false)
  const [editingCharge, setEditingCharge] = useState(null)
  const [editingSlot, setEditingSlot] = useState(null)
  const [chargeForm, setChargeForm] = useState({ area: '', charge: '' })
  const [slotForm, setSlotForm] = useState({ label: '', enabled: true })

  const handleChargeSubmit = (e) => {
    e.preventDefault()
    if (editingCharge) {
      updateDeliveryCharge(editingCharge.id, { area: chargeForm.area, charge: Number(chargeForm.charge) })
      toast.success('Delivery charge updated')
    } else {
      addDeliveryCharge({ area: chargeForm.area, charge: Number(chargeForm.charge) })
      toast.success('Delivery charge added')
    }
    setShowChargeModal(false)
    setEditingCharge(null)
    setChargeForm({ area: '', charge: '' })
  }

  const handleSlotSubmit = (e) => {
    e.preventDefault()
    if (editingSlot) {
      updateDeliverySlot(editingSlot.id, slotForm)
      toast.success('Delivery slot updated')
    } else {
      addDeliverySlot(slotForm)
      toast.success('Delivery slot added')
    }
    setShowSlotModal(false)
    setEditingSlot(null)
    setSlotForm({ label: '', enabled: true })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Delivery & Logistics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Charges */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Delivery Charges</h2>
            <button onClick={() => { setEditingCharge(null); setChargeForm({ area: '', charge: '' }); setShowChargeModal(true) }} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">
              <Plus size={18} /> Add
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {settings.deliveryCharges.map((charge) => (
                <div key={charge.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium text-gray-900">{charge.area}</p>
                    <p className="text-sm text-gray-500">৳{charge.charge}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingCharge(charge); setChargeForm({ area: charge.area, charge: charge.charge }); setShowChargeModal(true) }} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                    <button onClick={() => { if (confirm('Delete?')) { deleteDeliveryCharge(charge.id); toast.success('Deleted') } }} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Slots */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Delivery Slots</h2>
            <button onClick={() => { setEditingSlot(null); setSlotForm({ label: '', enabled: true }); setShowSlotModal(true) }} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">
              <Plus size={18} /> Add
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {settings.deliverySlots.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium text-gray-900">{slot.label}</p>
                    <p className="text-sm text-gray-500">{slot.enabled ? 'Enabled' : 'Disabled'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingSlot(slot); setSlotForm(slot); setShowSlotModal(true) }} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                    <button onClick={() => { if (confirm('Delete?')) { deleteDeliverySlot(slot.id); toast.success('Deleted') } }} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showChargeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingCharge ? 'Edit Charge' : 'Add Charge'}</h2>
            <form onSubmit={handleChargeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Area</label>
                <input type="text" value={chargeForm.area} onChange={(e) => setChargeForm({ ...chargeForm, area: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Charge (৳)</label>
                <input type="number" value={chargeForm.charge} onChange={(e) => setChargeForm({ ...chargeForm, charge: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save</button>
                <button type="button" onClick={() => { setShowChargeModal(false); setEditingCharge(null) }} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingSlot ? 'Edit Slot' : 'Add Slot'}</h2>
            <form onSubmit={handleSlotSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Slot Label</label>
                <input type="text" value={slotForm.label} onChange={(e) => setSlotForm({ ...slotForm, label: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="সকাল ১০টা - ১২টা" required />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={slotForm.enabled} onChange={(e) => setSlotForm({ ...slotForm, enabled: e.target.checked })} />
                <span className="text-sm">Enabled</span>
              </label>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save</button>
                <button type="button" onClick={() => { setShowSlotModal(false); setEditingSlot(null) }} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDelivery
