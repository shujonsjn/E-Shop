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
    toast.success('পেমেন্ট মেথড আপডেট হয়েছে')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">পেমেন্ট মেথড</h1>
      <p className="mb-4 text-sm text-gray-500">
        চেকআউটে যে পেমেন্ট অপশনগুলো দেখাবে সেগুলো এখান থেকে চালু বা বন্ধ করুন।
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
                  <span className="text-sm font-medium">চালু</span>
                </label>
              </div>
              {(key === 'bkash' || key === 'nagad' || key === 'rocket') && method.enabled && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">অ্যাকাউন্ট নম্বর</label>
                    <input type="text" value={method.number || ''} onChange={(e) => updatePaymentMethod(key, { number: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="01XXXXXXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">নির্দেশনা</label>
                    <textarea value={method.instructions || ''} onChange={(e) => updatePaymentMethod(key, { instructions: e.target.value })} className="w-full px-3 py-2 border rounded" rows={3} placeholder="কাস্টমারের জন্য পেমেন্ট নির্দেশনা" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {paymentMethods.length === 0 && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            কোনো পেমেন্ট মেথড পাওয়া যায়নি। পেজ রিফ্রেশ করুন বা সেটিংস যাচাই করুন।
          </p>
        )}
      </div>
    </div>
  )
}

export default AdminPayments
