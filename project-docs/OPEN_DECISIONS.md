# Open Decisions

- Final Shraddhanjali tagline.
- Final About content.
- Final contact details and FAQ responses.
- Replace old/science-fiction artwork and posters with culturally aligned dance/fashion artwork.
- Decide whether the registration-paused banner message needs alternate wording.
- Backend and payment work are parked: Backend approach undecided (leaning toward exporting registrations to Google Sheets, TBD). Payment gateway already selected by user but integration deferred to a dedicated round.
- Email confirmation logic will need rework once backend (Sheets/Firebase/etc.) is finalized — current implementation is frontend-only via EmailJS.
- EmailJS needs REACT_APP_EMAILJS_SERVICE_ID, REACT_APP_EMAILJS_CONFIRMATION_TEMPLATE_ID, REACT_APP_EMAILJS_VERIFIED_TEMPLATE_ID, and REACT_APP_EMAILJS_PUBLIC_KEY before messages can be sent. Templates contain “[PLACEHOLDER: email copy pending]”.
- Past Glimpses carousel images need replacing with new photos — awaiting from user.
- Event brochure file is pending; the Download Brochure control is currently disabled with a Coming Soon label.
- Current maximum participant counts are 20 for Gyration and 20 for Don-De-Mode (minimums remain 6 and 10 respectively).
