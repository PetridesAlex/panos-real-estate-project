import './StatsStrip.css'

function StatsStrip() {
  const items = [
    'Luxury Homes',
    'Prime Cyprus Locations',
    'International Buyer Support',
    'Trusted Advisory',
  ]
  const metrics = ['1,200+ Properties Sold', '18 Years Experience', '96% Client Referrals']

  return (
    <section className="stats-strip">
      <div className="container">
        <div className="stats-strip__content">
          <ul>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="stats-strip__metrics">
            {metrics.map((metric) => (
              <span key={metric}>{metric}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsStrip
