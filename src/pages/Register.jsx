import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, Phone, ShieldCheck, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'

const Register = () => {
  const { register } = useAuth()
  const { t, tx } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false,
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast.error(t('auth.fillAll'))
      return
    }
    if (form.password.length < 6) {
      toast.error(tx('Password must be at least 6 characters', 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'))
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error(t('auth.passwordMismatch'))
      return
    }
    if (!form.agree) {
      toast.error(tx('Please accept the terms to continue', 'চালিয়ে যেতে শর্তাবলিতে সম্মত হোন'))
      return
    }
    const ok = register(form.name.trim(), form.email.trim(), form.password, form.phone.trim())
    if (ok) navigate(from || '/account')
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
              <h1 className="mt-3 text-lg font-bold text-ink sm:text-xl">{t('auth.register')}</h1>
              <p className="mt-1 text-xs text-ink-muted sm:text-sm">{t('auth.registerSubtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 p-5 sm:p-6">
              <div>
                <label htmlFor="name" className="label">
                  {t('auth.name')}
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="input pl-9"
                    placeholder={tx('Your full name', 'আপনার পূর্ণ নাম')}
                    autoComplete="name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="label">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="input pl-9"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="label">
                  {t('auth.phone')}
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="input pl-9"
                    placeholder="01XXXXXXXXX"
                    autoComplete="tel"
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
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="input pl-9"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label">
                  {t('auth.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="input pl-9"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 text-[11.5px] leading-5 text-ink-muted">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-brand"
                />
                <span>
                  {t('auth.termsAgree')}{' '}
                  <Link to="/page/terms-and-conditions" className="font-semibold text-brand hover:underline">
                    {t('footer.terms')}
                  </Link>{' '}
                  {tx('and', 'ও')}{' '}
                  <Link to="/page/privacy-policy" className="font-semibold text-brand hover:underline">
                    {t('footer.privacy')}
                  </Link>
                </span>
              </label>

              <button type="submit" className="btn-primary w-full py-2.5">
                {t('auth.register')}
              </button>

              <p className="text-center text-xs text-ink-muted">
                {t('auth.haveAccount')}{' '}
                <Link
                  to="/login"
                  state={from ? { from } : undefined}
                  className="font-bold text-brand hover:underline"
                >
                  {t('auth.loginNow')}
                </Link>
              </p>
            </form>
          </div>

          <p className="mt-4 flex items-start justify-center gap-1.5 text-center text-[10.5px] leading-4 text-ink-muted">
            <ShieldCheck size={13} className="mt-0.5 shrink-0 text-brand" />
            {t('auth.demoNote')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
