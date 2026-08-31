#!/usr/bin/env node
/**
 * Locale key-parity check.
 *
 * Ensures every non-English translation file under public/locales contains the
 * exact set of keys present in the English base (public/locales/en/translation.json).
 *
 * i18next is configured with `fallbackLng: 'en'`, so a missing key does NOT throw —
 * it silently renders the English string inside an otherwise-translated UI. That makes
 * translation drift invisible in normal use. This script surfaces it and fails CI so
 * the gap cannot grow unnoticed.
 *
 * Usage:  node scripts/check-i18n.mjs
 * Exit codes: 0 = all locales in parity, 1 = drift detected.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, '..', 'public', 'locales');
const BASE_LOCALE = 'en';

/** Flatten a nested object into dot-notation keys. */
function flatten(obj, prefix = '') {
  const out = {};
  for (const key of Object.keys(obj)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(out, flatten(value, nextKey));
    } else {
      out[nextKey] = value;
    }
  }
  return out;
}

function loadKeys(locale) {
  const file = join(LOCALES_DIR, locale, 'translation.json');
  return new Set(Object.keys(flatten(JSON.parse(readFileSync(file, 'utf8')))));
}

const baseKeys = loadKeys(BASE_LOCALE);
const locales = readdirSync(LOCALES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== BASE_LOCALE)
  .map((d) => d.name)
  .sort();

let hasDrift = false;

for (const locale of locales) {
  const keys = loadKeys(locale);
  const missing = [...baseKeys].filter((k) => !keys.has(k)).sort();
  const extra = [...keys].filter((k) => !baseKeys.has(k)).sort();

  if (missing.length === 0 && extra.length === 0) {
    console.log(`✓ ${locale}: in parity (${keys.size} keys)`);
    continue;
  }

  hasDrift = true;
  console.error(`✗ ${locale}: drift detected`);
  if (missing.length) {
    console.error(`  Missing ${missing.length} key(s) present in '${BASE_LOCALE}':`);
    missing.forEach((k) => console.error(`    - ${k}`));
  }
  if (extra.length) {
    console.error(`  ${extra.length} orphan key(s) not present in '${BASE_LOCALE}':`);
    extra.forEach((k) => console.error(`    + ${k}`));
  }
}

if (hasDrift) {
  console.error(`\nLocale parity check FAILED. Base locale '${BASE_LOCALE}' has ${baseKeys.size} keys.`);
  process.exit(1);
}

console.log(`\nAll ${locales.length} locales are in parity with '${BASE_LOCALE}' (${baseKeys.size} keys).`);
