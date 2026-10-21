# Shraddhanjali 2026

A modern React-based festival website for Shraddhanjali 2026, celebrating the legacy of Late Er. Shri T.K. Agarwal Ji at Arya College of Engineering & I.T., Jaipur.

Live site: https://arya-shraddhanjali.vercel.app/

## Overview

Shraddhanjali 2026 is a college fest website built to showcase the event lineup, highlight the fest's purpose, share important information, and enable participant registration for the main competitions.

The project is designed as a fast, responsive single-page experience with smooth navigation, event cards, an about section, contact information, and registration workflow backed by Google Apps Script and a BillDesk payment flow.

## Features

- Responsive festival landing page
- Event showcase for Gyration and Don-De-Mode
- Dynamic route-based event detail registration flow
- Contact and organizer sections
- Google Analytics integration
- Smooth scrolling and animated UI
- Vercel-ready deployment setup
- Registration backend integration through Google Apps Script
- Payment redirection to BillDesk collect

## Event Highlights

### Gyration
- Dance competition
- Team-based performance
- Prize pool: up to ₹1,00,000 combined with Don-De-Mode
- Team size: 6 to 15 members

### Don-De-Mode
- Fashion show / ramp event
- Team-based theme presentation
- Prize pool: up to ₹1,00,000 combined with Gyration
- Team size: 10 to 20 members

## Tech Stack

- React
- React Router
- CSS Modules
- Google Apps Script (registration backend)
- Vercel (deployment)
- JavaScript / JSX

## Project Structure

```bash
shr/
├── public/                 # Static assets and public files
├── project-docs/           # Project planning, backend, and design documentation
├── scripts/                # Build-time setup scripts
├── src/                    # React application source code
│   ├── assets/             # Event images, placeholders, and media
│   ├── components/         # Reusable UI components
│   ├── config/             # Site and registration configuration
│   ├── pages/              # Page-level components
│   ├── utils/              # Route and helper utilities
│   ├── App.jsx             # Main app shell and routing
│   └── main.jsx            # App entry point
├── .env.example            # Sample environment variables
├── .gitignore
├── package.json
├── vercel.json             # SPA rewrite config for Vercel
├── README.md
├── GoogleAppsScript_Updated.gs
├── apps_script_backend.gs
├── package-lock.json
└── test.jpg
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm start
```

The app will run in development mode at your local Vercel/CRA environment default port.

## Environment Variables

This project uses environment variables for the registration backend URL.

Copy the sample file and configure the values:

```bash
cp .env.example .env.local
```

Example:

```env
REACT_APP_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/your-script-url/exec
```

Note: the project contains a setup bridge script in `scripts/setup-env.js` to support environments where the bare variable name is preferred over the `REACT_APP_` prefix.

## Deployment

This app is configured for Vercel deployment. The repository includes a `vercel.json` file to ensure client-side routing works correctly:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Deploy to Vercel

1. Import the repository into Vercel.
2. Set the build command to the default React app command.
3. Add your `REACT_APP_GOOGLE_SCRIPT_URL` environment variable.
4. Deploy the project.

## Registration & Payments

The registration flow uses:

- Google Apps Script as the backend processing layer
- BillDesk as the payment platform
- Form submission and validation logic within the frontend and backend script

The project already includes configuration references for these integrations in:

- `src/config/registrationConfig.js`
- `project-docs/apps-script-backend.gs`
- `.env.example`

## Documentation

Project documentation is available under the `project-docs/` folder:

- `PROJECT_BRIEF.md`
- `DESIGN_SYSTEM.md`
- `OPEN_DECISIONS.md`
- `PROGRESS_LOG.md`
- `apps-script-backend.gs`

## Contact

- College: Arya College of Engineering & I.T., Jaipur
- Purpose: Shraddhanjali 2026 Fest Website
- Queries: Refer to the project documentation and the contact section in the app

## License

This project is intended for educational and event-promotion purposes for Arya College's Shraddhanjali 2026 event.

## Acknowledgements

This project is dedicated to the memory of Late Er. Shri T.K. Agarwal Ji and reflects the effort of the organizing team, contributors, and college community behind Shraddhanjali 2026.

---

