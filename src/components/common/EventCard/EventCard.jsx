import React from "react";
import classes from "./EventCard.module.css";
import Button from "../Button/Button";
import { NavLink } from "react-router-dom";
import { eventPath } from "../../../utils/eventRoutes";

const EventCard = ({ eventData }) => {
  const { id, image, name, prizePool, directLink, link } = eventData;

  const CardContent = (
    <div className={classes.card} style={{ position: 'relative' }}>
      {![6, 15, 22, 23, 24].includes(id) && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: '#ff4d4f',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 10,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          ⏸️ Paused
        </div>
      )}
      <div className={classes.img_container}>
        <img
          className={classes.event_image}
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
        />
      </div>
      <h3 className={classes.event_name}>{name}</h3>
      {prizePool && <p className={classes.prizePool}>{prizePool}</p>}
      <div className={classes.view_more_btn}>
        <Button
          hrefLink={directLink ? link : null}
          link={!directLink ? eventPath(eventData) : null}
          label={directLink ? "Register Now" : "View More"}
        />
      </div>
    </div>
  );

  if (directLink) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        {CardContent}
      </a>
    );
  }

  return (
    <NavLink to={eventPath(eventData)} style={{ textDecoration: "none" }}>
      {CardContent}
    </NavLink>
  );
};

export default EventCard;
