import { useEffect, useRef } from 'react';

/**
 * Hook to apply a scroll reveal animation to an element using IntersectionObserver.
 * 
 * @param {Object} options - IntersectionObserver options
 * @returns {React.RefObject} - Ref to attach to the element
 */
const useScrollReveal = (options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }) => {
    const ref = useRef(null);

    useEffect(() => {
        const currentRef = ref.current;
        if (!currentRef) return;

        // Check if user prefers reduced motion to skip the observer setup
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            currentRef.classList.add('reveal-visible');
            return;
        }

        currentRef.classList.add('reveal');

        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    // Stop observing once revealed
                    observerInstance.unobserve(entry.target);
                }
            });
        }, options);

        observer.observe(currentRef);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [options]);

    return ref;
};

export default useScrollReveal;
