import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import classes from "./Navbar.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { HashLink as Link } from "react-router-hash-link";
// import Dropdown from "./Dropdown";
import GrabBitBtn from "../common/GrabBitBtn/GrabBitBtn";
import { siteStatus } from "../../config/siteStatus";

const Scroll = require("react-scroll");

const Navbar = () => {
  const Drop = Scroll.Link;
  const [scrolled, isScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);

  window.onscroll = () => {
    isScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  const location = useLocation();
  const isHome = location.pathname === "/";

  const scrollWithOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -100;
    window.scrollTo({ top: yCoordinate + yOffset, behavior: "smooth" });
  };

  const NavItem = ({ to, children }) => {
    if (isHome) {
      return (
        <Drop
          activeClass={classes.active}
          className={classes.homeLink}
          to={to}
          spy={true}
          smooth={true}
          offset={-100}
          duration={600}
        >
          {children}
        </Drop>
      );
    }
    return (
      <Link to={`/#${to}`} scroll={scrollWithOffset} className={classes.homeLink}>
        {children}
      </Link>
    );
  };

  const MobileNavItem = ({ to, children }) => {
    if (isHome) {
      return (
        <Drop
          onClick={() => setMobile(false)}
          activeClass={classes.active}
          className={classes.homeLink}
          to={to}
          spy={true}
          smooth={true}
          offset={-100}
          duration={600}
        >
          {children}
        </Drop>
      );
    }
    return (
      <Link
        onClick={() => setMobile(false)}
        to={`/#${to}`}
        scroll={scrollWithOffset}
        className={classes.homeLink}
      >
        {children}
      </Link>
    );
  };

  return (
    <header
      className={`${!scrolled ? classes.header : classes.scrolledHeader}`}
    >
      {siteStatus.registrationsPaused && (
        <div className={classes.announcement} role="status">
          <span className={classes.announcementMotif}>✦</span>
          {siteStatus.pausedMessage}
          <span className={classes.announcementMotif}>✦</span>
        </div>
      )}
      <div className={classes.elements}>
        <div className={classes.logobox}>
          <Link to="/" aria-label="Go to homepage">
            <span className={classes.brand} aria-label="Shraddhanjali 2026">
              <span className={classes.brandTitle}>
                Shraddhanjali <span className={classes.brandYear}>'26</span>
              </span>
              <span className={classes.brandTagline}>...a tribute to Late Er. Shri T.K. Agarwal Ji</span>
            </span>
          </Link>
        </div>

        <div className={classes.navbox}>
          <ul className={classes.nav}>
            <li className={classes.navLink}>
              <NavItem to="home">Home</NavItem>
            </li>
            <li className={classes.navLink}>
              <NavItem to="events">
                Events
                <FontAwesomeIcon
                  size="sm"
                  style={{ display: "inline-block", marginLeft: ".5rem" }}
                  icon={faArrowDown}
                  fade
                />
              </NavItem>
            </li>
            <li className={classes.navLink}>
              <NavItem to="about">About</NavItem>
            </li>
            <li className={classes.navLink}>
              <NavItem to="contact">Contact</NavItem>
            </li>
          </ul>

          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://aryacollege.in/"
            aria-label="Visit the ACEIT college website"
            title="Visit the ACEIT college website"
          >
            {/* <button className={classes.btn}>GrabBit</button> */}
            <div className={classes.btn}>
              <GrabBitBtn label="ACEIT" />
            </div>
          </a>

          <div className={classes.hamburger} onClick={() => setMobile(!mobile)}>
            <div className={`${classes.hamburgerIcon} ${mobile ? classes.open : ""}`}>
              <span className={classes.hamburgerBar}></span>
              <span className={classes.hamburgerBar}></span>
              <span className={classes.hamburgerBar}></span>
            </div>
          </div>
        </div>

        <div className={`${!mobile ? classes.none : classes.mobileBox}`}>
          <div className={classes.closeIconContainer} onClick={() => setMobile(false)}>
            <FontAwesomeIcon
              icon={faXmark}
              style={{ color: "white" }}
              size="2x"
            />
          </div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://aryacollege.in/"
            aria-label="Visit the ACEIT college website"
            title="Visit the ACEIT college website"
          >
            {/* <button className={classes.btn1}>GrabBit</button> */}
            <div className={classes.btn1}>
              <GrabBitBtn label="ACEIT" />
            </div>
          </a>

          {/* Mobile Page */}

          <ul className={classes.mobileNav}>
            <li>
              <MobileNavItem to="home">Home</MobileNavItem>
            </li>
            <li>
              <MobileNavItem to="events">
                Events
                <FontAwesomeIcon
                  size="sm"
                  style={{ display: "inline-block", marginLeft: ".5rem" }}
                  icon={faArrowDown}
                  fade
                />
              </MobileNavItem>
            </li>
            <li>
              <MobileNavItem to="about">About</MobileNavItem>
            </li>
            <li>
              <MobileNavItem to="contact">Contact</MobileNavItem>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
