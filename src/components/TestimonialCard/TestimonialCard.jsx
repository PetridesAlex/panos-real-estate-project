import { Quote } from 'lucide-react'
import './TestimonialCard.css'

function TestimonialCard({ testimonial }) {
  return (
    <article className="testimonial-card card-luxury">
      <Quote size={22} />
      <p className="testimonial-card__quote">"{testimonial.quote}"</p>
      <p className="testimonial-card__author">
        {testimonial.name} <span>{testimonial.location}</span>
      </p>
    </article>
  )
}

export default TestimonialCard
