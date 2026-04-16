import {
  WhatsAppBrandIcon,
  LinkedInBrandIcon,
  EmailBrandIcon,
} from '../Navbar/SocialBrandIcons'
import './AgentCard.css'

function AgentCard({ agent }) {
  const normalizedPhone = String(agent.phone || '').replace(/[^\d+]/g, '')
  const whatsappDigits = normalizedPhone.replace(/[^\d]/g, '')
  const contactHref = whatsappDigits ? `https://wa.me/${whatsappDigits}` : `tel:${normalizedPhone}`

  return (
    <article className="agent-card card-luxury">
      <img src={agent.image} alt={agent.name} />
      <div className="agent-card__content">
        <p className="agent-card__role">{agent.role}</p>
        <h3>{agent.name}</h3>
        <p className="agent-card__specialization">{agent.specialization}</p>
        <p className="agent-card__bio">{agent.bio}</p>
        <div className="agent-card__socials" aria-label="Agent social contacts">
          <a
            href={contactHref}
            target="_blank"
            rel="noreferrer"
            className="agent-card__social agent-card__social--whatsapp"
            aria-label={`Contact ${agent.name} on WhatsApp`}
            title="Contact on WhatsApp"
          >
            <WhatsAppBrandIcon size={16} aria-hidden />
          </a>
          <a
            href={agent.linkedin || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(agent.name)}`}
            target="_blank"
            rel="noreferrer"
            className="agent-card__social agent-card__social--linkedin"
            aria-label={`${agent.name} on LinkedIn`}
            title="LinkedIn"
          >
            <LinkedInBrandIcon size={16} aria-hidden />
          </a>
          <a
            href={`mailto:${agent.email}`}
            className="agent-card__social agent-card__social--email"
            aria-label={`Email ${agent.name}`}
            title="Email"
          >
            <EmailBrandIcon size={16} aria-hidden />
          </a>
        </div>
      </div>
    </article>
  )
}

export default AgentCard
