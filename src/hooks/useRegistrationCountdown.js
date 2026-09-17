import { useEffect, useState } from "react";
import {
  isRegistrationOpen,
  hasRegistrationClosed,
  timeUntilOpen,
  timeUntilClose,
} from "../config/registrationWindow";

const breakdown = (ms) => ({
  days:    Math.floor(ms / 86400000),
  hours:   Math.floor((ms % 86400000) / 3600000),
  minutes: Math.floor((ms % 3600000) / 60000),
  seconds: Math.floor((ms % 60000) / 1000),
});

// Before the window: counts down to the open. Inside it: counts down to the
// close, so the page can show how long is left and shut itself at the moment
// it ends. After it: nothing left to count.
const read = () => {
  const open = isRegistrationOpen();
  const closed = hasRegistrationClosed();
  return { open, closed, remaining: closed ? 0 : open ? timeUntilClose() : timeUntilOpen() };
};

/**
 * Ticks once a second so the UI opens and closes on time without the visitor
 * reloading the page.
 */
const useRegistrationCountdown = () => {
  const [state, setState] = useState(read);

  useEffect(() => {
    if (state.closed) return undefined;
    // Re-read rather than trusting the countdown reaching zero, so a device
    // whose clock jumps still flips correctly.
    const id = setInterval(() => setState(read()), 1000);
    return () => clearInterval(id);
  }, [state.closed]);

  return { ...state, ...breakdown(state.remaining) };
};

export default useRegistrationCountdown;
