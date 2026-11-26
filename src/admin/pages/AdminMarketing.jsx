import { useEffect, useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { Plus, Trash2, AlertTriangle, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import AutoSaveNote from '../../components/admin/AutoSaveNote'
import {
  deleteNewsletterSubscriber,
  fetchNewsletterSubscribers,
} from '../../services/newsletter'

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
  const [subscribers, setSubscribers] = useState([])
  const [subscribersLoaded, setSubscribersLoaded] = useState(false)
  const [subscribersError, setSubscribersError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const loadSubscribers = async () => {
    const result = await fetchNewsletterSubscribers()
    setSubscribers(result.rows)
    setSubscribersLoaded(true)
    setSubscribersError(result.ok ? '' : 'নিউজলেটার তালিকা লোড করা যায়নি। Supabase-এ supabase/newsletter.sql চালানো হয়েছে কিনা দেখুন।')
  }

  useEffect(() => {
    loadSubscribers()
  }, [])

  const handleDeleteSubscriber = async (row) => {
    if (!window.confirm(`এই ইমেইলটি তালিকা থেকে মুছবেন?\n${row.email}`)) return
    setDeletingId(row.id)
    const result = await deleteNewsletterSubscriber(row.id)
    setDeletingId(null)
    if (result.ok) {
      setSubscribers((prev) => prev.filter((item) => item.id !== row.id))
      toast.success('সাবস্ক্রাইবার মুছে ফেলা হয়েছে')
    } else {
      toast.error('সাবস্ক্রাইবার মোছা যায়নি')
    }
  }

  const downloadSubscribers = () => {
    const header = 'email,source,created_at\n'
    const rows = subscribers
      .map((row) => `${row.email},${row.source || ''},${row.created_at || ''}`)
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

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
      toast.error('কুপন কোড দিতে হবে')
      return
    }
    if (coupons.some((c) => String(c.code || '').toUpperCase() === code)) {
      toast.error('এই কুপন কোডটি আগে থেকেই আছে')
      return
    }
    const rawValue = Number(couponForm.discountValue)
    if (!Number.isFinite(rawValue) || rawValue <= 0) {
      toast.error('০-এর চেয়ে বড় ছাড়ের পরিমাণ দিন')
      return
    }
    if (couponForm.discountType === 'percent' && rawValue > 100) {
      toast.error('শতকরা ছাড় ১০০%-এর বেশি হতে পারবে না')
      return
    }
    addCoupon({
      code,
      discountType: couponForm.discountType,
      discountValue: Math.round(rawValue),
      minOrder: Number(couponForm.minOrder || 0),
      expiryDate: couponForm.expiryDate,
    })
    toast.success('কুপন তৈরি হয়েছে')
    setShowCouponModal(false)
    setCouponForm(emptyCoupon)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">কুপন</h1>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl text-sm text-gray-500">
            কুপন তৈরি করলে কাস্টমার কার্ট বা চেকআউটে কোড বসিয়ে ছাড় পাবে। এখানে না থাকা
            কোনো ডেমো কুপন কাজ করবে না।
          </p>
          <button
            onClick={() => setShowCouponModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Plus size={20} /> কুপন তৈরি করুন
          </button>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">কোড</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ছাড়</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">সর্বনিম্ন অর্ডার</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">মেয়াদ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">কাজ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td className="px-6 py-4 font-mono font-bold text-blue-600">
                    {coupon.code}
                    {isExpired(coupon) && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
                        <AlertTriangle size={11} /> মেয়াদ শেষ
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
                        if (confirm('এই কুপনটি মুছে ফেলবেন? যারা আগে কোডটি বসিয়েছে তারা চেকআউটে ছাড় পাবে না।')) {
                          deleteCoupon(coupon.id)
                          toast.success('কুপন মুছে ফেলা হয়েছে')
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="কুপন মুছুন"
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
              <p className="text-gray-700 font-medium">এখনো কোনো কুপন নেই</p>
              <p className="mt-1 text-sm text-gray-500">“কুপন তৈরি করুন” চেপে একটি ডিসকাউন্ট কোড বানান।</p>
            </div>
          )}
        </div>
        <AutoSaveNote className="mt-4">
          কুপন তৈরি বা মুছে ফেলার সাথে সাথে সেভ হয়।
        </AutoSaveNote>
      </div>

      {/* Newsletter subscribers */}
      <div className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">নিউজলেটার সাবস্ক্রাইবার</h2>
            <p className="mt-1 text-sm text-gray-500">
              যারা ফুটারের সাবস্ক্রাইব ফর্মে ইমেইল দিয়েছেন তাঁদের তালিকা।
            </p>
          </div>
          <button
            type="button"
            onClick={downloadSubscribers}
            disabled={subscribers.length === 0}
            className="flex items-center gap-2 rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-900 disabled:opacity-50"
          >
            <Download size={18} /> CSV ডাউনলোড
          </button>
        </div>

        {subscribersError && (
          <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {subscribersError}
          </p>
        )}

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">ইমেইল</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">তারিখ</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">কাজ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscribers.map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-3 font-medium text-gray-800">{row.email}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {row.created_at ? new Date(row.created_at).toLocaleString('en-GB') : '-'}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      type="button"
                      onClick={() => handleDeleteSubscriber(row)}
                      disabled={deletingId === row.id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      title="সাবস্ক্রাইবার মুছুন"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {subscribersLoaded && subscribers.length === 0 && (
            <div className="py-10 text-center">
              <p className="font-medium text-gray-700">কোনো সাবস্ক্রাইবার নেই</p>
              <p className="mt-1 text-sm text-gray-500">কেউ এখনো ফুটার ফর্মে ইমেইল দেয়নি।</p>
            </div>
          )}
          {!subscribersLoaded && (
            <div className="py-10 text-center text-sm text-gray-500">লোড হচ্ছে…</div>
          )}
        </div>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">কুপন তৈরি করুন</h2>
            <form onSubmit={handleCouponSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">কুপন কোড</label>
                <input
                  type="text"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="EID2026"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">কাস্টমার কার্ট বা চেকআউটে এই কোডটি লিখবে। শুধু ইংরেজি অক্ষর ও সংখ্যা।</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ধরন</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="percent">শতকরা (%)</option>
                    <option value="fixed">নির্দিষ্ট টাকা</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {couponForm.discountType === 'percent' ? 'ছাড় (%)' : 'ছাড় (৳)'}
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
                <label className="block text-sm font-medium mb-1">সর্বনিম্ন অর্ডার (৳)</label>
                <input
                  type="number"
                  value={couponForm.minOrder}
                  onChange={(e) => setCouponForm({ ...couponForm, minOrder: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                  placeholder="0 = কোনো সীমা নেই"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">মেয়াদ শেষের তারিখ</label>
                <input
                  type="date"
                  value={couponForm.expiryDate}
                  onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                <p className="text-xs text-gray-500 mt-1">খালি রাখলে কুপন মুছে ফেলার আগ পর্যন্ত চালু থাকবে।</p>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  তৈরি করুন
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCouponModal(false)
                    setCouponForm(emptyCoupon)
                  }}
                  className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
                >
                  বাতিল
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
