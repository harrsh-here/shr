// Event starts: 19 Sep 2026, 6:30 PM IST
// Live window: 12 hrs — ends 20 Sep 2026, 6:30 AM IST
const EVENT_START    = new Date("2026-09-19T18:30:00+05:30").getTime();
const LIVE_DURATION  = 12 * 60 * 60 * 1000; // 12 hours in ms

// ─── DEV PREVIEW ──────────────────────────────────────────────────────────────
// Set to one of:  'upcoming' | 'live' | 'complete'
// to force that phase in the browser during development.
// Set back to null before deploying to production.
const DEV_PREVIEW = null;
// ──────────────────────────────────────────────────────────────────────────────

export const getEventLifecycle = () => {
  if (DEV_PREVIEW) return DEV_PREVIEW;
  const now = Date.now();
  if (now < EVENT_START) return "upcoming";
  if (now < EVENT_START + LIVE_DURATION) return "live";
  return "complete";
};
