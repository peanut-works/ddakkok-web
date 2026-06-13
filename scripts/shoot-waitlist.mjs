import puppeteer from 'puppeteer-core'

const URL = process.env.SHOT_URL ?? 'http://localhost:5174'
const OUT = 'shots'

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(`${URL}/#waitlist`, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 1400))
await page.evaluate(() => document.getElementById('waitlist')?.scrollIntoView())
await new Promise((r) => setTimeout(r, 1200))
await page.screenshot({ path: `${OUT}/waitlist-idle.png` })

// fill + submit
await page.type('#waitlist input[type=email]', 'teacher@example.com', { delay: 12 })
await new Promise((r) => setTimeout(r, 300))
await page.screenshot({ path: `${OUT}/waitlist-filled.png` })
await page.evaluate(() => document.querySelector('#waitlist form button')?.click())
await new Promise((r) => setTimeout(r, 1500))
await page.evaluate(() => document.getElementById('waitlist')?.scrollIntoView())
await new Promise((r) => setTimeout(r, 400))
await page.screenshot({ path: `${OUT}/waitlist-success.png` })

await browser.close()
console.log('done')
