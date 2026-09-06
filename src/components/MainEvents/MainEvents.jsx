import React, { useEffect } from "react";
import classes from "./MainEvents.module.css";
import { eventsData } from "../../assets/eventsData";
import ReactGA from "react-ga";
import { NavLink } from "react-router-dom";

const MainEvents = () => {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  });

  return (
    <>
      <div className={classes.events_section}>
        <h1 className={classes.heading}>Our Events</h1>
        <p className={classes.subheading}>
          Are you interested? Come be a part of Shraddhanjali 2026!
        </p>

        {/* Two events displayed side-by-side as poster + name cards */}
        <div className={classes.two_events_container}>
          {eventsData.map((event) => (
            <NavLink
              key={event.id}
              to={`/events/${event.id}`}
              className={classes.poster_link}
              style={{ textDecoration: "none" }}
            >
              <div className={classes.poster_card}>
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
          ))}
        </div>
      </div>
    </>
  );
};

export default MainEvents;
