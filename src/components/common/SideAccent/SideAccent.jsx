import React from "react";
import classes from "./SideAccent.module.css";

const SideAccent = ({ side = "right" }) => (
  <div className={`${classes.accent} ${side === "left" ? classes.left : classes.right}`} aria-hidden="true">
    <svg viewBox="0 0 220 360">
      <g fill="none" stroke="currentColor">
        <path d="M-20 15 C150 34 170 124 45 180 C-25 211 5 301 180 347" strokeWidth="2" opacity="0.85" />
        <path d="M-2 50 C104 72 126 132 35 174 C-26 202 15 258 142 290" strokeWidth="1" opacity="0.65" />
        {[48, 108, 170, 232, 292].map((y) => (
          <g key={y} transform={`translate(27 ${y}) rotate(-20)`}>
            <path d="M0 0 C18 -17 38 -17 55 0 C38 17 18 17 0 0Z" strokeWidth="1.5" />
            <circle cx="28" cy="0" r="4" fill="currentColor" opacity="0.72" />
          </g>
        ))}
        <circle cx="42" cy="180" r="25" strokeWidth="1.5" strokeDasharray="4 6" />
        <circle cx="42" cy="180" r="7" fill="currentColor" opacity="0.55" />
      </g>
    </svg>
  </div>
);

export default SideAccent;
