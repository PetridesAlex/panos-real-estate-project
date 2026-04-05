import { useEffect, useId, useState } from 'react'
import { Phone, X, Mail } from 'lucide-react'
import {
  WHATSAPP_CHAT_URL,
  TELEGRAM_CHAT_URL,
  CONTACT_MAILTO_HREF,
  CONTACT_EMAIL,
} from '../../config/externalLinks'
import { WhatsAppBrandIcon, TelegramBrandIcon } from '../Navbar/SocialBrandIcons'
import './QuickContactFab.css'

const channels = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    hint: 'Message us',
    href: WHATSAPP_CHAT_URL,
    external: true,
    Icon: WhatsAppBrandIcon,
    className: 'quick-contact-fab__link--whatsapp',
  },
  {
    key: 'telegram',
    label: 'Telegram',
    hint: 'Chat on Telegram',
    href: TELEGRAM_CHAT_URL,
    external: true,
    Icon: TelegramBrandIcon,
    className: 'quick-contact-fab__link--telegram',
  },
  {
    key: 'email',
    label: 'Email',
    hint: CONTACT_EMAIL,
    href: CONTACT_MAILTO_HREF,
    external: false,
    Icon: null,
    className: 'quick-contact-fab__link--email',
  },
]

export default function QuickContactFab() {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {open ? (
        <div
          className="quick-contact-fab__backdrop"
          role="presentation"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="quick-contact-fab">
        <div
          id={panelId}
          className={`quick-contact-fab__panel ${open ? 'quick-contact-fab__panel--open' : ''}`}
          role="dialog"
          aria-modal={open}
          aria-label="Contact channels"
          aria-hidden={!open}
          inert={!open}
        >
          <p className="quick-contact-fab__headline">Get in touch</p>
          <p className="quick-contact-fab__sub">Choose a channel — we reply during business hours.</p>
          <ul className="quick-contact-fab__list">
            {channels.map(({ key, label, hint, href, external, Icon, className }) => (
              <li key={key}>
                <a
                  href={href}
                  className={`quick-contact-fab__link ${className}`}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  onClick={() => setOpen(false)}
                >
                  <span className="quick-contact-fab__link-icon" aria-hidden>
                    {Icon ? <Icon size={22} /> : <Mail size={22} strokeWidth={1.75} />}
                  </span>
                  <span className="quick-contact-fab__link-text">
                    <span className="quick-contact-fab__link-label">{label}</span>
                    <span className="quick-contact-fab__link-hint">{hint}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          className={`quick-contact-fab__trigger ${open ? 'quick-contact-fab__trigger--open' : ''}`}
          aria-expanded={open}
          aria-controls={panelId}
          aria-haspopup="dialog"
          aria-label={
            open
              ? 'Close booking menu'
              : 'Book a call — WhatsApp, Telegram, or email'
          }
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X size={26} strokeWidth={2} aria-hidden />
          ) : (
            <Phone size={26} strokeWidth={1.75} aria-hidden />
          )}
          <span className="quick-contact-fab__trigger-label">Book a call</span>
        </button>
      </div>
    </>
  )
}
