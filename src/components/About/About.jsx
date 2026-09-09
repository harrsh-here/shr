import React from "react";
import classes from "./About.module.css";
import PastGlimpse from "../PastGlimpse/PastGlimpse";
import Rangoli from "../common/Rangoli/Rangoli";
import useScrollReveal from "../../hooks/useScrollReveal";
import chairmanPhoto from "../../assets/tk-agarwal.avif";

const About = () => {
  const revealRef = useScrollReveal({ threshold: 0.2 });

  return (
    <>
      <section id="about" className={classes.aboutSec} ref={revealRef}>
        <div className={classes.about}>
          <div className={classes.details}>
            <h3 className={classes.heading}>About</h3>
            <h2 className={classes.heading1}>Shraddhanjali</h2>
            <p className={classes.para}>
              Shraddhanjali is a tribute to the founder chairman, Late Shri T. K. Agarwal Ji. This cultural celebration brings the campus together in a spirit of festivity, fun and frolic—filling every student with enthusiasm, creativity and the joy of performing together.
            </p>
          </div>

          <div className={classes.composition}>
            <Rangoli className={classes.tributeRangoli} />
            <figure className={classes.tributePortrait}>
              <div className={classes.portraitRing}>
                <img src={chairmanPhoto} alt="Late Shri T. K. Agarwal Ji" />
              </div>
              <figcaption>Late Shri T. K. Agarwal Ji<br /><span>Founder Chairman</span></figcaption>
            </figure>
          </div>
        </div>
        <PastGlimpse />
      </section>
    </>
  );
};

export default About;
