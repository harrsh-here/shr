import React, { useState, useEffect } from 'react';
import FormContainer from './FormContainer';
import InputField from './InputField';
import SelectField from './SelectField';
import PaymentSection from './PaymentSection';
import ImageUpload from './ImageUpload';
import SuccessTicket from './SuccessTicket';
import classes from './Register.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { eventsData } from '../../../assets/eventsData';
import { sendRegistrationEmails } from '../../../services/emailNotifications';

// Apps Script Web App URL
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzpGW-IZQN2WRG1aTYau1UEaK4NMftyl9xStrn2TEY_LE1XhaCUEsnj-IOtKHj5_uXL9w/exec";

const Register = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const selectedEvent = eventsData.find((event) => event.id === Number(eventId));
  const registrationEvents = selectedEvent ? [selectedEvent] : [];

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    college: '',
    year: '',
    branch: '',
    teamName: '',
    theme: '',
    songName: '',
    utr: ''
  });

  const [teamMembers, setTeamMembers] = useState({});
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [loadingStep, setLoadingStep] = useState("");

  // Initialize team members state for the selected team-only event.
  useEffect(() => {
    const initialMembers = {};
    registrationEvents.forEach(event => {
      if (event.type === 'team_fixed') {
        const minOtherMembers = Math.max(0, event.minMembers - 1); // User is 1st member
        initialMembers[event.id] = new Array(minOtherMembers).fill('');
      }
    });
    setTeamMembers(initialMembers);
  }, [eventId]);

  // Return to events when the route does not contain a valid event.
  useEffect(() => {
    if (registrationEvents.length === 0 && !isSubmitted) {
      navigate('/events');
    }
  }, [registrationEvents.length, navigate, isSubmitted]);

  const validate = (data) => {
    let newErrors = {};

    if (!data.fullName.trim()) newErrors.fullName = 'Full Name is required';

    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Email address is invalid';
    }

    if (!data.mobile.trim()) {
      newErrors.mobile = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(data.mobile)) {
      newErrors.mobile = 'Mobile Number must be exactly 10 digits';
    }

    if (!data.college.trim()) newErrors.college = 'College Name is required';
    if (!data.year.trim()) newErrors.year = 'Year is required';
    if (!data.branch.trim()) newErrors.branch = 'Branch is required';
    if (!data.teamName.trim()) newErrors.teamName = 'Team Name is required';
    if (!data.theme.trim()) newErrors.theme = 'Performance theme is required';
    if (!data.songName.trim()) newErrors.songName = 'Song / track name is required';
    if (!data.utr.trim()) newErrors.utr = 'UTR / Transaction ID is required';

    if (!screenshotFile && registrationEvents.length > 0) newErrors.screenshot = 'Payment screenshot is required';

    // Validate team sizes
    registrationEvents.forEach(event => {
      if (event.type === 'team_fixed') {
        const membersCount = (teamMembers[event.id]?.length || 0) + 1; // +1 for the registrant
        if (membersCount < event.minMembers) {
          newErrors[`team_${event.id}`] = `Minimum ${event.minMembers} members required (you + ${event.minMembers - 1} more).`;
        }

        // Ensure all member names are filled if present
        if (teamMembers[event.id]) {
          const hasEmptyNames = teamMembers[event.id].some(name => !name.trim());
          if (hasEmptyNames) {
            newErrors[`team_${event.id}_empty`] = 'All added team member names must be filled.';
          }
        }
      }
    });

    return newErrors;
  };

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === 'mobile') {
      value = value.replace(/\D/g, '');
      if (value.length > 10) return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTeamMemberAction = (eventId, action, index, value) => {
    setTeamMembers(prev => {
      const members = prev[eventId] ? [...prev[eventId]] : [];
      if (action === 'add') {
        members.push('');
      } else if (action === 'remove') {
        members.splice(index, 1);
      } else if (action === 'update') {
        members[index] = value;
      }

      // Clear related errors
      const newErrors = { ...errors };
      delete newErrors[`team_${eventId}`];
      delete newErrors[`team_${eventId}_empty`];
      setErrors(newErrors);

      return { ...prev, [eventId]: members };
    });
  };

  const handleFileSelect = (file) => {
    setScreenshotFile(file);
    if (file && errors.screenshot) {
      setErrors(prev => ({ ...prev, screenshot: '' }));
    }
  };

  const getEventAmount = (event) => {
    const teamSize = (teamMembers[event.id]?.length || 0) + 1;
    return event.feePerPerson ? event.feePerPerson * teamSize : (event.price || 0);
  };

  const totalAmount = registrationEvents.reduce((total, event) => total + getEventAmount(event), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Frontend-only placeholders: both EmailJS templates are triggered at submission.
    // Verification must move server-side after the backend is selected.
    void sendRegistrationEmails({ eventName: selectedEvent.name, registrantName: formData.fullName, email: formData.email });

    setIsSubmitting(true);
    setLoadingStep("Compressing Screenshot...");

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("mobile", formData.mobile);
      data.append("college", formData.college);
      data.append("year", formData.year);
      data.append("branch", formData.branch);
      data.append("teamName", formData.teamName);
      data.append("theme", formData.theme);
      data.append("songName", formData.songName);
      data.append("utr", formData.utr);

      const eventNames = registrationEvents.map(e => e.name);
      data.append("selectedEvents", JSON.stringify(eventNames));

      const teamMembersByName = {};
      Object.keys(teamMembers).forEach(id => {
        const eventName = registrationEvents.find(e => e.id.toString() === id.toString())?.name;
        if (eventName && teamMembers[id].length > 0) {
          teamMembersByName[eventName] = teamMembers[id];
        }
      });
      data.append("teamMembers", JSON.stringify(teamMembersByName));
      data.append("totalAmount", totalAmount);

      if (screenshotFile) {

        // 0. Compress Image before Upload
        const options = {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 1200,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(screenshotFile, options);

        setLoadingStep("Uploading Securely...");

        // 1. Upload directly to Cloudinary
        const cloudinaryData = new FormData();
        // Crucial Fix: Explicitly pass the filename as the 3rd argument for Blobs
        cloudinaryData.append("file", compressedFile, screenshotFile.name || "screenshot.jpg");
        cloudinaryData.append("upload_preset", "Shraddhanjali_tickets");
        cloudinaryData.append("cloud_name", "dykqdgzhy");

        const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dykqdgzhy/image/upload", {
          method: "POST",
          body: cloudinaryData,
        });

        const cloudinaryJson = await cloudinaryRes.json();

        if (!cloudinaryJson.secure_url) {
          throw new Error("Failed to upload image to Cloudinary.");
        }

        // 2. Pass the fast URL to Google Apps Script instead of heavy Base64
        data.append("fileUrl", cloudinaryJson.secure_url);

      } else {
        throw new Error("Screenshot file is missing.");
      }

      setLoadingStep("Generating Shraddhanjali Tickets...");

      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: data
      });

      const result = await response.json();

      if (result.status === "success") {
        const registrationPayload = {
          fullName: formData.fullName,
          selectedEvents: eventNames,
          teamMembers: teamMembersByName,
          utr: formData.utr,
          totalAmount: totalAmount,
          registrationId: result.registrationId
        };

        setRegistrationData(registrationPayload);
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        throw new Error(result.message || "Failed to process registration.");
      }

    } catch (error) {
      setSubmitError(error.message || "Failed to submit registration. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoadingStep("");
    }
  };

  const isFormValid = formData.fullName && formData.email && formData.mobile.length === 10 && formData.college && formData.year && formData.branch && formData.teamName && formData.theme && formData.songName && formData.utr;
  const canProceed = isFormValid && screenshotFile !== null;

  const yearOptions = [
    { value: '1st Year', label: '1st Year' },
    { value: '2nd Year', label: '2nd Year' },
    { value: '3rd Year', label: '3rd Year' },
    { value: '4th Year', label: '4th Year' },
  ];

  if (isSubmitted && registrationData) {
    return (
      <FormContainer>
        <SuccessTicket data={registrationData} />
      </FormContainer>
    );
  }

  if (registrationEvents.length === 0) return null;

  return (
    <FormContainer title="Team Registration">
      <form onSubmit={handleSubmit} className={classes.form}>

        <div className={classes.row}>
          <InputField label="Team Leader's Name" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} placeholder="Team leader's full name" required />
          <InputField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="john@example.com" required />
        </div>

        <InputField label="Mobile Number" type="tel" name="mobile" value={formData.mobile} onChange={handleChange} error={errors.mobile} placeholder="9876543210" required />
        <InputField label="College Name" name="college" value={formData.college} onChange={handleChange} error={errors.college} placeholder="National Institute of Technology" required />

        <div className={classes.row}>
          <SelectField label="Year" name="year" value={formData.year} onChange={handleChange} error={errors.year} options={yearOptions} required />
          <InputField label="Branch" name="branch" value={formData.branch} onChange={handleChange} error={errors.branch} placeholder="Computer Science" required />
        </div>

        <div className={classes.divider}></div>
        <h2 className={classes.sectionTitle}>Team Performance Details<span className={classes.titleUnderline}></span></h2>
        <InputField label="Team Name" name="teamName" value={formData.teamName} onChange={handleChange} error={errors.teamName} placeholder="Enter your team name" required />
        <div className={classes.row}>
          <InputField label="Performance Theme" name="theme" value={formData.theme} onChange={handleChange} error={errors.theme} placeholder="Enter the designated theme" required />
          <InputField label="Song / Track Name" name="songName" value={formData.songName} onChange={handleChange} error={errors.songName} placeholder="Enter your selected song" required />
        </div>

        <div className={classes.divider}></div>
        <h2 className={classes.sectionTitle}>Event & Team Info<span className={classes.titleUnderline}></span></h2>

        <div className={classes.eventsList}>
          {registrationEvents.map(event => (
            <div key={event.id} className={classes.eventCard} style={{ cursor: 'default' }}>
              <div className={classes.eventCardContent}>
                <div className={classes.eventDetails} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <h3 className={classes.eventName} style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '600' }}>{event.name}</h3>
                    <p className={classes.eventPrice} style={{ fontWeight: 'bold' }}>{event.feePerPerson ? `₹${event.feePerPerson} / person` : event.price === 0 ? 'Free' : `₹${event.price}`}</p>
                  </div>
                  {event.type === 'team_fixed' && (
                    <p style={{ color: '#a88bff', fontSize: '0.85rem', marginTop: '4px' }}>
                      Team size: {(teamMembers[event.id]?.length || 0) + 1} · Min {event.minMembers}, Max Participants {event.maxMembers} · Current total ₹{getEventAmount(event)}
                    </p>
                  )}
                </div>
              </div>

              {event.type === 'team_fixed' && (
                <div className={classes.teamSizeInner} style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', marginTop: '12px', paddingTop: '12px' }}>
                  <label className={classes.teamLabel}>Team Members Data</label>

                  {(teamMembers[event.id] || []).map((name, index) => (
                    <div key={index} className={classes.memberInputRow}>
                      <input
                        type="text"
                        placeholder={`Member ${index + 2} Name`}
                        value={name}
                        onChange={(e) => handleTeamMemberAction(event.id, 'update', index, e.target.value)}
                        className={classes.teamInput}
                      />
                      {((teamMembers[event.id]?.length || 0) + 1) > event.minMembers && (
                        <button
                          type="button"
                          className={classes.removeMemberBtn}
                          onClick={() => handleTeamMemberAction(event.id, 'remove', index)}
                          title="Remove Member"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}

                  {((teamMembers[event.id]?.length || 0) + 1) < event.maxMembers ? (
                    <button
                      type="button"
                      className={classes.addMemberBtn}
                      onClick={() => handleTeamMemberAction(event.id, 'add')}
                    >
                      + Add Member
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`${classes.addMemberBtn} ${classes.disabledBtn}`}
                      disabled
                    >
                      Maximum Members Reached
                    </button>
                  )}

                  {errors[`team_${event.id}`] && <div className={classes.eventErrorMessage} style={{ marginTop: '8px', fontSize: '13px' }}>{errors[`team_${event.id}`]}</div>}
                  {errors[`team_${event.id}_empty`] && <div className={classes.eventErrorMessage} style={{ marginTop: '8px', fontSize: '13px' }}>{errors[`team_${event.id}_empty`]}</div>}
                </div>
              )}
            </div>
          ))}
        </div>


        <div className={classes.totalContainer} style={{ marginTop: '20px' }}>
          <span className={classes.totalLabel}>Grand Total:</span>
          <span className={classes.totalValue}>₹<span className={classes.animatedNumber}>{totalAmount}</span></span>
        </div>

        <div className={classes.divider}></div>
        <PaymentSection totalAmount={totalAmount} />
        <InputField label="UTR / Transaction ID *" name="utr" value={formData.utr} onChange={handleChange} error={errors.utr} placeholder="Ex: 123456789012" required />
        <ImageUpload onFileSelect={handleFileSelect} file={screenshotFile} error={errors.screenshot} />

        {submitError && <div className={classes.eventErrorMessage}>{submitError}</div>}

        {isSubmitting ? (
          <div className={classes.processingMessageContainer}>
            <span className={classes.spinnerContainer}>
              <span className={classes.spinner}></span>
            </span>
            <p className={classes.processingMessageText}>
              Hold on, your {loadingStep.includes("Compressing") ? "screenshot is compressing..." :
                loadingStep.includes("Uploading") ? "receipt is uploading securely..." :
                  "ticket is being generated..."}
            </p>
          </div>
        ) : (
          <button type="submit" className={`${classes.submitButton} ${!canProceed ? classes.disabledBtn : ''}`} disabled={!canProceed}>
            <>Submit Registration <span className={classes.arrow}>&rarr;</span></>
          </button>
        )}
      </form>
    </FormContainer>
  );
};

export default Register;
