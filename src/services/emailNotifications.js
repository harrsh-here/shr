const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

const emailJsConfig = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
  confirmationTemplateId: process.env.REACT_APP_EMAILJS_CONFIRMATION_TEMPLATE_ID,
  verifiedTemplateId: process.env.REACT_APP_EMAILJS_VERIFIED_TEMPLATE_ID,
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
};

const isConfigured = () => Object.values(emailJsConfig).every(Boolean);

const sendTemplate = (templateId, { eventName, registrantName, email, teamSize }) => fetch(EMAILJS_ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    service_id: emailJsConfig.serviceId,
    template_id: templateId,
    user_id: emailJsConfig.publicKey,
    template_params: {
      to_email: email,
      event_name: eventName,
      registrant_name: registrantName,
      team_size: teamSize || "",
      // [PLACEHOLDER: finalize email copy]
    },
  }),
});

export const sendRegistrationEmails = async (registration) => {
  if (!isConfigured()) {
    console.info("EmailJS is awaiting REACT_APP_EMAILJS configuration; registration emails were not sent.");
    return;
  }

  const results = await Promise.allSettled([
    sendTemplate(emailJsConfig.confirmationTemplateId, registration),
    sendTemplate(emailJsConfig.verifiedTemplateId, registration),
  ]);

  if (results.some((result) => result.status === "rejected")) {
    console.warn("One or more EmailJS registration messages could not be sent.");
  }
};
