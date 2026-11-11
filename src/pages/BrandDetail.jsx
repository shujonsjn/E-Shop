import { Link, useParams } from 'react-router-dom'
import { ArrowRight, PackageSearch } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { Breadcrumbs, EmptyState } from '../components/ui'
import { getMergedBrands } from '../utils/mergeBrands'
import { useProducts } from '../context/ProductsContext'
import { useLanguage } from '../i18n/LanguageContext'

const BrandDetail = () => {
  const { slug } = useParams()
  const { getProductsByBrand, products } = useProducts()
  const { t, tx } = useLanguage()

  const brand = getMergedBrands().find((b) => b.slug === slug)
  const items = brand ? getProductsByBrand(brand.name) : []

  if (!brand) {
    return (
      <div className="container-gb py-4">
        <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('nav.brands'), to: '/brands' }, { label: t('track.orderNotFound') }]} />
        <div className="card mt-2">
          <EmptyState
            icon={PackageSearch}
            title={tx('Brand not found', 'ব্র্যান্ড পাওয়া যায়নি')}
            subtitle={tx('This brand page does not exist or was moved.', 'এই ব্র্যান্ড পেজটি নেই অথবা সরিয়ে ফেলা হয়েছে।')}
            action={
              <Link to="/brands" className="btn-primary">
                {t('nav.brands')}
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  const otherBrands = products
    .filter((product) => (product.brand || '').toLowerCase() !== brand.name.toLowerCase())
    .slice(0, 5)

  return (
    <div className="container-gb py-4">
      <Breadcrumbs
        items={[
          { label: t('common.home'), to: '/' },
          { label: t('nav.brands'), to: '/brands' },
          { label: tx(brand.name, brand.name_bn) },
        ]}
      />

      <div className="card flex flex-col items-center gap-4 bg-gradient-to-r from-brand-light to-white p-5 sm:flex-row sm:p-6">
        <div className="grid h-24 w-40 shrink-0 place-items-center rounded-md bg-white p-3 shadow-sm">
          <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full object-contain" />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-xl font-bold text-ink sm:text-2xl">{tx(brand.name, brand.name_bn)}</h1>
          <p className="mt-1 text-xs text-ink-muted sm:text-sm">
            {items.length > 0
              ? tx(
                  `${items.length} products available from this brand`,
                  `এই ব্র্যান্ডের ${items.length}টি পণ্য পাওয়া যাচ্ছে`
                )
              : tx('No products listed yet.', 'এখনো কোনো পণ্য তালিকাভুক্ত হয়নি।')}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card mt-4">
          <EmptyState
            icon={PackageSearch}
            title={tx('No products from this brand yet', 'এই ব্র্যান্ডের কোনো পণ্য এখনো নেই')}
            subtitle={tx(
              'Browse the full shop while we add new stock.',
              'আমরা নতুন স্টক যোগ করার সময় পুরো শপ দেখে নিন।'
            )}
            action={
              <Link to="/shop" className="btn-primary">
                {t('common.continueShopping')}
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {otherBrands.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">{t('home.justForYou')}</h2>
            <Link to="/shop" className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline">
              {t('common.viewAll')}
              <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {otherBrands.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default BrandDetail
