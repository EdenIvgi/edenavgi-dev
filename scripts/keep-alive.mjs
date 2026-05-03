#!/usr/bin/env node
const url = process.env.SITE_URL;

if (!url) {
  console.error('SITE_URL is not set. Example: SITE_URL=https://edenavgi-dev.onrender.com npm run keep-alive');
  process.exit(2);
}

const started = Date.now();

try {
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'User-Agent': 'edenavgi-dev-keep-alive/1.0' },
    redirect: 'follow',
  });
  const ms = Date.now() - started;
  console.log(`[keep-alive] ${url} -> ${res.status} in ${ms}ms`);
  if (!res.ok) process.exit(1);
} catch (err) {
  const ms = Date.now() - started;
  console.error(`[keep-alive] ${url} failed after ${ms}ms:`, err.message);
  process.exit(1);
}
