import React from "react";
import classes from "./Footer.module.css";
import CulturalOrnament from "../common/CulturalOrnament/CulturalOrnament";

// const sambhavitwitter=''

const grabbitinsta = "https://www.instagram.com/aryacollege/";
const grabbitlinkedin = "https://in.linkedin.com/school/aryacollege/";
// const grabbittwitter = "#";
const grabbitwebsite = "#";

const grabbiturl = "#";
const Footer = () => {
  return (
    <div className={classes.footer_outer}>
      <CulturalOrnament type="paisley" className={classes.footerPaisley} />
      <div className={classes.footer}>
        <div className={classes.footer_first}>
          <div className={classes.footer_sambhav_image_div}>
            <div>
              <p className={classes.footerBrand}>
                Shraddhanjali <span>'26</span>
              </p>
            </div>
            <div>
              {/* <h1 className={classes.footer_sambhav}>SAMBHAV'23</h1> */}
            </div>
          </div>
          <p className={classes.footer_sambhav_description}>
            Inter-college Cultural Fest · A tribute to Late Er. Shri T.K. Agarwal Ji
          </p>
        </div>
        <div className={classes.footer_first}>
          <div className={classes.footer_sambhav_image_div}>
            <div>
              <a
                href={grabbiturl}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.footer_a_link}
              >

              </a>
            </div>
            <div>

            </div>
          </div>
          <p className={`${classes.footer_sambhav_description} ${classes.footerFestivalName}`}>
            Shraddhanjali '26
          </p>
          <div className={classes.footer_social_item}>
            <div>
              <a
                href={grabbitinsta}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.footer_a_link}
              >
                <img
                  className={classes.footer_social_link}
                  src="https://img.icons8.com/fluency/48/ffffff/instagram-new.png"
                  alt=""
                />
              </a>{" "}
            </div>
            <div>
              <a
                href={grabbitlinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.footer_a_link}
              >
                <img
                  className={classes.footer_social_link}
                  src="https://img.icons8.com/color/48/ffffff/linkedin-circled--v1.png"
                  alt=""
                />
              </a>
            </div>
            {/* <div>
              <a
                href={grabbittwitter}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.footer_a_link}
              >
                <img
                  className={classes.footer_social_link}
                  src="https://img.icons8.com/fluency/48/ffffff/twitter-circled.png"
                  alt=""
                />
              </a>{" "}
            </div> */}
            <div>
              <a
                href={grabbitwebsite}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.footer_a_link}
              >
                <img
                  className={classes.footer_social_link}
                  src="https://img.icons8.com/color/48/ffffff/domain--v1.png"
                  alt="zsdsff"
                />
              </a>
            </div>
          </div>
        </div>
        {/* <div className={classes.footer}second'>
          <h2 className={classes.footer}menu-heading'>Menu</h2>
          <h6 className={classes.footer}page-link'>About US</h6>
          <h6 className={classes.footer}page-link'>Term of Use</h6>
          <h6 className={classes.footer}page-link'>Privary Policy</h6>
          <h6 className={classes.footer}page-link'>Order History</h6>
          <h6 className={classes.footer}page-link'>Return policy</h6>
        </div> */}
        <div className={classes.footer_third}>
          <h2 className={classes.footer_menu_heading}>Contact Us</h2>
          <div className={classes.footer_contact}>
            <div className={classes.footer_contact_item_image}>
              <img
                className={classes.footer_contact_image}
                src="https://img.icons8.com/ios-filled/50/ffffff/marker.png"
                alt=""
              />
            </div>
            <div>
              <p>Arya College of Engineeing and IT Jaipur</p>
            </div>
          </div>
          <div className={classes.footer_contact}>
            <div>
              <img
                className={classes.footer_contact_image}
                src="https://img.icons8.com/ios-filled/50/ffffff/outgoing-call.png"
                alt=""
              />
            </div>
            <div>
              <p>01426-227176 | 01426-227497</p>
            </div>
          </div>
          <div className={classes.footer_contact}>
            <div>
              <img
                className={classes.footer_contact_image}
                src="https://img.icons8.com/glyph-neue/64/ffffff/gmail.png"
                alt=""
              />
            </div>
            <div>
              <p className={classes.mail}>info@aryacollege.in</p>
            </div>
          </div>
          <div className={classes.footer_contact}>
            <div>
              <img
                className={classes.footer_contact_image}
                src="https://img.icons8.com/ios-filled/50/ffffff/user.png"
                alt=""
              />
            </div>
            <div>
              <p style={{ fontSize: '14px', lineHeight: '1.4' }}>
                For website related queries contact <br />
                <a href="tel:8177904081" className={classes.footer_a_link}>
                  Gopal Sharma : 8177904081
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Footer;
