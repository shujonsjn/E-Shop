import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck } from 'lucide-react'
import { Breadcrumbs, PageBanner } from '../components/ui'
import { useProducts } from '../context/ProductsContext'
import { useLanguage } from '../i18n/LanguageContext'
import { getMergedBrands } from '../utils/mergeBrands'
import { useSettings } from '../context/SettingsContext'

const Brands = () => {
  const { products } = useProducts()
  const { t, tx } = useLanguage()
  const { settings } = useSettings()
  const [brands, setBrands] = useState([])

  useEffect(() => {
    const load = () => {
      setBrands(getMergedBrands())
    }
    load()
    const handler = () => load()
    window.addEventListener('storage', handler)
    window.addEventListener('focus', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('focus', handler)
    }
  }, [])

  const countFor = (brand) =>
    products.filter((product) => (product.brand || '').toLowerCase() === brand.name.toLowerCase()).length

  return (
    <div className="container-gb py-3">
      <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('nav.brands') }]} />

      <PageBanner
        title={t('nav.brands')}
        subtitle={tx(
          'The brands and labels behind our collection.',
          'আমাদের সংগ্রহে থাকা ব্র্যান্ড ও লেবেল।'
        )}
        image={settings.pageBanners?.brands || ''}
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => {
          const count = countFor(brand)
          return (
            <Link
              key={brand.slug}
              to={`/brand/${brand.slug}`}
              className="group card flex flex-col p-4 transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lift"
            >
              <div className="grid h-24 place-items-center rounded-md bg-cream/70 p-4">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain transition group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h2 className="mt-3 text-base font-bold text-ink transition group-hover:text-brand">
                {tx(brand.name, brand.name_bn)}
              </h2>
              <p className="mt-1 flex-1 text-[12.5px] leading-5 text-ink-muted">
                {tx(brand.description || '', brand.description_bn || '')}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-muted">
                  <BadgeCheck size={13} className="text-brand" />
                  {count > 0
                    ? `${count} ${t('common.items')}`
                    : tx('Coming soon', 'শীঘ্রই আসছে')}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand">
                  {t('common.viewAll')}
                  <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 rounded-lg border border-gray-100 bg-white px-5 py-6 text-center shadow-card">
        <h2 className="text-base font-bold text-ink">
          {tx('Want to see your brand here?', 'আপনার ব্র্যান্ড এখানে দেখতে চান?')}
        </h2>
        <p className="mx-auto mt-1 max-w-lg text-xs text-ink-muted">
          {tx(
            'We partner with producers and importers who care about quality as much as we do.',
            'আমরা এমন উৎপাদক ও আমদানিকারকদের সাথে কাজ করি যারা মানের ব্যাপারে আমাদের মতোই সচেতন।'
          )}
        </p>
        <Link to="/page/contact-us" className="btn-outline mt-3">
          {t('nav.contact')}
        </Link>
      </div>
    </div>
  )
}

export default Brands
