/**
 * Bridges non-prefixed environment variables into CRA-visible ones.
 *
 * Create React App only inlines variables starting with REACT_APP_ into the
 * browser bundle; anything else is stripped. Some hosts (Vercel) discourage or
 * block the REACT_APP_ prefix on values they flag as sensitive, so this runs
 * before every build and copies the bare names across into
 * .env.production.local, which CRA reads at the highest precedence.
 *
 * Nothing here is a real secret: every value below ends up readable in the
 * published JS bundle either way. This only fixes the naming mismatch.
 */
const fs = require('fs');
const path = require('path');

// bare name -> the REACT_APP_ name the frontend actually reads
const BRIDGED = ['GOOGLE_SCRIPT_URL'];

const lines = [];
for (const name of BRIDGED) {
  const prefixed = `REACT_APP_${name}`;
  // An explicitly prefixed value always wins; the bare name is the fallback.
  const value = process.env[prefixed] || process.env[name];
  if (value) lines.push(`${prefixed}=${value}`);
}

if (!lines.length) {
  console.log('[setup-env] No bridged variables set; skipping.');
  process.exit(0);
}

const target = path.join(__dirname, '..', '.env.production.local');
fs.writeFileSync(target, lines.join('\n') + '\n');
console.log(`[setup-env] Wrote ${lines.length} variable(s): ${lines.map(l => l.split('=')[0]).join(', ')}`);
