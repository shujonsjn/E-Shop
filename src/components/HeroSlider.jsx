import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

const HeroSlider = () => {
  const { settings } = useSettings()
  const heroSlides = settings.siteContent?.heroSlides || []
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || heroSlides.length <= 1) return undefined
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroSlides.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [paused, heroSlides.length])

  const go = (direction) => {
    setIndex((prev) => (prev + direction + heroSlides.length) % heroSlides.length)
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
            to={slide.href}
            className={`absolute inset-0 transition-opacity duration-700 ${
              slideIndex === index ? 'z-10 opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={slideIndex !== index}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="h-full w-full object-cover"
              loading={slideIndex === 0 ? 'eager' : 'lazy'}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                  Featured
                </p>
                <p className="mt-1 truncate text-base font-bold text-white drop-shadow sm:text-xl">
                  {slide.alt}
                </p>
              </div>
              <span className="hidden shrink-0 rounded-full bg-white px-4 py-2 text-xs font-bold text-ink shadow-sm sm:inline-flex">
                Shop now
              </span>
            </div>
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={() => go(-1)}
        className="absolute left-2 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink opacity-0 shadow transition hover:bg-white group-hover:opacity-100 sm:left-3 sm:h-9 sm:w-9"
        aria-label="Previous slide"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        className="absolute right-2 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink opacity-0 shadow transition hover:bg-white group-hover:opacity-100 sm:right-3 sm:h-9 sm:w-9"
        aria-label="Next slide"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
        {heroSlides.map((slide, slideIndex) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setIndex(slideIndex)}
            className={`h-1.5 rounded-full transition-all ${
              slideIndex === index ? 'w-6 bg-brand' : 'w-1.5 bg-white/80 hover:bg-white'
            }`}
            aria-label={`Go to slide ${slideIndex + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider
