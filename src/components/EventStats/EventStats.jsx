import React from "react";
import classes from "./EventStats.module.css";

const stats = [
  { value: "1", label: "Day", detail: "of cultural celebration" },
  { value: "2", label: "Events", detail: "on the main stage" },
  { value: "40+", label: "Colleges", detail: "welcome across Rajasthan" },
  { value: "19 Sep", label: "2026", detail: "at ACEIT Jaipur" },
];

const EventStats = () => (
  <section className={classes.section} aria-label="Festival highlights">
    <div className={classes.stats}>
      {stats.map((stat) => (
        <div className={classes.item} key={stat.label}>
          <p className={classes.value}>{stat.value}</p>
          <p className={classes.label}>{stat.label}</p>
          <p className={classes.detail}>{stat.detail}</p>
        </div>
      ))}
    </div>
  </section>
);

export default EventStats;
