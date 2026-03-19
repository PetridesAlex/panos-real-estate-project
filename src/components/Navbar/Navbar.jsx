import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, MessageCircle, ChevronRight, Sparkles } from 'lucide-react'
import './Navbar.css'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/developments', label: 'Developments' },
  { to: '/agents', label: 'Agents' },
  { to: '/contact', label: 'Contact' },
]

const mobileLinks = [
  { to: '/properties', label: 'Properties' },
  ...navItems,
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showPropertiesDropdown, setShowPropertiesDropdown] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setShowPropertiesDropdown(false)
  }, [location.pathname])

  const navClass = `navbar ${isScrolled || !isHome ? 'navbar--solid' : 'navbar--transparent'}`

  return (
    <header className={navClass}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          AURA CYPRUS
        </Link>

        <nav className="navbar__desktop">
          <div
            className="navbar__dropdown"
            onMouseEnter={() => setShowPropertiesDropdown(true)}
            onMouseLeave={() => setShowPropertiesDropdown(false)}
          >
            <NavLink to="/properties" className={({ isActive }) => (isActive ? 'active' : '')}>
              Properties <ChevronDown size={14} />
            </NavLink>
            <AnimatePresence>
              {showPropertiesDropdown && (
                <motion.div
                  className="navbar__dropdown-menu"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                >
                  <Link to="/properties">All Listings</Link>
                  <Link to="/properties?status=For+Sale">For Sale</Link>
                  <Link to="/properties?status=For+Rent">For Rent</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__ctas">
          <a
            className="btn btn-outline-light navbar__wa"
            href="https://wa.me/35700000000"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} />
          </a>
          <Link to="/contact" className="btn btn-gold">
            Book a Consultation
          </Link>
          <button
            type="button"
            className="navbar__menu-btn"
            aria-label="Toggle menu"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="navbar__mobile"
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <div className="navbar__mobile-head">
              <span>
                <Sparkles size={14} />
                Navigation
              </span>
              <p>Discover premium Cyprus listings and services</p>
            </div>

            <div className="navbar__mobile-links">
              {mobileLinks.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * index, duration: 0.2 }}
                >
                  <Link to={item.to} className="navbar__mobile-link">
                    <span>{item.label}</span>
                    <ChevronRight size={16} />
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="https://wa.me/35700000000"
              target="_blank"
              rel="noreferrer"
              className="navbar__mobile-whatsapp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.25 }}
            >
              <MessageCircle size={16} />
              WhatsApp Inquiry
            </motion.a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
