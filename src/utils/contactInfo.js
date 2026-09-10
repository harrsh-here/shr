// Contact entries in eventsData are authored as plain strings, e.g.
// "Vaidik Nama — +91 9462243420". These helpers split that into a name and a
// dialable number so the number can be rendered as a tel: link.

const CONTACT_PATTERN = /^(.*?)\s*[—–-]\s*(\+?[\d][\d\s-]{6,})$/;

export const parseContact = (entry) => {
  const text = String(entry ?? '').trim();
  const match = text.match(CONTACT_PATTERN);
  // Unparseable entries fall back to plain text rather than breaking the list.
  if (!match) return { name: text, phone: null };
  return { name: match[1].trim(), phone: match[2].trim() };
};

export const telHref = (phone) => `tel:${String(phone).replace(/[^+\d]/g, '')}`;
