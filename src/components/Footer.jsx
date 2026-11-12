import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Youtube,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguage } from '../i18n/LanguageContext'
import { useSettings } from '../context/SettingsContext'
import { getMergedCategories } from '../utils/mergeCategories'

const Footer = () => {
  const { t, tx } = useLanguage()
  const { settings } = useSettings()
  const [categories, setCategories] = useState([])
  const [email, setEmail] = useState('')
  const [pages, setPages] = useState({})

  useEffect(() => {
    const loadCats = () => {
      // getMergedCategories() already returns exactly the saved+synced list.
      try {
        setCategories(getMergedCategories())
      } catch {
        setCategories([])
      }
      try {
        const saved = localStorage.getItem('gb_admin_pages')
        if (saved) setPages(JSON.parse(saved))
      } catch {}
    }
    loadCats()
    const handleStorage = () => loadCats()
    window.addEventListener('storage', handleStorage)
    window.addEventListener('focus', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('focus', handleStorage)
    }
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    toast.success(t('footer.subscribed'))
    setEmail('')
  }

  const information = [
    ['/page/about-us', t('footer.aboutUs')],
    ['/page/contact-us', t('footer.contactUs')],
    ['/page/company-information', t('footer.companyInfo')],
    ['/page/our-story', t('footer.stories')],
    ['/page/terms-and-conditions', t('footer.terms')],
    ['/page/privacy-policy', t('footer.privacy')],
    ['/page/careers', t('footer.careers')],
  ]

  const support = [
    ['/page/support-center', t('footer.supportCenter')],
    ['/page/how-to-order', t('footer.howToOrder')],
    ['/track', t('footer.orderTracking')],
    ['/page/faq', t('footer.faq')],
    ['/page/happy-return', t('footer.happyReturn')],
    ['/page/refund-policy', t('footer.refund')],
    ['/page/exchange', t('footer.exchange')],
    ['/page/cancellation', t('footer.cancellation')],
    ['/page/pre-order', t('footer.preOrder')],
  ]

  return (
    <footer className="mt-12 bg-ink text-white">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="container-gb flex flex-col gap-4 py-7 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-bold sm:text-lg">{t('footer.newsletterTitle')}</h3>
            <p className="mt-1 text-xs text-white/60 sm:text-sm">{settings.siteContent?.newsletterText || t('footer.newsletterSub')}</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('footer.emailPlaceholder')}
              className="h-10 w-full rounded-md border border-white/15 bg-white/10 px-3 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none"
            />
            <button type="submit" className="btn-primary h-10 shrink-0 px-4">
              <Send size={15} />
              <span className="hidden sm:inline">{t('footer.subscribe')}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-gb grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <Link to="/" className="inline-flex flex-col leading-none">
            <span className="text-2xl font-extrabold tracking-tight">
              {settings.siteLogo ? (
                <img src={settings.siteLogo} alt={settings.siteName} className="h-10" />
              ) : (
                <span className="text-brand">{settings.siteName}</span>
              )}
            </span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
              {tx(
                settings.siteTagline ?? 'Pure food, honest price',
                settings.siteTagline_bn ?? 'খাঁটি খাবার, সৎ দাম'
              )}
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-[13px] leading-6 text-white/55">
            {(settings.siteContent?.footerAbout || t('footer.aboutText')).replace(/GhorerBazar/g, settings.siteName)}
          </p>
          <ul className="mt-4 space-y-2 text-[13px] text-white/60">
            {settings.siteAddress && (
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-brand" />
                {settings.siteAddress}
              </li>
            )}
            {settings.sitePhone && (
              <li>
                <a href={`tel:${settings.sitePhone}`} className="flex items-center gap-2 hover:text-brand">
                  <Phone size={14} className="shrink-0 text-brand" />
                  {settings.sitePhone}
                </a>
              </li>
            )}
            {settings.siteEmail && (
              <li>
                <a href={`mailto:${settings.siteEmail}`} className="flex items-center gap-2 hover:text-brand">
                  <Mail size={14} className="shrink-0 text-brand" />
                  {settings.siteEmail}
                </a>
              </li>
            )}
          </ul>
          <div className="mt-4 flex items-center gap-2">
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-brand hover:text-white">
                <Facebook size={15} />
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-brand hover:text-white">
                <Instagram size={15} />
              </a>
            )}
            {settings.youtube && (
              <a href={settings.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-brand hover:text-white">
                <Youtube size={15} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold">{t('footer.information')}</h4>
          <ul className="space-y-2">
            {information.map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-[13px] text-white/55 transition hover:text-brand">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold">{t('footer.shopBy')}</h4>
          <ul className="space-y-2">
            {categories.slice(0, 7).map((category) => (
              <li key={category.slug}>
                <Link
                  to={`/collections/${category.slug}`}
                  className="text-[13px] text-white/55 transition hover:text-brand"
                >
                  {tx(category.name, category.name_bn)}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/offer-zone" className="text-[13px] font-semibold text-brand">
                {t('nav.offerZone')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold">{t('footer.support')}</h4>
          <ul className="space-y-2">
            {support.map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-[13px] text-white/55 transition hover:text-brand">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold">{t('footer.downloadApp')}</h4>
          <p className="mb-3 text-[12px] text-white/50">{t('footer.appNote').replace('GhorerBazar', settings.siteName)}</p>
          <div className="space-y-2">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 transition hover:border-brand"
            >
              <span className="grid h-7 w-7 place-items-center rounded bg-white text-ink">▶</span>
              <span className="leading-tight">
                <span className="block text-[9px] text-white/50">GET IT ON</span>
                <span className="block text-xs font-bold">Google Play</span>
              </span>
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 transition hover:border-brand"
            >
              <span className="grid h-7 w-7 place-items-center rounded bg-white text-ink">●</span>
              <span className="leading-tight">
                <span className="block text-[9px] text-white/50">Download on the</span>
                <span className="block text-xs font-bold">App Store</span>
              </span>
            </a>
          </div>
          <h4 className="mb-2 mt-5 text-sm font-bold">{t('footer.paymentMethods')}</h4>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(settings.paymentMethods || {})
              .filter(([, method]) => method?.enabled)
              .map(([key, method]) => (
                <span
                  key={key}
                  className="rounded border border-white/15 bg-white px-2 py-1 text-[10px] font-bold text-ink"
                >
                  {method.name || key}
                </span>
              ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-gb flex flex-col items-center justify-between gap-2 py-4 text-[11px] text-white/40 sm:flex-row">
          <p>
            {(settings.siteContent?.footerCopyright || `© ${new Date().getFullYear()} ${settings.siteName}. ${t('footer.copyright')}`)
              .replace(/GhorerBazar/g, settings.siteName)}
          </p>
          <p>
            {tx(
              'Secure checkout · Cash on delivery available',
              'নিরাপদ চেকআউট · ক্যাশ অন ডেলিভারি সুবিধা'
            )}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
