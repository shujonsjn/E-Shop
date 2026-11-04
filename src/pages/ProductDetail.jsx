import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Check,
  ChevronRight,
  Heart,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  ZoomIn,
} from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { Badge, Breadcrumbs, QtyStepper, RatingStars, SectionHeading, formatTaka } from '../components/ui'
import { useProducts } from '../context/ProductsContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { useReview } from '../context/ReviewContext'
import { useLanguage } from '../i18n/LanguageContext'
import { getCategory, getSubcategory } from '../data/catalog'
import { useSettings } from '../context/SettingsContext'

const ProductDetail = () => {
  const params = useParams()
  const key = params.slug || params.id
  const navigate = useNavigate()
  const { getProduct, getRelatedProducts } = useProducts()
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { user } = useAuth()
  const { getProductReviews, addReview, hasUserReviewed } = useReview()
  const { t, tx } = useLanguage()
  const { settings } = useSettings()

  const product = getProduct(key)
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState('description')
  const [selectedImage, setSelectedImage] = useState(0)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [zoom, setZoom] = useState(false)

  const reviews = product ? getProductReviews(product.id) : []
  const related = useMemo(() => getRelatedProducts(product, 5), [product, getRelatedProducts])

  if (!product) {
    return (
      <div className="container-gb py-16 text-center">
        <h1 className="text-2xl font-bold text-ink">{tx('Product not found', 'পণ্য পাওয়া যায়নি')}</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {tx('This product may have been removed or the link is incorrect.', 'পণ্যটি সরানো হয়েছে অথবা লিংকটি সঠিক নয়।')}
        </p>
        <Link to="/shop" className="btn-primary mt-6">
          {t('common.continueShopping')}
        </Link>
      </div>
    )
  }

  const category = getCategory(product.category)
  const subcategory = getSubcategory(product.category, product.subcategory)
  const wished = isWishlisted(product.id)
  const gallery = product.gallery?.length ? product.gallery : [product.image]
  const inStock = Number(product.stock ?? 1) > 0
  const off = product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0
  const displayName = tx(product.name, product.name_bn)
  const rawDescription = tx(product.description, product.description_bn)
  const rawFeatures = tx(product.features, product.features_bn)
  const description = Array.isArray(rawDescription)
    ? rawDescription
    : rawDescription
      ? [rawDescription]
      : []
  const features = Array.isArray(rawFeatures) ? rawFeatures : rawFeatures ? [rawFeatures] : []
  const brandSlug = String(product.brand || '').toLowerCase().replace(/\s+/g, '-')

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((review) => review.rating === star).length
    return { star, count }
  })
  const maxDistribution = Math.max(1, ...distribution.map((row) => row.count))

  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/checkout')
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login', { state: { from: `/products/${product.slug}` } })
      return
    }
    if (!comment.trim()) return
    const success = addReview({
      productId: product.id,
      userId: user.id,
      userName: user.name,
      rating,
      comment: comment.trim(),
    })
    if (success) setComment('')
  }

  const breadcrumbs = [
    { label: t('common.home'), to: '/' },
    { label: t('nav.shop'), to: '/shop' },
    ...(category ? [{ label: tx(category.name, category.name_bn), to: `/collections/${category.slug}` }] : []),
    ...(subcategory
      ? [{ label: tx(subcategory.name, subcategory.name_bn), to: `/collections/${category.slug}/${subcategory.slug}` }]
      : []),
    { label: displayName },
  ]

  const rawPhone = settings?.whatsappNumber || settings?.callOrderNumber || settings?.sitePhone || '+8801321208940'
  const waPhone = String(rawPhone).replace(/[^0-9]/g, '')
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${waPhone}&text=${encodeURIComponent(
    `Hello ${settings?.siteName || ''}, I want to order: ${product.name} (${product.unit})`
  )}`

  return (
    <div className="pb-24 lg:pb-6">
      <div className="container-gb">
        <Breadcrumbs items={breadcrumbs} />

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] xl:grid-cols-[520px_1fr]">
          {/* Gallery */}
          <div>
            <div className="relative overflow-hidden rounded-lg border border-gray-100 bg-white">
              <div className="absolute left-2 top-2 z-10 flex flex-col gap-1.5">
                {product.badges?.map((badge) => (
                  <Badge key={badge} tone="brand" className="shadow-sm">
                    {tx(
                      badge,
                      {
                        'Best Selling': 'বেস্ট সেলিং',
                        'New Arrival': 'নতুন এসেছে',
                        Offered: 'অফার',
                        Premium: 'প্রিমিয়াম',
                        Organic: 'অর্গানিক',
                      }[badge]
                    )}
                  </Badge>
                ))}
                {off > 0 && (
                  <span className="chip bg-success text-white shadow-sm">{off}% {t('common.off')}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full border bg-white/95 shadow-sm transition ${
                  wished ? 'border-brand text-brand' : 'border-gray-200 text-ink-muted hover:text-brand'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart size={17} className={wished ? 'fill-brand' : ''} />
              </button>
              <button
                type="button"
                onClick={() => setZoom(true)}
                className="group block w-full cursor-zoom-in bg-white p-4 sm:p-6"
              >
                <div className="aspect-square w-full overflow-hidden rounded">
                  <img
                    src={gallery[selectedImage]}
                    alt={displayName}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </button>
              <span className="absolute bottom-2 right-2 hidden items-center gap-1 rounded bg-black/40 px-2 py-1 text-[10px] text-white sm:flex">
                <ZoomIn size={12} /> {tx('Click to zoom', 'জুম করতে ক্লিক করুন')}
              </span>
            </div>

            {gallery.length > 1 && (
              <div className="mt-2.5 flex gap-2 overflow-x-auto">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded border bg-white p-1 ${
                      selectedImage === index ? 'border-brand' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-3 hidden grid-cols-2 gap-2 sm:grid">
              <div className="flex items-center gap-2 rounded-md border border-gray-100 bg-cream/60 px-3 py-2.5">
                <ShieldCheck size={20} className="shrink-0 text-brand" />
                <div>
                  <p className="text-[12px] font-bold text-ink">{t('product.authentic')}</p>
                  <p className="text-[10px] text-ink-muted">{tx('Sourced directly', 'সরাসরি সংগ্রহ করা')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-gray-100 bg-cream/60 px-3 py-2.5">
                <RotateCcw size={20} className="shrink-0 text-brand" />
                <div>
                  <p className="text-[12px] font-bold text-ink">{t('product.easyReturn')}</p>
                  <p className="text-[10px] text-ink-muted">{tx('No questions asked', 'কোনো প্রশ্ন ছাড়াই')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-xl font-bold leading-snug text-ink sm:text-2xl">{displayName}</h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <RatingStars value={product.rating} size={15} showValue count={product.reviewCount} />
              <span className="text-xs text-ink-muted">|</span>
              <span className={`text-xs font-semibold ${inStock ? 'text-success' : 'text-red-500'}`}>
                {inStock ? t('common.inStock') : t('common.outOfStock')}
              </span>
              <span className="text-xs text-ink-muted">
                {product.sold}+ {t('product.peopleBought')}
              </span>
            </div>

            <div className="mt-2 text-xs text-ink-muted">
              {t('product.brand')}:{' '}
              <Link to={`/brand/${brandSlug}`} className="font-semibold text-brand hover:underline">
                {product.brand}
              </Link>
            </div>

            <div className="mt-4 rounded-lg border border-gray-100 bg-cream/60 p-3.5">
              <div className="flex flex-wrap items-end gap-2">
                <span className="text-2xl font-extrabold text-brand sm:text-3xl">{formatTaka(product.price)}</span>
                {product.oldPrice > product.price && (
                  <>
                    <span className="text-sm text-gray-400 line-through sm:text-base">
                      {formatTaka(product.oldPrice)}
                    </span>
                    <span className="chip bg-green-50 text-success">
                      {t('product.saveAmount')} {formatTaka(product.oldPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-[11px] text-ink-muted">
                {tx('Inclusive of all taxes · Delivery charge added at checkout', 'সব ট্যাক্স অন্তর্ভুক্ত · ডেলিভারি চার্জ চেকআউটে')}
              </p>
            </div>

            <p className="mt-4 text-sm leading-6 text-ink-muted">{tx(product.short, product.short_bn)}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-ink">{t('common.quantity')}</span>
              <QtyStepper value={quantity} min={1} max={Math.max(1, Number(product.stock) || 99)} onChange={setQuantity} />
              <span className="text-[11px] text-ink-muted">{product.unit}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => addToCart(product, quantity)}
                disabled={!inStock}
                className="btn-outline py-3"
              >
                <ShoppingCart size={17} />
                {t('common.addToCart')}
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!inStock}
                className="btn-primary py-3"
              >
                {t('common.buyNow')}
                <ChevronRight size={17} />
              </button>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-dark bg-[#25D366] py-2.5 text-xs hover:bg-[#1eb457]">
                <MessageCircle size={15} />
                {t('product.orderOnWhatsApp')}
              </a>
              <a href={`tel:${settings?.callOrderNumber || settings?.sitePhone || '+8809642922922'}`} className="btn-dark py-2.5 text-xs">
                <Phone size={15} />
                {t('product.callForOrder')}
              </a>
            </div>

            <div className="mt-4 rounded-lg border border-gray-100 p-3.5">
              <h3 className="mb-2 flex items-center gap-1.5 text-[13px] font-bold text-ink">
                <Truck size={15} className="text-brand" />
                {t('product.deliveryInfo')}
              </h3>
              <ul className="space-y-1.5 text-[12px] text-ink-muted">
                <li className="flex items-start gap-2">
                  <MapPin size={13} className="mt-0.5 shrink-0 text-brand" />
                  {t('product.deliveryInside')}
                </li>
                <li className="flex items-start gap-2">
                  <Truck size={13} className="mt-0.5 shrink-0 text-brand" />
                  {t('product.deliveryOutside')}
                </li>
                <li className="flex items-start gap-2">
                  <Check size={13} className="mt-0.5 shrink-0 text-brand" />
                  {tx('Cash on delivery available nationwide', 'সারাদেশে ক্যাশ অন ডেলিভারি আছে')}
                </li>
              </ul>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11.5px] text-ink-muted">
              <p><span className="font-semibold text-ink">{t('product.sku')}:</span> GB-{1000 + product.id}</p>
              <p><span className="font-semibold text-ink">{t('product.unit')}:</span> {product.unit}</p>
              <p><span className="font-semibold text-ink">{t('product.category')}:</span> {tx(category?.name, category?.name_bn)}</p>
              <p><span className="font-semibold text-ink">{t('product.brand')}:</span> {product.brand}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 rounded-lg border border-gray-100 bg-white shadow-card">
          <div className="flex overflow-x-auto border-b border-gray-100">
            {[
              { id: 'description', label: t('product.description') },
              { id: 'reviews', label: `${t('product.reviews')} (${reviews.length})` },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`whitespace-nowrap border-b-2 px-5 py-3 text-sm font-semibold transition ${
                  tab === item.id
                    ? 'border-brand text-brand'
                    : 'border-transparent text-ink-muted hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6">
            {tab === 'description' ? (
              <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                <div className="prose-gb">
                  <h3 className="mb-2 text-sm font-bold text-ink">{t('product.keyFeatures')}</h3>
                  <ul className="mb-4 space-y-1.5">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 !mb-0 text-[13.5px]">
                        <Check size={15} className="mt-1 shrink-0 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <h3 className="mb-2 mt-5 text-sm font-bold text-ink">{tx('About this product', 'এই পণ্য সম্পর্কে')}</h3>
                  {description.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>
                <div className="rounded-md bg-cream/70 p-4">
                  <h4 className="text-[13px] font-bold text-ink">{tx('Why buy from us', 'কেন আমাদের কাছ থেকে কিনবেন')}</h4>
                  <ul className="mt-2 space-y-2.5 text-[12px] text-ink-muted">
                    {[
                      tx('Direct sourcing, no middlemen', 'সরাসরি সোর্সিং, কোনো মধ্যস্বত্বভোগী নেই'),
                      tx('Checked before every dispatch', 'প্রতিবার পাঠানোর আগে যাচাই'),
                      tx('Secure packaging, sealed products', 'নিরাপদ প্যাকেজিং, সিলড পণ্য'),
                      tx('7-day happy return policy', '৭ দিনের হ্যাপি রিটার্ন নীতি'),
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <ShieldCheck size={14} className="mt-0.5 shrink-0 text-brand" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
                <div>
                  <div className="rounded-md bg-cream/70 p-4 text-center">
                    <p className="text-4xl font-extrabold text-ink">{Number(product.rating).toFixed(1)}</p>
                    <div className="mt-1 flex justify-center">
                      <RatingStars value={product.rating} size={16} />
                    </div>
                    <p className="mt-1 text-[11px] text-ink-muted">
                      {t('product.basedOn')} {product.reviewCount} {t('product.reviewsCount')}
                    </p>
                    <div className="mt-3 space-y-1.5">
                      {distribution.map(({ star, count }) => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="flex w-8 items-center gap-0.5 text-[11px] text-ink-muted">
                            {star} <Star size={9} className="fill-amber-400 text-amber-400" />
                          </span>
                          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                            <span
                              className="block h-full rounded-full bg-amber-400"
                              style={{ width: `${(count / maxDistribution) * 100}%` }}
                            />
                          </span>
                          <span className="w-5 text-right text-[10px] text-ink-muted">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-ink">
                      {t('product.reviews')} ({reviews.length})
                    </h3>
                    {reviews.length > 3 && (
                      <span className="text-[11px] text-ink-muted">
                        {tx(`Showing 3 of ${reviews.length}`, `${reviews.length}-এর মধ্যে ৩টি দেখানো হচ্ছে`)}
                      </span>
                    )}
                  </div>

                  {reviews.length === 0 ? (
                    <p className="mt-4 rounded-md bg-cream/60 px-4 py-6 text-center text-sm text-ink-muted">
                      {t('product.noReviews')}
                    </p>
                  ) : (
                    <ul className="mt-3 divide-y divide-gray-100">
                      {reviews.slice(0, 6).map((review) => (
                        <li key={review.id} className="py-3.5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-light text-xs font-bold text-brand">
                                {review.userName?.charAt(0)?.toUpperCase()}
                              </span>
                              <div>
                                <p className="text-[13px] font-bold text-ink">{review.userName}</p>
                                <p className="text-[10px] text-gray-400">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <RatingStars value={review.rating} size={12} />
                          </div>
                          <p className="mt-2 text-[13px] leading-6 text-ink-muted">{review.comment}</p>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-5 rounded-md border border-gray-100 p-4">
                    <h4 className="text-sm font-bold text-ink">{t('product.writeReview')}</h4>
                    {!user ? (
                      <p className="mt-2 text-[13px] text-ink-muted">
                        <Link
                          to="/login"
                          state={{ from: `/products/${product.slug}` }}
                          className="font-semibold text-brand hover:underline"
                        >
                          {t('product.loginToReview')}
                        </Link>
                      </p>
                    ) : hasUserReviewed(product.id, user.id) ? (
                      <p className="mt-2 text-[13px] text-ink-muted">{t('product.alreadyReviewed')}</p>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="mt-3 space-y-3">
                        <div>
                          <p className="mb-1.5 text-xs font-semibold text-ink">{t('product.yourRating')}</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                aria-label={`${star} star`}
                                className="p-0.5"
                              >
                                <Star
                                  size={22}
                                  className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="review" className="label text-xs">
                            {t('product.yourOpinion')}
                          </label>
                          <textarea
                            id="review"
                            rows="3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            className="input resize-none"
                            placeholder={tx('Share what you liked about this product...', 'এই পণ্যের কোন দিকটি ভালো লেগেছে লিখুন...')}
                          />
                        </div>
                        <button type="submit" className="btn-primary">
                          {t('product.submitReview')}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-10">
            <SectionHeading
              title={t('product.relatedProducts')}
              href={category ? `/collections/${category.slug}` : '/shop'}
            />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-14 left-0 right-0 z-40 border-t border-gray-200 bg-white px-3 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-base font-extrabold leading-tight text-brand">{formatTaka(product.price)}</p>
            {product.oldPrice > product.price && (
              <p className="text-[10px] leading-tight text-gray-400 line-through">{formatTaka(product.oldPrice)}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!inStock}
            className="btn-primary ml-auto flex-1 py-2.5 text-xs"
          >
            {t('common.buyNow')}
          </button>
          <button
            type="button"
            onClick={() => addToCart(product, quantity)}
            disabled={!inStock}
            className="btn-outline flex-1 py-2.5 text-xs"
          >
            <ShoppingCart size={15} />
            {t('common.addToCart')}
          </button>
        </div>
      </div>

      {/* Zoom modal */}
      {zoom && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setZoom(false)}
          role="presentation"
        >
          <img src={gallery[selectedImage]} alt={displayName} className="max-h-full max-w-full object-contain" />
          <button
            type="button"
            onClick={() => setZoom(false)}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-ink"
            aria-label="Close"
          >
            <Minus size={20} className="rotate-45" />
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
