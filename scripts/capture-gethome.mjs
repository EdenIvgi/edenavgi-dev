import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'projects', 'gethome')
const url = 'http://localhost:5175/board'

const browser = await chromium.launch()

async function shoot({ width, height, file, prepare }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  if (prepare) await prepare(page)
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(outDir, file), type: 'png' })
  await ctx.close()
  console.log('saved', file)
}

await shoot({
  width: 393,
  height: 852,
  file: 'iphone-listings.png',
  prepare: async (page) => {
    await page.evaluate(() => {
      const grid = document.querySelector('[class*="grid"]') || document.body
      const target = document.querySelectorAll('article, [class*="card"], [class*="Card"]')[0]
      if (target) target.scrollIntoView({ block: 'start' })
      else window.scrollTo(0, window.innerHeight)
    })
  },
})

await shoot({
  width: 393,
  height: 852,
  file: 'iphone-detail.png',
  prepare: async (page) => {
    const card = page.locator('article, [class*="card"], [class*="Card"]').first()
    await card.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    await card.click({ trial: false }).catch(() => {})
    await page.waitForTimeout(800)
  },
})

await browser.close()
