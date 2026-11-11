import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { ChevronDown, Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { Breadcrumbs, EmptyState, PageBanner } from '../components/ui'
import { bannerImage } from '../data/catalog'
import { getMergedBrands } from '../utils/mergeBrands'
import { getMergedCategories } from '../utils/mergeCategories'
import { useProducts } from '../context/ProductsContext'
import { useLanguage } from '../i18n/LanguageContext'

const PAGE_SIZE = 12

const flagOptions = [
  { id: 'offered', en: 'On sale', bn: 'ছাড়ে আছে' },
  { id: 'best', en: 'Best selling', bn: 'বেস্ট সেলিং' },
  { id: 'new', en: 'New arrivals', bn: 'নতুন এসেছে' },
  { id: 'organic', en: 'Organic', bn: 'অর্গানিক' },
  { id: 'premium', en: 'Premium', bn: 'প্রিমিয়াম' },
  { id: 'inStock', en: 'In stock only', bn: 'শুধু স্টকে থাকা' },
]

const matchesFlag = (product, flag) => {
  if (flag === 'offered') return product.oldPrice > product.price
  if (flag === 'best') return product.topSelling || product.badges?.includes('Best Selling')
  if (flag === 'new') return product.badges?.includes('New Arrival')
  if (flag === 'organic') return product.badges?.includes('Organic') || product.category === 'organic'
  if (flag === 'premium') return product.badges?.includes('Premium')
  if (flag === 'inStock') return Number(product.stock) > 0
  return true
}

const checkClass =
  'h-4 w-4 rounded border-gray-300 text-brand accent-brand focus:ring-brand'

const FiltersPanel = ({
  selectedFlags,
  toggleFlag,
  selectedBrands,
  toggleBrand,
  brands,
  priceMin,
  priceMax,
  setPriceMin,
  setPriceMax,
  onClear,
  t,
  tx,
}) => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-bold text-ink">{t('shop.filters')}</h2>
      <button type="button" onClick={onClear} className="text-[11px] font-semibold text-brand hover:underline">
        {t('shop.clearAll')}
      </button>
    </div>

    <div className="border-t border-gray-100 pt-4">
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wide text-ink">{t('shop.productFlags')}</h3>
      <ul className="space-y-2">
        {flagOptions.map((flag) => (
          <li key={flag.id}>
            <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-muted hover:text-ink">
              <input
                type="checkbox"
                className={checkClass}
                checked={selectedFlags.includes(flag.id)}
                onChange={() => toggleFlag(flag.id)}
              />
              {tx(flag.en, flag.bn)}
            </label>
          </li>
        ))}
      </ul>
    </div>

    <div className="border-t border-gray-100 pt-4">
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wide text-ink">{t('shop.priceRange')}</h3>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          placeholder={t('shop.min')}
          className="input px-2 py-1.5 text-xs"
          aria-label={t('shop.min')}
        />
        <span className="text-gray-400">–</span>
        <input
          type="number"
          min="0"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          placeholder={t('shop.max')}
          className="input px-2 py-1.5 text-xs"
          aria-label={t('shop.max')}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {[
          [0, 500],
          [500, 1000],
          [1000, 2000],
          [2000, 5000],
        ].map(([min, max]) => (
          <button
            key={`${min}-${max}`}
            type="button"
            onClick={() => {
              setPriceMin(String(min))
              setPriceMax(String(max))
            }}
            className="rounded-full border border-gray-200 px-2.5 py-1 text-[10.5px] font-medium text-ink-muted transition hover:border-brand hover:text-brand"
          >
            ৳{min} – ৳{max}
          </button>
        ))}
      </div>
    </div>

    <div className="border-t border-gray-100 pt-4">
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wide text-ink">{t('shop.brands')}</h3>
      <ul className="space-y-2">
        {brands.map((brand) => (
          <li key={brand.slug}>
            <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-muted hover:text-ink">
              <input
                type="checkbox"
                className={checkClass}
                checked={selectedBrands.includes(brand.name)}
                onChange={() => toggleBrand(brand.name)}
              />
              {brand.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

const Products = () => {
  const { categorySlug, subSlug } = useParams()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, searchProducts } = useProducts()
  const { t, tx } = useLanguage()

  const isSearch = location.pathname.startsWith('/search')
  const isOffer = location.pathname.startsWith('/offer-zone')
  const q = isSearch ? searchParams.get('q') || '' : ''
  const [searchInput, setSearchInput] = useState(q)
  const [sort, setSort] = useState(searchParams.get('sort') || (isOffer ? 'best' : 'default'))
  const [selectedFlags, setSelectedFlags] = useState(
    searchParams.get('flag') ? [searchParams.get('flag')] : []
  )
  const [selectedBrands, setSelectedBrands] = useState(
    searchParams.get('brand') ? [searchParams.get('brand')] : []
  )
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const category = categorySlug ? getMergedCategories().find((c) => c.slug === categorySlug) : null
  const subcategory =
    categorySlug && subSlug
      ? (category?.children || []).find((ch) => ch.slug === subSlug) || null
      : null

  useEffect(() => {
    setSearchInput(q)
  }, [q])

  useEffect(() => {
    setPage(1)
  }, [categorySlug, subSlug, q, sort, selectedFlags, selectedBrands, priceMin, priceMax])

  const toggleFlag = (flag) =>
    setSelectedFlags((prev) => (prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]))

  const toggleBrand = (brand) =>
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))

  const clearFilters = () => {
    setSelectedFlags([])
    setSelectedBrands([])
    setPriceMin('')
    setPriceMax('')
  }

  const filtered = useMemo(() => {
    let list = products

    if (isOffer) list = list.filter((p) => p.oldPrice > p.price)
    if (categorySlug) list = list.filter((p) => p.category === categorySlug)
    if (subSlug) list = list.filter((p) => p.subcategory === subSlug)
    if (q) {
      const searchedIds = new Set(searchProducts(q).map((p) => p.id))
      list = list.filter((p) => searchedIds.has(p.id))
    }
    if (selectedFlags.length) {
      list = list.filter((p) => selectedFlags.every((flag) => matchesFlag(p, flag)))
    }
    if (selectedBrands.length) {
      list = list.filter((p) => selectedBrands.includes(p.brand))
    }
    const min = Number(priceMin) || 0
    const max = Number(priceMax) || Infinity
    list = list.filter((p) => p.price >= min && p.price <= max && (max > 0 || min === 0))

    const sorted = [...list]
    if (sort === 'price-low') sorted.sort((a, b) => a.price - b.price)
    else if (sort === 'price-high') sorted.sort((a, b) => b.price - a.price)
    else if (sort === 'latest') sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    else if (sort === 'best') sorted.sort((a, b) => (b.sold || 0) - (a.sold || 0))
    return sorted
  }, [
    products,
    isOffer,
    categorySlug,
    subSlug,
    q,
    selectedFlags,
    selectedBrands,
    priceMin,
    priceMax,
    sort,
    searchProducts,
  ])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const title = q
    ? `${t('shop.searchResults')} “${q}”`
    : isOffer
      ? t('nav.offerZone')
      : subcategory
        ? tx(subcategory.name, subcategory.name_bn)
        : category
          ? tx(category.name, category.name_bn)
          : t('shop.title')

  const subtitle = q
    ? `${filtered.length} ${t('shop.results')}`
    : isOffer
      ? tx('Limited-time savings across the store', 'স্টোরজুড়ে সীমিত সময়ের ছাড়')
      : category
        ? tx(
            `Explore our ${category.name.toLowerCase()} collection`,
            `আমাদের ${category.name_bn} কালেকশন দেখুন`
          )
        : tx('Everything your kitchen needs, in one place', 'রান্নাঘরের সব প্রয়োজন, এক জায়গায়')

  const breadcrumbs = [
    { label: t('common.home'), to: '/' },
    { label: t('nav.shop'), to: '/shop' },
    ...(category ? [{ label: tx(category.name, category.name_bn), to: `/collections/${category.slug}` }] : []),
    ...(subcategory ? [{ label: tx(subcategory.name, subcategory.name_bn) }] : []),
    ...(isSearch ? [{ label: t('nav.search') }] : []),
    ...(isOffer ? [{ label: t('nav.offerZone') }] : []),
  ]

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const value = searchInput.trim()
    setSearchParams(value ? { q: value } : {})
  }

  const handleSort = (value) => {
    setSort(value)
    const next = new URLSearchParams(searchParams)
    if (value === 'default') next.delete('sort')
    else next.set('sort', value)
    setSearchParams(next, { replace: true })
  }

  const panelProps = {
    selectedFlags,
    toggleFlag,
    selectedBrands,
    toggleBrand,
    brands: getMergedBrands(),
    priceMin,
    priceMax,
    setPriceMin,
    setPriceMax,
    onClear: clearFilters,
    t,
    tx,
  }

  return (
    <div className="pb-6">
      {!isSearch && (
        <div className="container-gb pt-3">
          <PageBanner
            title={title}
            subtitle={subtitle}
            image={isOffer ? bannerImage('KQlqd1788006502-4000x1039.jpeg') : bannerImage('nr4nq1788005117-1000x400.png')}
          />
        </div>
      )}

      <div className="container-gb">
        <Breadcrumbs items={breadcrumbs} />

        {isSearch && (
          <div className="mb-4">
            <form onSubmit={handleSearchSubmit} className="flex h-11 items-center overflow-hidden rounded-md border border-gray-200 bg-cream">
              <Search size={18} className="ml-3 text-gray-400" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t('common.searchPlaceholder')}
                className="h-full w-full bg-transparent px-2.5 text-sm outline-none"
              />
              <button type="submit" className="h-full bg-brand px-4 text-white">
                <Search size={17} />
              </button>
            </form>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
              <span className="font-semibold text-ink">{title}</span>
              <span>·</span>
              <span>{filtered.length} {t('shop.results')}</span>
              <Link to="/shop" className="ml-1 font-semibold text-brand hover:underline">
                {t('shop.clearAll')}
              </Link>
            </div>
          </div>
        )}

        {category && category.children.length > 0 && (
          <div className="no-scrollbar -mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
            <Link
              to={`/collections/${category.slug}`}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                !subSlug
                  ? 'border-brand bg-brand text-white'
                  : 'border-gray-200 bg-white text-ink-muted hover:border-brand hover:text-brand'
              }`}
            >
              {t('shop.all')}
            </Link>
            {category.children.map((child) => (
              <Link
                key={child.slug}
                to={`/collections/${category.slug}/${child.slug}`}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  subSlug === child.slug
                    ? 'border-brand bg-brand text-white'
                    : 'border-gray-200 bg-white text-ink-muted hover:border-brand hover:text-brand'
                }`}
              >
                {tx(child.name, child.name_bn)}
              </Link>
            ))}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-[150px] rounded-lg border border-gray-100 bg-white p-4 shadow-card">
              <FiltersPanel {...panelProps} />
            </div>
          </aside>

          <section>
            <div className="mb-3 flex items-center justify-between gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2.5 shadow-card">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-ink lg:hidden"
                >
                  <SlidersHorizontal size={14} />
                  {t('shop.filters')}
                </button>
                <p className="hidden text-xs text-ink-muted sm:block">
                  {t('shop.showing')} <span className="font-semibold text-ink">{pageItems.length}</span>{' '}
                  {t('shop.of')} <span className="font-semibold text-ink">{filtered.length}</span>{' '}
                  {t('shop.results')}
                </p>
                <p className="text-xs text-ink-muted sm:hidden">
                  {filtered.length} {t('shop.results')}
                </p>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-ink-muted">
                <Filter size={13} className="hidden sm:block" />
                <span className="hidden sm:inline">{t('shop.sortBy')}:</span>
                <select
                  value={sort}
                  onChange={(e) => handleSort(e.target.value)}
                  className="rounded border border-gray-200 bg-white px-1.5 py-1 text-xs font-semibold text-ink outline-none focus:border-brand"
                >
                  <option value="default">{t('shop.sortDefault')}</option>
                  <option value="latest">{t('shop.sortLatest')}</option>
                  <option value="price-low">{t('shop.sortPriceLow')}</option>
                  <option value="price-high">{t('shop.sortPriceHigh')}</option>
                  <option value="best">{t('shop.sortBest')}</option>
                </select>
              </label>
            </div>

            {pageItems.length === 0 ? (
              <EmptyState
                icon={Search}
                title={t('shop.noProducts')}
                subtitle={t('shop.noProductsSub')}
                action={
                  <button type="button" onClick={clearFilters} className="btn-primary">
                    {t('shop.clearAll')}
                  </button>
                }
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {pageItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setPage(Math.max(1, safePage - 1))
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  disabled={safePage === 1}
                  className="rounded border border-gray-200 px-3 py-1.5 text-xs font-semibold text-ink-muted transition hover:border-brand hover:text-brand disabled:opacity-40"
                >
                  {t('shop.previous')}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => {
                      setPage(number)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className={`grid h-8 w-8 place-items-center rounded text-xs font-semibold transition ${
                      number === safePage
                        ? 'bg-brand text-white'
                        : 'border border-gray-200 text-ink-muted hover:border-brand hover:text-brand'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setPage(Math.min(totalPages, safePage + 1))
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  disabled={safePage === totalPages}
                  className="rounded border border-gray-200 px-3 py-1.5 text-xs font-semibold text-ink-muted transition hover:border-brand hover:text-brand disabled:opacity-40"
                >
                  {t('shop.next')}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] animate-slide-up overflow-y-auto rounded-t-2xl bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-ink">{t('shop.filters')}</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-ink-muted hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <FiltersPanel {...panelProps} />
            <button type="button" onClick={() => setFiltersOpen(false)} className="btn-primary mt-5 w-full">
              {t('shop.applyFilters')} ({filtered.length})
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
