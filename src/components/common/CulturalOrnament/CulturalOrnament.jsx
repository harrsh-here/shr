import React from "react";
import classes from "./CulturalOrnament.module.css";

const CulturalOrnament = ({ type = "lotus", className = "" }) => (
  <svg className={`${classes.ornament} ${className}`} viewBox="0 0 220 180" aria-hidden="true">
    {type === "lotus" ? (
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M110 143 C63 143 31 126 17 96 C52 96 77 109 110 143Z" />
        <path d="M110 143 C157 143 189 126 203 96 C168 96 143 109 110 143Z" />
        <path d="M110 143 C71 112 60 74 75 40 C96 57 107 83 110 143Z" />
        <path d="M110 143 C149 112 160 74 145 40 C124 57 113 83 110 143Z" />
        <path d="M110 143 C91 104 94 61 110 23 C126 61 129 104 110 143Z" />
        <path d="M43 151 H177" opacity="0.65" />
        <path d="M68 160 H152" opacity="0.4" />
        <circle cx="110" cy="143" r="5" fill="currentColor" opacity="0.68" />
      </g>
    ) : (
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M30 20 C166 8 201 80 157 132 C124 170 57 163 55 103 C54 72 81 55 113 68 C139 79 135 115 110 119 C93 122 84 107 90 94" />
        <path d="M46 37 C144 29 169 79 139 119 C113 153 72 137 75 104 C77 81 97 74 113 82" opacity="0.65" />
        <path d="M41 25 L20 8 M54 24 L45 2 M67 22 L70 0 M180 52 L206 40 M183 68 L214 65" opacity="0.6" />
        <circle cx="110" cy="99" r="7" fill="currentColor" opacity="0.55" />
      </g>
    )}
  </svg>
);

export default CulturalOrnament;
