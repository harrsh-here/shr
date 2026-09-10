import { useEffect, useState } from "react";
import { isRegistrationOpen, timeUntilOpen } from "../config/registrationWindow";

const breakdown = (ms) => ({
  days:    Math.floor(ms / 86400000),
  hours:   Math.floor((ms % 86400000) / 3600000),
  minutes: Math.floor((ms % 3600000) / 60000),
  seconds: Math.floor((ms % 60000) / 1000),
});

/**
 * Ticks once a second until registrations open, then reports `open: true` so
 * the UI unlocks without the visitor needing to reload the page.
 */
const useRegistrationCountdown = () => {
  const [state, setState] = useState(() => ({
    open: isRegistrationOpen(),
    remaining: timeUntilOpen(),
  }));

  useEffect(() => {
    if (state.open) return undefined;
    const id = setInterval(() => {
      const remaining = timeUntilOpen();
      // Re-check rather than trusting the countdown reaching zero, so a device
      // whose clock jumps forward still unlocks correctly.
      setState({ open: isRegistrationOpen(), remaining });
    }, 1000);
    return () => clearInterval(id);
  }, [state.open]);

  return { ...state, ...breakdown(state.remaining) };
};

export default useRegistrationCountdown;
