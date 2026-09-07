import React, { useEffect, useState, useRef } from 'react';
import styles from './Cursor.module.css';

const Cursor = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if device uses a coarse pointer (touch screen)
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        
        if (isTouchDevice) {
            // On touch devices, do not mount cursor logic or styles
            return;
        }

        // Hide default cursor on body
        document.body.style.cursor = 'none';
        setIsVisible(true);

        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly move the dot
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            }

            // Check if we're over an element that shouldn't have a custom cursor
            // e.g. input fields or elements explicitly marked with data-no-cursor
            const target = e.target;
            const isNoCursorZone = target.closest('input, textarea, [data-no-cursor="true"]');
            
            if (isNoCursorZone) {
                document.body.style.cursor = 'auto';
                if (dotRef.current) dotRef.current.style.opacity = '0';
                if (ringRef.current) ringRef.current.style.opacity = '0';
            } else {
                document.body.style.cursor = 'none';
                if (dotRef.current) dotRef.current.style.opacity = '1';
                if (ringRef.current) ringRef.current.style.opacity = '1';
            }
        };

        // Use requestAnimationFrame for smooth ring follow
        const render = () => {
            ringX += (mouseX - ringX) * 0.15; // Ease factor
            ringY += (mouseY - ringY) * 0.15;
            
            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            }
            requestAnimationFrame(render);
        };
        
        requestAnimationFrame(render);

        const handleMouseDown = () => {
            if (dotRef.current) dotRef.current.classList.add(styles.active);
            if (ringRef.current) ringRef.current.classList.add(styles.active);
        };

        const handleMouseUp = () => {
            if (dotRef.current) dotRef.current.classList.remove(styles.active);
            if (ringRef.current) ringRef.current.classList.remove(styles.active);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.body.style.cursor = 'auto';
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <>
            <div ref={ringRef} className={styles.cursorRing}></div>
            <div ref={dotRef} className={styles.cursorDot}></div>
        </>
    );
};

export default Cursor;
