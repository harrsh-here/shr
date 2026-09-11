import React, { useMemo } from "react";
import useEventLifecycle from "../../../hooks/useEventLifecycle";
import classes from "./EventCelebration.module.css";

const COLORS = ["#FFD700","#FF9933","#FF6B6B","#4FC3F7","#81C784","#CE93D8","#F48FB1","#FFCC02","#ffffff"];
const EMOJIS = ["🎉","✨","🌸","🎊","🪔","🌺","💛","🎶","🥁","🌼","🎈","🎆"];
const TOTAL = 90; // total particles

const makePieces = () =>
  Array.from({ length: TOTAL }, (_, i) => {
    const isEmoji = i % 3 === 0;
    return {
      id: i,
      left: (i * 1.12) % 100,
      delay: -((i * 0.31) % 7),
      duration: 4.5 + ((i * 2.7) % 5),
      rotation: (i * 53) % 360,
      isEmoji,
      emoji: EMOJIS[i % EMOJIS.length],
      color: COLORS[i % COLORS.length],
      size: 0.7 + ((i * 0.07) % 0.9),   // rem for rectangles
      drift: ((i % 2 === 0 ? 1 : -1) * ((i * 23) % 80)), // px lateral drift
    };
  });

const EventCelebration = () => {
  const state = useEventLifecycle();
  const pieces = useMemo(makePieces, []);

  if (state === "upcoming") return null;

  return (
    <>
      {state === "live" && (
        <div className={classes.confetti} aria-hidden="true">
          {pieces.map((p) =>
            p.isEmoji ? (
              <span
                key={p.id}
                className={classes.emojiPiece}
                style={{
                  left: `${p.left}%`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  fontSize: `${1.2 + ((p.id * 0.09) % 1.2)}rem`,
                  "--drift": `${p.drift}px`,
                  "--rot-end": `${p.rotation + 360}deg`,
                }}
              >
                {p.emoji}
              </span>
            ) : (
              <span
                key={p.id}
                className={classes.piece}
                style={{
                  left: `${p.left}%`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  width: `${p.size * 0.55}rem`,
                  height: `${p.size}rem`,
                  background: p.color,
                  borderRadius: p.id % 5 === 0 ? "50%" : "2px",
                  "--rotation": `${p.rotation}deg`,
                  "--drift": `${p.drift}px`,
                }}
              />
            )
          )}

          {/* Glowing pulse rings at corners */}
          <span className={`${classes.ring} ${classes.ringTL}`} />
          <span className={`${classes.ring} ${classes.ringTR}`} />
          <span className={`${classes.ring} ${classes.ringBL}`} />
          <span className={`${classes.ring} ${classes.ringBR}`} />
        </div>
      )}

      <div
        className={`${classes.status} ${state === "live" ? classes.live : classes.complete}`}
        role="status"
      >
        {state === "live"
          ? "🎉 Shraddhanjali 2026 is happening NOW — celebrate with us! 🎉"
          : "🙏 Shraddhanjali 2026 concluded successfully. Thank you for being part of it. 🙏"}
      </div>
    </>
  );
};

export default EventCelebration;
