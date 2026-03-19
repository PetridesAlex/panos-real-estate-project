import './InquiryForm.css'

function InquiryForm({ className = '' }) {
  return (
    <form
      className={`inquiry-form card-luxury ${className}`.trim()}
      onSubmit={(event) => event.preventDefault()}
      aria-label="Property inquiry form"
    >
      <h3>Request a Private Consultation</h3>
      <div className="inquiry-form__grid">
        <label>
          Full Name
          <input type="text" name="fullName" required />
        </label>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Phone
          <input type="tel" name="phone" required />
        </label>
        <label>
          Subject
          <input type="text" name="subject" required />
        </label>
        <label>
          Interested Property (optional)
          <input type="text" name="property" />
        </label>
        <label>
          Preferred Contact Method
          <select name="preferredContact">
            <option>Email</option>
            <option>Phone</option>
            <option>WhatsApp</option>
          </select>
        </label>
      </div>
      <label>
        Message
        <textarea name="message" rows="5" required />
      </label>
      <button type="submit" className="btn btn-gold">
        Send Inquiry
      </button>
    </form>
  )
}

export default InquiryForm
