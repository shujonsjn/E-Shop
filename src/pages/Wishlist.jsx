import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { Breadcrumbs, EmptyState } from '../components/ui'
import { useProducts } from '../context/ProductsContext'
import { useWishlist } from '../context/WishlistContext'
import { useLanguage } from '../i18n/LanguageContext'

const Wishlist = () => {
  const { wishlist, clearWishlist } = useWishlist()
  const { products } = useProducts()
  const { t, tx } = useLanguage()

  const items = products.filter((product) =>
    wishlist.some((id) => String(id) === String(product.id))
  )

  return (
    <div className="container-gb py-4">
      <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('account.wishlist') }]} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold text-ink sm:text-2xl">
          {t('account.wishlist')}
          <span className="ml-2 text-sm font-normal text-ink-muted">
            ({items.length} {t('common.items')})
          </span>
        </h1>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="inline-flex items-center gap-1 rounded border border-gray-200 px-2.5 py-1.5 text-[11px] font-semibold text-ink-muted transition hover:border-red-200 hover:text-red-500"
          >
            <Trash2 size={13} />
            {t('shop.clearAll')}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Heart}
            title={t('account.noWishlist')}
            subtitle={t('account.noWishlistSub')}
            action={
              <Link to="/shop" className="btn-primary">
                {t('account.browseProducts')}
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <p className="mt-5 text-center text-[11px] text-gray-400">
            {tx(
              'Your wishlist is saved in this browser. Tap the heart on a product to add or remove it.',
              'আপনার উইশলিস্ট এই ব্রাউজারে সংরক্ষিত। যোগ বা বাদ দিতে পণ্যের হার্ট আইকনে ট্যাপ করুন।'
            )}
          </p>
        </>
      )}
    </div>
  )
}

export default Wishlist
