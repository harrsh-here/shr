import { EVENT_POSTPONED, POSTPONEMENT_NOTICE } from "./eventLifecycle";

// Keep this false during normal registration. Set it to true only when
// registrations are paused; the sitewide announcement bar will then appear.
export const siteStatus = {
  registrationsPaused: false,
  pausedMessage: "Registrations are temporarily paused. Please check back shortly.",
};

// The message for the sitewide announcement bar, or null for no bar.
// A postponement outranks a registration pause.
export const getAnnouncement = () => {
  if (EVENT_POSTPONED) return POSTPONEMENT_NOTICE;
  if (siteStatus.registrationsPaused) return siteStatus.pausedMessage;
  return null;
};
