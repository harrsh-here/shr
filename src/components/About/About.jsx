// import Button from "../common/Button/Button";
import classes from "./About.module.css";
import about from "./about.svg";
import PastGlimpse from "../PastGlimpse/PastGlimpse";

const About = () => {
  return (
    <>
      <section id="about" className={classes.aboutSec}>
        <div className={classes.about}>
          <div className={classes.details}>
            <h3 className={classes.heading}>About</h3>
            <h2 className={classes.heading1}>Shraddhanjali-2026</h2>
            <p className={classes.para}>
              {/* [PLACEHOLDER: About section copy — to be provided by user] */}
              [PLACEHOLDER: About section copy — to be provided by user]
            </p>
          </div>

          <div className={classes.composition}>
            <img className={classes.images} src={about} alt="about" loading="lazy" decoding="async" />
          </div>
        </div>
        <PastGlimpse />
      </section>
    </>
  );
};

export default About;
