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

  return (
    <motion.article
      className={`property-card ${isSignature ? 'property-card--signature' : 'card-luxury'} ${
        isCover ? 'property-card--cover' : ''
      }`.trim()}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <div className="property-card__media">
        <img src={property.image} alt={`${property.title} in ${property.location}`} />
        <motion.span
          className={`property-card__badge property-card__badge--${badgeVariant}${
            isCover ? ' property-card__badge--on-cover' : ''
          }`}
          data-listing={badgeVariant}
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          whileHover={reduceMotion ? undefined : { scale: 1.03 }}
        >
          <span className="property-card__badge-main">{property.status}</span>
          {property.type ? (
            <>
              <span className="property-card__badge-sep" aria-hidden="true" />
              <span className="property-card__badge-type">{property.type}</span>
            </>
          ) : null}
        </motion.span>
        {isSignature && <span className="property-card__signature">United Properties. Signature</span>}
        {isCover && (
          <>
            <div className="property-card__cover-bottom">
              <p className="property-card__cover-price">{formatPrice(property.price, property.status)}</p>
              <div className="property-card__cover-extra" role="group" aria-label="Listing summary">
                <p className="property-card__cover-line">
                  <span className="property-card__cover-label">Address</span>
                  <span className="property-card__cover-value">{streetAddress}</span>
                </p>
                <p className="property-card__cover-line">
                  <span className="property-card__cover-label">Area</span>
                  <span className="property-card__cover-value">{property.location}</span>
                </p>
                <p className="property-card__cover-line property-card__cover-line--compact">
                  <span className="property-card__cover-label">Size</span>
                  <span className="property-card__cover-value">{property.sqm} sqm</span>
                </p>
              </div>
            </div>
            <Link
              className="property-card__cover-link"
              to={`/properties/${property.slug}`}
              aria-label={`View ${property.title} details`}
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
