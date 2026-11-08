import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'

const demoAccounts = [
  {
    role: 'customer',
    email: 'customer@example.com',
    password: 'demo123',
    label: 'Demo customer',
    labelBn: 'ডেমো ক্রেতা',
  },
]

const Login = () => {
  const { login } = useAuth()
  const { t, tx } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const user = login(email, password)
    if (!user) return
    if (user.role === 'admin') {
      navigate('/admin')
    } else {
      navigate(from || '/account')
    }
  }

  const fillDemo = (account) => {
    setEmail(account.email)
    setPassword(account.password)
  }

  return (
    <div className="bg-cream/60">
      <div className="container-gb flex min-h-[70vh] items-center justify-center py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="card overflow-hidden">
            <div className="border-b border-gray-100 bg-gradient-to-r from-brand-light to-white px-6 py-6 text-center">
              <Link to="/" className="text-xl font-extrabold">
                <span className="text-brand">Ghorer</span>
                <span className="text-ink">Bazar</span>
              </Link>
              <h1 className="mt-3 text-lg font-bold text-ink sm:text-xl">{t('auth.welcomeBack')}</h1>
              <p className="mt-1 text-xs text-ink-muted sm:text-sm">{t('auth.loginSubtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 p-5 sm:p-6">
              <div>
                <label htmlFor="email" className="label">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="input pl-9"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="label mb-0">
                    {t('auth.password')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((show) => !show)}
                    className="mb-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-ink-muted hover:text-brand"
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    {showPassword ? tx('Hide', 'লুকান') : tx('Show', 'দেখুন')}
                  </button>
                </div>
                <div className="relative mt-1.5">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="input pl-9"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-2.5">
                {t('auth.login')}
              </button>

              <p className="text-center text-xs text-ink-muted">
                {t('auth.noAccount')}{' '}
                <Link
                  to="/register"
                  state={from ? { from } : undefined}
                  className="font-bold text-brand hover:underline"
                >
                  {t('auth.register')}
                </Link>
              </p>
            </form>
          </div>

          <div className="mt-4 rounded-lg border border-brand/20 bg-brand-soft p-4">
            <p className="flex items-center gap-1.5 text-[12px] font-bold text-ink">
              <Sparkles size={14} className="text-brand" />
              {tx('Try a demo account', 'ডেমো অ্যাকাউন্ট দিয়ে দেখুন')}
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemo(account)}
                  className="rounded-md border border-gray-200 bg-white px-2.5 py-2 text-left transition hover:border-brand"
                >
                  <span className="block text-[11px] font-bold text-ink">
                    {tx(account.label, account.labelBn)}
                  </span>
                  <span className="block truncate text-[10px] text-ink-muted">{account.email}</span>
                  <span className="block text-[10px] text-ink-muted">{account.password}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-[10.5px] leading-4 text-ink-muted">
              <ShieldCheck size={12} className="mt-0.5 shrink-0 text-brand" />
              {t('auth.demoNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
