import { useSettings } from '../../context/SettingsContext'
import toast from 'react-hot-toast'
import AutoSaveNote from '../../components/admin/AutoSaveNote'

const AdminPayments = () => {
  const { settings, updatePaymentMethod } = useSettings()
  const paymentMethods = settings.paymentMethods && typeof settings.paymentMethods === 'object'
    ? Object.entries(settings.paymentMethods)
    : []

  // SettingsContext persists the change automatically; this only confirms it.
  const notifyUpdated = () => {
    toast.success('Payment method updated')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Methods</h1>
      <p className="mb-4 text-sm text-gray-500">
        Enable or disable the payment options shown at checkout.
      </p>
      <AutoSaveNote className="mb-6" />

      <div className="space-y-4">
        {paymentMethods.map(([key, method]) => {
          if (!method || typeof method !== 'object') return null
          return (
            <div key={key} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{method.name || key}</h2>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(method.enabled)}
                    onChange={(e) => {
                      updatePaymentMethod(key, { enabled: e.target.checked })
                      notifyUpdated()
                    }}
                    className="w-5 h-5"
                  />
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
          )
        })}
        {paymentMethods.length === 0 && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            No payment methods found. Refresh the page or check your settings.
          </p>
        )}
      </div>
    </div>
  )
}

export default AdminPayments
