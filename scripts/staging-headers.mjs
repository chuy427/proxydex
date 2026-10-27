#!/usr/bin/env node
// Staging build only (see .github/workflows/deploy.yml): points the content security
// policy at the staging Supabase project (DEV_URL) instead of production's, and adds
// a noindex header to every page so search engines never list staging.
import { readFileSync, writeFileSync } from 'node:fs';

const file = process.argv[2] || 'dist/_headers';
const dev = (process.env.DEV_URL || '').replace(/\/$/, '');
if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(dev)) {
  console.error(`[staging-headers] DEV_URL isn't a Supabase project URL: "${dev}"`);
  process.exit(1);
}
const PROD = 'tbissnuzjfjuvjwtseza.supabase.co';
const host = dev.replace('https://', '');
let s = readFileSync(file, 'utf8').split(PROD).join(host);
s = s.replace(/^\/\*$/m, '/*\n  X-Robots-Tag: noindex, nofollow');
writeFileSync(file, s);
console.log(`[staging-headers] ${file}: Supabase → ${host}, noindex added`);
