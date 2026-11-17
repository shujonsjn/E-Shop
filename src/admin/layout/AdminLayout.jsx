import { useEffect, useState } from 'react'
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Star, FolderTree, Truck, Megaphone, CreditCard, Calculator, BarChart3, UserCog, FileText, Layout, File, Home, Globe, Cloud, CloudOff, Search, X, MessageSquare } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { isSupabaseConfigured } from '../../lib/supabase'

const menuGroups = [
  {
    key: 'main',
    label: 'Main',
    items: [
      { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    ],
  },
  {
    key: 'catalog',
    label: 'Catalog',
    items: [
      { path: '/admin/products', icon: Package, label: 'Products' },
      { path: '/admin/categories', icon: FolderTree, label: 'Categories' },
      { path: '/admin/brands', icon: Star, label: 'Brands' },
      { path: '/admin/reviews', icon: MessageSquare, label: 'Reviews' },
    ],
  },
  {
    key: 'sales',
    label: 'Sales',
    items: [
      { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    ],
  },
  {
    key: 'customers',
    label: 'Customers',
    items: [
      { path: '/admin/users', icon: Users, label: 'Customers' },
      { path: '/admin/staff', icon: UserCog, label: 'Staff' },
    ],
  },
  {
    key: 'website',
    label: 'Website',
    items: [
      { path: '/admin/home-layout', icon: Layout, label: 'Home Layout' },
      { path: '/admin/pages', icon: File, label: 'Pages' },
      { path: '/admin/site-content', icon: FileText, label: 'Site Content' },
    ],
  },
  {
    key: 'marketing',
    label: 'Marketing',
    items: [
      { path: '/admin/marketing', icon: Megaphone, label: 'Coupons' },
    ],
  },
  {
    key: 'config',
    label: 'Configuration',
    items: [
      { path: '/admin/delivery', icon: Truck, label: 'Delivery' },
      { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
      { path: '/admin/accounts', icon: Calculator, label: 'Accounts' },
      { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
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
                <h2 className="text-base font-bold text-gray-900">Admin</h2>
                <p className="text-xs text-gray-500">Admin Panel</p>
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
                placeholder="Search menu…"
                aria-label="Search admin menu"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#EF4A23] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#EF4A23]/30"
              />
              {menuQuery && (
                <button
                  type="button"
                  onClick={() => setMenuQuery('')}
                  aria-label="Clear search"
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
                <p className="px-3 mb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{group.label}</p>
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
                No pages match “{menuQuery.trim()}”.
              </p>
            )}
          </nav>

          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 w-full transition text-sm"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">Admin Dashboard</p>
                <p className="text-sm text-gray-500">Manage your e-commerce store</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  title={isSupabaseConfigured ? 'Admin changes sync to every device through Supabase.' : 'Local only — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel to sync everywhere.'}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    isSupabaseConfigured ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {isSupabaseConfigured ? <Cloud size={14} /> : <CloudOff size={14} />}
                  <span>{isSupabaseConfigured ? 'Cloud sync on' : 'Local only'}</span>
                </span>
                <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Globe size={16} />
                  View Site
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
