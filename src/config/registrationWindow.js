// ─── Registration open time ──────────────────────────────────────────────────
// Registrations opened on 12 September 2026, 8:45 AM IST. The offset is written
// explicitly so the moment is absolute: it resolves to the same instant no
// matter what timezone the visitor's device is set to.
export const REGISTRATION_OPENS_AT = new Date("2026-09-12T08:45:00+05:30").getTime();

// ─── Registration close time ────────────────────────────────────
// Registrations close 17 September 2026, 12:45 PM IST. Written with the
// offset for the same reason as the open time: it is one absolute instant,
// whatever timezone the visitor's device is set to.
export const REGISTRATION_CLOSES_AT = new Date("2026-09-17T12:45:00+05:30").getTime();

// ─── DEV PREVIEW ─────────────────────────────────────────────────────────────
// Set to true to preview the open state, or false to preview the locked state.
// Leave null before deploying so the real clock decides.
const DEV_FORCE_OPEN = null;
// ─────────────────────────────────────────────────────────────────────────────

export const isRegistrationOpen = () => {
  if (DEV_FORCE_OPEN !== null) return DEV_FORCE_OPEN;
  const now = Date.now();
  return now >= REGISTRATION_OPENS_AT && now < REGISTRATION_CLOSES_AT;
};

// Distinguishes "not yet" from "no longer", so the UI can say which.
export const hasRegistrationClosed = () =>
  DEV_FORCE_OPEN !== null ? false : Date.now() >= REGISTRATION_CLOSES_AT;

// Milliseconds until registrations open; 0 once they are open.
export const timeUntilOpen = () => Math.max(0, REGISTRATION_OPENS_AT - Date.now());

// Milliseconds until registrations close; 0 once they have.
export const timeUntilClose = () => Math.max(0, REGISTRATION_CLOSES_AT - Date.now());

// Human-readable open time, e.g. "12 September 2026, 6:00 PM IST".
export const OPENS_AT_LABEL = "12 September 2026, 8:45 AM IST";

// Human-readable close time.
export const CLOSES_AT_LABEL = "17 September 2026, 12:45 PM IST";
