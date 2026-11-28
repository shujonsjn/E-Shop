import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, Phone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useSettings } from '../context/SettingsContext'

const Login = () => {
  const { login } = useAuth()
  const { t, tx } = useLanguage()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from

  // Customers sign in with a mobile number. Email sign-in exists only for the
  // admin panel, and it is revealed when the panel sends a visitor here.
  const [adminMode, setAdminMode] = useState(
    () =>
      new URLSearchParams(location.search).get('admin') === '1' ||
      location.state?.from === '/admin'
  )
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    const user = await login(identifier, password)
    setBusy(false)
    if (!user) return
    if (user.role === 'admin') {
      navigate('/admin')
    } else {
      navigate(from || '/account')
    }
  }

  const toggleAdminMode = () => {
    setAdminMode((value) => !value)
    setIdentifier('')
  }

  return (
    <div className="bg-cream/60">
      <div className="container-gb flex min-h-[70vh] items-center justify-center py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="card overflow-hidden">
            <div className="border-b border-gray-100 bg-gradient-to-r from-brand-light to-white px-6 py-6 text-center">
              <Link to="/" className="inline-block">
                {settings.siteLogo ? (
                  <img src={settings.siteLogo} alt={settings.siteName} className="mx-auto h-10" />
                ) : (
                  <span className="text-xl font-extrabold text-brand">{settings.siteName}</span>
                )}
              </Link>
              <h1 className="mt-3 text-lg font-bold text-ink sm:text-xl">{t('auth.welcomeBack')}</h1>
              <p className="mt-1 text-xs text-ink-muted sm:text-sm">
                {adminMode ? t('auth.adminLoginSubtitle') : t('auth.loginSubtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 p-5 sm:p-6">
              <div>
                <label htmlFor="identifier" className="label">
                  {adminMode ? t('auth.email') : t('auth.phone')}
                </label>
                <div className="relative">
                  {adminMode ? (
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  ) : (
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  )}
                  <input
                    id="identifier"
                    type={adminMode ? 'email' : 'text'}
                    inputMode={adminMode ? 'email' : 'tel'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    autoComplete={adminMode ? 'email' : 'username'}
                    className="input pl-9"
                    placeholder={adminMode ? 'admin@example.com' : '01XXXXXXXXX'}
                  />
                </div>
                <p className="mt-1.5 text-[10.5px] leading-4 text-ink-muted">
                  {adminMode ? t('auth.adminLoginHint') : t('auth.phoneNote')}
                </p>
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

              <button type="submit" disabled={busy} className="btn-primary w-full py-2.5 disabled:opacity-60">
                {busy ? tx('Signing in…', 'সাইন ইন হচ্ছে…') : t('auth.login')}
              </button>

              {!adminMode && (
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
              )}

              <button
                type="button"
                onClick={toggleAdminMode}
                className="mx-auto block text-[11px] font-semibold text-ink-muted underline-offset-2 hover:text-brand hover:underline"
              >
                {adminMode ? t('auth.customerLogin') : t('auth.adminLogin')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
