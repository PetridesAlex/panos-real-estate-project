import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BedDouble, Bath, Ruler, MapPin } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import './PropertyCard.css'

function formatPrice(value, status) {
  const formatter = new Intl.NumberFormat('en-US')
  return status === 'For Rent'
    ? `EUR ${formatter.format(value)} / month`
    : `EUR ${formatter.format(value)}`
}

function badgeVariantFromStatus(status) {
  const s = (status || '').toLowerCase()
  if (s.includes('rent')) return 'rent'
  if (s.includes('sold')) return 'sold'
  if (s.includes('reserved')) return 'reserved'
  if (s.includes('sale')) return 'sale'
  return 'sale'
}

function PropertyCard({
  property,
  variant = 'default',
  showDescription = true,
  showButton = true,
}) {
  const isSignature = variant === 'signature'
  const isCover = variant === 'cover'
  const badgeVariant = badgeVariantFromStatus(property.status)
  const reduceMotion = useReducedMotion()
  const streetAddress = property.address || property.title
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isCoverRevealed, setIsCoverRevealed] = useState(false)

  useEffect(() => {
    if (!isCover || typeof window === 'undefined') return undefined

    const media = window.matchMedia('(hover: none), (pointer: coarse)')
    const onChange = () => setIsTouchDevice(media.matches)
    onChange()

    if (media.addEventListener) {
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    }

    media.addListener(onChange)
    return () => media.removeListener(onChange)
  }, [isCover])

  useEffect(() => {
    if (!isCoverRevealed || !isTouchDevice) return undefined
    const timeoutId = window.setTimeout(() => setIsCoverRevealed(false), 3500)
    return () => window.clearTimeout(timeoutId)
  }, [isCoverRevealed, isTouchDevice])

  function onCoverLinkClick(event) {
    if (!isCover || !isTouchDevice) return
    if (!isCoverRevealed) {
      event.preventDefault()
      setIsCoverRevealed(true)
    }
  }

  return (
    <motion.article
      className={`property-card ${isSignature ? 'property-card--signature' : 'card-luxury'} ${
        isCover ? 'property-card--cover' : ''
      } ${isCoverRevealed ? 'is-revealed' : ''}`.trim()}
      onMouseLeave={() => {
        if (isCoverRevealed) setIsCoverRevealed(false)
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <div className="property-card__media">
        <img src={property.image} alt={`${property.title} in ${property.location}`} />
        {!isCover && (
          <motion.span
            className={`property-card__badge property-card__badge--${badgeVariant}`}
            data-listing={badgeVariant}
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
          >
            <span className="property-card__badge-main">{property.status}</span>
            {property.type ? (
              <span className="property-card__badge-sub">{property.type}</span>
            ) : null}
          </motion.span>
        )}
        {isSignature && <span className="property-card__signature">United Properties. Signature</span>}
        {isCover && (
          <>
            <div className="property-card__cover-overlay">
              <p>
                <strong>Street Address:</strong> {streetAddress}
              </p>
              <p>
                <strong>Location Area:</strong> {property.location}
              </p>
              <p>
                <strong>sqm:</strong> {property.sqm}
              </p>
            </div>
            <Link
              className="property-card__cover-link"
              to={`/properties/${property.slug}`}
              aria-label={`View ${property.title} details`}
              onClick={onCoverLinkClick}
            />
          </>
        )}
      </div>
      {!isCover && (
        <div className="property-card__content">
          <p className="property-card__price">{formatPrice(property.price, property.status)}</p>
          <h3>{property.title}</h3>
          <p className="property-card__location">
            <MapPin size={15} /> {property.location}
          </p>
          {showDescription && <p className="property-card__description">{property.description}</p>}
          <div className="property-card__meta">
            <span>
              <BedDouble size={16} /> {property.bedrooms} Beds
            </span>
            <span>
              <Bath size={16} /> {property.bathrooms} Baths
            </span>
            <span>
              <Ruler size={16} /> {property.sqm} sqm
            </span>
          </div>
          {showButton && (
            <Link className="btn btn-outline-dark" to={`/properties/${property.slug}`}>
              View Details
            </Link>
          )}
        </div>
      )}
    </motion.article>
  )
}

export default PropertyCard
