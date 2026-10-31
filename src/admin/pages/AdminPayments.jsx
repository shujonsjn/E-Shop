import { useSettings } from '../../context/SettingsContext'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminPayments = () => {
  const { settings, updatePaymentMethod } = useSettings()

  const handleSave = (key) => {
    toast.success('Payment method updated')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Methods</h1>

      <div className="space-y-4">
        {Object.entries(settings.paymentMethods).map(([key, method]) => (
          <div key={key} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{method.name}</h2>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={method.enabled} onChange={(e) => { updatePaymentMethod(key, { enabled: e.target.checked }); handleSave(key) }} className="w-5 h-5" />
                <span className="text-sm font-medium">Enabled</span>
              </label>
            </div>
            {(key === 'bkash' || key === 'nagad' || key === 'rocket') && method.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Account Number</label>
                  <input type="text" value={method.number || ''} onChange={(e) => updatePaymentMethod(key, { number: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="01XXXXXXXXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Instructions</label>
                  <textarea value={method.instructions || ''} onChange={(e) => updatePaymentMethod(key, { instructions: e.target.value })} className="w-full px-3 py-2 border rounded" rows={3} placeholder="Payment instructions for customer" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPayments
