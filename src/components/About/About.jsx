import React from "react";
import classes from "./About.module.css";
import about from "./about.svg";
import PastGlimpse from "../PastGlimpse/PastGlimpse";
import useScrollReveal from "../../hooks/useScrollReveal";

const About = () => {
  const revealRef = useScrollReveal({ threshold: 0.2 });

  return (
    <>
      <section id="about" className={classes.aboutSec} ref={revealRef}>
        <div className={classes.about}>
          <div className={classes.details}>
            <h3 className={classes.heading}>About</h3>
            <h2 className={classes.heading1}>Shraddhanjali-2026</h2>
            <p className={classes.para}>
              [PLACEHOLDER: About section copy — to be provided by user]
            </p>
          </div>

          <div className={classes.composition}>
            {/* Mandala Motif SVG */}
            <svg className={classes.mandala} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="50%" stopColor="#FF9933" />
                  <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
              </defs>
              <g fill="none" stroke="url(#goldGradient)" strokeWidth="1">
                <circle cx="50" cy="50" r="45" strokeDasharray="4,4" />
                <circle cx="50" cy="50" r="35" />
                <path d="M50 15 Q 65 35 50 50 Q 35 35 50 15 Z" />
                <path d="M50 85 Q 65 65 50 50 Q 35 65 50 85 Z" />
                <path d="M15 50 Q 35 65 50 50 Q 35 35 15 50 Z" />
                <path d="M85 50 Q 65 65 50 50 Q 65 35 85 50 Z" />
                <circle cx="50" cy="50" r="10" fill="url(#goldGradient)" opacity="0.3" />
              </g>
            </svg>

            <img className={classes.images} src={about} alt="about" loading="lazy" decoding="async" />
          </div>
        </div>
        <PastGlimpse />
      </section>
    </>
  );
};

export default About;
