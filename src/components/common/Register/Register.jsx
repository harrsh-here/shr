import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsData } from '../../../assets/eventsData';
import { sendRegistrationEmails } from '../../../services/emailNotifications';
import { GOOGLE_SCRIPT_URL, IS_BACKEND_CONFIGURED, UPI_ID, QR_CODE_PLACEHOLDER } from '../../../config/registrationConfig';
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
        <span className={classes.idIcon}>🪪</span>
        <p>
          <strong>Please carry a photo ID on event day.</strong> Every team member must bring their
          college ID card or a government ID (Aadhaar, Driving Licence, etc.) for verification at
          the reporting desk.
        </p>
      </div>

      <p className={classes.noteText}>
        Questions, or spotted a mistake in your details? The event coordinators are happy to help:
      </p>
      <ul className={classes.noteContactList}>
        {event.contactInfo?.map((c, i) => <li key={i}>{c}</li>)}
      </ul>

      <p className={classes.noteFootnote}>
        As noted during registration, the registration fee is non-refundable.
      </p>
    </div>
    <a href="/" className={classes.backHome}>← Back to Home</a>
  </div>
);

// ─── Main Register Component ──────────────────────────────────────────────────
const Register = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const event = eventsData.find(e => e.id === Number(eventId));

  const [members, setMembers] = useState([]);
  const [utr, setUtr]         = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors]   = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Redirect if event not found
  useEffect(() => {
    if (!event) navigate('/events');
  }, [event, navigate]);

  // Pre-fill (minMembers) member cards on load
  useEffect(() => {
    if (!event) return;
    const count = Math.max(1, event.minMembers);
    setMembers(Array.from({ length: count }, emptyMember));
  }, [eventId]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (!utr.trim()) errs.utr = 'Transaction / Reference ID is required';
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
      const payload = {
        event: event.name,
        eventId: event.id,
        leader: members[0],
        members: members.slice(1),
        totalMembers: members.length,
        totalAmount,
        utr,
        timestamp: new Date().toISOString(),
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

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!event) return null;

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
              Please double-check all team details and ensure your UPI payment is complete before submitting.
              Fees will not be returned under any circumstances, including rejected registrations.
            </p>
          </div>
        </div>

        <div className={classes.idReminder}>
          <span className={classes.idIcon}>🪪</span>
          <p>
            <strong>Carry a photo ID on event day.</strong> Every team member must bring their
            college ID card or a government ID (Aadhaar, Driving Licence, etc.) for verification
            at the reporting desk.
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

            <div className={classes.qrBlock}>
              {QR_CODE_PLACEHOLDER
                ? <img src={QR_CODE_PLACEHOLDER} alt="UPI QR Code" className={classes.qrImg} />
                : (
                  <div className={classes.qrPlaceholder}>
                    <span>QR Code</span>
                    <small>Actual UPI QR to be supplied by organiser</small>
                  </div>
                )
              }
              <div className={classes.upiInfo}>
                <p className={classes.upiLabel}>UPI ID</p>
                <p className={classes.upiValue}>{UPI_ID}</p>
                <p className={classes.upiNote}>
                  Scan the QR or pay to the UPI ID above, then enter your
                  transaction reference below.
                </p>
              </div>
            </div>

            <Field
              label="UPI Transaction / Reference ID (UTR)"
              name="utr"
              value={utr}
              onChange={e => { setUtr(e.target.value); setErrors(p => { const n={...p}; delete n.utr; return n; }); }}
              error={errors.utr}
              placeholder="e.g. 123456789012"
              required
            />

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
