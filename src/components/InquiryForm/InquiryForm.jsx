import { Clock, Lock, Send, Sparkles } from 'lucide-react'
import './InquiryForm.css'

function InquiryForm({ className = '' }) {
  return (
    <form
      className={`inquiry-form ${className}`.trim()}
      onSubmit={(event) => event.preventDefault()}
      aria-label="Property inquiry form"
    >
      <header className="inquiry-form__header">
        <span className="inquiry-form__eyebrow">
          <Sparkles size={15} strokeWidth={2.2} aria-hidden />
          Priority access
        </span>
        <h3 className="inquiry-form__title">Request a private consultation</h3>
        <p className="inquiry-form__lede">
          Share your details and a dedicated advisor will contact you — usually within one business day.
        </p>
        <ul className="inquiry-form__trust" aria-label="What to expect">
          <li>
            <Clock size={15} strokeWidth={2} aria-hidden />
            Fast reply
          </li>
          <li>
            <Lock size={15} strokeWidth={2} aria-hidden />
            Confidential
          </li>
        </ul>
      </header>

      <div className="inquiry-form__fields">
        <div className="inquiry-form__grid">
          <label className="inquiry-form__field">
            <span className="inquiry-form__label">Full name</span>
            <input type="text" name="fullName" autoComplete="name" required placeholder="Your name" />
          </label>
          <label className="inquiry-form__field">
            <span className="inquiry-form__label">Email</span>
            <input type="email" name="email" autoComplete="email" required placeholder="you@example.com" />
          </label>
          <label className="inquiry-form__field">
            <span className="inquiry-form__label">Phone</span>
            <input type="tel" name="phone" autoComplete="tel" required placeholder="+357 …" />
          </label>
          <label className="inquiry-form__field">
            <span className="inquiry-form__label">Subject</span>
            <input type="text" name="subject" required placeholder="e.g. Viewing, offer, questions" />
          </label>
          <label className="inquiry-form__field inquiry-form__field--full">
            <span className="inquiry-form__label">Interested property <span className="inquiry-form__optional">(optional)</span></span>
            <input type="text" name="property" placeholder="Address or reference" />
          </label>
          <label className="inquiry-form__field">
            <span className="inquiry-form__label">Preferred contact</span>
            <select name="preferredContact" defaultValue="Email">
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
          </label>
        </div>

        <label className="inquiry-form__field inquiry-form__field--full">
          <span className="inquiry-form__label">Message</span>
          <textarea
            name="message"
            rows={4}
            required
            placeholder="Tell us what you need — viewing times, budget, or questions about this listing."
          />
        </label>

        <button type="submit" className="inquiry-form__submit">
          <Send size={18} strokeWidth={2.25} aria-hidden />
          <span>Send inquiry</span>
        </button>
        <p className="inquiry-form__footnote">No spam. We only use your details to respond to this request.</p>
      </div>
    </form>
  )
}

export default InquiryForm
