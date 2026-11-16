import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { useLanguage } from '../i18n/LanguageContext'
import { isDemoAsset } from '../utils/media'

const HeroSlider = () => {
  const { settings } = useSettings()
  const { t, tx } = useLanguage()
  const heroSlides = (settings.siteContent?.heroSlides || []).filter(
    (slide) => slide?.image && !isDemoAsset(slide.image)
  )
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || heroSlides.length <= 1) return undefined
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroSlides.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [paused, heroSlides.length])

  // A deleted slide must not leave the index out of range.
  const activeIndex = heroSlides.length ? index % heroSlides.length : 0

  const go = (direction) => {
    setIndex((prev) => (prev + direction + heroSlides.length) % heroSlides.length)
  }

  // No uploaded slides: show the shop's own identity instead of three empty
  // "Featured / Shop now" placeholders.
  if (heroSlides.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-ink via-[#2b3442] to-brand/80">
        <div className="flex aspect-[2.1/1] w-full flex-col items-start justify-center gap-3 p-6 sm:aspect-[2.5/1] sm:p-10">
          {settings.siteLogo ? (
            <span className="inline-flex items-center rounded-lg bg-white px-3 py-2 shadow-sm">
              <img
                src={settings.siteLogo}
                alt={settings.siteName}
                className="h-8 w-auto max-w-[180px] object-contain"
              />
            </span>
          ) : (
            <p className="text-2xl font-extrabold text-white sm:text-3xl">{settings.siteName}</p>
          )}
          <p className="max-w-md text-sm font-medium leading-6 text-white/75 sm:text-base">
            {tx(
              settings.siteTagline || 'Thoughtful gifts, delivered to your door',
              settings.siteTagline_bn || 'যত্নে বাছাই করা উপহার, আপনার দরজায়'
            )}
          </p>
          <Link to="/shop" className="btn-primary mt-1">
            <ShoppingBag size={16} />
            {t('home.heroCta')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-cream"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[2.1/1] w-full sm:aspect-[2.5/1]">
        {heroSlides.map((slide, slideIndex) => (
          <Link
            key={slide.id}
            to={slide.href || '/shop'}
            className={`absolute inset-0 transition-opacity duration-700 ${
              slideIndex === activeIndex ? 'z-10 opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={slideIndex !== activeIndex}
            tabIndex={slideIndex === activeIndex ? 0 : -1}
          >
            <img
              src={slide.image}
              alt={slide.alt || settings.siteName}
              className="h-full w-full object-cover"
              loading={slideIndex === 0 ? 'eager' : 'lazy'}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
            {slide.alt && (
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                    {tx('Featured', 'নির্বাচিত')}
                  </p>
                  <p className="mt-1 truncate text-base font-bold text-white drop-shadow sm:text-xl">
                    {slide.alt}
                  </p>
                </div>
                <span className="hidden shrink-0 rounded-full bg-white px-4 py-2 text-xs font-bold text-ink shadow-sm sm:inline-flex">
                  {tx('Shop now', 'এখনই কিনুন')}
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {heroSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink opacity-0 shadow transition hover:bg-white group-hover:opacity-100 sm:left-3 sm:h-9 sm:w-9"
            aria-label={tx('Previous slide', 'আগের স্লাইড')}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink opacity-0 shadow transition hover:bg-white group-hover:opacity-100 sm:right-3 sm:h-9 sm:w-9"
            aria-label={tx('Next slide', 'পরের স্লাইড')}
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-1.5 left-1/2 z-20 flex -translate-x-1/2 items-center">
            {heroSlides.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(slideIndex)}
                className="grid h-6 w-6 place-items-center"
                aria-label={tx(`Go to slide ${slideIndex + 1}`, `স্লাইড ${slideIndex + 1}-এ যান`)}
                aria-current={slideIndex === activeIndex}
              >
                <span
                  className={`block h-1.5 rounded-full transition-all ${
                    slideIndex === activeIndex ? 'w-6 bg-brand' : 'w-1.5 bg-white/80 hover:bg-white'
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default HeroSlider
