import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero/Hero'
import StatsStrip from '../components/StatsStrip/StatsStrip'
import SectionHeader from '../components/SectionHeader/SectionHeader'
import PropertyCard from '../components/PropertyCard/PropertyCard'
import RegionCard from '../components/RegionCard/RegionCard'
import ServiceCard from '../components/ServiceCard/ServiceCard'
import AgentCard from '../components/AgentCard/AgentCard'
import TestimonialCard from '../components/TestimonialCard/TestimonialCard'
import CTASection from '../components/CTASection/CTASection'
import { properties } from '../data/properties'
import { regions } from '../data/regions'
import { services } from '../data/services'
import { agents } from '../data/agents'
import { developments } from '../data/developments'
import { testimonials } from '../data/testimonials'
import './Home.css'

function Home() {
  const featuredProperties = properties.filter((property) => property.featured).slice(0, 3)
  const featuredAgents = agents.slice(0, 3)
  const homeServices = services.slice(0, 8)

  return (
    <>
      <Helmet>
        <title>AURA CYPRUS | Luxury Real Estate in Cyprus</title>
      </Helmet>

      <Hero />
      <StatsStrip />

      <section className="section section--light" id="featured-properties">
        <div className="container">
          <SectionHeader
            eyebrow="Featured Portfolio"
            title="Signature Properties Across Cyprus"
            description="A handpicked portfolio of exceptional homes and investment opportunities in prime locations."
          />
          <div className="grid-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeader
            eyebrow="Explore by Location"
            title="Prime Cyprus Regions"
            description="Discover opportunities in coastal and city markets shaped by lifestyle and long-term value."
          />
          <div className="grid-3 home-region-grid">
            {regions.map((region) => (
              <RegionCard key={region.name} region={region} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <SectionHeader
            eyebrow="New Developments"
            title="Off-Plan and Next-Generation Residences"
            description="Position early in standout projects designed for lifestyle prestige and future capital growth."
          />
          <div className="home-dev-grid">
            {developments.map((development) => (
              <article key={development.id} className="home-dev-card">
                <img src={development.image} alt={development.name} />
                <div>
                  <p className="home-dev-card__status">{development.status}</p>
                  <h3>{development.name}</h3>
                  <p>{development.area}</p>
                  <p>{development.description}</p>
                  <Link to="/developments" className="btn btn-outline-light">
                    Inquire
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <SectionHeader
            eyebrow="Services"
            title="Comprehensive Advisory and Property Services"
            description="From acquisition strategy to relocation and portfolio management, every step is tailored."
          />
          <div className="grid-4">
            {homeServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container home-editorial">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <p className="home-editorial__eyebrow">Editorial Perspective</p>
            <h2>Coastal Living, Strategic Value, and Tailored Guidance</h2>
            <p>
              Cyprus offers a rare combination of Mediterranean lifestyle, long-term
              growth fundamentals, and global buyer accessibility. Our advisors blend
              market intelligence with private-client service to secure properties that
              align with your ambitions.
            </p>
          </motion.div>
          <img
            src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80"
            alt="Luxury Cyprus property lifestyle"
          />
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <SectionHeader
            eyebrow="Advisory Team"
            title="Experienced Professionals"
            description="Specialist consultants in prime residential, development, and cross-border transactions."
          />
          <div className="grid-3">
            {featuredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeader
            eyebrow="Client Testimonials"
            title="Trusted by Local and International Clients"
          />
          <div className="grid-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}

export default Home
