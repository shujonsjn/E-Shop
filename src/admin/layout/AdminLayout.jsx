import { useEffect, useState } from 'react'
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Star, FolderTree, Truck, Megaphone, CreditCard, Calculator, BarChart3, UserCog, FileText, Layout, File, Home, Globe, Cloud, CloudOff, Search, X, MessageSquare, Languages } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { isSupabaseConfigured } from '../../lib/supabase'
import { AdminLanguageProvider, useAdminLang } from '../i18n/AdminLanguage'

const menuGroups = [
  {
    key: 'main',
    label: 'মূল',
    en: 'Main',
    items: [
      { path: '/admin', icon: LayoutDashboard, label: 'ড্যাশবোর্ড', en: 'Dashboard', exact: true, keywords: 'dashboard overview home stats' },
    ],
  },
  {
    key: 'catalog',
    label: 'ক্যাটালগ',
    en: 'Catalog',
    items: [
      { path: '/admin/products', icon: Package, label: 'পণ্য', en: 'Products', keywords: 'product item stock price' },
      { path: '/admin/categories', icon: FolderTree, label: 'ক্যাটাগরি', en: 'Categories', keywords: 'category subcategory' },
      { path: '/admin/brands', icon: Star, label: 'ব্র্যান্ড', en: 'Brands', keywords: 'brand logo' },
      { path: '/admin/reviews', icon: MessageSquare, label: 'রিভিউ', en: 'Reviews', keywords: 'review rating comment' },
    ],
  },
  {
    key: 'sales',
    label: 'বিক্রয়',
    en: 'Sales',
    items: [
      { path: '/admin/orders', icon: ShoppingBag, label: 'অর্ডার', en: 'Orders', keywords: 'order sales invoice' },
    ],
  },
  {
    key: 'customers',
    label: 'কাস্টমার',
    en: 'Customers',
    items: [
      { path: '/admin/users', icon: Users, label: 'কাস্টমার', en: 'Customers', keywords: 'customer user buyer' },
      { path: '/admin/staff', icon: UserCog, label: 'স্টাফ', en: 'Staff', keywords: 'staff team employee' },
    ],
  },
  {
    key: 'website',
    label: 'ওয়েবসাইট',
    en: 'Website',
    items: [
      { path: '/admin/home-layout', icon: Layout, label: 'হোম লেআউট', en: 'Home Layout', keywords: 'home layout section' },
      { path: '/admin/pages', icon: File, label: 'পেজ', en: 'Pages', keywords: 'page content about' },
      { path: '/admin/site-content', icon: FileText, label: 'সাইট কনটেন্ট', en: 'Site Content', keywords: 'content banner logo footer seo' },
    ],
  },
  {
    key: 'marketing',
    label: 'মার্কেটিং',
    en: 'Marketing',
    items: [
      { path: '/admin/marketing', icon: Megaphone, label: 'কুপন', en: 'Coupons', keywords: 'coupon discount promo offer' },
    ],
  },
  {
    key: 'config',
    label: 'কনফিগারেশন',
    en: 'Configuration',
    items: [
      { path: '/admin/delivery', icon: Truck, label: 'ডেলিভারি', en: 'Delivery', keywords: 'delivery shipping charge area' },
      { path: '/admin/payments', icon: CreditCard, label: 'পেমেন্ট', en: 'Payment', keywords: 'payment method bkash nagad' },
      { path: '/admin/accounts', icon: Calculator, label: 'হিসাব', en: 'Accounts', keywords: 'accounts expense income profit' },
      { path: '/admin/reports', icon: BarChart3, label: 'রিপোর্ট', en: 'Reports', keywords: 'reports analytics best selling' },
    ],
  },
]

const AdminShell = () => {
  const { user, logout } = useAuth()
  const { lang, setLang } = useAdminLang()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuQuery, setMenuQuery] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user || user.role !== 'admin') {
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isEn = lang === 'en'
  const query = menuQuery.trim().toLowerCase()
  // Matches both language labels plus English keywords, so "product" finds পণ্য
  // and "পণ্য" finds Products no matter which language the panel is in.
  const filteredGroups = menuGroups
    .map((group) => ({
      ...group,
      items: query
        ? group.items.filter(
            (item) =>
              item.label.toLowerCase().includes(query) ||
              item.en.toLowerCase().includes(query) ||
              item.keywords.includes(query) ||
              item.path.toLowerCase().includes(query)
          )
        : group.items,
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-white border-r border-gray-200 min-h-screen shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#EF4A23] rounded-lg flex items-center justify-center">
                <Home size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">{isEn ? 'Admin' : 'অ্যাডমিন'}</h2>
                <p className="text-xs text-gray-500">{isEn ? 'Control Panel' : 'কন্ট্রোল প্যানেল'}</p>
              </div>
            </Link>
          </div>

          <div className="border-b border-gray-200 p-3">
            <div className="relative">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                value={menuQuery}
                onChange={(e) => setMenuQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setMenuQuery('')
                }}
                placeholder={isEn ? 'Search menu…' : 'মেনু খুঁজুন…'}
                aria-label={isEn ? 'Search admin menu' : 'অ্যাডমিন মেনু খুঁজুন'}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#EF4A23] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#EF4A23]/30"
              />
              {menuQuery && (
                <button
                  type="button"
                  onClick={() => setMenuQuery('')}
                  aria-label={isEn ? 'Clear search' : 'সার্চ মুছুন'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          <nav className="p-3 space-y-4 flex-1 overflow-y-auto">
            {filteredGroups.map((group) => (
              <div key={group.key}>
                <p className="px-3 mb-1 text-[11px] font-semibold text-gray-400 tracking-wider">
                  {isEn ? group.en : group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMenuQuery('')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-sm ${
                          isActive
                            ? 'bg-[#EF4A23]/10 text-[#EF4A23] font-semibold'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <Icon size={18} />
                        <span>{isEn ? item.en : item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
            {filteredGroups.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-500">
                {isEn
                  ? `No page named “${menuQuery.trim()}”.`
                  : `“${menuQuery.trim()}” নামে কোনো পেজ নেই।`}
              </p>
            )}
          </nav>

          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 w-full transition text-sm"
            >
              <LogOut size={18} />
              <span>{isEn ? 'Log out' : 'লগআউট'}</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {isEn ? 'Admin Dashboard' : 'অ্যাডমিন ড্যাশবোর্ড'}
                </p>
                <p className="text-sm text-gray-500">
                  {isEn ? 'Manage your online store' : 'আপনার অনলাইন স্টোর পরিচালনা করুন'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 p-0.5"
                  data-no-i18n
                  role="group"
                  aria-label="Admin language"
                >
                  <Languages size={14} className="mx-1 text-gray-500" />
                  <button
                    type="button"
                    onClick={() => setLang('bn')}
                    aria-pressed={!isEn}
                    className={`rounded-md px-2 py-1 text-xs font-semibold transition ${
                      !isEn ? 'bg-white text-[#EF4A23] shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    বাংলা
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    aria-pressed={isEn}
                    className={`rounded-md px-2 py-1 text-xs font-semibold transition ${
                      isEn ? 'bg-white text-[#EF4A23] shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    English
                  </button>
                </div>
                <span
                  title={
                    isSupabaseConfigured
                      ? isEn
                        ? 'Admin changes sync to all devices through Supabase.'
                        : 'অ্যাডমিনের পরিবর্তন Supabase দিয়ে সব ডিভাইসে সিঙ্ক হয়।'
                      : isEn
                        ? 'This device only — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY on Vercel to sync across devices.'
                        : 'শুধু এই ডিভাইসে — সব ডিভাইসে সিঙ্ক করতে Vercel-এ VITE_SUPABASE_URL ও VITE_SUPABASE_ANON_KEY যোগ করুন।'
                  }
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    isSupabaseConfigured ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {isSupabaseConfigured ? <Cloud size={14} /> : <CloudOff size={14} />}
                  <span>
                    {isSupabaseConfigured
                      ? isEn
                        ? 'Cloud sync on'
                        : 'ক্লাউড সিঙ্ক চালু'
                      : isEn
                        ? 'This device only'
                        : 'শুধু এই ডিভাইসে'}
                  </span>
                </span>
                <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Globe size={16} />
                  {isEn ? 'View site' : 'সাইট দেখুন'}
                </a>
              </div>
            </div>
          </header>
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

const AdminLayout = () => (
  <AdminLanguageProvider>
    <AdminShell />
  </AdminLanguageProvider>
)

export default AdminLayout
