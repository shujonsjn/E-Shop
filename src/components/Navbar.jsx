import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  ChevronRight,
  Globe2,
  Grid3X3,
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  ShoppingCart,
  Truck,
  User,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useProducts } from '../context/ProductsContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useSettings } from '../context/SettingsContext'
import { getMergedCategories } from '../utils/mergeCategories'
import { formatTaka } from './ui'
import CartDrawer from './CartDrawer'

const HIDE_ON = ['/login', '/register', '/admin']

const Navbar = () => {
  const { user } = useAuth()
  const { getCartCount, openCart, subtotal } = useCart()
  const { wishlist } = useWishlist()
  const { products, searchProducts } = useProducts()
  const { t, tx, lang, toggle } = useLanguage()
  const { settings } = useSettings()
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const loadCats = () => {
      // getMergedCategories() already returns exactly the saved+synced list.
      try {
        const list = getMergedCategories()
        // A sub-category with the same name as its parent only duplicates the
        // menu entry, so drop those.
        setCategories(
          list.map((category) => ({
            ...category,
            children: (category.children || []).filter(
              (child) =>
                (child.name || '').trim().toLowerCase() !==
                (category.name || '').trim().toLowerCase()
            ),
          }))
        )
      } catch {
        setCategories([])
      }
    }
    loadCats()
    const handleStorage = () => loadCats()
    window.addEventListener('storage', handleStorage)
    window.addEventListener('focus', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('focus', handleStorage)
    }
  }, [location.pathname])

  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [activeMegaCat, setActiveMegaCat] = useState(null)
  const [openMobileCat, setOpenMobileCat] = useState('')
  const [query, setQuery] = useState('')
  const [showSuggest, setShowSuggest] = useState(false)
  const blurTimer = useRef(null)

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setMegaOpen(false)
    setShowSuggest(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    const locked = menuOpen || searchOpen
    if (!locked) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen, searchOpen])

  useEffect(() => () => clearTimeout(blurTimer.current), [])

  if (HIDE_ON.some((path) => location.pathname.startsWith(path))) return null

  const suggestions = query.trim() ? searchProducts(query).slice(0, 6) : []
  const popular = ['Honey', 'Dates', 'Ghee', 'Mustard oil', 'Cashew', 'Masala']

  const goSearch = (value) => {
    const q = String(value || '').trim()
    if (!q) {
      navigate('/shop')
    } else {
      navigate(`/search?q=${encodeURIComponent(q)}`)
    }
    setShowSuggest(false)
    setSearchOpen(false)
    setQuery('')
  }

  const submitSearch = (e) => {
    e.preventDefault()
    goSearch(query)
  }

  const handleBlur = () => {
    blurTimer.current = setTimeout(() => setShowSuggest(false), 160)
  }

  return (
    <>
      {/* Top strip */}
      <div className="bg-ink text-white">
        <div className="container-gb flex h-9 items-center justify-between gap-3 text-[11px] sm:text-xs">
          <div className="flex items-center gap-3">
            <a href={`tel:${settings.callOrderNumber || settings.sitePhone}`} className="inline-flex items-center gap-1.5 hover:text-brand">
              <Phone size={12} />
              <span className="font-semibold">{settings.callOrderNumber || settings.sitePhone}</span>
            </a>
            <span className="hidden text-white/25 sm:inline">|</span>
            <span className="hidden items-center gap-1.5 text-white/75 sm:inline-flex">
              <Truck size={13} />
              {settings.topBarText || t('topbar.delivery')}
            </span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <Link to="/track" className="hover:text-brand">
              {t('nav.trackOrder')}
            </Link>
            <span className="text-white/25">|</span>
            <Link to="/my/wishlists" className="hidden items-center gap-1 hover:text-brand sm:inline-flex">
              <Heart size={12} />
              {t('nav.wishlist')}
            </Link>
            <span className="hidden text-white/25 sm:inline">|</span>
            {user ? (
              <Link to="/account" className="inline-flex items-center gap-1 font-semibold text-brand hover:text-white">
                <User size={12} />
                {user.name.split(' ')[0]}
              </Link>
            ) : (
              <Link to="/login" className="inline-flex items-center gap-1 hover:text-brand">
                <User size={12} />
                {t('nav.signIn')}
              </Link>
            )}
            <span className="text-white/25">|</span>
            <button
              type="button"
              onClick={toggle}
              className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-1 font-semibold transition hover:bg-brand"
            >
              <Globe2 size={12} />
              {lang === 'en' ? 'বাংলা' : 'English'}
              <span className="sr-only">{tx('Change language', 'ভাষা পরিবর্তন')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="container-gb flex h-16 items-center gap-3 sm:h-[70px] sm:gap-5">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-md text-ink transition hover:bg-gray-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="flex shrink-0 flex-col leading-none">
            <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
              {settings.siteLogo ? (
                <img src={settings.siteLogo} alt={settings.siteName} className="h-10" />
              ) : (
                <span className="text-brand">{settings.siteName}</span>
              )}
            </span>
            <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-ink-muted sm:block">
              {tx(
                settings.siteTagline ?? 'Pure food, honest price',
                settings.siteTagline_bn ?? 'খাঁটি খাবার, সেরা দাম'
              )}
            </span>
          </Link>

          <form onSubmit={submitSearch} className="relative mx-auto hidden w-full max-w-xl md:block">
            <div className="flex h-10 items-center overflow-hidden rounded-md border border-gray-200 bg-cream focus-within:border-brand">
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setShowSuggest(true)
                }}
                onFocus={() => setShowSuggest(true)}
                onBlur={handleBlur}
                placeholder={t('common.searchPlaceholder')}
                className="h-full w-full bg-transparent px-3.5 text-sm text-ink outline-none placeholder:text-gray-500"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="h-full bg-brand px-4 text-white transition hover:bg-brand-dark"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>

            {showSuggest && query.trim() && (
              <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-md border border-gray-100 bg-white shadow-xl">
                {suggestions.length === 0 ? (
                  <p className="px-4 py-5 text-sm text-ink-muted">{t('common.noResults')}</p>
                ) : (
                  <ul className="divide-y divide-gray-50">
                    {suggestions.map((product) => (
                      <li key={product.id}>
                        <Link
                          to={`/products/${product.slug}`}
                          onMouseDown={(e) => e.preventDefault()}
                          className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-cream"
                        >
                          <img src={product.image} alt="" className="h-10 w-10 rounded object-contain" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-semibold text-ink">
                              {tx(product.name, product.name_bn)}
                            </span>
                            <span className="text-[11px] text-ink-muted">{product.unit}</span>
                          </span>
                          <span className="text-sm font-bold text-brand">{formatTaka(product.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goSearch(query)}
                  className="block w-full border-t border-gray-100 bg-cream/60 px-4 py-2.5 text-left text-xs font-semibold text-brand hover:bg-cream"
                >
                  {tx('See all results', 'সব ফলাফল দেখুন')} →
                </button>
              </div>
            )}
          </form>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              to={user ? '/account' : '/login'}
              className="hidden flex-col items-center rounded px-2 py-1 text-ink-muted transition hover:text-brand sm:flex"
            >
              <User size={20} />
              <span className="mt-0.5 text-[10px] font-medium">{t('nav.account')}</span>
            </Link>
            <Link
              to="/my/wishlists"
              className="relative hidden flex-col items-center rounded px-2 py-1 text-ink-muted transition hover:text-brand sm:flex"
            >
              <Heart size={20} />
              <span className="mt-0.5 text-[10px] font-medium">{t('nav.wishlist')}</span>
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-md text-ink-muted transition hover:text-brand md:hidden"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center gap-2 rounded-md px-1.5 py-1 text-ink-muted transition hover:text-brand sm:px-2"
            >
              <span className="sr-only lg:hidden">{t('nav.cart')}</span>
              <span className="relative">
                <ShoppingCart size={21} />
                {getCartCount() > 0 && (
                  <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">
                    {getCartCount()}
                  </span>
                )}
              </span>
              <span className="hidden text-left leading-tight lg:block">
                <span className="block text-[9px] uppercase tracking-wide text-gray-500">
                  {t('nav.cart')}
                </span>
                <span className="block text-xs font-bold text-ink">{formatTaka(subtotal)}</span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile search row */}
        <div className="container-gb pb-2.5 md:hidden">
          <form onSubmit={submitSearch} className="flex h-9 items-center overflow-hidden rounded-md border border-gray-200 bg-cream">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('common.searchPlaceholder')}
              className="h-full w-full bg-transparent px-3 text-xs text-ink outline-none placeholder:text-gray-500"
              aria-label="Search products"
            />
            <button type="submit" className="h-full bg-brand px-3 text-white" aria-label="Search">
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* Desktop nav */}
        <nav className="hidden border-t border-gray-100 lg:block" aria-label="Main navigation">
          <div className="container-gb flex h-11 items-center gap-1">
            <button
              type="button"
              onMouseEnter={() => {
                setMegaOpen(true)
                setActiveMegaCat(categories[0]?.slug || null)
              }}
              onClick={() => setMegaOpen((open) => !open)}
              className="inline-flex h-full items-center gap-2 bg-brand px-4 text-sm font-bold text-white"
            >
              <Grid3X3 size={16} />
              {t('nav.allCategories')}
              <ChevronDown size={14} className={`transition ${megaOpen ? 'rotate-180' : ''}`} />
            </button>

            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `px-3 py-2 text-[13px] font-semibold transition hover:text-brand ${isActive ? 'text-brand' : 'text-ink'}`
              }
            >
              {t('nav.shop')}
            </NavLink>

            {categories.slice(0, 7).map((category) => (
              <div key={category.slug} className="group relative">
                <Link
                  to={`/collections/${category.slug}`}
                  className="inline-flex items-center gap-1 px-3 py-2 text-[13px] font-semibold text-ink transition hover:text-brand"
                >
                  {tx(category.name, category.name_bn)}
                  <ChevronDown size={12} className="text-gray-400" />
                </Link>
                {category.children.length > 0 && (
                  <div className="invisible absolute left-0 top-full z-50 w-56 rounded-b-md border border-t-0 border-gray-100 bg-white py-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                    {category.children.map((child) => (
                      <Link
                        key={child.slug}
                        to={`/collections/${category.slug}/${child.slug}`}
                        className="block px-4 py-2 text-[13px] text-ink-muted transition hover:bg-cream hover:text-brand"
                      >
                        {tx(child.name, child.name_bn)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              to="/offer-zone"
              className="ml-1 inline-flex items-center gap-1 rounded bg-red-50 px-3 py-1.5 text-[13px] font-bold text-red-600 transition hover:bg-red-100"
            >
              {t('nav.offerZone')}
            </Link>
            <Link
              to="/brands"
              className="px-3 py-2 text-[13px] font-semibold text-ink transition hover:text-brand"
            >
              {t('nav.brands')}
            </Link>
            <Link
              to="/track"
              className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-muted transition hover:text-brand"
            >
              <Truck size={14} />
              {t('nav.trackOrder')}
            </Link>
          </div>
        </nav>

        {/* Mega menu */}
        {megaOpen && (
          <div
            className="absolute left-0 right-0 top-full hidden lg:block"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => {
              setMegaOpen(false)
              setActiveMegaCat(null)
            }}
          >
            <div className="container-gb">
              <div className="inline-flex border border-t-0 border-gray-200 bg-white shadow-lg">
                <div className="w-[250px] shrink-0 border-r border-gray-200">
                  {categories.map((category) => (
                    <button
                      key={category.slug}
                      type="button"
                      onMouseEnter={() => setActiveMegaCat(category.slug)}
                      onClick={() => {
                        setMegaOpen(false)
                        navigate(`/collections/${category.slug}`)
                      }}
                      className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-[13px] transition ${
                        activeMegaCat === category.slug
                          ? 'bg-gray-100 font-medium text-ink'
                          : 'text-ink hover:bg-gray-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <img src={category.image} alt="" className="h-5 w-5 object-contain" />
                        <span className="line-clamp-1">{tx(category.name, category.name_bn)}</span>
                      </span>
                      {category.children.length > 0 && <ChevronRight size={14} className="text-gray-400" />}
                    </button>
                  ))}
                </div>
                <div className="shrink-0 px-6 py-4">
                  {(() => {
                    const activeCat = categories.find((c) => c.slug === activeMegaCat) || categories[0]
                    if (!activeCat) return null
                    return (
                      <div className="w-max">
                        <Link
                          to={`/collections/${activeCat.slug}`}
                          onClick={() => setMegaOpen(false)}
                          className="mb-3 inline-block whitespace-nowrap text-sm font-bold text-ink hover:text-brand"
                        >
                          {tx(activeCat.name, activeCat.name_bn)}
                        </Link>
                        {activeCat.children.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {activeCat.children.map((child) => (
                              <Link
                                key={child.slug}
                                to={`/collections/${activeCat.slug}/${child.slug}`}
                                onClick={() => setMegaOpen(false)}
                                className="whitespace-nowrap py-1 text-[13px] text-ink hover:text-brand"
                              >
                                {tx(child.name, child.name_bn)}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="whitespace-nowrap text-sm text-ink-muted">{tx('No subcategories', 'সাবক্যাটেগরি নেই')}</p>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[86%] max-w-sm animate-fade-in flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
              <Link to="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
                {settings.siteLogo ? (
                  <img src={settings.siteLogo} alt={settings.siteName} className="h-8" />
                ) : (
                  <span className="text-lg font-extrabold tracking-tight text-brand">
                    {settings.siteName}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-ink-muted hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <form onSubmit={submitSearch} className="mb-4 flex h-10 items-center overflow-hidden rounded-md border border-gray-200 bg-cream">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('common.searchPlaceholder')}
                  className="h-full w-full bg-transparent px-3 text-sm outline-none"
                />
                <button type="submit" className="h-full bg-brand px-3 text-white" aria-label="Search">
                  <Search size={16} />
                </button>
              </form>

              <div className="mb-4 grid grid-cols-2 gap-2">
                <Link
                  to="/shop"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md bg-cream px-3 py-2.5 text-sm font-semibold text-ink"
                >
                  {t('nav.shop')}
                </Link>
                <Link
                  to="/offer-zone"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600"
                >
                  {t('nav.offerZone')}
                </Link>
                <Link
                  to="/brands"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md bg-cream px-3 py-2.5 text-sm font-semibold text-ink"
                >
                  {t('nav.brands')}
                </Link>
                <Link
                  to="/track"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md bg-cream px-3 py-2.5 text-sm font-semibold text-ink"
                >
                  {t('nav.trackOrder')}
                </Link>
              </div>

              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                {t('nav.categories')}
              </p>
              <ul className="divide-y divide-gray-100 border-y border-gray-100">
                {categories.map((category) => {
                  const open = openMobileCat === category.slug
                  return (
                    <li key={category.slug}>
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/collections/${category.slug}`}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 py-2.5 text-sm font-semibold text-ink"
                        >
                          <img src={category.image} alt="" className="h-7 w-7 object-contain" />
                          {tx(category.name, category.name_bn)}
                        </Link>
                        {category.children.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setOpenMobileCat(open ? '' : category.slug)}
                            className="grid h-8 w-8 place-items-center text-ink-muted"
                            aria-label={`Toggle ${category.name}`}
                          >
                            <ChevronDown size={16} className={`transition ${open ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>
                      {open && (
                        <ul className="space-y-1 pb-3 pl-10">
                          {category.children.map((child) => (
                            <li key={child.slug}>
                              <Link
                                to={`/collections/${category.slug}/${child.slug}`}
                                onClick={() => setMenuOpen(false)}
                                className="block py-1 text-[13px] text-ink-muted hover:text-brand"
                              >
                                {tx(child.name, child.name_bn)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>

              <div className="mt-4 space-y-1 border-t border-gray-100 pt-4">
                <Link to="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-sm font-semibold text-ink">
                  <User size={16} /> {t('nav.myAccount')}
                </Link>
                <Link to="/my/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-sm font-semibold text-ink">
                  <ShoppingBag size={16} /> {t('nav.myOrders')}
                </Link>
                <Link to="/my/wishlists" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-sm font-semibold text-ink">
                  <Heart size={16} /> {t('nav.wishlist')}
                </Link>
                <Link to="/faq" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-sm font-semibold text-ink">
                  <Phone size={16} /> {t('nav.help')}
                </Link>
              </div>

              <button
                type="button"
                onClick={toggle}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 py-2.5 text-sm font-semibold text-ink"
              >
                <Globe2 size={16} />
                {lang === 'en' ? 'বাংলায় দেখুন' : 'View in English'}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[65] flex flex-col bg-white md:hidden">
          <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-3">
            <form onSubmit={submitSearch} className="flex h-10 flex-1 items-center overflow-hidden rounded-md border border-gray-200 bg-cream">
              <Search size={16} className="ml-3 text-gray-400" />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('common.searchPlaceholder')}
                className="h-full w-full bg-transparent px-2 text-sm outline-none"
              />
            </form>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-ink-muted"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {query.trim() ? (
              <>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                  {t('common.searchProducts')}
                </p>
                {suggestions.length === 0 ? (
                  <p className="py-8 text-center text-sm text-ink-muted">{t('common.noResults')}</p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {suggestions.map((product) => (
                      <li key={product.id}>
                        <Link
                          to={`/products/${product.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 py-3"
                        >
                          <img src={product.image} alt="" className="h-12 w-12 rounded object-contain" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-ink">
                              {tx(product.name, product.name_bn)}
                            </span>
                            <span className="text-[11px] text-ink-muted">{product.unit}</span>
                          </span>
                          <span className="text-sm font-bold text-brand">{formatTaka(product.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={() => goSearch(query)}
                  className="btn-primary mt-4 w-full"
                >
                  {t('common.searchProducts')}
                </button>
              </>
            ) : (
              <>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                  {t('common.popularSearches')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {popular.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => goSearch(term)}
                      className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-brand hover:text-brand"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <CartDrawer />
    </>
  )
}

export default Navbar
