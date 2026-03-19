import { Phone, Mail } from 'lucide-react'
import './AgentCard.css'

function AgentCard({ agent }) {
  return (
    <article className="agent-card card-luxury">
      <img src={agent.image} alt={agent.name} />
      <div className="agent-card__content">
        <p className="agent-card__role">{agent.role}</p>
        <h3>{agent.name}</h3>
        <p className="agent-card__specialization">{agent.specialization}</p>
        <p className="agent-card__bio">{agent.bio}</p>
        <div className="agent-card__actions">
          <a href={`tel:${agent.phone}`} className="btn btn-outline-dark">
            <Phone size={15} /> Call
          </a>
          <a href={`mailto:${agent.email}`} className="btn btn-outline-dark">
            <Mail size={15} /> Email
          </a>
        </div>
      </div>
    </article>
  )
}

export default AgentCard
