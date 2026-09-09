import React from "react";
import artwork from "../../About/about.svg";
import classes from "./FestivalSprite.module.css";

const FestivalSprite = ({ side = "left", className = "" }) => (
  <img
    className={`${classes.sprite} ${side === "right" ? classes.right : classes.left} ${className}`}
    src={artwork}
    alt=""
    aria-hidden="true"
  />
);

export default FestivalSprite;
