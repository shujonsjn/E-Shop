import { Link, useLocation } from 'react-router-dom'
import { Home, LayoutGrid, Search, ShoppingCart, User } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../i18n/LanguageContext'

const MobileBottomNav = () => {
  const { getCartCount, openCart } = useCart()
  const { t } = useLanguage()
  const location = useLocation()

  if (['/login', '/register', '/admin'].some((path) => location.pathname.startsWith(path))) {
    return null
  }

  const active = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const itemClass = (isActive) =>
    `flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-semibold transition ${
      isActive ? 'text-brand' : 'text-ink-muted'
    }`

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:hidden"
      aria-label="Mobile bottom navigation"
    >
      <div className="mx-auto flex h-14 max-w-md items-stretch">
        <Link to="/" className={itemClass(active('/'))}>
          <Home size={19} />
          {t('nav.home')}
        </Link>
        <Link to="/shop" className={itemClass(active('/shop') || active('/collections'))}>
          <LayoutGrid size={19} />
          {t('nav.menu')}
        </Link>
        <button type="button" onClick={openCart} className={`relative ${itemClass(false)}`}>
          <span className="relative">
            <ShoppingCart size={19} />
            {getCartCount() > 0 && (
              <span className="absolute -right-2.5 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">
                {getCartCount()}
              </span>
            )}
          </span>
          {t('nav.cart')}
        </button>
        <Link to="/search" className={itemClass(active('/search'))}>
          <Search size={19} />
          {t('nav.search')}
        </Link>
        <Link to="/account" className={itemClass(active('/account') || active('/my'))}>
          <User size={19} />
          {t('nav.account')}
        </Link>
      </div>
    </nav>
  )
}

export default MobileBottomNav
