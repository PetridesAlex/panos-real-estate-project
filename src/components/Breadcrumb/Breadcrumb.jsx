import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import './Breadcrumb.css'

function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={item.label} className="breadcrumb__item">
            {item.to && !isLast ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
            {!isLast && <ChevronRight size={15} />}
          </span>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
