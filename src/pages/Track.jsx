import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  Package,
  Phone,
  Search,
  Truck,
  XCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Breadcrumbs, StatusBadge, formatTaka } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'

const STEPS = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered']

const Track = () => {
  const { orderId: routeOrderId } = useParams()
  const { getOrderById, cancelOrder, user } = useAuth()
  const { t, tx } = useLanguage()

  const [input, setInput] = useState(routeOrderId || '')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState(null)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (routeOrderId) {
      const found = getOrderById(routeOrderId)
      setOrder(found || null)
      setSearched(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeOrderId])

  const handleSearch = (e) => {
    e.preventDefault()
    const key = input.trim().replace(/^#/, '')
    if (!key) {
      toast.error(tx('Enter your order ID', 'আপনার অর্ডার আইডি দিন'))
      return
    }
    const found = getOrderById(key)
    if (found && phone.trim()) {
      const storedPhone = found.shippingAddress?.phone || ''
      if (!storedPhone.includes(phone.trim())) {
        setOrder(null)
        setSearched(true)
        return
      }
    }
    setOrder(found || null)
    setSearched(true)
  }

  const canCancel =
    order &&
    user &&
    String(order.userId) === String(user.id) &&
    !['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(order.status)

  const handleCancel = () => {
    if (!order) return
    if (window.confirm(tx('Cancel this order?', 'এই অর্ডারটি বাতিল করবেন?'))) {
      const ok = cancelOrder(order.id)
      if (ok) {
        setOrder((prev) => ({ ...prev, status: 'Cancelled' }))
      }
    }
  }

  const history = order?.statusHistory || []
  const currentStep = order ? STEPS.indexOf(order.status) : -1
  const cancelled = order?.status === 'Cancelled'

  return (
    <div className="container-gb py-4">
      <Breadcrumbs
        items={[
          { label: t('common.home'), to: '/' },
          { label: t('track.title') },
        ]}
      />

      <div className="mx-auto max-w-3xl">
        <div className="card overflow-hidden">
          <div className="bg-gradient-to-r from-brand-light to-white px-5 py-6 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand text-white">
              <Truck size={24} />
            </span>
            <h1 className="mt-3 text-xl font-bold text-ink sm:text-2xl">{t('track.title')}</h1>
            <p className="mt-1 text-xs text-ink-muted sm:text-sm">{t('track.subtitle')}</p>
          </div>

          <form onSubmit={handleSearch} className="grid gap-2.5 border-t border-gray-100 p-4 sm:grid-cols-[1fr_180px_auto]">
            <div>
              <label htmlFor="orderId" className="label text-xs">
                {t('track.orderId')}
              </label>
              <input
                id="orderId"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={tx('e.g. 1760000000000', 'যেমন ১৭৬০০০০০০০০০০')}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="phone" className="label text-xs">
                {t('track.phone')}
              </label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="input"
                type="tel"
              />
            </div>
            <button type="submit" className="btn-primary self-end py-2.5">
              <Search size={16} />
              {t('track.trackOrder')}
            </button>
          </form>
        </div>

        {searched && !order && (
          <div className="card mt-4 p-8 text-center">
            <XCircle size={44} className="mx-auto text-red-300" />
            <h2 className="mt-3 text-lg font-bold text-ink">{t('track.orderNotFound')}</h2>
            <p className="mt-1.5 text-sm text-ink-muted">{t('track.orderNotFoundSub')}</p>
            <p className="mt-3 text-[11px] text-gray-400">
              {tx(
                'Tip: this demo stores orders in the browser that placed them. Orders from another browser or device cannot be found.',
                'টিপস: এই ডেমোটি যে ব্রাউজারে অর্ডার করা হয়েছে সেখানেই সংরক্ষণ করে। অন্য ব্রাউজার বা ডিভাইসের অর্ডার পাওয়া যাবে না।'
              )}
            </p>
            <Link to="/shop" className="btn-outline mt-4">
              {t('common.continueShopping')}
            </Link>
          </div>
        )}

        {order && (
          <div className="mt-4 space-y-4">
            <div className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-cream/70 px-4 py-3">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-ink-muted">
                    {t('track.orderId')}
                  </p>
                  <p className="text-base font-extrabold text-ink">#{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10.5px] text-ink-muted">{t('track.orderDate')}</p>
                  <p className="text-xs font-semibold text-ink">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <StatusBadge
                  status={order.status}
                  label={t(`status.${order.status}`)}
                  className="text-[11px]"
                />
              </div>

              {/* Timeline */}
              <div className="p-4 sm:p-5">
                <h2 className="mb-4 text-sm font-bold text-ink">{t('track.timeline')}</h2>

                {cancelled ? (
                  <div className="flex items-start gap-3 rounded-md bg-red-50 p-3 text-red-700">
                    <XCircle size={18} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] font-bold">
                        {tx('This order was cancelled', 'এই অর্ডারটি বাতিল করা হয়েছে')}
                      </p>
                      <p className="mt-0.5 text-[11.5px]">
                        {history.find((h) => h.status === 'Cancelled')?.date
                          ? new Date(history.find((h) => h.status === 'Cancelled').date).toLocaleString()
                          : ''}
                      </p>
                    </div>
                  </div>
                ) : (
                  <ol className="relative ml-1 space-y-5 border-l-2 border-dashed border-gray-200 pl-6">
                    {STEPS.map((step, index) => {
                      const done = currentStep >= index
                      const active = currentStep === index
                      const entry = history.find((h) => h.status === step)
                      return (
                        <li key={step} className="relative">
                          <span
                            className={`absolute -left-[35px] grid h-6 w-6 place-items-center rounded-full border-2 ${
                              done
                                ? 'border-brand bg-brand text-white'
                                : 'border-gray-200 bg-white text-gray-300'
                            }`}
                          >
                            {done ? <CheckCircle2 size={14} /> : <Circle size={8} />}
                          </span>
                          <p
                            className={`text-[13px] font-bold ${
                              active ? 'text-brand' : done ? 'text-ink' : 'text-gray-400'
                            }`}
                          >
                            {t(`status.${step}`)}
                          </p>
                          {entry?.date && (
                            <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-ink-muted">
                              <Clock size={10} />
                              {new Date(entry.date).toLocaleString()}
                            </p>
                          )}
                          {active && !entry?.date && (
                            <p className="mt-0.5 text-[11px] text-ink-muted">
                              {tx('In progress', 'চলমান')}
                            </p>
                          )}
                        </li>
                      )
                    })}
                  </ol>
                )}

                {!cancelled && order.status !== 'Delivered' && (
                  <p className="mt-4 rounded-md bg-cream/70 px-3 py-2 text-[11.5px] text-ink-muted">
                    {tx(
                      'Estimated delivery: 1–2 working days inside Dhaka, 2–3 working days outside Dhaka.',
                      'আনুমানিক ডেলিভারি: ঢাকার ভিতরে ১–২ কর্মদিবস, বাইরে ২–৩ কর্মদিবস।'
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card p-4">
                <h2 className="flex items-center gap-1.5 text-sm font-bold text-ink">
                  <MapPin size={15} className="text-brand" />
                  {t('track.deliveryAddress')}
                </h2>
                <div className="mt-2 space-y-0.5 text-[12.5px] leading-6 text-ink-muted">
                  <p className="font-semibold text-ink">{order.shippingAddress?.fullName}</p>
                  <p>
                    {[
                      order.shippingAddress?.address,
                      order.shippingAddress?.upazila,
                      order.shippingAddress?.district,
                      order.shippingAddress?.division,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  {order.shippingAddress?.phone && (
                    <p className="inline-flex items-center gap-1">
                      <Phone size={12} /> {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="card p-4">
                <h2 className="flex items-center gap-1.5 text-sm font-bold text-ink">
                  <Package size={15} className="text-brand" />
                  {t('track.paymentMethod')}
                </h2>
                <p className="mt-2 text-[12.5px] text-ink-muted">
                  {order.paymentMethod === 'bkash'
                    ? t('checkout.bkash')
                    : order.paymentMethod === 'nagad'
                      ? t('checkout.nagad')
                      : t('checkout.cod')}
                </p>
                <div className="mt-3 space-y-1 border-t border-gray-100 pt-2 text-[12.5px]">
                  <div className="flex justify-between text-ink-muted">
                    <span>{t('cart.subtotal')}</span>
                    <span>{formatTaka(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>{tx('Discount', 'ছাড়')}</span>
                      <span>− {formatTaka(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-ink-muted">
                    <span>{t('cart.deliveryCharge')}</span>
                    <span>{formatTaka(order.deliveryCharge)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-1.5 text-sm font-bold text-ink">
                    <span>{t('cart.total')}</span>
                    <span className="text-brand">{formatTaka(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card overflow-hidden">
              <h2 className="border-b border-gray-100 bg-cream/70 px-4 py-2.5 text-sm font-bold text-ink">
                {t('track.items')} ({(order.items || []).length})
              </h2>
              <ul className="divide-y divide-gray-100 px-4">
                {(order.items || []).map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-2.5">
                    <img src={item.image} alt="" className="h-12 w-12 shrink-0 rounded object-contain" />
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/products/${item.slug}`}
                        className="line-clamp-1 text-[13px] font-semibold text-ink hover:text-brand"
                      >
                        {tx(item.name, item.name_bn)}
                      </Link>
                      <p className="text-[11px] text-ink-muted">
                        {item.unit ? `${item.unit} · ` : ''}
                        {formatTaka(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-[13px] font-bold text-ink">
                      {formatTaka(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3">
              <p className="text-[12px] text-ink-muted">
                {t('track.needHelp')}{' '}
                <a href="tel:+8809642922922" className="font-semibold text-brand hover:underline">
                  {t('track.contact')}
                </a>
              </p>
              <div className="flex flex-wrap gap-2">
                {canCancel && (
                  <button type="button" onClick={handleCancel} className="btn-outline border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                    <XCircle size={14} />
                    {tx('Cancel order', 'অর্ডার বাতিল')}
                  </button>
                )}
                <Link to="/shop" className="btn-outline px-3 py-1.5 text-xs">
                  {t('common.continueShopping')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Track
