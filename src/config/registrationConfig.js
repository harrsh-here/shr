import paymentQr from "../assets/payment-qr.jpg";

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

// ─── Payment ─────────────────────────────────────────────────────────────────
// Payments are collected on the college's official BillDesk collect page. The
// same destination is offered two ways on the form: the QR image below and the
// plain link. There is no UPI ID and no in-app payment — the participant pays
// on that page and gets a receipt from the gateway.
//
// NOTE: the amount is NOT pre-filled on the BillDesk page; the payer types it
// in. That is why the form states the exact amount so prominently.
export const PAYMENT_LINK =
  "https://payments.billdesk.com/bdcollect/bd/aryacollegeofengineeringandit/22311";

export const PAYMENT_QR = paymentQr;
