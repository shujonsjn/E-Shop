import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

const NotFound = () => {
  const { t, tx } = useLanguage()

  return (
    <div className="container-gb flex min-h-[60vh] items-center justify-center py-12">
      <div className="w-full max-w-lg text-center">
        <p className="text-6xl font-extrabold tracking-tight text-brand sm:text-7xl">404</p>
        <h1 className="mt-2 text-xl font-bold text-ink sm:text-2xl">{t('notFound.title')}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">{t('notFound.sub')}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link to="/" className="btn-primary">
            <Home size={16} />
            {t('notFound.home')}
          </Link>
          <Link to="/shop" className="btn-outline">
            <Search size={16} />
            {t('common.continueShopping')}
          </Link>
        </div>
        <p className="mt-6 text-[11px] text-gray-400">
          {tx(
            'Looking for something specific? Try the search bar at the top of the page.',
            'নির্দিষ্ট কিছু খুঁজছেন? পেজের উপরের সার্চ বার ব্যবহার করুন।'
          )}
        </p>
      </div>
    </div>
  )
}

export default NotFound
