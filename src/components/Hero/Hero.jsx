import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, MapPin, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { properties } from '../../data/properties'
import { developments } from '../../data/developments'
import './Hero.css'

function Hero() {
  const sectionRef = useRef(null)
  const overlaySearchInputRef = useRef(null)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const featuredProperty = useMemo(
    () => properties.find((property) => property.featured) || properties[0],
    [],
  )
  const featuredDevelopment = useMemo(() => developments[0], [])
  const featuredDevelopmentLink = useMemo(() => {
    const name = featuredDevelopment?.name || ''
    return `/developments?project=${encodeURIComponent(name)}`
  }, [featuredDevelopment])
  const filteredListings = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()
    if (!normalizedTerm) return properties.slice(0, 5)
    return properties
      .filter((property) =>
        [property.title, property.location, property.description, property.type]
          .join(' ')
          .toLowerCase()
          .includes(normalizedTerm),
      )
      .slice(0, 5)
  }, [searchTerm])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) return undefined

    const section = sectionRef.current
    if (!section) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShouldLoadVideo(true)
        observer.disconnect()
      },
      { threshold: 0.12, rootMargin: '200px 0px' },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isSearchOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsSearchOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isSearchOpen])

  useEffect(() => {
    if (!isSearchOpen) return
    overlaySearchInputRef.current?.focus()
  }, [isSearchOpen])

  return (
    <>
      <section className="hero-section" ref={sectionRef}>
        <div
          className="hero-section__media"
          aria-hidden="true"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=2000&q=80")',
          }}
        >
          <video
            className="hero-section__video"
            src={shouldLoadVideo ? '/video/cyprus-luxury-real-estate-hero.mp4.mp4' : undefined}
            autoPlay={shouldLoadVideo}
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            poster="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=2000&q=80"
          />
        </div>
        <div className="hero-section__overlay" />
        <div className="container hero-section__inner">
          <motion.div
            className="hero-section__trigger"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            role="button"
            tabIndex={0}
            onClick={() => setIsSearchOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setIsSearchOpen(true)
              }
            }}
            aria-label="Open property search panel"
          >
            <button
              type="button"
              className="hero-section__trigger-input"
              aria-label="Open search panel"
              onClick={() => setIsSearchOpen(true)}
            >
              <span>Search properties, locations, agents...</span>
              <span className="hero-section__trigger-map-icon" aria-hidden="true">
                <MapPin size={14} />
              </span>
            </button>
            <button
              type="button"
              className="hero-section__trigger-location"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search by location"
            >
              <Search size={16} />
            </button>
          </motion.div>
        </div>

        <a className="hero-section__indicator" href="#featured-properties" aria-label="Scroll">
          <ChevronDown size={22} />
        </a>
      </section>

      {isSearchOpen && (
        <div className="hero-search-overlay" role="dialog" aria-modal="true" onClick={() => setIsSearchOpen(false)}>
          <section className="hero-search-overlay__panel" onClick={(event) => event.stopPropagation()}>
            <button
              className="hero-search-overlay__close"
              type="button"
              aria-label="Close search panel"
              onClick={() => setIsSearchOpen(false)}
            >
              <X size={18} />
            </button>
            <h2>Search</h2>
            <div className="hero-search-overlay__input-wrap">
              <Search size={18} />
              <input
                ref={overlaySearchInputRef}
                type="text"
                placeholder="Type to search properties, locations, agents..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="hero-search-overlay__grid">
              <Link
                className="hero-search-card hero-search-card--link"
                to={`/properties/${featuredProperty.slug}`}
                onClick={() => setIsSearchOpen(false)}
                aria-label={`Open ${featuredProperty.title}`}
              >
                <p className="hero-search-card__label">Featured Property</p>
                <img src={featuredProperty.image} alt={featuredProperty.title} />
                <h3>{featuredProperty.title}</h3>
                <p>{featuredProperty.location}</p>
                <strong>EUR {featuredProperty.price.toLocaleString()}</strong>
              </Link>

              <Link
                className="hero-search-card hero-search-card--link"
                to={featuredDevelopmentLink}
                onClick={() => setIsSearchOpen(false)}
                aria-label={`Open developments for ${featuredDevelopment.name}`}
              >
                <p className="hero-search-card__label">New Developments</p>
                <img src={featuredDevelopment.image} alt={featuredDevelopment.name} />
                <h3>{featuredDevelopment.name}</h3>
                <p>{featuredDevelopment.area}</p>
              </Link>

              <aside className="hero-search-list">
                <h3>Signature Listings</h3>
                <ul>
                  {filteredListings.map((property) => (
                    <li key={property.id}>
                      <Link
                        to={`/properties/${property.slug}`}
                        className="hero-search-list__item-link"
                        onClick={() => setIsSearchOpen(false)}
                        aria-label={`Open ${property.title}`}
                      >
                        <img src={property.image} alt={property.title} />
                        <div>
                          <strong>EUR {property.price.toLocaleString()}</strong>
                          <p>{property.title}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default Hero
