import { Link, useLocation, useParams } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Package,
  Phone,
  Truck,
} from 'lucide-react'
import { Breadcrumbs, StatusBadge, formatTaka } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import { useLanguage } from '../i18n/LanguageContext'

const OrderSuccess = () => {
  const { id } = useParams()
  const location = useLocation()
  const { getOrderById } = useAuth()
  const { t, tx } = useLanguage()
  const { settings } = useSettings()

  const order = location.state?.order || getOrderById(id)

  if (!order) {
    return (
      <div className="container-gb py-4">
        <Breadcrumbs
          items={[
            { label: t('common.home'), to: '/' },
            { label: tx('Order Confirmation', 'অর্ডার নিশ্চিতকরণ') },
          ]}
        />
        <div className="card mx-auto mt-6 max-w-lg p-8 text-center">
          <ClipboardList size={44} className="mx-auto text-gray-300" />
          <h1 className="mt-3 text-xl font-bold text-ink">
            {tx('Order not found', 'অর্ডার পাওয়া যায়নি')}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {tx(
              'We could not find this order in this browser. If you saved the order ID, you can look it up on the tracking page.',
              'এই ব্রাউজারে অর্ডারটি পাওয়া যায়নি। অর্ডার আইডি সংরক্ষণ করে থাকলে ট্র্যাকিং পেজে দেখতে পারেন।'
            )}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link to="/track" className="btn-primary">
              {t('track.trackOrder')}
            </Link>
            <Link to="/shop" className="btn-outline">
              {t('common.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const address = order.shippingAddress || {}
  const items = Array.isArray(order.items) ? order.items : []
  const placedAt = new Date(order.createdAt)

  const paymentLabel =
    order.paymentMethod === 'bkash'
      ? t('checkout.bkash')
      : order.paymentMethod === 'nagad'
        ? t('checkout.nagad')
        : t('checkout.cod')

  return (
    <div className="container-gb py-4">
      <Breadcrumbs
        items={[
          { label: t('common.home'), to: '/' },
          { label: tx('Order Confirmation', 'অর্ডার নিশ্চিতকরণ') },
        ]}
      />

      <div className="mx-auto max-w-3xl">
        <div className="card overflow-hidden text-center">
          <div className="bg-gradient-to-b from-green-50 to-white px-5 py-8">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-success">
              <CheckCircle2 size={36} />
            </span>
            <h1 className="mt-4 text-xl font-bold text-ink sm:text-2xl">{t('checkout.orderPlaced')}</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
              {t('checkout.orderPlacedSub').replace('GhorerBazar', settings.siteName)}
            </p>

            <div className="mx-auto mt-5 inline-flex flex-col items-center rounded-lg border border-dashed border-brand/40 bg-white px-6 py-3">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-ink-muted">
                {t('checkout.orderId')}
              </span>
              <span className="text-lg font-extrabold text-brand">#{order.id}</span>
              <span className="mt-0.5 text-[11px] text-gray-400">
                {placedAt.toLocaleDateString()} · {placedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link to={`/track/${order.id}`} className="btn-dark">
                <Truck size={16} />
                {t('checkout.trackOrder')}
              </Link>
              <Link to="/shop" className="btn-outline">
                {t('common.continueShopping')}
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-100 px-4 py-4 text-left sm:px-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-ink">{t('checkout.orderSummary')}</h2>
              <StatusBadge status={order.status} label={t(`status.${order.status}`)} />
            </div>

            <ul className="mt-3 divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-2.5">
                  <img
                    src={item.image}
                    alt={tx(item.name, item.name_bn)}
                    className="h-14 w-14 shrink-0 rounded object-contain"
                  />
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
                  <span className="text-sm font-bold text-ink">
                    {formatTaka(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-[13px]">
              <div className="flex justify-between text-ink-muted">
                <span>{t('cart.subtotal')}</span>
                <span className="font-semibold text-ink">{formatTaka(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>{tx('Coupon discount', 'কুপন ছাড়')}</span>
                  <span className="font-semibold">− {formatTaka(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-muted">
                <span>{t('cart.deliveryCharge')}</span>
                <span className="font-semibold text-ink">
                  {Number(order.deliveryCharge) === 0 ? t('checkout.free') : formatTaka(order.deliveryCharge)}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-gray-100 pt-2">
                <span className="font-bold text-ink">{t('cart.total')}</span>
                <span className="text-lg font-extrabold text-brand">{formatTaka(order.total)}</span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md bg-cream/70 p-3">
                <h3 className="flex items-center gap-1.5 text-[12px] font-bold text-ink">
                  <MapPin size={13} className="text-brand" />
                  {t('track.deliveryAddress')}
                </h3>
                <p className="mt-1 text-[12px] leading-5 text-ink-muted">
                  {address.fullName}
                  <br />
                  {[address.address, address.upazila, address.district, address.division]
                    .filter(Boolean)
                    .join(', ')}
                  {address.phone && (
                    <>
                      <br />
                      <span className="inline-flex items-center gap-1">
                        <Phone size={11} /> {address.phone}
                      </span>
                    </>
                  )}
                </p>
              </div>
              <div className="rounded-md bg-cream/70 p-3">
                <h3 className="flex items-center gap-1.5 text-[12px] font-bold text-ink">
                  <Package size={13} className="text-brand" />
                  {t('track.paymentMethod')}
                </h3>
                <p className="mt-1 text-[12px] text-ink-muted">{paymentLabel}</p>
                <p className="mt-1 text-[11px] leading-5 text-ink-muted">
                  {tx(
                    'We will call to confirm before dispatch. Keep the order ID handy.',
                    'পাঠানোর আগে কল করে নিশ্চিত করা হবে। অর্ডার আইডি হাতে রাখুন।'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-gray-400">
          {tx(
            'Our team will call you shortly to confirm the order and delivery time.',
            'আমাদের টিম অর্ডার ও ডেলিভারির সময় নিশ্চিত করতে শীঘ্রই আপনাকে কল করবে।'
          )}
        </p>
      </div>
    </div>
  )
}

export default OrderSuccess
