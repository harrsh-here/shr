import { useState, useEffect } from "react";
import classes from "./Hero.module.css";
import { Link as ScrollLink } from "react-scroll";
import collegeLogo from "../../assets/collegeLogo.png";

const Hero = () => {
  const [countDays, setDays] = useState(0);
  const [countHours, setHours] = useState(0);
  const [countMinutes, setMinutes] = useState(0);
  const [countSeconds, setSeconds] = useState(0);
  const [showHindi, setShowHindi] = useState(false);

  // Countdown timer — synced to the event cards: 19 September 2026, 6:30 PM IST.
  useEffect(() => {
    const countdownDate = new Date("2026-09-19T18:30:00+05:30").getTime();
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
    return () => clearInterval(interval);
  }, []);

  // Title crossfade — toggle every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowHindi(prev => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Ambient mandala SVG (slow 60s rotation)
  const mandalaMotif = (
    <svg className={classes.heroMandala} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heroMandalaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FF9933" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#heroMandalaGrad)" strokeWidth="0.5">
        <circle cx="100" cy="100" r="95" strokeDasharray="6,4" />
        <circle cx="100" cy="100" r="80" strokeDasharray="3,6" />
        <circle cx="100" cy="100" r="65" />
        <circle cx="100" cy="100" r="50" strokeDasharray="8,3" />
        {/* Petal shapes — 8 petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
          <path
            key={angle}
            d={`M100 100 Q ${100 + 40 * Math.cos((angle - 20) * Math.PI / 180)} ${100 + 40 * Math.sin((angle - 20) * Math.PI / 180)} ${100 + 70 * Math.cos(angle * Math.PI / 180)} ${100 + 70 * Math.sin(angle * Math.PI / 180)} Q ${100 + 40 * Math.cos((angle + 20) * Math.PI / 180)} ${100 + 40 * Math.sin((angle + 20) * Math.PI / 180)} 100 100 Z`}
          />
        ))}
        <circle cx="100" cy="100" r="20" fill="url(#heroMandalaGrad)" opacity="0.1" />
      </g>
    </svg>
  );

  return (
    <section
      id="home"
      className={classes.hero}
    >
      {mandalaMotif}

      <div className={classes.herobox}>
        <div className={classes.headerbox}>
          {/* Logo — stagger delay 0s */}
          <div className={classes.logoWrapper} style={{ animationDelay: '0s' }}>
            <img src={collegeLogo} alt="Arya College Logo" className={classes.collegeLogoImg} />
          </div>

          {/* College Name — stagger delay 0.2s */}
          <h3 className={classes.collegeName} style={{ animationDelay: '0.2s' }}>
            Arya College of Engineering & I.T, Jaipur
          </h3>

          {/* Title crossfade — stagger delay 0.4s */}
          <div className={classes.titleContainer} style={{ animationDelay: '0.4s' }}>
            <h1 className={`${classes.heading} ${classes.headingEnglish} ${showHindi ? classes.titleHidden : classes.titleVisible}`}>
              Shraddhanjali 2026
            </h1>
            <h1 className={`${classes.heading} ${classes.headingAlt} ${showHindi ? classes.titleVisible : classes.titleHidden}`}>
              श्रद्धांजलि 2026
            </h1>
          </div>

          <p className={classes.titleTagline} style={{ animationDelay: '0.5s' }}>
            ...a tribute to Late Er. Shri T.K. Agarwal Ji
          </p>

          {/* Caption — stagger delay 0.6s */}
          <h4 className={classes.caption} style={{ animationDelay: '0.6s' }}>
            Intercollege Cultural Fest
          </h4>

          {/* Date — stagger delay 0.8s */}
          <p className={classes.date} style={{ animationDelay: '0.8s' }}>
            19 September 2026
          </p>
          <p className={classes.eventTime} style={{ animationDelay: '0.9s' }}>6:30 PM onwards</p>

          {/* CTA — stagger delay 1.0s — inline button, no old Button component */}
          <ScrollLink
            to="events"
            smooth={true}
            duration={800}
            offset={-100}
            className={classes.anchorBtn}
            style={{ animationDelay: '1.0s' }}
          >
            <button className={classes.ctaBtn}>Explore Our Events</button>
          </ScrollLink>
        </div>

        {/* Countdown — confirmed good, untouched */}
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
