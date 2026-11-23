import { useEffect, useState } from 'react'
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Star, FolderTree, Truck, Megaphone, CreditCard, Calculator, BarChart3, UserCog, FileText, Layout, File, Home, Globe, Cloud, CloudOff, Search, X, MessageSquare } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { isSupabaseConfigured } from '../../lib/supabase'

const menuGroups = [
  {
    key: 'main',
    label: 'মূল',
    items: [
      { path: '/admin', icon: LayoutDashboard, label: 'ড্যাশবোর্ড', exact: true },
    ],
  },
  {
    key: 'catalog',
    label: 'ক্যাটালগ',
    items: [
      { path: '/admin/products', icon: Package, label: 'পণ্য' },
      { path: '/admin/categories', icon: FolderTree, label: 'ক্যাটাগরি' },
      { path: '/admin/brands', icon: Star, label: 'ব্র্যান্ড' },
      { path: '/admin/reviews', icon: MessageSquare, label: 'রিভিউ' },
    ],
  },
  {
    key: 'sales',
    label: 'বিক্রয়',
    items: [
      { path: '/admin/orders', icon: ShoppingBag, label: 'অর্ডার' },
    ],
  },
  {
    key: 'customers',
    label: 'কাস্টমার',
    items: [
      { path: '/admin/users', icon: Users, label: 'কাস্টমার' },
      { path: '/admin/staff', icon: UserCog, label: 'স্টাফ' },
    ],
  },
  {
    key: 'website',
    label: 'ওয়েবসাইট',
    items: [
      { path: '/admin/home-layout', icon: Layout, label: 'হোম লেআউট' },
      { path: '/admin/pages', icon: File, label: 'পেজ' },
      { path: '/admin/site-content', icon: FileText, label: 'সাইট কনটেন্ট' },
    ],
  },
  {
    key: 'marketing',
    label: 'মার্কেটিং',
    items: [
      { path: '/admin/marketing', icon: Megaphone, label: 'কুপন' },
    ],
  },
  {
    key: 'config',
    label: 'কনফিগারেশন',
    items: [
      { path: '/admin/delivery', icon: Truck, label: 'ডেলিভারি' },
      { path: '/admin/payments', icon: CreditCard, label: 'পেমেন্ট' },
      { path: '/admin/accounts', icon: Calculator, label: 'হিসাব' },
      { path: '/admin/reports', icon: BarChart3, label: 'রিপোর্ট' },
    ],
  },
]

const AdminLayout = () => {
  const { user, logout } = useAuth()
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

  const query = menuQuery.trim().toLowerCase()
  // Matches the Bengali label, the English route and the English section name so
  // both "পণ্য" and "product" find the same page.
  const filteredGroups = menuGroups
    .map((group) => ({
      ...group,
      items: query
        ? group.items.filter(
            (item) =>
              item.label.toLowerCase().includes(query) ||
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
                <h2 className="text-base font-bold text-gray-900">অ্যাডমিন</h2>
                <p className="text-xs text-gray-500">কন্ট্রোল প্যানেল</p>
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
                placeholder="মেনু খুঁজুন…"
                aria-label="অ্যাডমিন মেনু খুঁজুন"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#EF4A23] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#EF4A23]/30"
              />
              {menuQuery && (
                <button
                  type="button"
                  onClick={() => setMenuQuery('')}
                  aria-label="সার্চ মুছুন"
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
                <p className="px-3 mb-1 text-[11px] font-semibold text-gray-400 tracking-wider">{group.label}</p>
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
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
            {filteredGroups.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-500">
                “{menuQuery.trim()}” নামে কোনো পেজ নেই।
              </p>
            )}
          </nav>

          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 w-full transition text-sm"
            >
              <LogOut size={18} />
              <span>লগআউট</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">অ্যাডমিন ড্যাশবোর্ড</p>
                <p className="text-sm text-gray-500">আপনার অনলাইন স্টোর পরিচালনা করুন</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  title={isSupabaseConfigured ? 'অ্যাডমিনের পরিবর্তন Supabase দিয়ে সব ডিভাইসে সিঙ্ক হয়।' : 'শুধু এই ডিভাইসে — সব ডিভাইসে সিঙ্ক করতে Vercel-এ VITE_SUPABASE_URL ও VITE_SUPABASE_ANON_KEY যোগ করুন।'}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    isSupabaseConfigured ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {isSupabaseConfigured ? <Cloud size={14} /> : <CloudOff size={14} />}
                  <span>{isSupabaseConfigured ? 'ক্লাউড সিঙ্ক চালু' : 'শুধু এই ডিভাইসে'}</span>
                </span>
                <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Globe size={16} />
                  সাইট দেখুন
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

export default AdminLayout
