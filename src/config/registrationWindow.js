// ─── Registration open time ──────────────────────────────────────────────────
// Registrations unlock at 12 September 2026, 6:00 PM IST. The offset is written
// explicitly so the moment is absolute: it resolves to the same instant no
// matter what timezone the visitor's device is set to.
export const REGISTRATION_OPENS_AT = new Date("2026-09-12T18:00:00+05:30").getTime();

// ─── DEV PREVIEW ─────────────────────────────────────────────────────────────
// Set to true to preview the open state, or false to preview the locked state.
// Leave null before deploying so the real clock decides.
const DEV_FORCE_OPEN = null;
// ─────────────────────────────────────────────────────────────────────────────

export const isRegistrationOpen = () =>
  DEV_FORCE_OPEN !== null ? DEV_FORCE_OPEN : Date.now() >= REGISTRATION_OPENS_AT;

// Milliseconds until registrations open; 0 once they are open.
export const timeUntilOpen = () => Math.max(0, REGISTRATION_OPENS_AT - Date.now());

// Human-readable open time, e.g. "12 September 2026, 6:00 PM IST".
export const OPENS_AT_LABEL = "12 September 2026, 6:00 PM IST";
