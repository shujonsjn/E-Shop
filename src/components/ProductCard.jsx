import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useLanguage } from '../i18n/LanguageContext'
import { RatingStars, discountPercent, formatTaka } from './ui'

const ProductCard = ({ product, compact = false }) => {
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { tx } = useLanguage()

  if (!product) return null

  const wished = isWishlisted(product.id)
  const off = discountPercent(product)
  const name = tx(product.name, product.name_bn)
  const badge = product.badges?.[0]
  const badgeBn = {
    'Best Selling': 'বেস্ট সেলিং',
    'New Arrival': 'নতুন এসেছে',
    Offered: 'অফার',
    Premium: 'প্রিমিয়াম',
    Organic: 'অর্গানিক',
  }[badge]

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lift">
      <div className="absolute left-2 top-2 z-10 flex flex-col items-start gap-1.5">
        {badge && (
          <span className="rounded bg-brand px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            {tx(badge, badgeBn)}
          </span>
        )}
        {off > 0 && (
          <span className="rounded bg-success px-2 py-1 text-[10px] font-bold text-white shadow-sm">
            -{off}%
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => toggleWishlist(product)}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full border bg-white/95 shadow-sm transition ${
          wished ? 'border-brand text-brand' : 'border-gray-200 text-ink-muted hover:border-brand hover:text-brand'
        }`}
      >
        <Heart size={15} className={wished ? 'fill-brand' : ''} />
      </button>

      <Link to={`/products/${product.slug}`} className="block overflow-hidden bg-white p-3">
        <div className={`${compact ? 'aspect-square' : 'aspect-[4/3]'} w-full overflow-hidden rounded-md`}>
          <img
            src={product.image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-3 pb-3">
        <Link
          to={`/products/${product.slug}`}
          className="line-clamp-2 min-h-[2.5rem] text-[13px] font-semibold leading-5 text-ink transition-colors hover:text-brand sm:text-sm"
        >
          {name}
        </Link>
        <div className="mt-1 flex items-center justify-between gap-2">
          {product.unit && <span className="text-[11px] text-gray-400">{product.unit}</span>}
          {product.rating > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-muted">
              <RatingStars value={product.rating} size={11} />
              {Number(product.rating).toFixed(1)}
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-bold text-brand sm:text-lg">{formatTaka(product.price)}</span>
          {product.oldPrice > product.price && (
            <span className="text-[11px] text-gray-400 line-through sm:text-xs">
              {formatTaka(product.oldPrice)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => addToCart(product, 1)}
          className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-brand bg-white py-2 text-xs font-bold text-brand transition-colors hover:bg-brand hover:text-white sm:text-[13px]"
        >
          <ShoppingCart size={14} />
          {tx('Add to Cart', 'কার্টে যোগ করুন')}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
