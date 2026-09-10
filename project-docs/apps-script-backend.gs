/**
 * Shraddhanjali 2026 — Google Apps Script Backend
 * =================================================
 * SETUP INSTRUCTIONS (do this manually):
 *  1. Create a new Google Sheet named "Shraddhanjali 2026 Registrations"
 *  2. Add two tabs: "Gyration" and "Don-De-Mode"
 *  3. In the sheet, open Extensions → Apps Script
 *  4. Paste this entire file into the editor (replace any default content)
 *  5. Save, then click Deploy → New Deployment
 *     - Type: Web App
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  6. Copy the resulting /exec URL
 *  7. Put it in the frontend env as REACT_APP_GOOGLE_SCRIPT_URL
 *     (.env.local for dev, Vercel project settings for production)
 *
 * COLUMNS per tab (added automatically by doPost):
 *   Timestamp | Event | Leader Name | Leader Email | Leader Phone |
 *   Leader College | Leader Year | Leader Branch | Leader Roll No |
 *   Member2 Name | Member2 Email | Member2 Phone | Member2 College |
 *   Member2 Year | Member2 Branch | Member2 Roll No |
 *   ... (same 7 fields repeated for Members 3–20) ...
 *   Total Members | Total Amount | UTR/Transaction ID |
 *   Status | Rejection Reason
 *
 * NOTE: Status column is manually updated by the admin (Pending → Verified or Rejected).
 * NOTE: For Rejected rows, fill the "Rejection Reason" column BEFORE changing Status to "Rejected"
 *       so the onEdit trigger can include it in the email.
 */

// Largest team size across all events (Don-De-Mode allows 20).
// Bump this if any event's maxMembers ever exceeds it.
var MAX_MEMBERS = 20;

// ─── doPost: receives form data and appends to the correct sheet tab ──────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Map event name to sheet tab name
    var tabName = data.event; // "Gyration" or "Don-De-Mode"
    var sheet = ss.getSheetByName(tabName);
    if (!sheet) {
      sheet = ss.insertSheet(tabName);
    }

    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp", "Event",
        "Leader Name", "Leader Email", "Leader Phone",
        "Leader College", "Leader Year", "Leader Branch", "Leader Roll No"
      ];
      for (var m = 2; m <= MAX_MEMBERS; m++) {
        headers.push(
          "Member" + m + " Name", "Member" + m + " Email", "Member" + m + " Phone",
          "Member" + m + " College", "Member" + m + " Year",
          "Member" + m + " Branch", "Member" + m + " Roll No"
        );
      }
      headers.push("Total Members", "Total Amount", "UTR/Transaction ID", "Status", "Rejection Reason");
      sheet.appendRow(headers);

      // Freeze header row
      sheet.setFrozenRows(1);
    }

    // Build the row
    var leader = data.leader;
    var members = data.members || [];

    var row = [
      new Date().toISOString(),
      data.event,
      leader.name, leader.email, leader.phone,
      leader.college, leader.year, leader.branch, leader.rollNo
    ];

    // Fill member columns (leader + MAX_MEMBERS-1 additional members)
    for (var i = 0; i < MAX_MEMBERS - 1; i++) {
      var member = members[i] || {};
      row.push(
        member.name    || "",
        member.email   || "",
        member.phone   || "",
        member.college || "",
        member.year    || "",
        member.branch  || "",
        member.rollNo  || ""
      );
    }

    row.push(
      data.totalMembers,
      data.totalAmount,
      data.utr,
      "Pending",  // Default status
      ""          // Rejection reason (blank by default)
    );

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Registration recorded." }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── onEdit trigger: watches Status column, sends emails on change ────────────
/**
 * HOW TO INSTALL THIS TRIGGER:
 *  1. In the Apps Script editor, click Triggers (clock icon on left sidebar)
 *  2. Click "+ Add Trigger"
 *  3. Function: onEdit
 *     Event source: From spreadsheet
 *     Event type: On edit
 *  4. Save
 *
 * ADMIN NOTES:
 *  - To VERIFY a registration: change the Status cell to "Verified"
 *  - To REJECT a registration: FIRST fill in the "Rejection Reason" cell on that row,
 *    THEN change the Status cell to "Rejected"
 *    (the trigger reads Rejection Reason at the moment Status changes)
 */
function onEdit(e) {
  var range = e.range;
  var sheet = range.getSheet();
  var row   = range.getRow();
  var col   = range.getColumn();

  // Find the Status column index (based on headers)
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var statusColIndex   = headers.indexOf("Status") + 1;
  var rejectionColIndex = headers.indexOf("Rejection Reason") + 1;
  var leaderEmailIndex  = headers.indexOf("Leader Email") + 1;
  var leaderNameIndex   = headers.indexOf("Leader Name") + 1;
  var eventNameIndex    = headers.indexOf("Event") + 1;

  // Only act if the edited cell is in the Status column (and not header row)
  if (col !== statusColIndex || row === 1) return;

  var newStatus     = range.getValue();
  var leaderEmail   = sheet.getRange(row, leaderEmailIndex).getValue();
  var leaderName    = sheet.getRange(row, leaderNameIndex).getValue();
  var eventName     = sheet.getRange(row, eventNameIndex).getValue();
  var rejectionReason = sheet.getRange(row, rejectionColIndex).getValue();

  var subject, body;

  if (newStatus === "Verified") {
    subject = "✅ Registration Confirmed — Shraddhanjali 2026";
    body = [
      "Dear " + leaderName + ",",
      "",
      "Great news! Your team's registration for " + eventName + " at Shraddhanjali 2026 has been verified and confirmed.",
      "",
      "Please arrive at the venue on 19 September 2026 with your team. Final reporting times and venue details will be shared closer to the event.",
      "",
      "REMINDER: The registration fee is strictly non-refundable.",
      "",
      "For any queries, please contact the event coordinators listed on the event page.",
      "",
      "Best regards,",
      "Team Shraddhanjali 2026",
      "Arya College of Engineering & I.T., Jaipur"
    ].join("\n");

  } else if (newStatus === "Rejected") {
    subject = "❌ Registration Not Verified — Shraddhanjali 2026";
    body = [
      "Dear " + leaderName + ",",
      "",
      "Unfortunately, your team's registration for " + eventName + " at Shraddhanjali 2026 could not be verified.",
      "",
      "Reason: " + (rejectionReason || "Not specified — please contact the coordinators."),
      "",
      "IMPORTANT: The registration fee is strictly non-refundable, including in cases of rejected registrations.",
      "If you believe this rejection is in error, please contact the event coordinators immediately.",
      "",
      "We apologise for the inconvenience.",
      "",
      "Best regards,",
      "Team Shraddhanjali 2026",
      "Arya College of Engineering & I.T., Jaipur"
    ].join("\n");

  } else {
    // Any other status change — do nothing
    return;
  }

  if (leaderEmail) {
    GmailApp.sendEmail(leaderEmail, subject, body);
  }
}

// ─── doGet: health check ─────────────────────────────────────────────────────
// Open the /exec URL in a browser after deploying. Seeing this JSON means the
// deployment is live and publicly reachable.
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", service: "Shraddhanjali 2026 registrations" }))
    .setMimeType(ContentService.MimeType.JSON);
}
