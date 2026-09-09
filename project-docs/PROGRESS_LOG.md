# Progress Log

## Completed

- Rebranded visible festival text to Shraddhanjali 2026.
- Refined Hero: cultural maroon/gold palette, particles, mandala, bilingual title crossfade, countdown, date, and CTA.
- Refined Navbar: classical wordmark, tagline placeholder, cart control, ACEIT external-link cue, and scroll transition.
- Added global registration-paused configuration in `src/config/siteStatus.js`; banner is off by default.
- Restyled cart drawer and floating cart to align with the maroon/gold theme.
- Began About redesign with framed internal panel and shared page background around it.
- Added reusable rotating rangoli artwork and cultural section dividers; removed astronaut/music artwork from the tribute-focused About panel and relocated it to Events as a subtle accent.
- Created Git backup commit `600bda6` before adding the next visual pass.
- Added low-opacity, floating astronaut/music accents in alternating side positions, plus gentle motion on the event artwork and side ornaments.
- Added automatic lifecycle states: sitewide celebration and live status for the event's first 24 hours, followed by a completion message. Preview with `?eventPreview=live` or `?eventPreview=complete`.
- Added distinct cultural ornaments: a floating lotus line motif in the lower-right Events space and a paisley accent in the Footer.
- Replaced the About and FAQ placeholders with provisional public-facing content based on the supplied event description and sample-site information. These remain easy to update when final details arrive.
- Added a responsive, transparent festival-statistics strip after the Hero: one day, two events, 40+ invited colleges, and the confirmed date/location.
- Made the footer shell transparent so the shared maroon backdrop continues through every homepage section; the intentional About and Contact inner panels remain framed.
- Added the tribute tagline and synchronized the Hero countdown with both events: 19 September 2026, 6:30 PM IST.
- Removed the cart and combined checkout flow. Gyration and Don-De-Mode cards now route to their own team-registration form; all cart state and UI files are removed.
- Confirmed both events are team-only, clarified all capacity labels as “Max Participants,” and added a disabled “Download Brochure · Coming Soon” state.
- Matched the About title to the Hero’s Cinzel Decorative treatment, aligned the portrait with the rangoli, and matched Contact Us to the FAQ heading treatment.
- Added Gopal Sharma (8177904081) to Contact Us for website-related queries.
- Replaced the organizer grid with a continuously sliding Arya Student Clubs logo carousel and added the Arya College logo as a featured red badge.
- Added frontend-only EmailJS trigger support for placeholder confirmation and verified-registration templates, controlled through REACT_APP_EMAILJS environment variables.
- Folded Gopal Sharma into the main Contact Us coordinator cards, adjusted the tribute portrait down by four pixels, and refined the registration form with maroon-and-gold surfaces plus subtle floating gold particles and a rotating ornament.
- Enlarged the Arya College logo in the student-clubs badge and added its full name beneath it.

## Current task

Build and visual QA of the direct-registration flow and this UI refinement round.
