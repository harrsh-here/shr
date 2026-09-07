import React from "react";
import classes from "./About.module.css";
import PastGlimpse from "../PastGlimpse/PastGlimpse";
import Rangoli from "../common/Rangoli/Rangoli";
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
            <Rangoli className={classes.tributeRangoli} />
          </div>
        </div>
        <PastGlimpse />
      </section>
    </>
  );
};

export default About;
