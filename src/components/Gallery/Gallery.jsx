import { useMemo, useState } from 'react'
import './Gallery.css'

function Gallery({ images = [], title = 'Property gallery' }) {
  const normalizedImages = useMemo(() => images.filter(Boolean), [images])
  const [activeImage, setActiveImage] = useState(normalizedImages[0] || '')

  if (!normalizedImages.length) return null

  return (
    <section className="gallery" aria-label={title}>
      <img className="gallery__main" src={activeImage} alt={title} />
      <div className="gallery__thumbs">
        {normalizedImages.map((image) => (
          <button
            key={image}
            className={`gallery__thumb ${activeImage === image ? 'is-active' : ''}`}
            onClick={() => setActiveImage(image)}
            type="button"
            aria-label="Select gallery image"
          >
            <img src={image} alt="" />
          </button>
        ))}
      </div>
    </section>
  )
}

export default Gallery
