import Faq from "../Faq/Faq";
import SideAccent from "../common/SideAccent/SideAccent";
import FestivalSprite from "../common/FestivalSprite/FestivalSprite";
import classes from "./Contact.module.css";

const shraddhanjaliLeads = [
  { name: "Naina Khare", designation: "Event Coordinator", phone: "9258689744" },
  { name: "Shashank Shrivastava", designation: "Event Coordinator", phone: "9334024106" },
  { name: "Gopal Sharma", designation: "Website-related queries", phone: "8177904081" },
  { name: "Coordinator To Be Announced", designation: "Event Coordinator", phone: "Contact details pending", placeholder: true },
];

const Contact = () => {
  return (
    <section id="contact" className={classes.contact}>
      <SideAccent side="left" />
      <FestivalSprite side="right" />
      <div className={classes.leadsSection}>
        <div className={classes.headingBox}>
          <h2 className={classes.heading}>Contact Us</h2>
        </div>

        <div className={classes.categorySection}>
          <div className={classes.headingBox}>
            <h2 className={classes.categoryHeading}>Shraddhanjali ’26 Coordinators</h2>
          </div>
          <div className={classes.leadsGrid}>
            {shraddhanjaliLeads.map((lead, index) => (
              <div key={index} className={classes.leadCard}>
                <div className={classes.imgContainer}>
                  {lead.image ? <img src={lead.image} alt={lead.name} className={classes.leadImg} /> : <span className={classes.photoPlaceholder}>Photo<br />coming soon</span>}
                </div>
                <h3 className={classes.leadName}>{lead.name}</h3>
                <p className={classes.leadDesignation}>{lead.designation}</p>
                {lead.placeholder ? <p className={classes.leadPhone}>{lead.phone}</p> : <a href={`tel:${lead.phone.replace(/\s+/g, '')}`} className={classes.leadPhone}>{lead.phone}</a>}
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
