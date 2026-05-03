/**
 * BarOS — Mobile (iPhone 14 Pro) capture: per-page screenshots + order flow video → mp4 + gif.
 *
 * Output: public/projects/baros/mobile/
 *   01-landing.png            — sign-in screen (pre-login, mobile viewport)
 *   02-products.png           — products / menu list
 *   03-product-added.png      — first add-to-cart confirmation
 *   04-cart.png               — cart drawer/page open
 *   05-checkout-done.png      — post-checkout state
 *   06-orders-list.png        — orders list with the new order
 *   07-order-detail.png       — single-order detail view (if reachable)
 *   flow-order.webm/.mp4/.gif — full recorded flow
 *
 * PowerShell:
 *   $env:BAROS_USER="..."; $env:BAROS_PASS="..."; npm run capture:baros-mobile
 */
import { chromium, devices } from 'playwright'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'

// Load .env.local if env vars are not already set (lets you keep secrets out of shell history).
const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const envFile = path.join(repoRoot, '.env.local')
if (fs.existsSync(envFile) && (!process.env.BAROS_USER || !process.env.BAROS_PASS)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i)
    if (!m) continue
    const [, k, raw] = m
    if (process.env[k]) continue
    const v = raw.replace(/^['"]|['"]$/g, '')
    process.env[k] = v
  }
}

const ff = ffmpegInstaller.path
const user = process.env.BAROS_USER
const pass = process.env.BAROS_PASS
if (!user || !pass) {
  console.error('Set BAROS_USER and BAROS_PASS in the environment.')
  process.exit(1)
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'projects', 'baros', 'mobile')
const authStatePath = path.join(__dirname, '.baros-auth-state.json')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

/** Remove previous captures so each run only ships fresh assets. */
function emptyMobileOutDir() {
  for (const name of fs.readdirSync(outDir)) {
    const p = path.join(outDir, name)
    if (fs.statSync(p).isFile()) fs.unlinkSync(p)
  }
}

const webm = path.join(outDir, 'flow-order.webm')
const mp4 = path.join(outDir, 'flow-order.mp4')
const gif = path.join(outDir, 'flow-order.gif')

// Full logical display 393×852 — matches portfolio DeviceMockup (Playwright default viewport is 660 tall).
const iphone = devices['iPhone 14 Pro']
const device = {
  ...iphone,
  viewport: { width: iphone.screen.width, height: iphone.screen.height },
}

async function shot(page, name) {
  const file = path.join(outDir, name)
  await page.screenshot({ path: file, fullPage: false })
  console.log('  ✓', name)
}

async function loginAndSaveState(browser) {
  // Same UA + full 393×852 viewport as the flow recording (matches portfolio mockup).
  const ctx = await browser.newContext({ ...device })
  const p = await ctx.newPage()
  try {
    await p.goto('https://baros.onrender.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 120_000,
    })
    await p.getByPlaceholder(/username/i).waitFor({ state: 'visible', timeout: 20_000 })
    await p.waitForTimeout(1500)
    // Pre-login landing shot — captured here so it includes the styled background.
    await shot(p, '01-landing.png')

    await p.getByPlaceholder(/username/i).fill(user)
    await p.getByPlaceholder(/password/i).fill(pass)
    const [res] = await Promise.all([
      p.waitForResponse(
        (r) =>
          r.request().method() === 'POST' && r.url().includes('auth') && r.url().includes('login'),
        { timeout: 30_000 },
      ),
      p.getByRole('button', { name: /sign in/i }).click(),
    ])
    if (res.status() === 429) {
      throw new Error('BarOS returned 429 Too many requests. Wait 15+ minutes, then run again.')
    }
    if (res.status() < 200 || res.status() >= 300) {
      const body = (await res.text().catch(() => '')).slice(0, 200)
      throw new Error(`Login failed HTTP ${res.status()}: ${body}`)
    }
    await p.waitForLoadState('networkidle', { timeout: 60_000 })
    await p.waitForTimeout(1200)
    await ctx.storageState({ path: authStatePath })
  } finally {
    await ctx.close()
  }
}

emptyMobileOutDir()
console.log('cleared', outDir)

const browser = await chromium.launch({ headless: true })
let flowError

try {
  console.log('logging in (mobile UA) …')
  await loginAndSaveState(browser)
  console.log('auth state saved, recording mobile order flow …')

  const context = await browser.newContext({
    ...device,
    storageState: authStatePath,
    recordVideo: {
      dir: outDir,
      // Same pixel size as screenshots (393×852).
      size: { width: device.viewport.width, height: device.viewport.height },
    },
  })
  const page = await context.newPage()

  try {
    // 2) products / menu
    await page.goto('https://baros.onrender.com/products', {
      waitUntil: 'networkidle',
      timeout: 60_000,
    })
    await page.waitForTimeout(1500)
    await page.waitForSelector('.btn-add-to-cart', { state: 'visible', timeout: 30_000 })
    await shot(page, '02-products.png')

    // 3) add a couple of items
    await page.locator('.btn-add-to-cart').first().click()
    await page.waitForTimeout(900)
    await shot(page, '03-product-added.png')

    await page.locator('.btn-add-to-cart').nth(2).click()
    await page.waitForTimeout(900)

    // 4) open cart
    await page.locator('button.cart-icon-btn').click()
    await page.waitForTimeout(1200)
    await shot(page, '04-cart.png')

    // 5) checkout
    await page.getByRole('button', { name: /^checkout$/i }).click()
    await page.waitForLoadState('networkidle', { timeout: 45_000 })
    await page.waitForTimeout(2000)
    await shot(page, '05-checkout-done.png')

    // 6) orders list — prefer clicking the bottom-nav tab so we don't lose
    //    in-memory auth state. Fall back to direct URL, and re-login inline if redirected.
    try {
      const ordersTab = page.getByRole('link', { name: /^orders$/i }).last()
      await ordersTab.waitFor({ state: 'visible', timeout: 5_000 })
      await ordersTab.click()
    } catch {
      await page.goto('https://baros.onrender.com/orders', {
        waitUntil: 'networkidle',
        timeout: 60_000,
      })
    }
    await page.waitForTimeout(2500)

    // If we got bounced back to the sign-in form, re-auth inline and retry.
    const onSignIn = await page
      .getByPlaceholder(/username/i)
      .isVisible()
      .catch(() => false)
    if (onSignIn) {
      console.warn('  (orders required re-auth — signing in again)')
      await page.getByPlaceholder(/username/i).fill(user)
      await page.getByPlaceholder(/password/i).fill(pass)
      await Promise.all([
        page.waitForResponse(
          (r) =>
            r.request().method() === 'POST' && r.url().includes('auth') && r.url().includes('login'),
          { timeout: 30_000 },
        ),
        page.getByRole('button', { name: /sign in/i }).click(),
      ])
      await page.waitForLoadState('networkidle', { timeout: 45_000 })
      await page.waitForTimeout(1500)
      try {
        const ordersTab = page.getByRole('link', { name: /^orders$/i }).last()
        await ordersTab.waitFor({ state: 'visible', timeout: 5_000 })
        await ordersTab.click()
      } catch {
        await page.goto('https://baros.onrender.com/orders', {
          waitUntil: 'networkidle',
          timeout: 60_000,
        })
      }
      await page.waitForTimeout(2500)
    }
    await shot(page, '06-orders-list.png')

    // 7) open the first order if visible
    try {
      const item = page
        .locator('a, [role="button"], li')
        .filter({ hasText: /order\s*#?\s*[0-9a-f-]{4,}/i })
        .first()
      await item.waitFor({ state: 'visible', timeout: 15_000 })
      await item.scrollIntoViewIfNeeded()
      await item.click()
      await page.waitForLoadState('networkidle', { timeout: 30_000 })
      await page.waitForTimeout(2500)
      await shot(page, '07-order-detail.png')
    } catch {
      console.warn('  (no order detail link reachable — skipping 07)')
    }
  } catch (e) {
    flowError = e
    await page
      .screenshot({ path: path.join(outDir, 'flow-order-error.png'), fullPage: true })
      .catch(() => undefined)
    console.error('Flow error:', e?.message || e)
  } finally {
    const videoPath = await page.video()?.path()
    await context.close()
    if (videoPath && fs.existsSync(videoPath)) {
      if (fs.existsSync(webm)) fs.unlinkSync(webm)
      fs.renameSync(videoPath, webm)
      console.log('webm', webm)
    }
  }
} catch (e) {
  if (!flowError) console.error('Login or setup failed:', e?.message || e)
} finally {
  if (fs.existsSync(authStatePath)) fs.unlinkSync(authStatePath)
  await browser.close()
}

if (!fs.existsSync(webm)) {
  console.error('No webm file produced.')
  process.exit(1)
}

if (ff && fs.existsSync(ff)) {
  // mp4 (h.264, no audio — silent flow)
  const r1 = spawnSync(
    ff,
    ['-y', '-i', webm, '-c:v', 'libx264', '-preset', 'fast', '-crf', '28', '-an', mp4],
    { stdio: 'inherit' },
  )
  if (r1.status === 0) console.log('mp4', mp4)

  // gif — narrower than desktop because the mobile viewport is portrait
  const r2 = spawnSync(
    ff,
    [
      '-y',
      '-i',
      webm,
      '-vf',
      'fps=8,scale=420:-1:flags=lanczos,split[s0][s1];[s0]palettegen=reserve_transparent=1[p];[s1][p]paletteuse',
      '-loop',
      '0',
      gif,
    ],
    { stdio: 'inherit' },
  )
  if (r2.status === 0) console.log('gif', gif)
} else {
  console.warn('ffmpeg missing:', ff)
  process.exit(1)
}

if (flowError) {
  console.warn('Flow had errors; check webm, gif, and flow-order-error.png before publishing.')
  process.exit(1)
}
