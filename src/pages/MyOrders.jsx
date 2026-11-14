import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Package, ShoppingBag, XCircle } from 'lucide-react'
import { Breadcrumbs, EmptyState, StatusBadge, formatTaka } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import toast from 'react-hot-toast'

const MyOrders = () => {
  const { user, getUserOrders, cancelOrder, refreshOrders } = useAuth()
  const navigate = useNavigate()
  const { t, tx } = useLanguage()

  useEffect(() => {
    if (user) refreshOrders()
    // Status refresh only needs to happen when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!user) {
    return (
      <div className="container-gb py-4">
        <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('account.orders') }]} />
        <div className="card mx-auto mt-6 max-w-lg">
          <EmptyState
            icon={Package}
            title={tx('Please sign in', 'সাইন ইন করুন')}
            subtitle={t('account.needLogin')}
            action={
              <Link to="/login" state={{ from: '/my/orders' }} className="btn-primary">
                {t('auth.login')}
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  const orders = getUserOrders()

  const handleCancel = (orderId) => {
    if (window.confirm(tx('Cancel this order?', 'এই অর্ডারটি বাতিল করবেন?'))) {
      cancelOrder(orderId)
    }
  }

  return (
    <div className="container-gb py-4">
      <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('account.orders') }]} />

      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold text-ink sm:text-2xl">{t('account.orders')}</h1>
        <Link to="/account" className="text-[12px] font-semibold text-brand hover:underline">
          {t('account.title')}
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={ShoppingBag}
            title={t('account.noOrders')}
            subtitle={t('account.noOrdersSub')}
            action={
              <Link to="/shop" className="btn-primary">
                {t('account.browseProducts')}
              </Link>
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const canCancel = !['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(order.status)
            return (
              <article key={order.id} className="card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-cream/70 px-4 py-2.5">
                  <div>
                    <p className="text-[13px] font-bold text-ink">
                      {t('account.orderId')}: #{order.id}
                    </p>
                    <p className="text-[11px] text-ink-muted">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <StatusBadge status={order.status} label={t(`status.${order.status}`)} />
                </div>

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

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
                  <div className="text-[11px] text-ink-muted">
                    <p className="flex items-start gap-1.5">
                      <MapPin size={12} className="mt-0.5 shrink-0" />
                      {[
                        order.shippingAddress?.address,
                        order.shippingAddress?.upazila,
                        order.shippingAddress?.district,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    <p className="mt-1">
                      {t('track.paymentMethod')}:{' '}
                      {order.paymentMethod === 'bkash'
                        ? t('checkout.bkash')
                        : order.paymentMethod === 'nagad'
                          ? t('checkout.nagad')
                          : t('checkout.cod')}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-ink">
                      {t('cart.total')}: <span className="text-brand">{formatTaka(order.total)}</span>
                    </p>
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => handleCancel(order.id)}
                        className="inline-flex items-center gap-1 rounded border border-red-200 px-2.5 py-1.5 text-[11px] font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <XCircle size={13} />
                        {tx('Cancel', 'বাতিল')}
                      </button>
                    )}
                    <Link to={`/track/${order.id}`} className="btn-dark px-3 py-1.5 text-[11px]">
                      {t('checkout.trackOrder')}
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyOrders
