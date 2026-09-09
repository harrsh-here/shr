import { useEffect, useRef, useState, useCallback } from 'react';
import classes from './PastGlimpse.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons';

// Dynamically import all images from the pastglimpse folder.
// Case-insensitive regex covers both .jpg and .JPG (Linux/Vercel is case-sensitive).
const req = require.context('../../assets/pastglimpse', false, /\.(jpe?g|JPE?G)$/);
const originalImages = req.keys().map(req);

const PastGlimpse = () => {
    const duplicatedImages = [...originalImages, ...originalImages, ...originalImages];

    const scrollRef = useRef(null);
    const isPaused = useRef(false);
    const [lightbox, setLightbox] = useState(null); // index into originalImages

    // Close lightbox on Escape key
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') setLightbox(null);
            if (e.key === 'ArrowRight' && lightbox !== null) setLightbox(i => (i + 1) % originalImages.length);
            if (e.key === 'ArrowLeft'  && lightbox !== null) setLightbox(i => (i - 1 + originalImages.length) % originalImages.length);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [lightbox]);

    // Lock body scroll when lightbox is open
    useEffect(() => {
        document.body.style.overflow = lightbox !== null ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [lightbox]);

    useEffect(() => {
        let animationId;
        const scrollStep = () => {
            if (!isPaused.current && scrollRef.current) {
                scrollRef.current.scrollLeft += 1;
                const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
                if (scrollRef.current.scrollLeft >= maxScrollLeft - 10) {
                    scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 4;
                }
            }
            animationId = requestAnimationFrame(scrollStep);
        };
        animationId = requestAnimationFrame(scrollStep);
        return () => cancelAnimationFrame(animationId);
    }, []);

    const slideLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.style.scrollBehavior = 'smooth';
            scrollRef.current.scrollBy({ left: -480 });
            setTimeout(() => { if (scrollRef.current) scrollRef.current.style.scrollBehavior = 'auto'; }, 400);
        }
    };

    const slideRight = () => {
        if (scrollRef.current) {
            scrollRef.current.style.scrollBehavior = 'smooth';
            scrollRef.current.scrollBy({ left: 480 });
            setTimeout(() => { if (scrollRef.current) scrollRef.current.style.scrollBehavior = 'auto'; }, 400);
        }
    };

    const openLightbox = useCallback((realIndex) => {
        isPaused.current = true;
        setLightbox(realIndex);
    }, []);

    const closeLightbox = useCallback(() => {
        isPaused.current = false;
        setLightbox(null);
    }, []);

    return (
        <section className={classes.pastGlimpseSection}>
            <h2 className={classes.heading}>Past Glimpses</h2>
            <div className={classes.sliderWrapper}>
                <button
                    className={`${classes.arrowBtn} ${classes.leftArrow}`}
                    onClick={slideLeft}
                    onMouseEnter={() => { isPaused.current = true; }}
                    onMouseLeave={() => { isPaused.current = false; }}
                    aria-label="Previous"
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                <div
                    className={classes.sliderContainer}
                    ref={scrollRef}
                    onMouseEnter={() => { isPaused.current = true; }}
                    onMouseLeave={() => { isPaused.current = false; }}
                    onTouchStart={() => { isPaused.current = true; }}
                    onTouchEnd={() => { isPaused.current = false; }}
                >
                    <div className={classes.sliderTrack}>
                        {duplicatedImages.map((img, index) => {
                            // Map back to the real index in originalImages for lightbox nav
                            const realIndex = index % originalImages.length;
                            return (
                                <div
                                    className={classes.slide}
                                    key={`glimpse-${index}`}
                                    onClick={() => openLightbox(realIndex)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Open photo ${realIndex + 1}`}
                                    onKeyDown={(e) => e.key === 'Enter' && openLightbox(realIndex)}
                                >
                                    <img src={img} alt={`Past Glimpse ${realIndex + 1}`} draggable="false" loading="lazy" decoding="async" />
                                    <span className={classes.slideZoomHint} aria-hidden="true">⤢</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button
                    className={`${classes.arrowBtn} ${classes.rightArrow}`}
                    onClick={slideRight}
                    onMouseEnter={() => { isPaused.current = true; }}
                    onMouseLeave={() => { isPaused.current = false; }}
                    aria-label="Next"
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>

            {/* ── Lightbox ── */}
            {lightbox !== null && (
                <div className={classes.lightboxOverlay} onClick={closeLightbox} role="dialog" aria-modal="true" aria-label="Photo lightbox">
                    {/* Prev */}
                    <button
                        className={`${classes.lbNav} ${classes.lbPrev}`}
                        onClick={(e) => { e.stopPropagation(); setLightbox(i => (i - 1 + originalImages.length) % originalImages.length); }}
                        aria-label="Previous photo"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>

                    <img
                        className={classes.lightboxImg}
                        src={originalImages[lightbox]}
                        alt={`Past Glimpse ${lightbox + 1}`}
                        onClick={(e) => e.stopPropagation()}
                        draggable="false"
                    />

                    {/* Next */}
                    <button
                        className={`${classes.lbNav} ${classes.lbNext}`}
                        onClick={(e) => { e.stopPropagation(); setLightbox(i => (i + 1) % originalImages.length); }}
                        aria-label="Next photo"
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>

                    {/* Close */}
                    <button className={classes.lbClose} onClick={closeLightbox} aria-label="Close lightbox">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>

                    {/* Counter */}
                    <span className={classes.lbCounter}>{lightbox + 1} / {originalImages.length}</span>
                </div>
            )}
        </section>
    );
};

export default PastGlimpse;
