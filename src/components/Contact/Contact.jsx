import Faq from "../Faq/Faq";
import classes from "./Contact.module.css";

const shraddhanjaliLeads = []; // Left blank for now as requested

const Contact = () => {
  return (
    <section id="contact" className={classes.contact}>
      <div className={classes.leadsSection}>
        <div className={classes.headingBox}>
          <h2 className={classes.heading}>Contact Us</h2>
        </div>

        <div className={classes.categorySection}>
          <div className={classes.headingBox}>
            <h2 className={classes.categoryHeading}>Shraddhanjali'26 Related Queries</h2>
          </div>
          <div className={classes.leadsGrid}>
            {shraddhanjaliLeads.map((lead, index) => (
              <div key={index} className={classes.leadCard}>
                <div className={classes.imgContainer}>
                  <img src={lead.image} alt={lead.name} className={classes.leadImg} />
                </div>
                <h3 className={classes.leadName}>{lead.name}</h3>
                <p className={classes.leadDesignation}>{lead.designation}</p>
                <a href={`tel:${lead.phone.replace(/\s+/g, '')}`} className={classes.leadPhone}>
                  {lead.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={classes.contactBox}>
        <div className={classes.contentBox}>
          <Faq />
        </div>
      </div>
    </section>
  );
};

export default Contact;
