import React from "react";
import classes from "./Rangoli.module.css";

const Rangoli = ({ className = "" }) => (
  <svg className={`${classes.rangoli} ${className}`} viewBox="0 0 240 240" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="120" cy="120" r="108" strokeDasharray="4 8" opacity="0.48" />
      <circle cx="120" cy="120" r="88" opacity="0.7" />
      <circle cx="120" cy="120" r="50" strokeDasharray="3 5" opacity="0.72" />
      {[...Array(12)].map((_, index) => (
        <g key={index} transform={`rotate(${index * 30} 120 120)`}>
          <path d="M120 120 C102 94 101 67 120 42 C139 67 138 94 120 120Z" />
          <path d="M120 51 C111 67 111 78 120 91 C129 78 129 67 120 51Z" opacity="0.6" />
          <circle cx="120" cy="28" r="5" fill="currentColor" opacity="0.7" />
        </g>
      ))}
      <path d="M120 70 L134 106 L172 106 L141 129 L153 166 L120 143 L87 166 L99 129 L68 106 L106 106 Z" opacity="0.72" />
      <circle cx="120" cy="120" r="17" fill="currentColor" opacity="0.22" />
    </g>
  </svg>
);

export default Rangoli;
