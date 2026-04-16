import { Quote } from 'lucide-react'
import './TestimonialCard.css'

function initialsFromName(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function TestimonialCard({ testimonial }) {
  const avatarUrl = typeof testimonial.avatarUrl === 'string' ? testimonial.avatarUrl.trim() : ''

  return (
    <article className="testimonial-card card-luxury">
      <Quote size={22} />
      <p className="testimonial-card__quote">"{testimonial.quote}"</p>
      <div className="testimonial-card__author-row">
        <div className="testimonial-card__avatar-wrap">
          {avatarUrl ? (
            <img
              className="testimonial-card__avatar testimonial-card__avatar--photo"
              src={avatarUrl}
              alt=""
              width={48}
              height={48}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="testimonial-card__avatar testimonial-card__avatar--initials">
              {initialsFromName(testimonial.name)}
            </span>
          )}
        </div>
        <p className="testimonial-card__author">
          <span className="testimonial-card__author-name">{testimonial.name}</span>{' '}
          <span className="testimonial-card__author-location">{testimonial.location}</span>
        </p>
      </div>
    </article>
  )
}

export default TestimonialCard
