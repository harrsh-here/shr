import React, { useState, useEffect, useRef } from "react";
import classes from "./Hero.module.css";
import { Link as ScrollLink } from "react-scroll";
import Button from "../common/Button/Button";
import collegeLogo from "../../assets/collegeLogo.png";

const Hero = () => {
  const [countDays, setDays] = useState(0);
  const [countHours, setHours] = useState(0);
  const [countMinutes, setMinutes] = useState(0);
  const [countSeconds, setSeconds] = useState(0);

  const heroRef = useRef(null);
  const parallaxBgRef = useRef(null);

  const startTimer = () => {
    const countdownDate = new Date("September 19 2026 00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      if (distance < 0) {
        clearInterval(interval);
      } else {
        setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        setMinutes(Math.floor((distance / 1000 / 60) % 60));
        setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
      }
    }, 1000);

    return interval;
  };

  useEffect(() => {
    const interval = startTimer();
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current || !parallaxBgRef.current) return;
    
    // Check if on touch device to skip parallax for performance
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const x = (clientX / innerWidth - 0.5) * 40; // max 20px movement
    const y = (clientY / innerHeight - 0.5) * 40;

    parallaxBgRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
  };

  // Generate 20 random particles
  const particles = Array.from({ length: 20 }).map((_, i) => {
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = Math.random() * 10 + 10; // 10s to 20s
    const delay = Math.random() * 5;
    const size = Math.random() * 6 + 2; // 2px to 8px
    return (
      <span 
        key={i} 
        className={classes.particle} 
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`
        }}
      ></span>
    );
  });

  return (
    <section 
      id="home" 
      className={classes.hero} 
      ref={heroRef}
      onMouseMove={handleMouseMove}
    >
      <div className={classes.parallaxBg} ref={parallaxBgRef}></div>
      <div className={classes.particlesContainer}>
        {particles}
      </div>

      <div className={classes.herobox}>
        <div className={classes.headerbox}>
          <div className={classes.logoWrapper}>
            <img src={collegeLogo} alt="Arya College Logo" className={classes.collegeLogoImg} />
            <h3 className={classes.collegeName}>Arya College of Engineering & I.T, Jaipur</h3>
          </div>
          <h1 className={classes.heading}>Shraddhanjali 2026</h1>
          <h4 className={classes.caption}>Intercollege Cultural Fest</h4>
          <p className={classes.date}>19 September 2026</p>
          
          <ScrollLink
            to="events"
            smooth={true}
            duration={800}
            offset={-100}
            className={classes.anchorBtn}
          >
            <Button
              label="Explore Our Events"
              className={classes.ctaBtn}
            ></Button>
          </ScrollLink>
        </div>

        <div className={classes.countdownbox}>
          <div className={classes.countdown}>
            <p className={classes.countNum}>{countDays.toString().padStart(2, '0')}</p>
            <p className={classes.countLabel}>days</p>
          </div>
          <span className={classes.column}>:</span>
          <div className={classes.countdown}>
            <p className={classes.countNum}>{countHours.toString().padStart(2, '0')}</p>
            <p className={classes.countLabel}>hours</p>
          </div>
          <span className={classes.column}>:</span>
          <div className={classes.countdown}>
            <p className={classes.countNum}>{countMinutes.toString().padStart(2, '0')}</p>
            <p className={classes.countLabel}>min</p>
          </div>
          <span className={classes.column}>:</span>
          <div className={classes.countdown}>
            <p className={classes.countNum}>{countSeconds.toString().padStart(2, '0')}</p>
            <p className={classes.countLabel}>sec</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
