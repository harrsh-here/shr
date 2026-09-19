// Event starts: 19 Sep 2026, 6:00 PM IST
// Live window: 12 hrs — ends 20 Sep 2026, 6:00 AM IST
//
// This is the only place the start time lives. The Hero countdown imports it
// rather than keeping its own copy, so the two can no longer drift apart.
export const EVENT_START = new Date("2026-09-19T18:00:00+05:30").getTime();
const LIVE_DURATION  = 12 * 60 * 60 * 1000; // 12 hours in ms

// ─── POSTPONEMENT ─────────────────────────────────────────────────────────────
// Postponed on 19 Sep 2026 due to weather; officials will announce a new date.
// While true, every date on the site reads "Date to be announced", the hero
// shows the postponement notice instead of a countdown, and the time-based
// "live" / "complete" phases never fire.
//
// When the new date is announced: update EVENT_START above, EVENT_DATE_LABEL
// and EVENT_TIME_LABEL below, then set this back to false.
export const EVENT_POSTPONED = true;

export const EVENT_DATE_LABEL = "19 September 2026";
export const EVENT_TIME_LABEL = "6:00 PM onwards";

// What the site actually displays as "when", in one line.
export const EVENT_WHEN = EVENT_POSTPONED
  ? "Date to be announced"
  : `${EVENT_DATE_LABEL} · ${EVENT_TIME_LABEL}`;

// Copy is kept here with the switch so the notice reads the same everywhere.
export const POSTPONEMENT_NOTICE =
  "Shraddhanjali 2026 has been postponed due to weather conditions. The new date will be announced soon.";
export const POSTPONEMENT_REGISTERED_NOTE =
  "Already registered? Your registration remains valid for the new date, so there's no need to register again. We'll share the updated schedule as soon as it's confirmed. For any questions, please reach out to the event coordinators.";

// ─── DEV PREVIEW ──────────────────────────────────────────────────────────────
// Set to one of:  'upcoming' | 'live' | 'complete' | 'postponed'
// to force that phase in the browser during development.
// Set back to null before deploying to production.
const DEV_PREVIEW = null;
// ──────────────────────────────────────────────────────────────────────────────

export const getEventLifecycle = () => {
  if (DEV_PREVIEW) return DEV_PREVIEW;
  if (EVENT_POSTPONED) return "postponed";
  const now = Date.now();
  if (now < EVENT_START) return "upcoming";
  if (now < EVENT_START + LIVE_DURATION) return "live";
  return "complete";
};

export const getNextLifecycleChangeAt = () => {
  const now = Date.now();
  // Nothing is scheduled while postponed.
  if (EVENT_POSTPONED) return now;
  if (now < EVENT_START) return EVENT_START;
  if (now < EVENT_START + LIVE_DURATION) return EVENT_START + LIVE_DURATION;
  return now;
};
