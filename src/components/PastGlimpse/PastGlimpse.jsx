import React, { useEffect, useRef } from 'react';
import classes from './PastGlimpse.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// TODO: Replace these old-event images with the new Past Glimpses photos when supplied by the user.
// Dynamically import all images from the pastglimpse folder using Webpack's require.context
const req = require.context('../../assets/pastglimpse', false, /.*\.jpe?g$/);
const originalImages = req.keys().map(req);

const PastGlimpse = () => {
    // Duplicate exactly the same items to create a seamless infinite loop
    const duplicatedImages = [...originalImages, ...originalImages, ...originalImages];

    const scrollRef = useRef(null);
    const isPaused = useRef(false);

    useEffect(() => {
        let animationId;
        const scrollStep = () => {
            if (!isPaused.current && scrollRef.current) {
                // If the user isn't interacting, smoothly scroll by 1 pixel per frame
                scrollRef.current.scrollLeft += 1;

                const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
                // If we've scrolled far enough, seamlessly reset to the middle (since we have 4 sets of images)
                // This creates the infinite illusion
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
            scrollRef.current.style.scrollBehavior = "smooth";
            scrollRef.current.scrollBy({ left: -480 }); // approximate width of one slide (450) + margin
            setTimeout(() => {
                if (scrollRef.current) scrollRef.current.style.scrollBehavior = "auto";
            }, 400);
        }
    };

    const slideRight = () => {
        if (scrollRef.current) {
            scrollRef.current.style.scrollBehavior = "smooth";
            scrollRef.current.scrollBy({ left: 480 });
            setTimeout(() => {
                if (scrollRef.current) scrollRef.current.style.scrollBehavior = "auto";
            }, 400);
        }
    };

    return (
        <section className={classes.pastGlimpseSection}>
            <h2 className={classes.heading}>Past Glimpses</h2>
            <div className={classes.sliderWrapper}>
                <button
                    className={`${classes.arrowBtn} ${classes.leftArrow}`}
                    onClick={slideLeft}
                    onMouseEnter={() => { isPaused.current = true; }}
                    onMouseLeave={() => { isPaused.current = false; }}
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
                        {duplicatedImages.map((img, index) => (
                            <div className={classes.slide} key={`glimpse-${index}`}>
                                <img src={img} alt={`Glimpse`} draggable="false" loading="lazy" decoding="async" />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className={`${classes.arrowBtn} ${classes.rightArrow}`}
                    onClick={slideRight}
                    onMouseEnter={() => { isPaused.current = true; }}
                    onMouseLeave={() => { isPaused.current = false; }}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
        </section>
    );
};

export default PastGlimpse;
