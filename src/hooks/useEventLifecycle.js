import { useEffect, useState } from "react";
import { getEventLifecycle, getNextLifecycleChangeAt } from "../config/eventLifecycle";

/**
 * Keeps time-based event UI in sync without requiring a page refresh.
 * The interval handles normal ticking, while the timeout targets the exact
 * lifecycle boundary and visibility events catch up after a sleeping tab.
 */
const useEventLifecycle = () => {
  const [phase, setPhase] = useState(getEventLifecycle);

  useEffect(() => {
    const refresh = () => setPhase(getEventLifecycle());
    const scheduleBoundaryRefresh = () => {
      const delay = Math.max(0, getNextLifecycleChangeAt() - Date.now()) + 25;
      return window.setTimeout(refresh, delay);
    };

    refresh();
    const intervalId = window.setInterval(refresh, 1000);
    const timeoutId = scheduleBoundaryRefresh();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return phase;
};

export default useEventLifecycle;
