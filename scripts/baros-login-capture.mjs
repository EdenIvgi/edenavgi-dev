/**
 * Log into BarOS (demo) and save a post-login screenshot.
 * Usage (do not commit real secrets; use .env.local or shell env only):
 *   set BAROS_USER=... & set BAROS_PASS=... & node scripts/baros-login-capture.mjs
 */
import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const user = process.env.BAROS_USER
const pass = process.env.BAROS_PASS
if (!user || !pass) {
  console.error('Set BAROS_USER and BAROS_PASS in the environment.')
  process.exit(1)
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'projects', 'baros')
const outFile = path.join(outDir, '02-after-login.png')

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })

try {
  await page.goto('https://baros.onrender.com/', { waitUntil: 'domcontentloaded', timeout: 120_000 })
  const userField = page.getByPlaceholder(/username/i)
  const passField = page.getByPlaceholder(/password/i)
  await userField.waitFor({ state: 'visible', timeout: 15_000 })
  await userField.fill(user)
  await passField.fill(pass)
  await page.getByRole('button', { name: /sign in/i }).click()
  await page
    .waitForURL(/.*/, { waitUntil: 'commit', timeout: 5_000 })
    .catch(() => undefined)
  await page.waitForLoadState('networkidle', { timeout: 45_000 })
  await page.waitForTimeout(2000)
  await page.screenshot({ path: outFile, fullPage: true })
  console.log('ok', outFile)
} catch (e) {
  const fail = path.join(outDir, '02-login-failed.png')
  await page.screenshot({ path: fail, fullPage: true })
  console.error('login capture failed', e)
  process.exit(1)
} finally {
  await browser.close()
}
