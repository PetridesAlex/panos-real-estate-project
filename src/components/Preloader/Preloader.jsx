import { useEffect, useState } from 'react'
import './Preloader.css'

const MIN_DISPLAY_MS = 1800

function Preloader() {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  const [logoSrc, setLogoSrc] = useState('/images/logo/987%20(1).svg')

  useEffect(() => {
    const startedAt = Date.now()
    let hideTimerId

    const beginExit = () => {
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)

      hideTimerId = window.setTimeout(() => {
        setIsExiting(true)
      }, remaining)
    }

    if (document.readyState === 'complete') {
      beginExit()
    } else {
      window.addEventListener('load', beginExit, { once: true })
    }

    return () => {
      window.removeEventListener('load', beginExit)
      if (hideTimerId) window.clearTimeout(hideTimerId)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`preloader ${isExiting ? 'is-exiting' : ''}`.trim()}
      role="status"
      aria-live="polite"
      aria-label="Loading United Properties"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && isExiting) {
          setIsVisible(false)
        }
      }}
    >
      <div className="preloader__bg" aria-hidden="true" />
      <div className="preloader__content">
        <div className="preloader__logo-shell">
          <span className="preloader__ring preloader__ring--outer" aria-hidden="true" />
          <span className="preloader__ring preloader__ring--inner" aria-hidden="true" />
          <img
            className="preloader__logo"
            src={logoSrc}
            alt="United Properties logo"
            loading="eager"
            decoding="sync"
            onError={() => {
              if (logoSrc !== '/images/logo/image%20(1).avif') {
                setLogoSrc('/images/logo/image%20(1).avif')
              }
            }}
          />
        </div>
        <p className="preloader__title">United Properties</p>
        <p className="preloader__subtitle">Luxury Real Estate in Cyprus</p>
        <div className="preloader__progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  )
}

export default Preloader
