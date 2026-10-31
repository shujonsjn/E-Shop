import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Phone,
  Save,
  ShoppingBag,
  User as UserIcon,
} from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { Breadcrumbs, EmptyState, StatusBadge, formatTaka } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { useProducts } from '../context/ProductsContext'
import { useLanguage } from '../i18n/LanguageContext'

const Account = () => {
  const { user, getUserOrders, updateProfile, logout } = useAuth()
  const { wishlist } = useWishlist()
  const { products } = useProducts()
  const { t, tx } = useLanguage()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'dashboard'

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  })

  useEffect(() => {
    setForm({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' })
  }, [user?.id, user?.name, user?.phone, user?.address])

  if (!user) {
    return (
      <div className="container-gb py-4">
        <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('account.title') }]} />
        <div className="card mx-auto mt-6 max-w-lg">
          <EmptyState
            icon={UserIcon}
            title={tx('Please sign in', 'সাইন ইন করুন')}
            subtitle={t('account.needLogin')}
            action={
              <Link to="/login" state={{ from: '/account' }} className="btn-primary">
                {t('auth.login')}
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  const orders = getUserOrders()
  const wishlistProducts = products.filter((product) =>
    wishlist.some((id) => String(id) === String(product.id))
  )
  const recentOrders = orders.slice(0, 2)

  const navigation = [
    { id: 'dashboard', label: t('account.dashboard'), icon: LayoutDashboard },
    { id: 'profile', label: t('account.profile'), icon: UserIcon },
    { id: 'orders', label: t('account.orders'), icon: Package, count: orders.length },
    { id: 'wishlist', label: t('account.wishlist'), icon: Heart, count: wishlist.length },
  ]

  const handleProfileSave = (e) => {
    e.preventDefault()
    updateProfile({
      name: form.name.trim() || user.name,
      phone: form.phone.trim(),
      address: form.address.trim(),
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const stats = [
    { label: t('account.orderCount'), value: orders.length, icon: ShoppingBag, href: '/account?tab=orders' },
    { label: t('account.wishlistCount'), value: wishlist.length, icon: Heart, href: '/account?tab=wishlist' },
  ]

  return (
    <div className="container-gb py-4">
      <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('account.title') }]} />

      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-lg border border-gray-100 bg-white p-3 shadow-card lg:sticky lg:top-[150px]">
          <div className="mb-3 flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-light text-sm font-extrabold text-brand">
              {user.name?.charAt(0)?.toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold text-ink">{user.name}</p>
              <p className="truncate text-[10.5px] text-ink-muted">{user.email}</p>
            </div>
          </div>

          <nav className="space-y-0.5">
            {navigation.map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSearchParams(id === 'dashboard' ? {} : { tab: id })}
                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-semibold transition ${
                  tab === id ? 'bg-brand-light text-brand' : 'text-ink-muted hover:bg-cream hover:text-ink'
                }`}
              >
                <Icon size={16} />
                {label}
                {count > 0 && (
                  <span className="ml-auto rounded-full bg-brand/10 px-1.5 py-0.5 text-[10px] font-bold text-brand">
                    {count}
                  </span>
                )}
              </button>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-semibold text-red-500 transition hover:bg-red-50"
            >
              <LogOut size={16} />
              {t('account.logout')}
            </button>
          </nav>
        </aside>

        <section className="min-w-0">
          {tab === 'dashboard' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-r from-brand to-[#FFA94D] px-5 py-6 text-white shadow-card">
                <h1 className="text-lg font-bold sm:text-xl">
                  {t('account.welcome')}, {user.name.split(' ')[0]}!
                </h1>
                <p className="mt-1 text-xs text-white/85">
                  {t('account.memberSince')}{' '}
                  {new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {stats.map(({ label, value, icon: Icon, href }) => (
                  <Link
                    key={label}
                    to={href}
                    className="card flex items-center gap-3 p-4 transition hover:border-brand/30 hover:shadow-lift"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-light text-brand">
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-lg font-extrabold leading-none text-ink">{value}</p>
                      <p className="mt-1 text-[11px] text-ink-muted">{label}</p>
                    </div>
                  </Link>
                ))}
                <Link
                  to="/shop"
                  className="card flex items-center gap-3 p-4 transition hover:border-brand/30 hover:shadow-lift"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-light text-brand">
                    <ShoppingBag size={18} />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold leading-tight text-ink">{t('account.browseProducts')}</p>
                    <p className="mt-1 text-[11px] text-ink-muted">{t('nav.shop')}</p>
                  </div>
                </Link>
              </div>

              <div className="card overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 bg-cream/70 px-4 py-3">
                  <h2 className="text-sm font-bold text-ink">{t('account.orders')}</h2>
                  <button
                    type="button"
                    onClick={() => setSearchParams({ tab: 'orders' })}
                    className="text-[11px] font-semibold text-brand hover:underline"
                  >
                    {t('common.viewAll')}
                  </button>
                </div>
                {recentOrders.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title={t('account.noOrders')}
                    subtitle={t('account.noOrdersSub')}
                    action={
                      <Link to="/shop" className="btn-primary">
                        {t('account.browseProducts')}
                      </Link>
                    }
                  />
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                        <div>
                          <p className="text-[13px] font-bold text-ink">#{order.id}</p>
                          <p className="text-[11px] text-ink-muted">
                            {new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0}{' '}
                            {t('common.items')}
                          </p>
                        </div>
                        <StatusBadge status={order.status} label={t(`status.${order.status}`)} />
                        <span className="text-sm font-bold text-brand">{formatTaka(order.total)}</span>
                        <Link to={`/track/${order.id}`} className="text-[11px] font-semibold text-brand hover:underline">
                          {t('checkout.trackOrder')}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <div className="card overflow-hidden">
              <div className="border-b border-gray-100 bg-cream/70 px-4 py-3">
                <h1 className="text-sm font-bold text-ink">{t('account.profile')}</h1>
                <p className="text-[10.5px] text-ink-muted">{t('account.profileNote')}</p>
              </div>
              <form onSubmit={handleProfileSave} className="grid gap-3 p-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="label">
                    {t('auth.name')}
                  </label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="label">
                    {t('auth.email')}
                  </label>
                  <input id="email" value={user.email} className="input bg-gray-50" disabled />
                </div>
                <div>
                  <label htmlFor="phone" className="label">
                    {t('auth.phone')}
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="input pl-9"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="label">
                    {t('checkout.address')}
                  </label>
                  <textarea
                    id="address"
                    rows="3"
                    value={form.address}
                    onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                    className="input resize-none"
                    placeholder={tx('House, road, area, city', 'বাড়ি, রোড, এলাকা, শহর')}
                  />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="btn-primary">
                    <Save size={15} />
                    {t('common.save')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {tab === 'orders' && (
            <div className="card overflow-hidden">
              <div className="border-b border-gray-100 bg-cream/70 px-4 py-3">
                <h1 className="text-sm font-bold text-ink">{t('account.orders')}</h1>
              </div>
              {orders.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title={t('account.noOrders')}
                  subtitle={t('account.noOrdersSub')}
                  action={
                    <Link to="/shop" className="btn-primary">
                      {t('account.browseProducts')}
                    </Link>
                  }
                />
              ) : (
                <ul className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <li key={order.id} className="p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-[13px] font-bold text-ink">
                            {t('account.orderId')}: #{order.id}
                          </p>
                          <p className="text-[11px] text-ink-muted">
                            {t('account.date')}: {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <StatusBadge status={order.status} label={t(`status.${order.status}`)} />
                      </div>

                      <ul className="mt-2.5 space-y-1.5">
                        {(order.items || []).slice(0, 3).map((item) => (
                          <li key={item.id} className="flex items-center gap-2.5">
                            <img src={item.image} alt="" className="h-10 w-10 rounded object-contain" />
                            <span className="min-w-0 flex-1 truncate text-[12px] text-ink">
                              {tx(item.name, item.name_bn)}
                            </span>
                            <span className="text-[11px] text-ink-muted">× {item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                      {(order.items || []).length > 3 && (
                        <p className="mt-1 text-[11px] text-ink-muted">
                          + {(order.items || []).length - 3} {t('common.items')}
                        </p>
                      )}

                      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-2.5">
                        <p className="text-sm font-bold text-ink">
                          {t('account.total')}: <span className="text-brand">{formatTaka(order.total)}</span>
                        </p>
                        <div className="flex gap-2">
                          <Link
                            to={`/track/${order.id}`}
                            className="btn-outline px-3 py-1.5 text-[11px]"
                          >
                            {t('checkout.trackOrder')}
                          </Link>
                        </div>
                      </div>

                      {order.shippingAddress && (
                        <p className="mt-2 flex items-start gap-1.5 text-[11px] text-ink-muted">
                          <MapPin size={11} className="mt-0.5 shrink-0" />
                          {[
                            order.shippingAddress.address,
                            order.shippingAddress.upazila,
                            order.shippingAddress.district,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === 'wishlist' && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h1 className="text-base font-bold text-ink">
                  {t('account.wishlist')}
                  <span className="ml-1.5 text-xs font-normal text-ink-muted">({wishlistProducts.length})</span>
                </h1>
                {wishlistProducts.length > 0 && (
                  <Link to="/my/wishlists" className="text-[11px] font-semibold text-brand hover:underline">
                    {t('common.viewAll')}
                  </Link>
                )}
              </div>
              {wishlistProducts.length === 0 ? (
                <div className="card">
                  <EmptyState
                    icon={Heart}
                    title={t('account.noWishlist')}
                    subtitle={t('account.noWishlistSub')}
                    action={
                      <Link to="/shop" className="btn-primary">
                        {t('account.browseProducts')}
                      </Link>
                    }
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                  {wishlistProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Account
