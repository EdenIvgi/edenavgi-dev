import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5174/projects/gethome', { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
await page.evaluate(() => window.scrollBy(0, 280))
await page.waitForTimeout(800)
await page.screenshot({ path: path.join(__dirname, 'verify-showcase.png') })

await page.goto('http://localhost:5174/projects', { waitUntil: 'networkidle' })
await page.waitForTimeout(1000)
await page.screenshot({ path: path.join(__dirname, 'verify-grid.png'), fullPage: true })

await browser.close()
console.log('done')
