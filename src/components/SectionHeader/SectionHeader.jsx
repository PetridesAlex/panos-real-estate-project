import { motion } from 'framer-motion'
import './SectionHeader.css'

function SectionHeader({ eyebrow, title, description, center = false }) {
  return (
    <motion.header
      className={`section-header ${center ? 'section-header--center' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
    >
      {eyebrow && <p className="section-header__eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p className="section-header__description">{description}</p>}
    </motion.header>
  )
}

export default SectionHeader
