// 랜딩 페이지를 여러 스크롤 위치에서 캡처하는 검증 스크립트
import puppeteer from 'puppeteer-core'

const URL = process.env.SHOT_URL ?? 'http://localhost:5174/'
const OUT = 'shots'

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(URL, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 1800))

const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
const stops = [0, 0.12, 0.24, 0.32, 0.4, 0.48, 0.58, 0.7, 0.82, 0.94]

for (const [i, stop] of stops.entries()) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.round(totalHeight * stop))
  await new Promise((r) => setTimeout(r, 700))
  await page.screenshot({ path: `${OUT}/scroll-${String(i).padStart(2, '0')}.png` })
}

await browser.close()
console.log('done, total scrollable:', totalHeight)
