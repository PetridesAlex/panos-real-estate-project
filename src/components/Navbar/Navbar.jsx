import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Instagram, MapPin, Menu, MessageCircle, Search, Send } from 'lucide-react'
import StaggeredMenu from '../StaggeredMenu/StaggeredMenu'
import './Navbar.css'

const navTabs = [
  { key: 'buy', label: 'Buy', to: '/properties?status=For+Sale' },
  { key: 'rent', label: 'Rent', to: '/properties?status=For+Rent' },
  { key: 'sell', label: 'Sell', to: '/properties' },
  { key: 'development', label: 'New Development', to: '/properties' },
  { key: 'agents', label: 'Agents', to: '/properties' },
]

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navClass = `navbar ${isScrolled || !isHome ? 'navbar--solid' : 'navbar--transparent'}`

  return (
    <header className={navClass}>
      <div className="container navbar__topline navbar__inner--wide" aria-label="Top bar">
        <span className="navbar__topline-spacer" aria-hidden="true" />
        <p className="navbar__topline-text">UNITED PROPERTIES</p>
        <div className="navbar__topline-socials">
          <a href="https://wa.me/35700000000" target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <MessageCircle size={14} />
          </a>
          <a href="#" aria-label="Telegram">
            <Send size={14} />
          </a>
          <a href="#" aria-label="Instagram">
            <Instagram size={14} />
          </a>
        </div>
      </div>

      <div className="container navbar__inner navbar__inner--wide">
        <Link to="/" className="navbar__logo">
          <img src="/images/logo/987%20(1).svg" alt="United Properties" />
        </Link>

        <nav className="navbar__desktop">
          {navTabs.map((tab) => (
            <NavLink
              key={tab.key}
              to={tab.to}
              className={({ isActive }) => `navbar__nav-trigger ${isActive ? 'active' : ''}`.trim()}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="navbar__search-pill" aria-label="Search homes and agents">
          <Search size={14} />
          <span>Homes &amp; Agents</span>
          <span className="navbar__search-pill-map" aria-hidden="true">
            <MapPin size={13} />
          </span>
        </button>

        <div className="navbar__ctas">
          <a
            className="btn btn-outline-light navbar__wa"
            href="https://wa.me/35700000000"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} />
          </a>
          <Link to="/contact" className="navbar__menu-pill">
            Menu <Menu size={14} />
          </Link>
          <StaggeredMenu
            className="navbar__staggered"
            position="right"
            items={[
              { label: 'Home', link: '/' },
              { label: 'Properties', link: '/properties' },
              { label: 'About', link: '/about' },
              { label: 'Services', link: '/services' },
              { label: 'Developments', link: '/developments' },
              { label: 'Agents', link: '/agents' },
              { label: 'Contact', link: '/contact' },
            ]}
            socialItems={[
              { label: 'Instagram', link: '#' },
              { label: 'LinkedIn', link: '#' },
              { label: 'WhatsApp', link: 'https://wa.me/35700000000' },
            ]}
            displaySocials
            displayItemNumbering={false}
            menuButtonColor="#ffffff"
            openMenuButtonColor="#ffffff"
            changeMenuColorOnOpen
            colors={['#2b2926', '#141312']}
            accentColor="#a98348"
          />
        </div>
      </div>
    </header>
  )
}

export default Navbar
