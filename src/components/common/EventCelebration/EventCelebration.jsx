import React, { useEffect, useMemo, useState } from "react";
import { getEventLifecycle } from "../../../config/eventLifecycle";
import classes from "./EventCelebration.module.css";

const EventCelebration = () => {
  const [state, setState] = useState(getEventLifecycle);
  const confetti = useMemo(() => Array.from({ length: 44 }, (_, index) => ({
    id: index,
    left: (index * 29) % 100,
    delay: -((index * 0.37) % 6),
    duration: 5 + ((index * 3) % 4),
    rotation: (index * 47) % 180,
  })), []);

  useEffect(() => {
    const refresh = () => setState(getEventLifecycle());
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener("popstate", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("popstate", refresh);
    };
  }, []);

  if (state === "upcoming") return null;

  return (
    <>
      {state === "live" && (
        <div className={classes.confetti} aria-hidden="true">
          {confetti.map((piece) => (
            <span
              key={piece.id}
              className={classes.piece}
              style={{
                left: `${piece.left}%`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                "--rotation": `${piece.rotation}deg`,
              }}
            />
          ))}
        </div>
      )}
      <div className={`${classes.status} ${state === "live" ? classes.live : classes.complete}`} role="status">
        {state === "live"
          ? "✦ Shraddhanjali 2026 is live — celebrate with us! ✦"
          : "✦ Shraddhanjali 2026 concluded successfully. Thank you for celebrating with us. ✦"}
      </div>
    </>
  );
};

export default EventCelebration;
