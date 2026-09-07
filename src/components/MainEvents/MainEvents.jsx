import React, { useEffect, useRef } from "react";
import classes from "./MainEvents.module.css";
import { eventsData } from "../../assets/eventsData";
import ReactGA from "react-ga";
import { NavLink } from "react-router-dom";
import useScrollReveal from "../../hooks/useScrollReveal";

const EventCard3D = ({ event }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate cursor position relative to card center (range -1 to 1)
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    
    // Max rotation 8 degrees
    const rotateX = y * -8;
    const rotateY = x * 8;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <NavLink
      to={`/events/${event.id}`}
      className={classes.poster_link}
      style={{ textDecoration: "none" }}
    >
      <div 
        className={classes.poster_card}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className={classes.poster_img_wrapper}>
          <img
            src={event.image}
            alt={`${event.name} poster`}
            className={classes.poster_img}
            loading="lazy"
            decoding="async"
          />
        </div>
        <h3 className={classes.poster_event_name}>{event.name}</h3>
      </div>
    </NavLink>
  );
};

const MainEvents = () => {
  const revealRef = useScrollReveal({ threshold: 0.1 });

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  return (
    <>
      <div className={classes.events_section} ref={revealRef}>
        <h1 className={classes.heading}>Our Events</h1>
        <p className={classes.subheading}>
          Are you interested? Come be a part of Shraddhanjali 2026!
        </p>

        {/* Two events displayed side-by-side as poster + name cards */}
        <div className={classes.two_events_container}>
          {eventsData.map((event) => (
            <EventCard3D key={event.id} event={event} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MainEvents;
