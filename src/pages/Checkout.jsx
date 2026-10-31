import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  User,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Breadcrumbs, EmptyState, QtyStepper, Spinner, formatTaka } from '../components/ui'
import { districts, divisions, upazilas } from '../data/locations'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../i18n/LanguageContext'

const Checkout = () => {
  const {
    cartItems,
    subtotal,
    discount,
    coupon,
    applyCoupon,
    removeCoupon,
    clearCart,
    updateQuantity,
    removeFromCart,
    freeDelivery,
  } = useCart()
  const { user, placeOrder } = useAuth()
  const { t, tx } = useLanguage()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    division: '',
    district: '',
    upazila: '',
    address: user?.address || '',
    notes: '',
    paymentMethod: 'cod',
  })
  const [paymentDetails, setPaymentDetails] = useState({ senderNumber: '', transactionId: '' })
  const [couponCode, setCouponCode] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [placing, setPlacing] = useState(false)

  const availableDistricts = formData.division ? districts[formData.division] || [] : []
  const availableUpazilas = formData.district ? upazilas[formData.district] || [] : []
  const deliveryCharge = freeDelivery ? 0 : formData.district === 'Dhaka' ? 60 : 120
  const total = subtotal - discount + deliveryCharge

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'division') {
      setFormData((prev) => ({ ...prev, division: value, district: '', upazila: '' }))
    } else if (name === 'district') {
      setFormData((prev) => ({ ...prev, district: value, upazila: '' }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    const result = applyCoupon(couponCode)
    setCouponMessage(result.message)
    if (result.ok) setCouponCode('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (cartItems.length === 0) {
      toast.error(t('checkout.emptyCart'))
      return
    }
    if (formData.paymentMethod !== 'cod') {
      if (!paymentDetails.senderNumber.trim() || !paymentDetails.transactionId.trim()) {
        toast.error(tx('Please enter the payment details', 'পেমেন্টের তথ্য দিন'))
        return
      }
    }

    setPlacing(true)
    const orderData = {
      items: cartItems,
      shippingAddress: formData,
      paymentMethod: formData.paymentMethod,
      paymentDetails: formData.paymentMethod !== 'cod' ? paymentDetails : null,
      subtotal,
      discount,
      couponCode: coupon?.code || null,
      deliveryCharge,
      total,
      orderNotes: formData.notes,
      fullName: formData.fullName,
      phone: formData.phone,
    }

    setTimeout(() => {
      const order = placeOrder(orderData)
      clearCart()
      navigate(`/order-success/${order.id}`, { state: { order } })
    }, 500)
  }

  if (cartItems.length === 0) {
    return (
      <div className="container-gb py-4">
        <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('checkout.title') }]} />
        <div className="card mt-2">
          <EmptyState
            icon={ShoppingBag}
            title={t('cart.empty')}
            subtitle={t('checkout.emptyCart')}
            action={
              <Link to="/shop" className="btn-primary">
                {t('common.continueShopping')}
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  const paymentOptions = [
    { id: 'cod', label: t('checkout.cod'), note: t('checkout.codNote'), icon: Truck },
    { id: 'bkash', label: t('checkout.bkash'), note: t('checkout.mobileNote'), accent: 'bg-[#E2136E]' },
    { id: 'nagad', label: t('checkout.nagad'), note: t('checkout.mobileNote'), accent: 'bg-[#F6921E]' },
  ]

  return (
    <div className="container-gb py-3">
      <Breadcrumbs
        items={[
          { label: t('common.home'), to: '/' },
          { label: t('cart.title'), to: '/cart' },
          { label: t('checkout.title') },
        ]}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-ink sm:text-2xl">{t('checkout.title')}</h1>
          <p className="mt-0.5 text-xs text-ink-muted sm:text-sm">{t('checkout.subtitle')}</p>
        </div>
        <ol className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-muted">
          <li className="text-success">1. {t('cart.title')}</li>
          <li>→</li>
          <li className="text-brand">2. {t('checkout.title')}</li>
          <li>→</li>
          <li>3. {tx('Confirm', 'নিশ্চিত')}</li>
        </ol>
      </div>

      {!user && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-md border border-brand/20 bg-brand-light px-3.5 py-2.5 text-xs text-ink">
          <span>
            {t('checkout.loginNote')}{' '}
            <Link to="/login" state={{ from: '/checkout' }} className="font-bold text-brand hover:underline">
              {t('checkout.loginLink')}
            </Link>
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {/* Delivery information */}
          <section className="card overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-gray-100 bg-cream/70 px-4 py-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white">
                <MapPin size={16} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-ink">{t('checkout.deliveryInfo')}</h2>
                <p className="text-[10.5px] text-ink-muted">
                  {tx('We deliver to all 64 districts', 'সারাদেশে ৬৪ জেলায় ডেলিভারি')}
                </p>
              </div>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="label">
                  {t('checkout.fullName')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="input pl-9"
                    placeholder={tx('Enter your full name', 'আপনার পূর্ণ নাম লিখুন')}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="label">
                  {t('checkout.phone')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input pl-9"
                    placeholder="01XXXXXXXXX"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="label">
                  {t('checkout.email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="division" className="label">
                  {t('checkout.division')} <span className="text-red-500">*</span>
                </label>
                <select
                  id="division"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">{t('checkout.selectDivision')}</option>
                  {divisions.map((division) => (
                    <option key={division.id} value={division.name}>
                      {division.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="district" className="label">
                  {t('checkout.district')} <span className="text-red-500">*</span>
                </label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="input"
                  disabled={!formData.division}
                  required
                >
                  <option value="">{t('checkout.selectDistrict')}</option>
                  {availableDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="upazila" className="label">
                  {t('checkout.upazila')} <span className="text-red-500">*</span>
                </label>
                {availableUpazilas.length > 0 ? (
                  <select
                    id="upazila"
                    name="upazila"
                    value={formData.upazila}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">{t('checkout.selectUpazila')}</option>
                    {availableUpazilas.map((upazila) => (
                      <option key={upazila} value={upazila}>
                        {upazila}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="upazila"
                    name="upazila"
                    value={formData.upazila}
                    onChange={handleChange}
                    className="input"
                    placeholder={t('checkout.selectUpazila')}
                    disabled={!formData.district}
                    required
                  />
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="label">
                  {t('checkout.address')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="input resize-none"
                  placeholder={tx('House, road, area, landmark', 'বাড়ি, রোড, এলাকা, ল্যান্ডমার্ক')}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="notes" className="label">
                  {t('checkout.notes')}
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  className="input resize-none"
                  placeholder={t('checkout.notesPlaceholder')}
                />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="card overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-gray-100 bg-cream/70 px-4 py-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white">
                <CreditCard size={16} />
              </span>
              <h2 className="text-sm font-bold text-ink">{t('checkout.paymentMethod')}</h2>
            </div>
            <div className="space-y-2.5 p-4">
              {paymentOptions.map((option) => {
                const checked = formData.paymentMethod === option.id
                const Icon = option.icon
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition ${
                      checked ? 'border-brand bg-brand-light/50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.id}
                      checked={checked}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 accent-brand"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-[13px] font-bold text-ink">
                        {Icon ? (
                          <Icon size={16} className="text-brand" />
                        ) : (
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${option.accent}`}>
                            {option.label}
                          </span>
                        )}
                        {Icon ? option.label : tx('Pay with mobile wallet', 'মোবাইল ওয়ালেটে পেমেন্ট')}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-ink-muted">{option.note}</span>
                    </span>
                  </label>
                )
              })}

              {formData.paymentMethod !== 'cod' && (
                <div className="rounded-md border border-gray-200 bg-cream/60 p-3">
                  <p className="text-[12px] text-ink-muted">{t('checkout.mobileNote')}</p>
                  <div className="mt-2 rounded border border-gray-200 bg-white px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400">
                      {tx('Merchant number', 'মার্চেন্ট নম্বর')}
                    </p>
                    <p className="text-base font-bold text-ink">01700 000000</p>
                  </div>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="senderNumber" className="label text-xs">
                        {t('checkout.senderNumber')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="senderNumber"
                        name="senderNumber"
                        type="tel"
                        value={paymentDetails.senderNumber}
                        onChange={(e) => setPaymentDetails((prev) => ({ ...prev, senderNumber: e.target.value }))}
                        className="input py-2 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="transactionId" className="label text-xs">
                        {t('checkout.transactionId')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="transactionId"
                        name="transactionId"
                        value={paymentDetails.transactionId}
                        onChange={(e) => setPaymentDetails((prev) => ({ ...prev, transactionId: e.target.value }))}
                        className="input py-2 text-xs"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <p className="flex items-start gap-2 rounded-md bg-green-50 px-3 py-2 text-[11px] text-green-700">
                <ShieldCheck size={14} className="mt-0.5 shrink-0" />
                {tx(
                  'This is a demo store. No real payment is collected and no order is dispatched.',
                  'এটি একটি ডেমো স্টোর। প্রকৃত পেমেন্ট নেওয়া হয় না এবং অর্ডার পাঠানো হয় না।'
                )}
              </p>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside>
          <div className="card sticky top-[150px] overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 bg-cream/70 px-4 py-3">
              <h2 className="text-sm font-bold text-ink">{t('checkout.orderSummary')}</h2>
              <span className="text-[11px] text-ink-muted">{cartItems.length} {t('common.items')}</span>
            </div>

            <ul className="max-h-64 divide-y divide-gray-100 overflow-y-auto px-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex gap-2.5 py-2.5">
                  <img src={item.image} alt="" className="h-12 w-12 shrink-0 rounded object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-[12px] font-semibold text-ink">
                      {tx(item.name, item.name_bn)}
                    </p>
                    <p className="text-[10.5px] text-ink-muted">{item.unit}</p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <QtyStepper
                        value={item.quantity}
                        min={1}
                        max={item.stock || 99}
                        size="sm"
                        onChange={(qty) => updateQuantity(item.id, qty)}
                      />
                      <span className="text-[12px] font-bold text-ink">
                        {formatTaka(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="self-start p-1 text-gray-300 hover:text-red-500"
                    aria-label="Remove"
                  >
                    <X size={13} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 px-4 pt-3">
              {coupon ? (
                <div className="flex items-center justify-between gap-2 rounded-md border border-green-200 bg-green-50 px-2.5 py-1.5">
                  <p className="text-[11px] font-bold text-success">
                    <Tag size={11} className="mr-1 inline" />
                    {coupon.code} {t('common.applied')}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      removeCoupon()
                      setCouponMessage('')
                    }}
                    className="p-0.5 text-green-700 hover:text-red-500"
                    aria-label="Remove coupon"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleApplyCoupon(e)
                      }
                    }}
                    placeholder={t('cart.couponPlaceholder')}
                    className="input py-1.5 text-[11px] uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="btn-dark shrink-0 px-2.5 py-1.5 text-[11px]"
                  >
                    {t('common.apply')}
                  </button>
                </div>
              )}
              {couponMessage && (
                <p className={`mt-1 text-[10.5px] ${couponMessage.includes('applied') ? 'text-success' : 'text-red-500'}`}>
                  {couponMessage}
                </p>
              )}
            </div>

            <div className="space-y-2 px-4 py-3 text-[12.5px]">
              <div className="flex justify-between text-ink-muted">
                <span>{t('checkout.shipping')} — {t('cart.subtotal')}</span>
                <span className="font-semibold text-ink">{formatTaka(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>{tx('Coupon discount', 'কুপন ছাড়')}</span>
                  <span className="font-semibold">− {formatTaka(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-muted">
                <span>
                  {t('cart.deliveryCharge')}
                  <span className="ml-1 text-[10px] text-gray-400">
                    ({formData.district === 'Dhaka' ? t('checkout.deliveryInside') : formData.district ? t('checkout.deliveryOutside') : '—'})
                  </span>
                </span>
                <span className="font-semibold text-ink">
                  {deliveryCharge === 0 ? t('checkout.free') : formatTaka(deliveryCharge)}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-gray-100 pt-2.5">
                <span className="text-sm font-bold text-ink">{t('cart.total')}</span>
                <span className="text-lg font-extrabold text-brand">{formatTaka(total)}</span>
              </div>
            </div>

            <div className="px-4 pb-4">
              <button type="submit" disabled={placing} className="btn-primary w-full py-3">
                {placing ? (
                  <>
                    <Spinner /> {t('checkout.processing')}
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    {t('checkout.placeOrder')}
                  </>
                )}
              </button>
              <p className="mt-2 text-center text-[10.5px] leading-4 text-ink-muted">{t('checkout.termsNote')}</p>
              <Link
                to="/cart"
                className="mt-2 inline-flex w-full items-center justify-center gap-1 text-[11px] font-semibold text-brand hover:underline"
              >
                <ArrowLeft size={12} />
                {t('checkout.backToCart')}
              </Link>
            </div>
          </div>
        </aside>
      </form>
    </div>
  )
}

export default Checkout
