import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../i18n/LanguageContext'
import { EmptyState, QtyStepper, formatTaka } from './ui'
import { useEffect } from 'react'

const FREE_DELIVERY_THRESHOLD = 2000

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    getCartCount,
  } = useCart()
  const { t, tx } = useLanguage()

  useEffect(() => {
    if (!isCartOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isCartOpen])

  if (!isCartOpen) return null

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide-in flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
          <h2 className="flex items-center gap-2 text-base font-bold text-ink">
            <ShoppingBag size={18} className="text-brand" />
            {t('cart.title')}
            <span className="rounded-full bg-brand-light px-2 py-0.5 text-xs font-semibold text-brand-dark">
              {getCartCount()}
            </span>
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="grid h-8 w-8 place-items-center rounded-full text-ink-muted transition hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={ShoppingBag}
              title={t('cart.empty')}
              subtitle={t('cart.emptySub')}
              action={
                <Link to="/shop" onClick={closeCart} className="btn-primary">
                  {t('common.continueShopping')}
                </Link>
              }
            />
          </div>
        ) : (
          <>
            <div className="border-b border-gray-100 px-4 py-3">
              {remaining > 0 ? (
                <p className="text-xs text-ink-muted">
                  {tx(
                    `Add ${formatTaka(remaining)} more for free delivery`,
                    `ফ্রি ডেলিভারির জন্য আরও ${formatTaka(remaining)} যোগ করুন`
                  )}
                </p>
              ) : (
                <p className="text-xs font-semibold text-success">
                  {tx('You unlocked free delivery!', 'আপনি ফ্রি ডেলিভারি পেয়েছেন!')}
                </p>
              )}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-brand transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              <ul className="space-y-3">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex gap-3 rounded-md border border-gray-100 p-2.5">
                    <Link to={`/products/${item.slug}`} onClick={closeCart} className="shrink-0">
                      <img
                        src={item.image}
                        alt={tx(item.name, item.name_bn)}
                        className="h-20 w-20 rounded object-contain"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="line-clamp-2 text-[13px] font-semibold leading-5 text-ink hover:text-brand"
                        >
                          {tx(item.name, item.name_bn)}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="shrink-0 p-1 text-gray-400 transition hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="mt-0.5 text-[11px] text-gray-400">{item.unit}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <QtyStepper
                          value={item.quantity}
                          min={1}
                          max={item.stock || 99}
                          size="sm"
                          onChange={(qty) => updateQuantity(item.id, qty)}
                        />
                        <span className="text-sm font-bold text-brand">
                          {formatTaka(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-gray-100 px-4 py-4">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-ink-muted">{t('cart.subtotal')}</span>
                <span className="font-bold text-ink">{formatTaka(subtotal)}</span>
              </div>
              <p className="mb-3 text-[11px] text-gray-400">{t('cart.deliveryNote')}</p>
              <Link
                to="/cart"
                onClick={closeCart}
                className="btn-outline mb-2 w-full"
              >
                {t('cart.title')}
              </Link>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="btn-primary w-full justify-between px-4"
              >
                {t('cart.checkout')}
                <ArrowRight size={16} />
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}

export default CartDrawer
