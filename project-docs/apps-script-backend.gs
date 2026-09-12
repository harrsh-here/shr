/**
 * Shraddhanjali 2026 - Google Apps Script Backend
 * =================================================
 * SETUP INSTRUCTIONS (do this manually):
 *  1. Create a new Google Sheet named "Shraddhanjali 2026 Registrations"
 *  2. In the sheet, open Extensions -> Apps Script
 *  3. Paste this entire file into the editor (replace any default content)
 *  4. Save, then click Deploy -> New Deployment
 *     - Type: Web App
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  5. Copy the resulting /exec URL
 *  6. Put it in the frontend env as REACT_APP_GOOGLE_SCRIPT_URL
 *     (.env.local for dev, Vercel project settings for production)
 *
 * A tab is created per event on its first registration ("Gyration",
 * "Don-De-Mode"), so there is nothing to set up by hand.
 *
 * COLUMNS per tab:
 *   Timestamp | Event | Leader Name | Leader Email | Leader Phone |
 *   Leader College | Leader Year | Leader Branch | Leader Roll No |
 *   Member2 Name | Member2 Email | Member2 Phone | Member2 College |
 *   Member2 Year | Member2 Branch | Member2 Roll No |
 *   ... (same 7 fields, repeated only as far as the largest team so far) ...
 *   Total Members | Total Amount | Status | Rejection Reason
 *
 * Every column above is written on every submission. Member columns are
 * created on demand: a tab whose biggest team is 6 has member blocks up to
 * Member6 and no further, and the next 9-member team grows it to Member9.
 * Nothing here is left permanently blank.
 *
 * There is no transaction-ID column. Payment happens on the college BillDesk
 * page (a QR + button on the form), the payer gets a receipt from the gateway,
 * and nothing about the payment is typed into the form - so there is nothing
 * for the sheet to store. If you are upgrading a sheet that still has the old
 * "UTR/Transaction ID" column, run cleanUpLegacyColumns() once (see below).
 *
 * Rows are written BY COLUMN NAME, not by position, so reordering columns in
 * the sheet cannot corrupt later rows.
 *
 * NOTE: Status column is manually updated by the admin (Pending -> Verified or Rejected).
 * NOTE: For Rejected rows, fill the "Rejection Reason" column BEFORE changing Status to "Rejected"
 *       so the onEdit trigger can include it in the email.
 */

// Largest team each event allows, mirroring maxMembers in
// src/assets/eventsData.js. A payload claiming more members than this is
// rejected rather than silently trimmed.
var MAX_MEMBERS_BY_EVENT = {
  "Gyration": 15,
  "Don-De-Mode": 20
};

// Fallback for an event that is not listed above.
var DEFAULT_MAX_MEMBERS = 20;

// The seven fields captured per person, in column order.
var MEMBER_FIELDS = ["Name", "Email", "Phone", "College", "Year", "Branch", "Roll No"];

// Columns that are not per-member, in the order they appear after them.
var TRAILING_HEADERS = ["Total Members", "Total Amount", "Status", "Rejection Reason"];

// Registrations opened 12 September 2026, 8:45 AM IST. The site hides the form
// until then, but that is only a UI state - anyone can POST to this URL
// directly, so the window is enforced here as well. Keep this in sync with
// src/config/registrationWindow.js.
var REGISTRATION_OPENS_AT = new Date("2026-09-12T08:45:00+05:30").getTime();

// --- Header helpers ---------------------------------------------------------

// The full set of columns needed to record a team of `memberCount` people.
function headersFor_(memberCount) {
  var headers = ["Timestamp", "Event"];
  MEMBER_FIELDS.forEach(function (f) { headers.push("Leader " + f); });

  for (var m = 2; m <= memberCount; m++) {
    MEMBER_FIELDS.forEach(function (f) { headers.push("Member" + m + " " + f); });
  }

  return headers.concat(TRAILING_HEADERS);
}

// Flattens a submission into a { columnName: value } map.
function rowMapFor_(data) {
  var leader = data.leader || {};
  var members = data.members || [];
  var values = {
    "Timestamp": new Date().toISOString(),
    "Event": data.event,
    "Leader Name": leader.name || "",
    "Leader Email": leader.email || "",
    "Leader Phone": leader.phone || "",
    "Leader College": leader.college || "",
    "Leader Year": leader.year || "",
    "Leader Branch": leader.branch || "",
    "Leader Roll No": leader.rollNo || ""
  };

  members.forEach(function (member, i) {
    var prefix = "Member" + (i + 2) + " ";
    values[prefix + "Name"]    = member.name    || "";
    values[prefix + "Email"]   = member.email   || "";
    values[prefix + "Phone"]   = member.phone   || "";
    values[prefix + "College"] = member.college || "";
    values[prefix + "Year"]    = member.year    || "";
    values[prefix + "Branch"]  = member.branch  || "";
    values[prefix + "Roll No"] = member.rollNo  || "";
  });

  values["Total Members"]    = data.totalMembers;
  values["Total Amount"]     = data.totalAmount;
  values["Status"]           = "Pending";
  values["Rejection Reason"] = "";
  return values;
}

// Makes sure every column this submission needs exists, adding only the ones
// that are missing. Existing columns are never moved or deleted here - see
// cleanUpLegacyColumns() for that. Returns the sheet's header row.
function ensureHeaders_(sheet, memberCount) {
  var needed = headersFor_(memberCount);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(needed);
    sheet.setFrozenRows(1);
    return needed;
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var missing = needed.filter(function (h) { return headers.indexOf(h) === -1; });
  if (!missing.length) return headers;

  // New member blocks belong before the trailing columns so the sheet stays
  // readable left to right; values are written by name regardless.
  var trailingStart = headers.length;
  TRAILING_HEADERS.forEach(function (h) {
    var at = headers.indexOf(h);
    if (at !== -1 && at < trailingStart) trailingStart = at;
  });

  var newMemberCols = missing.filter(function (h) { return TRAILING_HEADERS.indexOf(h) === -1; });
  var newTrailing   = missing.filter(function (h) { return TRAILING_HEADERS.indexOf(h) !== -1; });

  // The new columns have to be inserted at the position they will occupy, so
  // that Sheets shifts the existing rows' values along with the header. Adding
  // them at the far right and then rewriting the header row in the new order
  // would leave every earlier row's Total Members / Status under the wrong
  // heading.
  if (newMemberCols.length) sheet.insertColumnsBefore(trailingStart + 1, newMemberCols.length);
  if (newTrailing.length) sheet.insertColumnsAfter(sheet.getLastColumn(), newTrailing.length);

  var updated = headers.slice(0, trailingStart)
    .concat(newMemberCols)
    .concat(headers.slice(trailingStart))
    .concat(newTrailing);

  sheet.getRange(1, 1, 1, updated.length).setValues([updated]);
  return updated;
}

// --- doPost: receives form data and appends to the correct sheet tab ---------
function doPost(e) {
  try {
    if (new Date().getTime() < REGISTRATION_OPENS_AT) {
      return jsonOut_({ status: "error", message: "Registrations are not open yet." });
    }

    var data = JSON.parse(e.postData.contents);

    var tabName = data.event; // "Gyration" or "Don-De-Mode"
    if (!tabName) return jsonOut_({ status: "error", message: "Missing event name." });

    var memberCount = (data.members || []).length + 1;
    var allowed = MAX_MEMBERS_BY_EVENT[tabName] || DEFAULT_MAX_MEMBERS;
    if (memberCount > allowed) {
      return jsonOut_({
        status: "error",
        message: tabName + " allows at most " + allowed + " members per team."
      });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName);

    var headers = ensureHeaders_(sheet, memberCount);
    var values = rowMapFor_(data);

    // Written by column name: a column the sheet has but this script does not
    // know about stays blank rather than shifting everything after it.
    var row = headers.map(function (h) {
      return Object.prototype.hasOwnProperty.call(values, h) ? values[h] : "";
    });

    sheet.appendRow(row);

    return jsonOut_({ status: "success", message: "Registration recorded." });

  } catch (err) {
    return jsonOut_({ status: "error", message: err.toString() });
  }
}

function jsonOut_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- One-time cleanup for sheets created by an older version -----------------
/**
 * Removes columns this script never writes - the old "UTR/Transaction ID"
 * column, and member blocks past the largest team that actually registered.
 *
 * Run it from the Apps Script editor: pick cleanUpLegacyColumns from the
 * function dropdown, click Run, then read the execution log for what it did.
 *
 * A column that still holds data is REPORTED AND KEPT, not deleted, so an
 * accidental run cannot lose registrations. If you have read the log and still
 * want those columns gone, set the flag below to true and run it again.
 */
var DELETE_COLUMNS_THAT_STILL_HAVE_DATA = false;

function cleanUpLegacyColumns() {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();

  sheets.forEach(function (sheet) {
    if (sheet.getLastRow() === 0) return;

    var lastCol = sheet.getLastColumn();
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var dataRows = sheet.getLastRow() - 1;

    // The largest team recorded on this tab decides how many member blocks are
    // legitimately in use.
    var biggestTeam = 1;
    var totalCol = headers.indexOf("Total Members");
    if (totalCol !== -1 && dataRows > 0) {
      sheet.getRange(2, totalCol + 1, dataRows, 1).getValues().forEach(function (r) {
        var n = Number(r[0]);
        if (!isNaN(n) && n > biggestTeam) biggestTeam = n;
      });
    }

    var keep = headersFor_(biggestTeam);

    // Right to left, so deleting one column cannot shift the next index.
    for (var c = lastCol; c >= 1; c--) {
      var name = headers[c - 1];
      if (keep.indexOf(name) !== -1) continue;

      var hasData = false;
      if (dataRows > 0) {
        hasData = sheet.getRange(2, c, dataRows, 1).getValues().some(function (r) {
          return r[0] !== "" && r[0] !== null;
        });
      }

      if (hasData && !DELETE_COLUMNS_THAT_STILL_HAVE_DATA) {
        Logger.log('[' + sheet.getName() + '] KEPT "' + name + '" - it still contains data. Set DELETE_COLUMNS_THAT_STILL_HAVE_DATA = true to remove it.');
        continue;
      }

      sheet.deleteColumn(c);
      Logger.log('[' + sheet.getName() + '] Deleted "' + name + '"' + (hasData ? ' (had data)' : ' (was empty)'));
    }
  });

  Logger.log("Cleanup finished.");
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
      "PLEASE CARRY A PHYSICAL PHOTO ID",
      "Every team member must bring their original college ID card or a government ID (Aadhaar, Driving Licence, Passport, etc.). Digital copies and photographs are not accepted. IDs are checked at the reporting desk, and members without one may not be allowed to participate.",
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
