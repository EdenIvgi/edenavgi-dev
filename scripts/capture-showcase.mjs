/**
 * Capture three showcase screenshots for the portfolio:
 *   1. iPhone 16 Pro — Home page              → public/projects/baros/iphone-home.png
 *   2. iPhone 16 Pro — Items Management page  → public/projects/baros/iphone-items.png
 *   3. iPad 11" (landscape) — Orders page     → public/projects/baros/ipad-orders.png
 *
 * Auth: everything runs in ONE context so sessionStorage is preserved.
 *
 * Safe-area: we shift every top-anchored fixed/sticky element down by the
 * device's status-bar height, add matching body padding, and fill the newly
 * revealed gap with a colored strip — exactly what the OS does on a real device
 * via env(safe-area-inset-top).
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot  = path.resolve(__dirname, '..')
const outDir    = path.join(repoRoot, 'public', 'projects', 'baros')

// ── Credentials ────────────────────────────────────────────────────────────
const envFile = path.join(repoRoot, '.env.local')
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i)
    if (!m) continue
    const [, k, raw] = m
    if (!process.env[k]) process.env[k] = raw.replace(/^['"]|['"]$/g, '')
  }
}
const user = process.env.BAROS_USER
const pass = process.env.BAROS_PASS
if (!user || !pass) { console.error('Set BAROS_USER / BAROS_PASS in .env.local'); process.exit(1) }

// ── Device specs ───────────────────────────────────────────────────────────
// iPhone 16 Pro: full-screen logical px 393×852; Dynamic Island + status bar = 59 pt
// iPad 11" landscape: 1194×834; plain status bar = 24 pt
const IPHONE = { viewport: { width: 393, height: 852 }, safeAreaTop: 59 }
const IPAD   = { viewport: { width: 1194, height: 834 }, safeAreaTop: 24 }

const BASE = 'https://baros.onrender.com'

// ── Safe-area injection ────────────────────────────────────────────────────
/**
 * Simulates env(safe-area-inset-top) by:
 *  1. Pushing every top-anchored fixed/sticky element down by safeAreaPx
 *  2. Adding the same amount to body padding-top so normal-flow content
 *     stays below the moved header
 *  3. Injecting a colored strip at y=0…safeAreaPx-1 to represent the status bar
 */
async function applyDeviceSafeArea(page, safeAreaPx) {
  await page.evaluate((safeArea) => {
    // 1. Shift top-anchored fixed/sticky elements down
    for (const el of document.querySelectorAll('*')) {
      const s = getComputedStyle(el)
      if (s.position !== 'fixed' && s.position !== 'sticky') continue
      const rect = el.getBoundingClientRect()
      // Only elements pinned near the top (top < 10px), ignore bottom bars
      if (rect.top > 10 || s.top === 'auto') continue
      el.style.top = `${(parseFloat(s.top) || 0) + safeArea}px`
    }

    // 2. Compensate body padding so content remains flush below the moved header
    const currentPT = parseFloat(getComputedStyle(document.body).paddingTop) || 0
    document.body.style.paddingTop = `${currentPT + safeArea}px`

    // 3. Determine the status-bar background color (match the header / animated-bg)
    let barColor = '#111111'
    const candidates = ['.app-header', 'header', '.animated-background', 'nav']
    for (const sel of candidates) {
      const el = document.querySelector(sel)
      if (!el) continue
      const bg = getComputedStyle(el).backgroundColor
      if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
        barColor = bg
        break
      }
    }

    // 4. Insert the status-bar strip (sits above everything else)
    const bar = document.createElement('div')
    bar.id = '_portfolio_safe_area_bar'
    bar.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'right:0',
      `height:${safeArea}px`, `background:${barColor}`,
      'z-index:2147483647', 'pointer-events:none',
    ].join(';')
    document.documentElement.appendChild(bar)

    window.scrollTo(0, 0)
  }, safeAreaPx)

  await page.waitForTimeout(400) // let layout reflow
  await page.evaluate(() => window.scrollTo(0, 0))
}

// ── Screenshot helper ──────────────────────────────────────────────────────
async function capture(page, outPath, safeAreaPx) {
  await applyDeviceSafeArea(page, safeAreaPx)
  await page.screenshot({ path: outPath, fullPage: false })
  console.log('  ✓', path.basename(outPath))
}

// ── Main ───────────────────────────────────────────────────────────────────
const browser = await chromium.launch({ headless: true })
const ctx     = await browser.newContext({ viewport: IPHONE.viewport })
const page    = await ctx.newPage()

// Login (single context preserves sessionStorage throughout)
console.log('Logging in…')
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 120_000 })
await page.getByPlaceholder(/username/i).waitFor({ state: 'visible', timeout: 20_000 })
await page.getByPlaceholder(/username/i).fill(user)
await page.getByPlaceholder(/password/i).fill(pass)
const [loginRes] = await Promise.all([
  page.waitForResponse(
    r => r.request().method() === 'POST' && r.url().includes('/auth/login'),
    { timeout: 30_000 }
  ),
  page.getByRole('button', { name: /sign in/i }).click(),
])
if (loginRes.status() < 200 || loginRes.status() >= 300) {
  console.error(`Login failed — HTTP ${loginRes.status()}`); await browser.close(); process.exit(1)
}
await page.waitForLoadState('networkidle', { timeout: 60_000 })
await page.waitForTimeout(1500)
console.log('Login OK →', page.url())

// ── 1. Home (iPhone) ───────────────────────────────────────────────────────
console.log('Capturing Home (iPhone)…')
await page.goto(BASE + '/home', { waitUntil: 'networkidle', timeout: 60_000 })
await page.waitForTimeout(1500)
await capture(page, path.join(outDir, 'iphone-home.png'), IPHONE.safeAreaTop)

// ── 2. Orders (iPhone) ────────────────────────────────────────────────────
console.log('Capturing Orders (iPhone)…')
await page.goto(BASE + '/orders', { waitUntil: 'networkidle', timeout: 60_000 })
await page.waitForTimeout(1500)
await capture(page, path.join(outDir, 'iphone-orders.png'), IPHONE.safeAreaTop)

// ── 3. Items Management (iPad landscape) ──────────────────────────────────
console.log('Capturing Items Management (iPad landscape)…')
await page.setViewportSize(IPAD.viewport)
await page.goto(BASE + '/items-management', { waitUntil: 'networkidle', timeout: 60_000 })
await page.waitForTimeout(1500)
await capture(page, path.join(outDir, 'ipad-items.png'), IPAD.safeAreaTop)

await browser.close()
console.log('\nDone.')
