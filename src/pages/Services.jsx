import { Helmet } from 'react-helmet-async'
import { Navigate, useLocation } from 'react-router-dom'
import InvestWithUsSection from '../components/InvestWithUsSection/InvestWithUsSection'
import CTASection from '../components/CTASection/CTASection'
import './Services.css'

function Services() {
  const location = useLocation()

  if (location.pathname === '/services' && location.hash === '#sell-with-us') {
    return <Navigate to="/sell-with-us" replace />
  }

  const investDeepLink = location.hash === '#invest-with-us'

  return (
    <>
      <Helmet>
        <title>Services | United Properties</title>
      </Helmet>

      <section className={`page-hero${investDeepLink ? ' page-hero--services-invest' : ''}`}>
        <div className="container">
          {investDeepLink ? (
            <div className="services-invest-hero">
              <p className="services-invest-hero__eyebrow">United Services</p>
              <h1 className="services-invest-hero__title">Invest with us</h1>
              <p className="services-invest-hero__lead">
                Real plots, clear concepts and accountable numbers—coordinated with our legal, design and construction
                partners from day one, not off-the-shelf products.
              </p>
            </div>
          ) : (
            <>
              <p>Services</p>
              <h1>Premium Real Estate Services</h1>
              <p>
                Comprehensive support for sales, rentals, investment, management, and international relocation in
                Cyprus.
              </p>
            </>
          )}
        </div>
      </section>

      <InvestWithUsSection />

      <CTASection title="Discuss Your Property Goals With Our Advisory Team" />
    </>
  )
}

export default Services
