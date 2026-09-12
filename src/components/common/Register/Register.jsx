import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsData } from '../../../assets/eventsData';
import { sendRegistrationEmails } from '../../../services/emailNotifications';
import { GOOGLE_SCRIPT_URL, IS_BACKEND_CONFIGURED, PAYMENT_LINK, PAYMENT_QR } from '../../../config/registrationConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faLock } from '@fortawesome/free-solid-svg-icons';
import { parseContact, telHref } from '../../../utils/contactInfo';
import { loadDraft, saveDraft, clearDraft } from '../../../utils/registrationDraft';
import useRegistrationCountdown from '../../../hooks/useRegistrationCountdown';
import { OPENS_AT_LABEL } from '../../../config/registrationWindow';
import classes from './Register.module.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const emptyMember = () => ({
  name: '', college: '', year: '', branch: '', email: '', phone: '', rollNo: '',
});

const validateMember = (m, index) => {
  const errs = {};
  const label = index === 0 ? 'Leader' : `Member ${index + 1}`;
  if (!m.name.trim())    errs[`${index}_name`]    = `${label}: Name is required`;
  if (!m.college.trim()) errs[`${index}_college`]  = `${label}: College is required`;
  if (!m.year)           errs[`${index}_year`]     = `${label}: Year is required`;
  if (!m.branch.trim())  errs[`${index}_branch`]   = `${label}: Branch is required`;
  if (!m.email.trim())   errs[`${index}_email`]    = `${label}: Email is required`;
  else if (!/\S+@\S+\.\S+/.test(m.email)) errs[`${index}_email`] = `${label}: Invalid email`;
  if (!m.phone.trim())   errs[`${index}_phone`]    = `${label}: Phone is required`;
  else if (!/^\d{10}$/.test(m.phone)) errs[`${index}_phone`] = `${label}: Must be 10 digits`;
  if (!m.rollNo.trim())  errs[`${index}_rollNo`]   = `${label}: Roll No. is required`;
  return errs;
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const Field = ({ label, name, type = 'text', value, onChange, error, placeholder, required }) => (
  <div className={classes.fieldWrap}>
    <label className={classes.label}>{label}{required && <span className={classes.req}>*</span>}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${classes.input} ${error ? classes.inputError : ''}`}
      aria-invalid={!!error}
    />
    {error && <p className={classes.errorMsg}>{error}</p>}
  </div>
);

const SelectField = ({ label, name, value, onChange, error, required }) => (
  <div className={classes.fieldWrap}>
    <label className={classes.label}>{label}{required && <span className={classes.req}>*</span>}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`${classes.input} ${classes.select} ${error ? classes.inputError : ''}`}
      aria-invalid={!!error}
    >
      <option value="">Select year</option>
      {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
    </select>
    {error && <p className={classes.errorMsg}>{error}</p>}
  </div>
);

const MemberCard = ({ member, index, isLeader, canRemove, onChange, onRemove, errors }) => (
  <div className={classes.memberCard}>
    <div className={classes.memberCardHeader}>
      <span className={classes.memberBadge}>
        {isLeader ? '★ Team Leader' : `Member ${index + 1}`}
      </span>
      {!isLeader && canRemove && (
        <button type="button" className={classes.removeBtn} onClick={() => onRemove(index)} aria-label={`Remove member ${index + 1}`}>
          ✕ Remove
        </button>
      )}
    </div>
    <div className={classes.memberGrid}>
      <Field label="Full Name" name="name" value={member.name} onChange={e => onChange(index, 'name', e.target.value)} error={errors[`${index}_name`]} placeholder="Full name" required />
      <Field label="Phone" name="phone" type="tel" value={member.phone} onChange={e => onChange(index, 'phone', e.target.value.replace(/\D/g, '').slice(0, 10))} error={errors[`${index}_phone`]} placeholder="10-digit mobile number" required />
      <Field label="Email" name="email" type="email" value={member.email} onChange={e => onChange(index, 'email', e.target.value)} error={errors[`${index}_email`]} placeholder="email@example.com" required />
      <Field label="College Name" name="college" value={member.college} onChange={e => onChange(index, 'college', e.target.value)} error={errors[`${index}_college`]} placeholder="College name" required />
      <SelectField label="Year" name="year" value={member.year} onChange={e => onChange(index, 'year', e.target.value)} error={errors[`${index}_year`]} required />
      <Field label="Branch" name="branch" value={member.branch} onChange={e => onChange(index, 'branch', e.target.value)} error={errors[`${index}_branch`]} placeholder="e.g. Computer Science" required />
      <Field label="University Roll No." name="rollNo" value={member.rollNo} onChange={e => onChange(index, 'rollNo', e.target.value)} error={errors[`${index}_rollNo`]} placeholder="e.g. 22BTECH1234" required />
    </div>
  </div>
);

// ─── Success Screen ───────────────────────────────────────────────────────────
const SuccessScreen = ({ event, leaderEmail, leaderName }) => (
  <div className={classes.successWrap}>
    <div className={classes.successBadge}>✓ Verification Pending</div>
    <h1 className={classes.successHeading}>Registration Received</h1>
    <p className={classes.successBody}>
      Your team's registration for <strong>{event.name}</strong> has been received successfully.
      Our team will manually verify your payment and details. An email will be sent to{' '}
      <strong>{leaderEmail}</strong> with the outcome — either confirming your registration or,
      if there's an issue, explaining the reason for rejection.
    </p>
    <div className={classes.noteBox}>
      <p className={classes.noteTitle}>What happens next</p>

      <p className={classes.noteText}>
        Our team will review your registration and payment details, and you'll hear back by email
        at <strong>{leaderEmail}</strong>. This usually takes a day or two.
      </p>
      <p className={classes.noteText}>
        If anything doesn't match up, we'll email you the reason so it can be sorted out quickly.
      </p>

      <div className={classes.idReminder}>
        <FontAwesomeIcon icon={faIdCard} className={classes.idIcon} />
        <p>
          <strong>Please carry a physical photo ID on event day.</strong> Every team member must
          bring their original college ID card or a government ID (Aadhaar, Driving Licence, etc.).
          Digital copies and photographs are not accepted at the reporting desk.
        </p>
      </div>

      <p className={classes.noteText}>
        Questions, or spotted a mistake in your details? The event coordinators are happy to help:
      </p>
      <ul className={classes.noteContactList}>
        {event.contactInfo?.map((c, i) => {
          const { name, phone } = parseContact(c);
          return (
            <li key={i}>
              {name}
              {phone && (
                <>
                  {' — '}
                  <a href={telHref(phone)} className={classes.phoneLink}>{phone}</a>
                </>
              )}
            </li>
          );
        })}
      </ul>

      <p className={classes.noteFootnote}>
        As noted during registration, the registration fee is non-refundable.
      </p>
    </div>
    <a href="/" className={classes.backHome}>← Back to Home</a>
  </div>
);

const pad = (n) => String(n).padStart(2, '0');

// Shown in place of the form until registrations open. The form is never
// rendered while locked, so reaching /register/:id directly by URL cannot be
// used to submit early.
const LockedScreen = ({ event, countdown, onBack }) => (
  <div className={classes.successWrap}>
    <div className={classes.lockedBadge}>
      <FontAwesomeIcon icon={faLock} /> Registrations Locked
    </div>
    <h1 className={classes.successHeading}>Opening Soon</h1>
    <p className={classes.successBody}>
      Registration for <strong>{event.name}</strong> hasn't opened yet. It goes live on{' '}
      <strong>{OPENS_AT_LABEL}</strong> — this page will unlock automatically, so you can
      keep it open.
    </p>

    <div className={classes.countdown}>
      {[
        { value: countdown.days,    label: 'Days' },
        { value: countdown.hours,   label: 'Hours' },
        { value: countdown.minutes, label: 'Minutes' },
        { value: countdown.seconds, label: 'Seconds' },
      ].map(({ value, label }) => (
        <div key={label} className={classes.countdownUnit}>
          <span className={classes.countdownValue}>{pad(value)}</span>
          <span className={classes.countdownLabel}>{label}</span>
        </div>
      ))}
    </div>

    <button type="button" className={classes.backHome} onClick={onBack}>
      ← Back to Event Details
    </button>
  </div>
);

// ─── Main Register Component ──────────────────────────────────────────────────
const Register = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const event = eventsData.find(e => e.id === Number(eventId));

  const [members, setMembers] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors]   = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const countdown = useRegistrationCountdown();
  const [draftRestored, setDraftRestored] = useState(false);
  // Blocks the save effect from writing over a stored draft with the empty
  // initial state before the restore below has run.
  const hydrated = useRef(false);

  // Redirect if event not found
  useEffect(() => {
    if (!event) navigate('/events');
  }, [event, navigate]);

  // Restore a saved draft if there is one, otherwise start with (minMembers)
  // blank member cards.
  useEffect(() => {
    if (!event) return;
    hydrated.current = false;

    const draft = loadDraft(event.id);
    if (draft) {
      // Team size limits may have changed since the draft was written.
      const clamped = draft.members.slice(0, event.maxMembers);
      while (clamped.length < Math.max(1, event.minMembers)) clamped.push(emptyMember());
      setMembers(clamped);
      setDraftRestored(true);
    } else {
      const count = Math.max(1, event.minMembers);
      setMembers(Array.from({ length: count }, emptyMember));
      setDraftRestored(false);
    }

    hydrated.current = true;
  }, [eventId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist as the form is filled in, so a reload or accidental close does not
  // lose the team's details.
  useEffect(() => {
    if (!event || !hydrated.current || submitted) return;
    saveDraft(event.id, { members });
  }, [event, members, submitted]);

  const totalAmount = event
    ? (event.feePerPerson ?? event.price ?? 0) * members.length
    : 0;

  const handleMemberChange = useCallback((index, field, value) => {
    setMembers(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
    setErrors(prev => { const n = { ...prev }; delete n[`${index}_${field}`]; return n; });
  }, []);

  const addMember = () => {
    if (!event || members.length >= event.maxMembers) return;
    setMembers(prev => [...prev, emptyMember()]);
  };

  const removeMember = (index) => {
    if (!event || members.length <= event.minMembers) return;
    setMembers(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    let errs = {};
    members.forEach((m, i) => Object.assign(errs, validateMember(m, i)));
    if (!confirmed)  errs.confirmed = 'Please confirm your details and non-refund policy';
    if (!event) return errs;
    if (members.length < event.minMembers)
      errs.teamSize = `Minimum ${event.minMembers} members required`;
    if (members.length > event.maxMembers)
      errs.teamSize = `Maximum ${event.maxMembers} members allowed`;
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    try {
      // Every key here maps to a column the Apps Script backend writes; it
      // records its own server-side Timestamp, so nothing else is sent.
      // See project-docs/apps-script-backend.gs.
      const payload = {
        event: event.name,
        leader: members[0],
        members: members.slice(1),
        totalMembers: members.length,
        totalAmount,
      };

      if (IS_BACKEND_CONFIGURED) {
        // NOTE: Content-Type MUST stay text/plain. Any other value makes this a
        // "non-simple" request, so the browser fires a CORS preflight OPTIONS
        // that Apps Script cannot answer and the submission fails. Apps Script
        // still reads the raw JSON body via e.postData.contents.
        const res = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          redirect: 'follow',
        });
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);

        const raw = await res.text();
        let result;
        try {
          result = JSON.parse(raw);
        } catch {
          throw new Error('Unexpected response from the registration server. Please try again.');
        }
        if (result.status !== 'success') throw new Error(result.message || 'Submission failed');
      } else if (process.env.NODE_ENV === 'production') {
        throw new Error('Registrations are not open yet. Please try again shortly or contact the coordinators.');
      } else {
        // Dev mode without a deployed backend: log the payload and continue.
        console.info('[DEV] REACT_APP_GOOGLE_SCRIPT_URL is not set. Payload:', payload);
      }

      // Fire confirmation email (non-blocking)
      void sendRegistrationEmails({
        eventName: event.name,
        registrantName: members[0].name,
        email: members[0].email,
        teamSize: members.length,
      });

      // Only once the registration is safely recorded: keeping it would leave
      // personal details in the browser and could seed a duplicate entry.
      clearDraft(event.id);

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!event) return null;

  // Gate the whole form, not just the submit button: a visitor who types the
  // URL directly gets the countdown, never the form.
  if (!countdown.open) {
    return (
      <div className={classes.page}>
        <LockedScreen event={event} countdown={countdown} onBack={() => navigate(`/events/${event.id}`)} />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={classes.page}>
        <SuccessScreen event={event} leaderEmail={members[0]?.email} leaderName={members[0]?.name} />
      </div>
    );
  }

  return (
    <div className={classes.page}>
      <div className={classes.formCard}>

        {/* Header */}
        <div className={classes.formHeader}>
          <p className={classes.formEvent}>{event.name}</p>
          <h1 className={classes.formTitle}>Team Registration</h1>
          <p className={classes.formMeta}>
            {event.minMembers}–{event.maxMembers} members · ₹{event.feePerPerson ?? event.price} per person
          </p>
        </div>

        {/* Non-refundable warning */}
        <div className={classes.warningBanner}>
          <span className={classes.warnIcon}>⚠</span>
          <div>
            <strong>Registration Fee is Strictly Non-Refundable</strong>
            <p>
              Please double-check all team details and ensure your payment is complete before submitting.
              Fees will not be returned under any circumstances, including rejected registrations.
            </p>
          </div>
        </div>

        {draftRestored && (
          <p className={classes.draftNotice}>
            We've restored the details you'd already entered. Please check them before submitting.
          </p>
        )}

        <div className={classes.idReminder}>
          <FontAwesomeIcon icon={faIdCard} className={classes.idIcon} />
          <p>
            <strong>Carry a physical photo ID on event day.</strong> Every team member must bring
            their original college ID card or a government ID (Aadhaar, Driving Licence, etc.).
            Digital copies and photographs are not accepted at the reporting desk.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Team size errors */}
          {errors.teamSize && <p className={classes.errorMsg} style={{ marginBottom: '1.2rem' }}>{errors.teamSize}</p>}

          {/* ── Section: Members ─────────────────────────────────────── */}
          <div className={classes.sectionBlock}>
            <div className={classes.sectionHeader}>
              <h2 className={classes.sectionTitle}>Team Members</h2>
              <span className={classes.memberCounter}>
                {members.length} of {event.minMembers}–{event.maxMembers} members
              </span>
            </div>

            {members.map((m, i) => (
              <MemberCard
                key={i}
                member={m}
                index={i}
                isLeader={i === 0}
                canRemove={members.length > event.minMembers}
                onChange={handleMemberChange}
                onRemove={removeMember}
                errors={errors}
              />
            ))}

            <button
              type="button"
              className={`${classes.addBtn} ${members.length >= event.maxMembers ? classes.addBtnDisabled : ''}`}
              onClick={addMember}
              disabled={members.length >= event.maxMembers}
            >
              {members.length >= event.maxMembers
                ? `Maximum ${event.maxMembers} members reached`
                : '+ Add Team Member'}
            </button>
          </div>

          {/* ── Section: Payment ─────────────────────────────────────── */}
          <div className={classes.sectionBlock}>
            <h2 className={classes.sectionTitle}>Payment</h2>

            <div className={classes.totalRow}>
              <span className={classes.totalLabel}>Total Amount</span>
              <span className={classes.totalAmount}>₹{totalAmount}</span>
            </div>
            <p className={classes.totalNote}>
              ₹{event.feePerPerson ?? event.price} × {members.length} member{members.length !== 1 ? 's' : ''}
            </p>

            <div className={classes.payHow}>
              <h3 className={classes.payHowTitle}>How to pay</h3>
              <ol className={classes.paySteps}>
                <li>
                  <strong>Scan the QR below, or tap the payment button.</strong> Both go to the
                  same official college payment page — you only need to use one of them.
                </li>
                <li>
                  That page does <strong>not</strong> fill in the amount for you. Type the amount
                  yourself and make sure it is exactly <strong>₹{totalAmount}</strong>{' '}
                  <span className={classes.amountTag}>(total amount)</span>.
                </li>
                <li>
                  Complete the payment. The payment gateway will show you a receipt — save it,
                  you may be asked for it at the reporting desk.
                </li>
                <li className={classes.payStepKey}>
                  <strong>Do not close this page after paying.</strong> Come back here and submit
                  the form below — your registration is only recorded once this form is
                  submitted. Paying alone does not register your team.
                </li>
              </ol>
            </div>

            <div className={classes.qrBlock}>
              <img
                src={PAYMENT_QR}
                alt="Scan to open the Shraddhanjali 2026 payment page"
                className={classes.qrImg}
              />
              <p className={classes.payLinkLabel}>Can't scan from this device?</p>
              <a
                className={classes.payBtn}
                href={PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Payment Page →
              </a>
              <p className={classes.payLinkNote}>
                The QR and the button open the same official payment page. Use whichever is
                easier — scan it from another phone, or tap the button on this one.
              </p>
            </div>

            <div className={classes.amountWarning}>
              <span className={classes.warnIcon}>⚠</span>
              <div>
                <strong>Enter ₹{totalAmount} on the payment page — check it carefully.</strong>
                <p>
                  The amount is typed in by you, so a wrong figure is easy to send. If the amount
                  you pay does not match ₹{totalAmount}, your registration will be put
                  <strong> on hold</strong> and it may be <strong>rejected</strong>. The fee is
                  non-refundable, so please confirm the amount before you pay.
                </p>
              </div>
            </div>

            <label className={classes.checkboxRow}>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => { setConfirmed(e.target.checked); setErrors(p => { const n={...p}; delete n.confirmed; return n; }); }}
                className={classes.checkbox}
              />
              <span>
                I confirm all details are accurate and understand the registration fee is{' '}
                <strong>non-refundable</strong>.
              </span>
            </label>
            {errors.confirmed && <p className={classes.errorMsg}>{errors.confirmed}</p>}
          </div>

          {submitError && <p className={classes.submitError}>{submitError}</p>}

          <button
            type="submit"
            className={classes.submitBtn}
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Submit Registration →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
