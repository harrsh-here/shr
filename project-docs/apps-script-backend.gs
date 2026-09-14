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
 * COLUMNS per tab - everything worth reading comes first, and the per-member
 * detail follows, so Status and the payment reference are visible without
 * scrolling past a couple of hundred member columns:
 *   Timestamp | Event | Team Name | Total Members | Total Amount | UTR |
 *   duplicate_utr | Status | Rejection Reason |
 *   Leader Name | Leader Email | Leader Phone | Leader College |
 *   Leader Year | Leader Branch | Leader Roll No |
 *   Member2 Name ... Member2 Roll No | Member3 ... |
 *   ... (repeated only as far as the largest team so far) ...
 *
 * A sheet built by an earlier version has those columns at the far right
 * instead. Run reorderColumns() once to bring them to the front; rows are
 * written by column name, so nothing breaks either way.
 *
 * Every column above is written on every submission. Member columns are
 * created on demand: a tab whose biggest team is 6 has member blocks up to
 * Member6 and no further, and the next 9-member team grows it to Member9.
 * Nothing here is left permanently blank.
 *
 * HARD_MAX_MEMBERS is capacity, not the stage limit. Each event shows
 * participants its own smaller limit ("max stage limit 15/20"); this is the
 * figure that actually refuses a submission, and it is deliberately not shown
 * to them. Keep it in sync with TEAM_SIZE_HARD_CAP in src/assets/eventsData.js.
 *
 * Payment happens on the college BillDesk page (a QR + button on the form).
 * The payer then copies the transaction reference from their receipt into the
 * form, and it lands in the UTR column, which is how a payment is matched to a
 * registration.
 *
 * UTRs are normalised (spaces and hyphens stripped, upper-cased) before they
 * are stored or compared, and the column is forced to plain text so a 12-digit
 * reference is not mangled into 1.23457E+11 or stripped of its leading zeros.
 *
 * Every row also carries duplicate_utr: "Yes" when that reference already
 * appears on any tab, "No" otherwise. The first use of a reference reads "No"
 * and the later one reads "Yes", so filtering that column to Yes shows exactly
 * the rows worth a second look. The registration is still recorded either way -
 * the team may well have paid - and Status is left alone for the admin
 * workflow (Pending -> Verified or Rejected).
 *
 * Rows are written BY COLUMN NAME, not by position, so reordering columns in
 * the sheet cannot corrupt later rows.
 *
 * Timestamp is recorded in readable IST - "12 Sep 2026, 4:38 PM IST" - because
 * the sheet is read by people. It is text, not a date value, so rows sort
 * chronologically by their order in the sheet rather than by sorting on that
 * column.
 *
 * NOTE: Status column is manually updated by the admin (Pending -> Verified or Rejected).
 * NOTE: For Rejected rows, fill the "Rejection Reason" column BEFORE changing Status to "Rejected"
 *       so the onEdit trigger can include it in the email.
 */

// Capacity: the largest team the sheet will accept, for any event. This is not
// the stage limit shown on the site (15 for Gyration, 20 for Don-De-Mode) - it
// is the figure that actually refuses a submission, and participants are not
// shown it. Mirrors TEAM_SIZE_HARD_CAP in src/assets/eventsData.js.
var HARD_MAX_MEMBERS = 35;

// Columns that come before the people, in order. Everything an organiser reads
// at a glance lives here, ahead of the member detail.
var LEADING_HEADERS = [
  "Timestamp", "Event", "Team Name",
  "Total Members", "Total Amount", "UTR", "duplicate_utr",
  "Status", "Rejection Reason"
];

// The seven fields captured per person, in column order.
var MEMBER_FIELDS = ["Name", "Email", "Phone", "College", "Year", "Branch", "Roll No"];

// Columns that are not per-member, in the order they appear after them.
// Nothing follows the member blocks any more; kept as an empty list so the
// header helpers below read the same way.
var TRAILING_HEADERS = [];

// Values written into duplicate_utr. Plain Yes/No so the column can be filtered
// and eyeballed without interpretation.
var DUPLICATE_YES = "Yes";
var DUPLICATE_NO = "No";

// Registrations opened 12 September 2026, 8:45 AM IST. The site hides the form
// until then, but that is only a UI state - anyone can POST to this URL
// directly, so the window is enforced here as well. Keep this in sync with
// src/config/registrationWindow.js.
var REGISTRATION_OPENS_AT = new Date("2026-09-12T08:45:00+05:30").getTime();

// Registrations are read by people, so the Timestamp column is written as
// readable IST rather than a raw ISO string: "12 Sep 2026, 4:38 PM IST" instead
// of "2026-09-12T11:08:40.744Z". The zone is stated explicitly so it does not
// depend on the spreadsheet's own timezone setting.
function timestamp_() {
  return Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, h:mm a") + " IST";
}

// --- Payment reference helpers ----------------------------------------------

// A reference is copied out of a receipt, an SMS or a screenshot, so it arrives
// with stray spaces, hyphens and inconsistent case. Everything downstream -
// storage, duplicate checks, an organiser searching the column - depends on the
// same payment always producing the same string.
function normaliseUtr_(value) {
  return String(value == null ? "" : value).replace(/[\s-]/g, "").toUpperCase();
}

// Deliberately permissive. A UPI UTR is 12 digits, but the BillDesk page hands
// back longer alphanumeric references, and someone who has genuinely paid must
// not be turned away by a format guess that is too narrow.
function isPlausibleUtr_(utr) {
  return /^[A-Z0-9]{6,40}$/.test(utr);
}

// True when this reference already appears on any tab. Catches a double
// submission and catches one team reusing another team's reference; either way
// an organiser should look at it rather than the sheet deciding on its own.
function utrAlreadyUsed_(utr) {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();

  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    if (sheet.getLastRow() < 2) continue;

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var col = headers.indexOf("UTR") + 1;
    if (col === 0) continue;

    var existing = sheet.getRange(2, col, sheet.getLastRow() - 1, 1).getValues();
    for (var r = 0; r < existing.length; r++) {
      if (normaliseUtr_(existing[r][0]) === utr) return true;
    }
  }

  return false;
}

// Sheets helpfully turns "123456789012" into a number and "0012..." into "12",
// which destroys a reference. Forcing the column to plain text BEFORE the row
// is written is the only way to keep exactly what the payer typed.
function forceTextColumn_(sheet, headers, name) {
  var col = headers.indexOf(name) + 1;
  if (col === 0) return;
  sheet.getRange(1, col, sheet.getMaxRows(), 1).setNumberFormat("@");
}

// --- Header helpers ---------------------------------------------------------

// The full set of columns needed to record a team of `memberCount` people.
function headersFor_(memberCount) {
  var headers = LEADING_HEADERS.slice();
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
    "Timestamp": timestamp_(),
    "Event": data.event,
    "Team Name": data.teamName || "",
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
  values["UTR"]              = normaliseUtr_(data.utr);
  values["duplicate_utr"]    = DUPLICATE_NO;  // doPost upgrades this to Yes
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

  // Each missing column is inserted at the position it belongs in, rather than
  // appended and reordered: Sheets shifts the existing rows' values along with
  // the column, so earlier rows keep their values under the right headings.
  // Adding at the far right and rewriting the header row would silently move
  // every old row's Total Members / Status under a neighbouring heading.
  missing.forEach(function (h) {
    var canonicalIndex = needed.indexOf(h);

    // Sit directly after the nearest earlier column that this sheet has.
    var insertAt = 0;
    for (var k = canonicalIndex - 1; k >= 0; k--) {
      var at = headers.indexOf(needed[k]);
      if (at !== -1) { insertAt = at + 1; break; }
    }

    if (insertAt >= headers.length) {
      sheet.insertColumnsAfter(headers.length, 1);
      insertAt = headers.length;
    } else {
      sheet.insertColumnsBefore(insertAt + 1, 1);
    }
    headers.splice(insertAt, 0, h);
  });

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  return headers;
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

    var utr = normaliseUtr_(data.utr);
    if (!utr) {
      return jsonOut_({ status: "error", message: "Missing payment reference (UTR)." });
    }
    if (!isPlausibleUtr_(utr)) {
      return jsonOut_({
        status: "error",
        message: "That payment reference does not look right. Copy it exactly as shown on your receipt."
      });
    }

    var memberCount = (data.members || []).length + 1;
    if (memberCount > HARD_MAX_MEMBERS) {
      return jsonOut_({
        status: "error",
        message: "That team is too large to register online. Please contact the coordinators."
      });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName);

    var headers = ensureHeaders_(sheet, memberCount);
    forceTextColumn_(sheet, headers, "UTR");

    var values = rowMapFor_(data);

    // A reference seen before is still recorded - the team may well have paid -
    // but it is marked so nobody has to spot it by eye. Status is left for the
    // admin workflow rather than being overloaded with this.
    values["duplicate_utr"] = utrAlreadyUsed_(utr) ? DUPLICATE_YES : DUPLICATE_NO;

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

// --- Test helpers: put a dummy registration in the sheet ---------------------
/**
 * VERIFYING A DEPLOYMENT
 *
 * insertDummyRow() writes one fake registration through the exact same code
 * path a real submission uses, so whatever appears in the sheet is what real
 * participants will produce - including the Team Name column.
 *
 * Run it from the Apps Script editor: choose insertDummyRow in the function
 * dropdown, click Run, then look at the Gyration tab. The row is labelled
 * "TEST TEAM (dummy)" in the Team Name column and its Status is "TEST".
 *
 * When you are done, run deleteDummyRows() to remove every row it created.
 */
var DUMMY_TEAM_NAME = "TEST TEAM (dummy)";

function insertDummyRow() {
  var members = [];
  for (var i = 1; i <= 6; i++) {
    members.push({
      name: "Test Member " + i,
      email: "test" + i + "@example.com",
      phone: "90000000" + i,
      college: "Arya College of Engineering & I.T.",
      year: "2nd Year",
      branch: "Computer Science",
      rollNo: "22BTECH" + (1000 + i)
    });
  }

  var payload = {
    event: "Gyration",
    teamName: DUMMY_TEAM_NAME,
    utr: "TESTUTR" + new Date().getTime(),
    leader: members[0],
    members: members.slice(1),
    totalMembers: members.length,
    totalAmount: members.length * 50
  };

  var response = doPost({ postData: { contents: JSON.stringify(payload) } });
  Logger.log("doPost said: " + response.getContent());

  // Mark it so nobody mistakes it for a real registration.
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(payload.event);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var statusCol = headers.indexOf("Status") + 1;
  if (statusCol > 0) sheet.getRange(sheet.getLastRow(), statusCol).setValue("TEST");

  Logger.log('Dummy row added to "%s" at row %s. Team Name column is %s.',
    payload.event, sheet.getLastRow(), columnLetter_(headers.indexOf("Team Name") + 1));
  Logger.log("Run deleteDummyRows() when you are finished checking.");
}

function deleteDummyRows() {
  var removed = 0;

  SpreadsheetApp.getActiveSpreadsheet().getSheets().forEach(function (sheet) {
    if (sheet.getLastRow() < 2) return;

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var teamCol = headers.indexOf("Team Name") + 1;
    if (teamCol === 0) return;

    var values = sheet.getRange(2, teamCol, sheet.getLastRow() - 1, 1).getValues();

    // Bottom to top, so deleting a row cannot shift the ones still to check.
    for (var r = values.length - 1; r >= 0; r--) {
      if (values[r][0] === DUMMY_TEAM_NAME) {
        sheet.deleteRow(r + 2);
        removed++;
      }
    }
  });

  Logger.log("Removed %s dummy row(s).", removed);
}

// A1-style letter for a column index, purely so the log can point at it.
function columnLetter_(index) {
  if (index < 1) return "(missing)";
  var letter = "";
  while (index > 0) {
    var rem = (index - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    index = Math.floor((index - rem) / 26);
  }
  return letter;
}

// --- One-off: move the key columns to the front ------------------------------
/**
 * A sheet built by an earlier version has Total Members, Total Amount, UTR,
 * duplicate_utr, Status and Rejection Reason at the far right, past every
 * member column. This rewrites each tab so they sit just after Team Name.
 *
 * Run it from the Apps Script editor: pick reorderColumns from the function
 * dropdown and click Run. No deployment needed, so the website is unaffected.
 *
 * Values move with their headings - rows are matched by column name, not
 * position - and any column this script does not recognise (an older
 * "UTR/Transaction ID", or anything you added by hand) is kept and placed
 * directly after Rejection Reason rather than being dropped.
 *
 * Safe to run twice: a sheet already in this order is left untouched.
 */
function reorderColumns() {
  SpreadsheetApp.getActiveSpreadsheet().getSheets().forEach(function (sheet) {
    if (sheet.getLastRow() < 1 || sheet.getLastColumn() < 1) return;

    var width = sheet.getLastColumn();
    var height = sheet.getLastRow();
    var grid = sheet.getRange(1, 1, height, width).getValues();
    var headers = grid[0];

    if (headers.indexOf("Timestamp") === -1) return;  // not a registrations tab

    // Biggest team on this tab decides how many member blocks to account for.
    var biggest = 1;
    var totalCol = headers.indexOf("Total Members");
    if (totalCol !== -1) {
      for (var r = 1; r < grid.length; r++) {
        var n = Number(grid[r][totalCol]);
        if (!isNaN(n) && n > biggest) biggest = n;
      }
    }

    var wanted = headersFor_(biggest).filter(function (h) {
      return headers.indexOf(h) !== -1;
    });

    // Unknown columns keep their relative order, parked after the key columns.
    var extras = headers.filter(function (h) {
      return h !== "" && wanted.indexOf(h) === -1;
    });
    var insertAt = wanted.indexOf("Rejection Reason");
    var order = insertAt === -1
      ? wanted.concat(extras)
      : wanted.slice(0, insertAt + 1).concat(extras, wanted.slice(insertAt + 1));

    var alreadyOrdered = order.length === headers.filter(function (h) { return h !== ""; }).length
      && order.every(function (h, i) { return headers[i] === h; });
    if (alreadyOrdered) {
      Logger.log('[%s] already in order; left alone.', sheet.getName());
      return;
    }

    var index = {};
    headers.forEach(function (h, i) { if (index[h] === undefined) index[h] = i; });

    var rewritten = grid.map(function (row) {
      return order.map(function (h) {
        var from = index[h];
        return from === undefined ? "" : row[from];
      });
    });

    sheet.getRange(1, 1, rewritten.length, order.length).setValues(rewritten);

    // Anything left to the right of the rebuilt block is now a duplicate.
    if (width > order.length) {
      sheet.deleteColumns(order.length + 1, width - order.length);
    }

    forceTextColumn_(sheet, order, "UTR");
    Logger.log('[%s] reordered %s columns; key columns now start at column D.',
      sheet.getName(), order.length);
  });

  Logger.log("Reorder finished.");
}

// --- Rewrite old UTC timestamps as readable IST ------------------------------
/**
 * Rows recorded before the timestamp change hold a raw UTC string such as
 * "2026-09-12T11:08:40.744Z". This rewrites those cells in place to read
 * "12 Sep 2026, 4:38 PM IST", matching what new registrations now write.
 *
 * Run it from the Apps Script editor: pick convertTimestampsToIST in the
 * function dropdown and click Run. It does NOT need a deployment - running a
 * function in the editor never touches what the web app serves - so the website
 * is completely unaffected.
 *
 * Safe to run as often as you like: a cell that is already readable is left
 * alone, so re-running after more registrations arrive only converts the new
 * ones.
 */
function convertTimestampsToIST() {
  var converted = 0;
  var skipped = 0;

  SpreadsheetApp.getActiveSpreadsheet().getSheets().forEach(function (sheet) {
    if (sheet.getLastRow() < 2) return;

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var col = headers.indexOf("Timestamp") + 1;
    if (col === 0) return;

    var range = sheet.getRange(2, col, sheet.getLastRow() - 1, 1);
    var values = range.getValues();

    var rewritten = values.map(function (row) {
      var value = row[0];
      if (value === "" || value === null) return [value];

      var parsed = null;

      // Sheets often parses an ISO string on the way in and stores a real date
      // value rather than text, so the cell comes back as a Date, not a string.
      // Both forms have to be handled or the old rows look untouched.
      if (Object.prototype.toString.call(value) === "[object Date]") {
        if (!isNaN(value.getTime())) parsed = value;
      } else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        parsed = new Date(value);
        if (isNaN(parsed.getTime())) parsed = null;
      }

      // Anything else - already readable IST, or something unexpected - is left
      // exactly as it is, which is what makes this safe to re-run.
      if (!parsed) { skipped++; return [value]; }

      converted++;
      return [Utilities.formatDate(parsed, "Asia/Kolkata", "dd MMM yyyy, h:mm a") + " IST"];
    });

    range.setNumberFormat("@");
    range.setValues(rewritten);
  });

  Logger.log("Converted %s timestamp(s) to IST; left %s value(s) alone.", converted, skipped);
  if (converted === 0) {
    Logger.log("Nothing was converted - every Timestamp cell is already readable IST.");
  }
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

  var subject, body, htmlBody;

  if (newStatus === "Verified") {
    subject = "\u2705 Registration Confirmed \u2014 Shraddhanjali 2026";

    // Plain text fallback
    body = "Dear " + leaderName + ",\n\n" +
      "Your team's registration for " + eventName + " at Shraddhanjali 2026 is confirmed!\n\n" +
      "EVENT DETAILS:\n" +
      "\u2022 Date: 19 September 2026\n" +
      "\u2022 Reporting Time: 5:00 PM\n" +
      "\u2022 Venue: Arya College of Engineering & I.T., Jaipur\n\n" +
      "MANDATORY REQUIREMENT:\n" +
      "Every team member must carry an original physical photo ID (College ID or Government ID). Photos or digital copies will not be accepted at the reporting desk.\n\n" +
      "Note: The registration fee is non-refundable.\n\n" +
      "Best regards,\nTeam Shraddhanjali 2026";

    // HTML Formatted Version
    htmlBody =
      "<div style='font-family: Arial, sans-serif; font-size: 14px; color: #222; line-height: 1.6; max-width: 600px;'>" +
        "<p>Dear <strong>" + leaderName + "</strong>,</p>" +
        "<p>Great news! Your team's registration for <strong>" + eventName + "</strong> at <strong>Shraddhanjali 2026</strong> is confirmed.</p>" +

        "<div style='background-color: #f4f6f8; border-left: 4px solid #007bff; padding: 14px; margin: 16px 0; border-radius: 4px;'>" +
          "<strong style='color: #007bff; font-size: 15px;'>\U0001F4C5 Event Schedule & Venue</strong><br><br>" +
          "\u2022 <strong>Date:</strong> 19 September 2026<br>" +
          "\u2022 <strong>Reporting Time:</strong> 5:00 PM<br>" +
          "\u2022 <strong>Venue:</strong> Arya College of Engineering & I.T., Jaipur" +
        "</div>" +

        "<div style='background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 14px; margin: 16px 0; border-radius: 4px; color: #856404;'>" +
          "<strong>\u26A0\uFE0F Important: Carry Physical Photo ID</strong><br>" +
          "Every team member must bring an original physical ID (College ID or official Government ID). Digital photos or soft copies on phones will <strong>not</strong> be accepted at the entry desk." +
        "</div>" +

        "<div style='background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 12px; margin: 16px 0; color: #721c24; border-radius: 4px;'>" +
          "<strong>Reminder:</strong> The registration fee is strictly non-refundable." +
        "</div>" +

        "<p>For any questions, feel free to contact the event coordinators listed on the website.</p>" +
        "<br>" +
        "<p style='margin-bottom: 0;'>Best regards,<br>" +
        "<strong>Team Shraddhanjali 2026</strong><br>" +
        "<span style='color: #666;'>Arya College of Engineering & I.T., Jaipur</span></p>" +
      "</div>";

  } else if (newStatus === "Rejected") {
    subject = "\u274C Registration Status \u2014 Shraddhanjali 2026";

    // Plain text fallback
    body = "Dear " + leaderName + ",\n\n" +
      "Unfortunately, your team's registration for " + eventName + " at Shraddhanjali 2026 could not be verified.\n\n" +
      "Reason: " + (rejectionReason || "Not specified \u2014 please contact the coordinators.") + "\n\n" +
      "Note: Registration fees are non-refundable. If you think this is a mistake, please reach out to the event coordinators immediately.\n\n" +
      "Best regards,\nTeam Shraddhanjali 2026";

    // HTML Formatted Version
    htmlBody =
      "<div style='font-family: Arial, sans-serif; font-size: 14px; color: #222; line-height: 1.6; max-width: 600px;'>" +
        "<p>Dear <strong>" + leaderName + "</strong>,</p>" +
        "<p>Unfortunately, your team's registration for <strong>" + eventName + "</strong> at <strong>Shraddhanjali 2026</strong> could not be verified.</p>" +

        "<div style='background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 14px; margin: 16px 0; color: #721c24; border-radius: 4px;'>" +
          "<strong>Reason for Rejection:</strong> " + (rejectionReason || "Not specified \u2014 please contact the coordinators.") +
        "</div>" +

        "<p><strong>Please Note:</strong> Registration fees are strictly non-refundable. If you believe this rejection was made in error, please contact the event coordinators immediately.</p>" +

        "<p>We apologize for the inconvenience.</p>" +
        "<br>" +
        "<p style='margin-bottom: 0;'>Best regards,<br>" +
        "<strong>Team Shraddhanjali 2026</strong><br>" +
        "<span style='color: #666;'>Arya College of Engineering & I.T., Jaipur</span></p>" +
      "</div>";

  } else {
    // Any other status change - do nothing
    return;
  }

  if (leaderEmail) {
    GmailApp.sendEmail(leaderEmail, subject, body, {
      htmlBody: htmlBody
    });
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
