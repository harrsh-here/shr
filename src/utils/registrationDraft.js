// ─── Registration draft persistence ──────────────────────────────────────────
// Keeps a half-filled registration form alive across reloads and accidental
// tab closes. Drafts are per-event, stored only in this browser, and cleared
// as soon as the registration is submitted.
//
// Note this holds names, emails and phone numbers, so it is deliberately
// short-lived and removed on submit rather than left lying around on what may
// be a shared or lab computer.

const PREFIX = 'shraddhanjali:registration-draft:v1:';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const keyFor = (eventId) => `${PREFIX}${eventId}`;

// Only these fields are read back, so a tampered or outdated payload cannot
// introduce unexpected keys into component state.
const MEMBER_FIELDS = ['name', 'college', 'year', 'branch', 'email', 'phone', 'rollNo'];

const sanitiseMember = (raw) => {
  const member = {};
  MEMBER_FIELDS.forEach((field) => {
    member[field] = typeof raw?.[field] === 'string' ? raw[field] : '';
  });
  return member;
};

export const clearDraft = (eventId) => {
  try {
    window.localStorage.removeItem(keyFor(eventId));
  } catch {
    // Storage unavailable (private mode, blocked cookies) — nothing to clean up.
  }
};

export const loadDraft = (eventId) => {
  try {
    const raw = window.localStorage.getItem(keyFor(eventId));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.members)) return null;

    // Drop stale drafts rather than resurfacing details from weeks ago.
    if (typeof parsed.savedAt !== 'number' || Date.now() - parsed.savedAt > MAX_AGE_MS) {
      clearDraft(eventId);
      return null;
    }

    const members = parsed.members.map(sanitiseMember);
    const teamName = typeof parsed.teamName === 'string' ? parsed.teamName : '';

    // A draft where nothing was actually typed is not worth restoring.
    const hasContent = teamName.trim() || members.some((m) => MEMBER_FIELDS.some((f) => m[f].trim()));
    if (!hasContent) return null;

    // Older drafts also carried a `utr` field; payments no longer go through a
    // transaction ID typed into the form, so anything stored there is dropped.
    return { teamName, members };
  } catch {
    // Corrupt JSON or unavailable storage: fall back to a blank form.
    return null;
  }
};

export const saveDraft = (eventId, { teamName, members }) => {
  try {
    window.localStorage.setItem(
      keyFor(eventId),
      JSON.stringify({ teamName, members, savedAt: Date.now() }),
    );
  } catch {
    // Quota exceeded or storage blocked — the form still works, just without
    // reload protection.
  }
};
