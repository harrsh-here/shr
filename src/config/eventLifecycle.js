const EVENT_START = new Date("2026-09-19T00:00:00+05:30").getTime();
const LIVE_DURATION = 24 * 60 * 60 * 1000;

export const getEventLifecycle = () => {
  const now = Date.now();
  if (now < EVENT_START) return "upcoming";
  if (now < EVENT_START + LIVE_DURATION) return "live";
  return "complete";
};
