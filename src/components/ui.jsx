import { Link } from 'react-router-dom'
import { ChevronRight, Minus, Plus, Star } from 'lucide-react'

export const formatTaka = (value) => `৳${Number(value || 0).toLocaleString('en-US')}`

export const discountPercent = (product) =>
  product?.oldPrice > product?.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

const toneMap = {
  brand: 'bg-brand-light text-brand-dark',
  green: 'bg-green-50 text-green-700',
  red: 'bg-red-50 text-red-600',
  dark: 'bg-ink text-white',
  gray: 'bg-gray-100 text-ink-muted',
  white: 'bg-white/95 text-ink',
}

export const Badge = ({ children, tone = 'brand', className = '' }) => (
  <span className={`chip ${toneMap[tone] || toneMap.brand} ${className}`}>{children}</span>
)

export const RatingStars = ({ value = 0, size = 14, showValue = false, count = null }) => {
  const rounded = Math.round((Number(value) || 0) * 2) / 2
  return (
    <span className="inline-flex items-center gap-1" role="img" aria-label={`Rated ${value} out of 5`}>
      <span className="inline-flex">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = rounded >= i
          const half = !filled && rounded >= i - 0.5
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-gray-300" />
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden text-amber-400"
                  style={{ width: half ? size / 2 : size }}
                >
                  <Star size={size} className="fill-amber-400 text-amber-400" />
                </span>
              )}
            </span>
          )
        })}
      </span>
      {showValue && <span className="text-xs font-semibold text-ink">{Number(value || 0).toFixed(1)}</span>}
      {count !== null && <span className="text-xs text-ink-muted">({count})</span>}
    </span>
  )
}

export const Price = ({ price, oldPrice = 0, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-2xl sm:text-3xl',
  }
  const off = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0
  return (
    <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className}`}>
      <span className={`font-bold text-brand ${sizes[size] || sizes.md}`}>{formatTaka(price)}</span>
      {oldPrice > price && (
        <>
          <span className="text-xs text-gray-400 line-through sm:text-sm">{formatTaka(oldPrice)}</span>
          <span className="text-[11px] font-semibold text-success">Save {off}%</span>
        </>
      )}
    </div>
  )
}

export const SectionHeading = ({ title, subtitle, href, linkLabel = 'View All', className = '' }) => (
  <div className={`mb-5 flex items-end justify-between gap-4 ${className}`}>
    <div>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="mt-1 text-xs text-ink-muted sm:text-sm">{subtitle}</p>}
    </div>
    {href && (
      <Link
        to={href}
        className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark sm:text-sm"
      >
        {linkLabel}
        <ChevronRight size={15} />
      </Link>
    )}
  </div>
)

export const Breadcrumbs = ({ items = [] }) => (
  <nav className="flex flex-wrap items-center gap-1.5 py-3 text-xs text-ink-muted sm:text-[13px]">
    {items.map((item, index) => (
      <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
        {index > 0 && <ChevronRight size={13} className="text-gray-300" />}
        {item.to && index < items.length - 1 ? (
          <Link to={item.to} className="hover:text-brand">
            {item.label}
          </Link>
        ) : (
          <span className={index === items.length - 1 ? 'font-semibold text-ink' : ''}>
            {item.label}
          </span>
        )}
      </span>
    ))}
  </nav>
)

export const QtyStepper = ({ value, onChange, min = 1, max = 99, size = 'md' }) => {
  const dimensions = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const inputSize = size === 'sm' ? 'h-8 w-9 text-sm' : 'h-10 w-12 text-sm'
  const setValue = (next) => {
    const clamped = Math.max(min, Math.min(max, Number(next) || min))
    onChange(clamped)
  }
  return (
    <div className="inline-flex items-center rounded-md border border-gray-300 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => setValue(Number(value) - 1)}
        disabled={Number(value) <= min}
        className={`${dimensions} grid place-items-center text-ink-muted transition hover:text-brand disabled:opacity-40`}
      >
        <Minus size={15} />
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => setValue(e.target.value)}
        className={`${inputSize} border-x border-gray-200 text-center font-semibold text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
        aria-label="Quantity"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => setValue(Number(value) + 1)}
        disabled={Number(value) >= max}
        className={`${dimensions} grid place-items-center text-ink-muted transition hover:text-brand disabled:opacity-40`}
      >
        <Plus size={15} />
      </button>
    </div>
  )
}

export const EmptyState = ({ icon: Icon, title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
    {Icon && (
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-brand-light text-brand">
        <Icon size={30} />
      </div>
    )}
    <h3 className="text-lg font-bold text-ink">{title}</h3>
    {subtitle && <p className="mt-1.5 max-w-md text-sm text-ink-muted">{subtitle}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
)

export const Spinner = ({ className = '' }) => (
  <span
    className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white ${className}`}
  />
)

const statusTones = {
  Pending: 'bg-amber-50 text-amber-700',
  Confirmed: 'bg-blue-50 text-blue-700',
  Packed: 'bg-indigo-50 text-indigo-700',
  Shipped: 'bg-cyan-50 text-cyan-700',
  'Out for Delivery': 'bg-purple-50 text-purple-700',
  Delivered: 'bg-green-50 text-green-700',
  Cancelled: 'bg-red-50 text-red-600',
}

export const StatusBadge = ({ status, label, className = '' }) => (
  <span className={`chip ${statusTones[status] || 'bg-gray-100 text-ink-muted'} ${className}`}>
    {label || status}
  </span>
)

export const PageBanner = ({ title, subtitle, image }) => (
  <div className="relative overflow-hidden rounded-lg bg-ink">
    {image && (
      <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-35" />
    )}
    <div className="relative px-6 py-8 sm:px-10 sm:py-12">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-sm text-white/80">{subtitle}</p>}
    </div>
  </div>
)
