import React, { useEffect, useMemo, useRef } from "react";
import classes from "./SiteBackdrop.module.css";

const SiteBackdrop = () => {
  const backdropRef = useRef(null);
  const particles = useMemo(() => Array.from({ length: 52 }, (_, index) => {
    const duration = 11 + ((index * 7) % 11);
    return {
      id: index,
      left: (index * 37) % 100,
      size: 2 + ((index * 5) % 5),
      duration,
      delay: -((index * 3.7) % duration),
      drift: ((index * 19) % 62) - 31,
    };
  }), []);

  useEffect(() => {
    const moveBackdrop = (event) => {
      if (!backdropRef.current || window.matchMedia("(pointer: coarse)").matches) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 22;
      const y = (event.clientY / window.innerHeight - 0.5) * 22;
      backdropRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.06)`;
    };

    window.addEventListener("mousemove", moveBackdrop, { passive: true });
    return () => window.removeEventListener("mousemove", moveBackdrop);
  }, []);

  return (
    <div className={classes.canvas} aria-hidden="true">
      <div className={classes.atmosphere} ref={backdropRef} />
      <div className={classes.vignette} />
      <div className={classes.particles}>
        {particles.map((particle) => (
          <span
            key={particle.id}
            className={classes.particle}
            style={{
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              "--drift": `${particle.drift}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SiteBackdrop;
