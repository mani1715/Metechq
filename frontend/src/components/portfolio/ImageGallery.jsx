import ProjectImage from './ProjectImage';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

const ImageGallery = ({ images, projectTitle, currentIndex, setCurrentIndex }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation
  React.useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="project-gallery" data-testid="image-gallery">
        {/* Main Featured Image */}
        <div className="gallery-item gallery-main" onClick={() => openLightbox(0)}>
          <ProjectImage
            src={images[0]}
            alt={`${projectTitle} - Screenshot 1`}
            className="gallery-image"
            loading="eager"
            data-testid="gallery-main-image"
          />
          <div className="gallery-overlay">
            <ZoomIn className="gallery-zoom-icon" />
            <span>Click to enlarge</span>
          </div>
        </div>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="gallery-thumbnails">
            {images.slice(1).map((image, idx) => (
              <div
                key={idx + 1}
                className="gallery-thumbnail"
                onClick={() => openLightbox(idx + 1)}
                data-testid={`gallery-thumbnail-${idx + 1}`}
              >
                <ProjectImage
                  src={image}
                  alt={`${projectTitle} - Screenshot ${idx + 2}`}
                  className="thumbnail-image"
                  loading="lazy"
                />
                <div className="thumbnail-overlay">
                  <ZoomIn className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox} data-testid="lightbox">
          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close lightbox"
            data-testid="lightbox-close-btn"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <ProjectImage
              src={images[lightboxIndex]}
              alt={`${projectTitle} - Full size ${lightboxIndex + 1}`}
              className="lightbox-image"
              data-testid="lightbox-image"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                className="lightbox-nav lightbox-prev"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                aria-label="Previous image"
                data-testid="lightbox-prev-btn"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                className="lightbox-nav lightbox-next"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                aria-label="Next image"
                data-testid="lightbox-next-btn"
              >
                <ChevronRight className="h-8 w-8" />
              </button>

              <div className="lightbox-counter">
                {lightboxIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ImageGallery;
