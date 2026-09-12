import { eventsData } from '../assets/eventsData';

/**
 * Event URLs are keyed by slug — /events/gyration rather than /events/9 — so a
 * link is readable when it is pasted into a WhatsApp group or printed on a
 * poster.
 *
 * The numeric ids are still the identity used everywhere else (saved drafts,
 * the sheet, eventsData itself); only the URL changed. Links that were shared
 * before this, like /events/9, still resolve — see findEvent below — so nothing
 * already in circulation breaks.
 */

// Matches a slug case-insensitively, and falls back to the old numeric id.
export const findEvent = (param) => {
  if (param === undefined || param === null) return undefined;

  const key = String(param).trim().toLowerCase();
  const bySlug = eventsData.find((event) => event.slug === key);
  if (bySlug) return bySlug;

  // Legacy /events/9 and /register/10 links.
  return /^\d+$/.test(key)
    ? eventsData.find((event) => event.id === Number(key))
    : undefined;
};

// The canonical URL key for an event. Falls back to the id if an event is ever
// added without a slug, so a missing slug degrades to the old behaviour rather
// than producing /events/undefined.
export const eventKey = (event) => (event && event.slug) || (event && String(event.id)) || '';

export const eventPath = (event) => `/events/${eventKey(event)}`;
export const registerPath = (event) => `/register/${eventKey(event)}`;

// True when the URL used the old numeric form, so the page can quietly rewrite
// the address bar to the slug.
export const isLegacyKey = (param, event) =>
  Boolean(event) && String(param) !== eventKey(event);
