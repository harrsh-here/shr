import React from "react";
import classes from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={classes.loadingContainer}>
      <div className={classes.diya}>
        <div className={classes.flame}></div>
        <div className={classes.bowl}></div>
      </div>
      <div className={classes.loadingText}>Shraddhanjali 2026</div>
    </div>
  );
};

export default Loading;
