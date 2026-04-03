import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import {
  BedDouble,
  Bath,
  Ruler,
  Car,
  CalendarClock,
  LandPlot,
  MessageCircle,
  MapPin,
  ChevronRight,
  LayoutTemplate,
  Map,
  Sparkles,
} from 'lucide-react'
import Gallery from '../components/Gallery/Gallery'
import InquiryForm from '../components/InquiryForm/InquiryForm'
import SectionHeader from '../components/SectionHeader/SectionHeader'
import PropertyCard from '../components/PropertyCard/PropertyCard'
import { agents } from '../data/agents'
import { useMergedProperties } from '../hooks/useMergedProperties'
import './PropertyDetails.css'

const DESCRIPTION_PREVIEW_CHARS = 280

function PropertyDetails() {
  const { slug } = useParams()
  const { list: allProperties, loading } = useMergedProperties()
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)

  const property = useMemo(
    () => allProperties.find((item) => item.slug === slug),
    [allProperties, slug],
  )

  const agent = property ? agents.find((item) => item.id === property.agentId) : null

  const similarProperties = useMemo(() => {
    if (!property) return []
    return allProperties
      .filter((item) => item.id !== property.id && item.location === property.location)
      .slice(0, 3)
  }, [allProperties, property])

  if (!property) {
    if (loading) {
      return (
        <>
          <Helmet>
            <title>Loading… | United Properties</title>
          </Helmet>
          <section className="section section--light">
            <div className="container">
              <p className="property-details__loading">Loading property…</p>
            </div>
          </section>
        </>
      )
    }

    return (
      <>
        <Helmet>
          <title>Property not found | United Properties</title>
        </Helmet>
        <section className="section section--light">
          <div className="container property-details property-details--not-found">
            <h1>Property not found</h1>
            <p>This listing may have been removed or the link is incorrect.</p>
            <Link to="/buy" className="btn btn-gold">
              Browse properties
            </Link>
          </div>
        </section>
      </>
    )
  }

  const featureList = Array.isArray(property.features) ? property.features : []

  return (
    <>
      <Helmet>
        <title>{property.title} | United Properties</title>
      </Helmet>

      <section className="page-hero page-hero--property">
        <div className="container">
          <h1 className="property-details__hero-title">{property.title}</h1>
          <p className="property-details__hero-location">
            <MapPin size={16} /> {property.location}
          </p>
        </div>
      </section>

      <section className="section section--light">
        <div className="container property-details">
          <Gallery images={property.gallery} title={property.title} />

          <div className="property-details__head">
            <div>
              <p className="property-details__status">{property.status}</p>
              <h2
                className="property-details__price"
                aria-label={`Price EUR ${property.price.toLocaleString()}${
                  property.status === 'For Rent' ? ' per month' : ''
                }`}
              >
                <span className="property-details__price-inner">
                  <span className="property-details__price-currency">EUR</span>
                  <span className="property-details__price-figure">
                    {property.price.toLocaleString()}
                  </span>
                  {property.status === 'For Rent' ? (
                    <span className="property-details__price-period">/ month</span>
                  ) : null}
                </span>
              </h2>
              <p className="property-details__summary">{property.description}</p>
            </div>
            <a
              className="btn btn-gold property-details__whatsapp"
              href="https://wa.me/35700000000"
              target="_blank"
              rel="noreferrer"
            >
              <span className="property-details__whatsapp-iconWrap" aria-hidden="true">
                <MessageCircle size={18} strokeWidth={2.25} />
              </span>
              <span className="property-details__whatsapp-text">
                <span className="property-details__whatsapp-title">Chat on WhatsApp</span>
                <span className="property-details__whatsapp-sub">Fast reply · same day</span>
              </span>
              <ChevronRight className="property-details__whatsapp-chevron" size={20} strokeWidth={2.25} aria-hidden />
            </a>
          </div>

          <div className="property-details__overview">
            <span className="property-details__stat">
              <BedDouble size={16} /> {property.bedrooms} Bedrooms
            </span>
            <span className="property-details__stat property-details__stat--bath">
              <Bath size={16} /> {property.bathrooms} Bathrooms
            </span>
            <span className="property-details__stat">
              <Ruler size={16} /> {property.sqm} sqm internal area
            </span>
            <span className="property-details__stat">
              <LandPlot size={16} /> {property.plotSize || 'N/A'} sqm plot size
            </span>
            <span className="property-details__stat">
              <Car size={16} /> {property.parking} Parking
            </span>
            <span className="property-details__stat">
              <CalendarClock size={16} /> Built in {property.yearBuilt}
            </span>
          </div>

          <div className="property-details__content-grid">
            <article className="property-details__description" aria-labelledby="property-description-title">
              <header className="property-details__description-header">
                <span className="property-details__description-eyebrow">
                  <Sparkles size={14} strokeWidth={2.2} aria-hidden />
                  Listing
                </span>
                <h3 id="property-description-title" className="property-details__description-title">
                  Description
                </h3>
              </header>

              <div
                id="property-description-body"
                className={`property-details__description-body ${descriptionExpanded ? 'is-expanded' : ''}`}
              >
                <p>{property.description}</p>
              </div>
              {property.description.length > DESCRIPTION_PREVIEW_CHARS ? (
                <button
                  type="button"
                  className="property-details__readmore"
                  onClick={() => setDescriptionExpanded((open) => !open)}
                  aria-expanded={descriptionExpanded}
                  aria-controls="property-description-body"
                >
                  {descriptionExpanded ? 'Show less' : 'Read full description'}
                </button>
              ) : null}

              {featureList.length > 0 ? (
                <section
                  className="property-details__amenities-section"
                  aria-labelledby="amenities-heading"
                >
                  <h4 id="amenities-heading">Amenities &amp; features</h4>
                  <ul className="property-details__amenities-list">
                    {featureList.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <div className="property-details__info-tiles">
                <div
                  className="property-details__info-tile"
                  role="group"
                  aria-label="Floor plan — available on request"
                >
                  <span className="property-details__info-tile-icon" aria-hidden="true">
                    <LayoutTemplate size={22} strokeWidth={2} />
                  </span>
                  <div className="property-details__info-tile-copy">
                    <h4>Floor plan</h4>
                    <p>Detailed layout available on request from our team.</p>
                  </div>
                  <span className="property-details__info-tile-hint">Request</span>
                </div>
                <div
                  className="property-details__info-tile"
                  role="group"
                  aria-label="Location map — coming soon"
                >
                  <span className="property-details__info-tile-icon" aria-hidden="true">
                    <Map size={22} strokeWidth={2} />
                  </span>
                  <div className="property-details__info-tile-copy">
                    <h4>Location</h4>
                    <p>Map and neighbourhood context — integration in progress.</p>
                  </div>
                  <span className="property-details__info-tile-hint">Soon</span>
                </div>
              </div>
            </article>

            <aside className="property-details__sidebar">
              {agent && (
                <article className="card-luxury property-details__agent">
                  <img src={agent.image} alt={agent.name} />
                  <h4>{agent.name}</h4>
                  <p>{agent.role}</p>
                  <Link to="/agents" className="btn btn-outline-dark">
                    View Agent Profile
                  </Link>
                </article>
              )}
              <InquiryForm />
            </aside>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeader title="Similar Properties" />
          <div className="grid-3">
            {similarProperties.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))}
          </div>
        </div>
      </section>

      <div className="property-details__mobile-cta">
        <a className="btn btn-gold" href="https://wa.me/35700000000" target="_blank" rel="noreferrer">
          <MessageCircle size={16} /> WhatsApp
        </a>
        <Link className="btn btn-outline-dark" to="/contact">
          Contact Team
        </Link>
      </div>
    </>
  )
}

export default PropertyDetails
