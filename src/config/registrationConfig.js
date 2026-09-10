// ─── Registration Backend Config ─────────────────────────────────────────────
// The Apps Script Web App URL is read from the environment so it never has to be
// committed. Create a `.env.local` (dev) and set the same key in your Vercel
// project settings (prod):
//
//   REACT_APP_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfy.../exec
//
// See /project-docs/apps-script-backend.gs for the deployment steps.

export const GOOGLE_SCRIPT_URL =
  process.env.REACT_APP_GOOGLE_SCRIPT_URL || "PLACEHOLDER_GOOGLE_SCRIPT_URL";

export const IS_BACKEND_CONFIGURED =
  Boolean(GOOGLE_SCRIPT_URL) && GOOGLE_SCRIPT_URL !== "PLACEHOLDER_GOOGLE_SCRIPT_URL";

// UPI collection details shown on the payment step.
export const UPI_ID = process.env.REACT_APP_UPI_ID || "PLACEHOLDER@upi";
export const UPI_PAYEE_NAME = process.env.REACT_APP_UPI_PAYEE_NAME || "Shraddhanjali 2026";

// Drop the organiser's UPI QR image into src/assets/ and import it here.
// e.g. import upiQr from "../assets/upi-qr.png";  ->  export const QR_CODE_PLACEHOLDER = upiQr;
export const QR_CODE_PLACEHOLDER = null;
