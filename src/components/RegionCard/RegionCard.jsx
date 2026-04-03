import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import './RegionCard.css'

function RegionCard({ region }) {
  return (
    <motion.article className="region-card">
      <img src={region.image} alt={`${region.name} properties`} />
      <div className="region-card__overlay" />
      <div className="region-card__content">
        <p>{region.propertiesCount} properties</p>
        <h3>{region.name}</h3>
        <span>
          Explore <ArrowUpRight size={16} />
        </span>
      </div>
    </motion.article>
  )
}

export default RegionCard
