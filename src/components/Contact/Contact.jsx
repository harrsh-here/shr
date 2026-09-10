import Faq from "../Faq/Faq";
import SideAccent from "../common/SideAccent/SideAccent";
import FestivalSprite from "../common/FestivalSprite/FestivalSprite";
import classes from "./Contact.module.css";

const contactPhotoFiles = require.context("../../assets/contacts", false, /\.(png|jpe?g|webp|avif)$/i);

const getContactPhoto = (name) => {
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const matchingFile = contactPhotoFiles.keys().find((file) =>
    file.slice(2).replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "") === normalizedName
  );

  return matchingFile ? contactPhotoFiles(matchingFile) : null;
};

const shraddhanjaliLeads = [
  { name: "Shashank Srivastava", designation: "Coordinator", phone: "+91 9334024106" },
  { name: "Gopal Sharma", designation: "Website & payment queries coordinator", phone: "+91 8177904081" },
  { name: "Harsh Patidar", designation: "Website & payment queries coordinator", phone: "+91 9057471432" },
  { name: "Harshit Pathak", designation: "Coordinator", phone: "+91 6307713384" },
  { name: "Sankalp Tiwari", designation: "Coordinator", phone: "+91 7652069346" },
  { name: "Priyanshu Soni", designation: "Coordinator", phone: "+91 8209385914" },
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
                  {getContactPhoto(lead.name) ? <img src={getContactPhoto(lead.name)} alt={lead.name} className={classes.leadImg} /> : <span className={classes.photoPlaceholder}>Photo<br />coming soon</span>}
                </div>
                <h3 className={classes.leadName}>{lead.name}</h3>
                <p className={classes.leadDesignation}>{lead.designation}</p>
                <a href={`tel:${lead.phone.replace(/[^+\d]/g, '')}`} className={classes.leadPhone}>{lead.phone}</a>
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
