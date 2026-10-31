import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Tag, Trash2, Truck, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { Breadcrumbs, EmptyState, QtyStepper, SectionHeading, formatTaka } from '../components/ui'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'
import { useLanguage } from '../i18n/LanguageContext'

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    coupon,
    applyCoupon,
    removeCoupon,
    discount,
    freeDelivery,
  } = useCart()
  const { products } = useProducts()
  const { t, tx } = useLanguage()
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  const handleApply = (e) => {
    e.preventDefault()
    const result = applyCoupon(code)
    setMessage(result.message)
    if (result.ok) setCode('')
  }

  const deliveryEstimate = freeDelivery ? 0 : null
  const total = subtotal - discount
  const suggestions = products.filter((p) => p.oldPrice > p.price).slice(0, 5)

  if (cartItems.length === 0) {
    return (
      <div className="container-gb py-4">
        <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('cart.title') }]} />
        <div className="card mt-2">
          <EmptyState
            icon={ShoppingBag}
            title={t('cart.empty')}
            subtitle={t('cart.emptySub')}
            action={
              <Link to="/shop" className="btn-primary">
                {t('common.continueShopping')}
                <ArrowRight size={16} />
              </Link>
            }
          />
        </div>
        {suggestions.length > 0 && (
          <section className="mt-8">
            <SectionHeading title={t('home.justForYou')} href="/shop" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {suggestions.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }

  return (
    <div className="container-gb py-2">
      <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('cart.title') }]} />

      <h1 className="mb-4 text-xl font-bold text-ink sm:text-2xl">
        {t('cart.title')}
        <span className="ml-2 text-sm font-normal text-ink-muted">({cartItems.length} {t('common.items')})</span>
      </h1>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="card overflow-hidden">
          <div className="hidden grid-cols-[1fr_120px_130px_40px] gap-3 border-b border-gray-100 bg-cream/70 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-ink-muted sm:grid">
            <span>{tx('Product', 'পণ্য')}</span>
            <span className="text-center">{t('common.quantity')}</span>
            <span className="text-right">{t('common.total')}</span>
            <span />
          </div>
          <ul className="divide-y divide-gray-100">
            {cartItems.map((item) => (
              <li key={item.id} className="p-3.5 sm:p-4">
                <div className="flex gap-3 sm:grid sm:grid-cols-[1fr_120px_130px_40px] sm:items-center">
                  <div className="flex min-w-0 flex-1 gap-3">
                    <Link to={`/products/${item.slug}`} className="shrink-0">
                      <img
                        src={item.image}
                        alt={tx(item.name, item.name_bn)}
                        className="h-20 w-20 rounded-md border border-gray-100 object-contain p-1"
                      />
                    </Link>
                    <div className="min-w-0">
                      <Link
                        to={`/products/${item.slug}`}
                        className="line-clamp-2 text-[13px] font-semibold text-ink hover:text-brand sm:text-sm"
                      >
                        {tx(item.name, item.name_bn)}
                      </Link>
                      <p className="mt-1 text-[11px] text-ink-muted">{item.unit}</p>
                      <p className="mt-1 text-sm font-bold text-brand sm:hidden">
                        {formatTaka(item.price * item.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={12} />
                        {t('common.remove')}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center sm:block">
                    <QtyStepper
                      value={item.quantity}
                      min={1}
                      max={item.stock || 99}
                      size="sm"
                      onChange={(qty) => updateQuantity(item.id, qty)}
                    />
                  </div>

                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-bold text-ink">{formatTaka(item.price * item.quantity)}</p>
                    <p className="text-[10px] text-gray-400">{formatTaka(item.price)} × {item.quantity}</p>
                  </div>

                  <div className="hidden justify-end sm:flex">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-gray-300 transition hover:text-red-500"
                      aria-label="Remove"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
            <Link to="/shop" className="text-xs font-semibold text-brand hover:underline">
              ← {t('common.continueShopping')}
            </Link>
            <p className="flex items-center gap-1.5 text-[11px] text-ink-muted">
              <Truck size={14} className="text-brand" />
              {t('cart.deliveryNote')}
            </p>
          </div>
        </section>

        <aside>
          <div className="card sticky top-[150px] p-4">
            <h2 className="text-base font-bold text-ink">{t('cart.orderSummary')}</h2>

            <form onSubmit={handleApply} className="mt-3">
              <label htmlFor="coupon" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink">
                <Tag size={13} className="text-brand" />
                {t('cart.coupon')}
              </label>
              {coupon ? (
                <div className="flex items-center justify-between gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2">
                  <div>
                    <p className="text-xs font-bold text-success">{coupon.code} {t('common.applied')}</p>
                    <p className="text-[10px] text-green-700">{coupon.label}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeCoupon()
                      setMessage('')
                    }}
                    className="shrink-0 p-1 text-green-700 hover:text-red-500"
                    aria-label="Remove coupon"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    id="coupon"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t('cart.couponPlaceholder')}
                    className="input py-2 text-xs uppercase"
                  />
                  <button type="submit" className="btn-dark shrink-0 px-3 py-2 text-xs">
                    {t('common.apply')}
                  </button>
                </div>
              )}
              {message && (
                <p className={`mt-1.5 text-[11px] ${message.includes('applied') ? 'text-success' : 'text-red-500'}`}>
                  {message}
                </p>
              )}
            </form>

            <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-[13px]">
              <div className="flex justify-between text-ink-muted">
                <span>{t('cart.subtotal')}</span>
                <span className="font-semibold text-ink">{formatTaka(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>{tx('Coupon discount', 'কুপন ছাড়')}</span>
                  <span className="font-semibold">− {formatTaka(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-muted">
                <span>{t('cart.deliveryCharge')}</span>
                <span className="text-[11px]">
                  {deliveryEstimate === 0 ? (
                    <span className="font-semibold text-success">{t('cart.freeDelivery')}</span>
                  ) : (
                    tx('Calculated at checkout', 'চেকআউটে নির্ধারিত হবে')
                  )}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-gray-100 pt-2.5">
                <span className="font-bold text-ink">{t('cart.total')}</span>
                <span className="text-lg font-extrabold text-brand">{formatTaka(total)}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary mt-4 w-full justify-between px-4">
              {t('cart.checkout')}
              <ArrowRight size={16} />
            </Link>
            <p className="mt-2 text-center text-[10.5px] text-ink-muted">
              {tx('Cash on delivery available · Secure checkout', 'ক্যাশ অন ডেলিভারি আছে · নিরাপদ চেকআউট')}
            </p>
          </div>
        </aside>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-10">
          <SectionHeading
            title={tx('You may also like', 'আপনার পছন্দ হতে পারে')}
            href="/offer-zone"
            linkLabel={t('common.viewAll')}
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {suggestions.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Cart
