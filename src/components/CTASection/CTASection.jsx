import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import './CTASection.css'

function CTASection({
  title = 'Ready to Find Your Ideal Property in Cyprus?',
  description = 'Connect with our advisors for a tailored strategy across premium Cyprus locations.',
}) {
  return (
    <section className="cta-section section">
      <div className="container">
        <div className="cta-section__panel">
          <h2>{title}</h2>
          <p>{description}</p>
          <div className="cta-section__actions">
            <Link to="/properties" className="btn btn-gold">
              View Listings
            </Link>
            <Link to="/contact" className="btn btn-outline-light">
              Contact Our Team
            </Link>
            <a
              href="https://wa.me/35700000000"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-light"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
