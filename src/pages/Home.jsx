import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  Quote,
  RotateCcw,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import HeroSlider from '../components/HeroSlider'
import ProductCard from '../components/ProductCard'
import { RatingStars, SectionHeading, formatTaka } from '../components/ui'
import { useProducts } from '../context/ProductsContext'
import { useReview } from '../context/ReviewContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useSettings } from '../context/SettingsContext'
import { getMergedCategories } from '../utils/mergeCategories'
import { getMergedBrands } from '../utils/mergeBrands'
import { isDemoAsset } from '../utils/media'
import { safeHref } from '../utils/links'

const ProductRow = ({ title, subtitle, items, href, linkLabel }) => {
  if (!items.length) return null
  return (
    <section className="container-gb mt-10">
      <SectionHeading title={title} subtitle={subtitle} href={href} linkLabel={linkLabel} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

const Home = () => {
  const { products } = useProducts()
  const { reviews } = useReview()
  const { t, tx } = useLanguage()
  const { settings } = useSettings()
  const [categories, setCategories] = useState([])
  const [brandsList, setBrandsList] = useState([])
  const sideBanners = (settings.siteContent?.sideBanners || []).filter(
    (banner) => banner?.image && !isDemoAsset(banner.image)
  )
  const promoBanners = (settings.siteContent?.promoBanners || []).filter(
    (banner) => banner?.image && !isDemoAsset(banner.image)
  )
  const homeLayout = [...(settings.homeLayout || [])]
    .map((item, idx) => ({ order: idx, enabled: true, ...item }))
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .filter((s) => s.enabled !== false)

  useEffect(() => {
    const load = () => {
      setCategories(getMergedCategories())
      setBrandsList(getMergedBrands())
    }
    load()
    const handleStorage = () => load()
    window.addEventListener('storage', handleStorage)
    window.addEventListener('focus', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('focus', handleStorage)
    }
  }, [])

  const flashProducts = products.filter((p) => p.oldPrice > p.price).slice(0, 4)
  const topProducts = products.filter((p) => p.topSelling).slice(0, 4)
  const featured = products.filter((p) => p.featured).slice(0, 5)
  const organicItems = products.filter((p) => p.badges?.includes('Organic')).slice(0, 5)

  // Real customer reviews replace the bundled demo testimonials. Only reviews
  // that actually describe the purchase are shown.
  const testimonials = [...reviews]
    .filter((review) => typeof review.comment === 'string' && review.comment.trim().length > 15)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 8)

  const freeDeliveryThreshold = Number(settings.freeDeliveryThreshold || 0)
  const savedCtaAmount = Number(
    String(settings.siteContent?.ctaSubtitle || '').replace(/[^\d০-৯]/g, '').replace(/[০-৯]/g, (d) => '০১২৩৪৫৬৭৮৯'.indexOf(d))
  )
  const savedCta = settings.siteContent?.ctaSubtitle || ''
  const savedCtaBn = settings.siteContent?.ctaSubtitleBn || ''
  const claimsFreeDelivery = /free\s*delivery|ফ্রি\s*ডেলিভারি/i.test(
    `${savedCta} ${savedCtaBn}`
  )
  // Same rule as the top bar: a saved CTA that advertises free delivery must not
  // survive when the delivery setting has the offer switched off (0).
  const showSavedCta = !(claimsFreeDelivery && freeDeliveryThreshold <= 0)
  const ctaSubtitle =
    freeDeliveryThreshold > 0 && (!savedCtaAmount || savedCtaAmount !== freeDeliveryThreshold)
      ? tx(
          `Free delivery on orders above ${formatTaka(freeDeliveryThreshold)} · Cash on delivery available`,
          `${formatTaka(freeDeliveryThreshold)} টাকার বেশি অর্ডারে ফ্রি ডেলিভারি · ক্যাশ অন ডেলিভারি আছে`
        )
      : showSavedCta
        ? tx(savedCta || 'Cash on delivery available', savedCtaBn || 'ক্যাশ অন ডেলিভারি আছে')
        : tx('Cash on delivery available', 'ক্যাশ অন ডেলিভারি আছে')

  const trustItems = [
    { icon: ShieldCheck, title: t('home.trustAuthentic'), text: t('home.trustAuthenticSub') },
    { icon: Truck, title: t('home.trustDelivery'), text: t('home.trustDeliverySub') },
    { icon: RotateCcw, title: t('home.trustReturn'), text: t('home.trustReturnSub') },
    { icon: Headphones, title: t('home.trustSupport'), text: t('home.trustSupportSub') },
  ]

  const getProductRowItems = (section) => {
    if (section.filter === 'topSelling') return topProducts.slice(0, section.limit || 4)
    if (section.filter === 'featured') return featured.slice(0, section.limit || 5)
    if (section.filter === 'category' && section.category) {
      const items = products.filter((p) => p.category === section.category)
      return items.slice(0, section.limit || 5)
    }
    if (section.filter === 'organic') return organicItems.slice(0, section.limit || 5)
    if (section.filter === 'flash') return flashProducts.slice(0, section.limit || 4)
    return products.slice(0, section.limit || 5)
  }

  const renderSection = (section) => {
    if (!section.enabled) return null
    switch (section.type) {
      case 'hero':
        return (
          <section key={section.id} className="container-gb pt-3 sm:pt-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_300px]">
              <HeroSlider />
              <div className="hidden grid-rows-2 gap-3 lg:grid">
                {sideBanners.map((banner) => (
                  <Link
                    key={banner.id}
                    to={safeHref(banner.href)}
                    className="group relative overflow-hidden rounded-lg bg-cream"
                  >
                    <img
                      src={banner.image}
                      alt={banner.alt || 'Banner'}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      case 'trust':
        return (
          <section key={section.id} className="container-gb mt-4">
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-gray-100 bg-white p-3 shadow-card sm:grid-cols-4 sm:gap-4 sm:p-4">
              {trustItems.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-light text-brand sm:h-10 sm:w-10">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-ink sm:text-[13px]">{title}</p>
                    <p className="line-clamp-1 text-[10px] text-ink-muted sm:text-[11px]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      case 'categories':
        return (
          <section key={section.id} className="container-gb mt-8">
            <SectionHeading
              title={section.titleBn ? tx(section.title, section.titleBn) : section.title || t('home.featuredCategories')}
              subtitle={section.subtitleBn ? tx(section.subtitle, section.subtitleBn) : section.subtitle || t('home.featuredCategoriesSub')}
              href={section.href || '/shop'}
              linkLabel={section.linkLabel || t('home.viewAllCategories')}
            />
            <div className="grid grid-cols-5 gap-2 sm:gap-3 lg:grid-cols-10">
              {categories.slice(0, 10).map((category) => (
                <Link
                  key={category.slug}
                  to={`/collections/${category.slug}`}
                  className="group flex flex-col items-center gap-2 text-center"
                >
                  <span className="relative grid aspect-square w-full place-items-center overflow-hidden rounded-full border border-gray-100 bg-cream transition group-hover:border-brand group-hover:bg-brand-light">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={tx(category.name, category.name_bn)}
                        className="h-full w-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-lg font-bold text-brand">
                        {(category.name || '?').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </span>
                  <span className="line-clamp-2 text-[10.5px] font-semibold leading-4 text-ink transition group-hover:text-brand sm:text-xs">
                    {tx(category.name, category.name_bn)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )
      case 'flash':
        if (flashProducts.length === 0) return null
        return (
          <section key={section.id} className="container-gb mt-9">
            <div className="rounded-lg bg-gradient-to-r from-brand-light via-[#FFF9F2] to-white p-3 ring-1 ring-brand/15 sm:p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white">
                    <BadgeCheck size={20} />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-ink sm:text-xl">{t('home.flashSale')}</h2>
                    <p className="text-[11px] text-ink-muted sm:text-xs">{t('home.flashSaleSub')}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {flashProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Link
                to="/offer-zone"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-dark"
              >
                {t('home.dealCta')} <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        )
      case 'productRow': {
        const items = getProductRowItems(section)
        if (!items.length) return null
        return (
          <section key={section.id} className="container-gb mt-10">
            <SectionHeading
              title={section.titleBn ? tx(section.title, section.titleBn) : section.title || t('home.topSelling')}
              subtitle={section.subtitleBn ? tx(section.subtitle, section.subtitleBn) : section.subtitle || ''}
              href={section.href || '/shop'}
              linkLabel={section.linkLabel}
            />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )
      }
      case 'brands':
        if (!brandsList.length) return null
        return (
          <section key={section.id} className="container-gb mt-10">
            <SectionHeading title={t('home.ourBrands')} subtitle={t('home.ourBrandsSub')} href="/brands" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {(brandsList.length > 0 ? brandsList : []).map((brand) => (
                <Link
                  key={brand.slug}
                  to={`/brand/${brand.slug}`}
                  className="group flex h-16 items-center justify-center rounded border border-gray-200 bg-white px-3 transition hover:border-brand hover:shadow-sm sm:h-18"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-[70%] max-w-full object-contain"
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>
          </section>
        )
      case 'promo':
        if (!promoBanners.length) return null
        return (
          <section key={section.id} className="container-gb mt-10">
            <div className="grid gap-3 md:grid-cols-2">
              {promoBanners.map((banner) => (
                <Link
                  key={banner.id}
                  to={safeHref(banner.href)}
                  className="group overflow-hidden rounded-lg bg-cream"
                >
                  <img
                    src={banner.image}
                    alt={banner.alt || tx('Promotion banner', 'প্রমোশন ব্যানার')}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>
          </section>
        )
      case 'testimonials':
        if (!testimonials.length) return null
        return (
          <section key={section.id} className="container-gb mt-10">
            <SectionHeading
              title={t('home.testimonials')}
              subtitle={t('home.testimonialsSub')}
            />
            <div className="no-scrollbar -mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
              {testimonials.map((review) => (
                <article
                  key={review.id}
                  className="w-[260px] shrink-0 snap-start rounded-lg border border-gray-100 bg-white p-4 shadow-card sm:w-[300px]"
                >
                  <div className="flex items-center justify-between">
                    <RatingStars value={review.rating} size={14} />
                    <Quote size={20} className="text-brand/20" />
                  </div>
                  <p className="mt-3 min-h-[76px] text-[13px] leading-6 text-ink-muted">
                    “{review.comment}”
                  </p>
                  <div className="mt-3 flex items-center gap-2.5 border-t border-gray-100 pt-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-light text-xs font-bold text-brand">
                      {(review.userName || '?').charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-[13px] font-bold text-ink">
                        {review.userName || tx('Customer', 'ক্রেতা')}
                      </p>
                      <p className="text-[11px] text-ink-muted">
                        {tx('Verified buyer', 'যাচাইকৃত ক্রেতা')}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )
      case 'cta':
        return (
          <section key={section.id} className="container-gb mt-10">
            <div className="flex flex-col items-center justify-between gap-4 rounded-lg bg-ink px-5 py-6 text-center sm:flex-row sm:text-left">
              <div>
                <h3 className="text-lg font-bold text-white sm:text-xl">
                  {tx(
                    settings.siteContent?.ctaTitle || 'Find the perfect gift today',
                    settings.siteContent?.ctaTitleBn || 'আজই নিখুঁত উপহার খুঁজে নিন'
                  )}
                </h3>
                <p className="mt-1 text-xs text-white/60 sm:text-sm">{ctaSubtitle}</p>
              </div>
              <Link to={settings.siteContent?.ctaHref || '/shop'} className="btn-primary shrink-0">
                {tx(
                  settings.siteContent?.ctaButton ?? t('home.heroCta'),
                  settings.siteContent?.ctaButtonBn ?? 'এখনই কিনুন'
                )}
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        )
      default:
        return null
    }
  }

  return (
    <div className="pb-2">
      {homeLayout.length > 0 ? homeLayout.map((section) => renderSection(section)) : (
        <>
          {/* Fallback if layout missing */}
          <section className="container-gb pt-3 sm:pt-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_300px]">
              <HeroSlider />
              <div className="hidden grid-rows-2 gap-3 lg:grid">
                {sideBanners.map((banner) => (
                  <Link key={banner.id} to={safeHref(banner.href)} className="group relative overflow-hidden rounded-lg bg-cream">
                    <img src={banner.image} alt={banner.alt || 'Banner'} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default Home
