/**
 * BarOS: record Products → cart → checkout → orders → first order.
 * Login runs first WITHOUT recording; a new browser context loads saved cookies
 * and starts on /products so the video does not include the sign-in screen.
 *
 * PowerShell: $env:BAROS_USER="..."; $env:BAROS_PASS="..."; npm run capture:baros-order
 */
import { chromium } from 'playwright'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'

const ff = ffmpegInstaller.path

const user = process.env.BAROS_USER
const pass = process.env.BAROS_PASS
if (!user || !pass) {
  console.error('Set BAROS_USER and BAROS_PASS')
  process.exit(1)
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'projects', 'baros')
const authStatePath = path.join(__dirname, '.baros-auth-state.json')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const webm = path.join(outDir, 'flow-order.webm')
const mp4 = path.join(outDir, 'flow-order.mp4')
const gif = path.join(outDir, 'flow-order.gif')

async function loginAndSaveState(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 800 } })
  const p = await ctx.newPage()
  try {
    await p.goto('https://baros.onrender.com/', { waitUntil: 'domcontentloaded', timeout: 120_000 })
    await p.getByPlaceholder(/username/i).waitFor({ state: 'visible', timeout: 15_000 })
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
    const st = res.status()
    if (st === 429) {
      throw new Error('BarOS returned 429 Too many requests. Wait 15+ minutes, then run again.')
    }
    if (st < 200 || st >= 300) {
      const body = (await res.text().catch(() => '')).slice(0, 200)
      throw new Error(`Login failed HTTP ${st}: ${body}`)
    }
    await p.waitForLoadState('networkidle', { timeout: 60_000 })
    await p.waitForTimeout(1000)
    await ctx.storageState({ path: authStatePath })
  } finally {
    await ctx.close()
  }
}

const browser = await chromium.launch({ headless: true })
let flowError

try {
  await loginAndSaveState(browser)
  console.log('auth state saved, starting screen recording on /products …')

  const context = await browser.newContext({
    recordVideo: { dir: outDir, size: { width: 1200, height: 800 } },
    viewport: { width: 1200, height: 800 },
    deviceScaleFactor: 1,
    storageState: authStatePath,
  })
  const page = await context.newPage()

  try {
    await page.goto('https://baros.onrender.com/products', { waitUntil: 'networkidle', timeout: 60_000 })
    await page.waitForTimeout(1200)
    await page.waitForSelector('.btn-add-to-cart', { state: 'visible', timeout: 30_000 })

    await page.locator('.btn-add-to-cart').first().click()
    await page.waitForTimeout(1000)
    await page.locator('.btn-add-to-cart').nth(2).click()
    await page.waitForTimeout(1200)

    await page.locator('button.cart-icon-btn').click()
    await page.waitForTimeout(1200)
    await page.getByRole('button', { name: /^checkout$/i }).click()
    await page.waitForLoadState('networkidle', { timeout: 45_000 })
    await page.waitForTimeout(2000)

    await page.goto('https://baros.onrender.com/orders', { waitUntil: 'networkidle', timeout: 60_000 })
    await page.waitForTimeout(4000)
    // Open first order line if present; otherwise stay on the list (valid end state)
    try {
      const item = page
        .locator('a')
        .filter({ hasText: /order\s*#\s*[0-9a-f-]+/i })
        .first()
      await item.waitFor({ state: 'visible', timeout: 25_000 })
      await item.scrollIntoViewIfNeeded()
      await item.click()
      await page.waitForLoadState('networkidle', { timeout: 30_000 })
      await page.waitForTimeout(3000)
    } catch {
      await page.screenshot({ path: path.join(outDir, 'flow-order-orders-list-only.png'), fullPage: true })
      await page.waitForTimeout(2000)
    }
  } catch (e) {
    flowError = e
    await page.screenshot({ path: path.join(outDir, 'flow-order-error.png'), fullPage: true })
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
  if (!flowError) {
    console.error('Login or setup failed:', e?.message || e)
  }
} finally {
  if (fs.existsSync(authStatePath)) fs.unlinkSync(authStatePath)
  await browser.close()
}

if (!fs.existsSync(webm)) {
  console.error('No webm file produced.')
  process.exit(1)
}

if (ff && fs.existsSync(ff)) {
  const p1 = spawnSync(
    ff,
    ['-y', '-i', webm, '-c:v', 'libx264', '-preset', 'fast', '-crf', '28', '-an', mp4],
    { stdio: 'inherit' },
  )
  if (p1.status === 0) console.log('mp4', mp4)
  const p2 = spawnSync(
    ff,
    [
      '-y',
      '-i',
      webm,
      '-vf',
      'fps=8,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen=reserve_transparent=1[p];[s1][p]paletteuse',
      '-loop',
      '0',
      gif,
    ],
    { stdio: 'inherit' },
  )
  if (p2.status === 0) console.log('gif', gif)
} else {
  console.warn('ffmpeg missing:', ff)
  process.exit(1)
}

if (flowError) {
  console.warn('Flow had errors; check webm, gif, and flow-order-error.png before publishing.')
  process.exit(1)
}
