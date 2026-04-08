import { Fragment } from 'react'
import {
  WHATSAPP_CHAT_URL,
  TELEGRAM_CHAT_URL,
  CONTACT_MAILTO_HREF,
  CONTACT_PHONE_TEL,
} from '../../config/externalLinks'
import { WhatsAppBrandIcon } from '../Navbar/SocialBrandIcons'
import './QuickContactFab.css'

function IconTelegram({ className = 'quick-contact-fab__dock-icon', size = 18 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M22 2L11 13"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L15 22l-4-9-9-4 20-7z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconEmail() {
  return (
    <svg
      className="quick-contact-fab__dock-icon quick-contact-fab__dock-icon--line"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 7l9 6 9-6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg
      className="quick-contact-fab__dock-icon quick-contact-fab__dock-icon--line"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.8.3 1.5.5 2.2a2 2 0 0 1-.5 2L8 9a16 16 0 0 0 7 7l1.1-1.1a2 2 0 0 1 2-.5c.7.2 1.4.4 2.2.5a2 2 0 0 1 1.7 2z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const DOCK_LINKS = [
  {
    key: 'whatsapp',
    href: WHATSAPP_CHAT_URL,
    external: true,
    ariaLabel: 'WhatsApp',
    Icon: WhatsAppBrandIcon,
    badge: 'whatsapp',
  },
  {
    key: 'telegram',
    href: TELEGRAM_CHAT_URL,
    external: true,
    ariaLabel: 'Telegram',
    Icon: IconTelegram,
    badge: 'telegram',
  },
  {
    key: 'email',
    href: CONTACT_MAILTO_HREF,
    external: false,
    ariaLabel: 'Email',
    Icon: IconEmail,
    badge: null,
  },
  {
    key: 'phone',
    href: CONTACT_PHONE_TEL,
    external: false,
    ariaLabel: 'Phone',
    Icon: IconPhone,
    badge: null,
  },
]

export default function QuickContactFab() {
  return (
    <div className="quick-contact-fab">
      <nav className="quick-contact-fab__dock" aria-label="Contact channels">
        {DOCK_LINKS.map(({ key, href, external, ariaLabel, Icon, badge }, index) => (
          <Fragment key={key}>
            <a
              href={href}
              className={`quick-contact-fab__dock-link ${badge ? `quick-contact-fab__dock-link--${badge}` : 'quick-contact-fab__dock-link--line'}`}
              aria-label={ariaLabel}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {badge ? (
                <span className={`quick-contact-fab__dock-badge quick-contact-fab__dock-badge--${badge}`}>
                  <Icon size={18} className="quick-contact-fab__dock-icon" />
                </span>
              ) : (
                <Icon />
              )}
            </a>
            {index < DOCK_LINKS.length - 1 ? (
              <span className="quick-contact-fab__dock-divider" aria-hidden="true" />
            ) : null}
          </Fragment>
        ))}
      </nav>
    </div>
  )
}
