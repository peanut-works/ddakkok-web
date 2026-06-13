// 체험 로그인 후 대시보드 각 페이지를 캡처하는 검증 스크립트
import puppeteer from 'puppeteer-core'

const URL = process.env.SHOT_URL ?? 'http://localhost:5174'
const OUT = 'shots'

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(`${URL}/`, { waitUntil: 'networkidle0' })

// 체험하기 클릭 → 대시보드 진입
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('체험하기'))
  btn?.click()
})
await page.waitForFunction(() => location.pathname === '/dashboard', { timeout: 10000 })
await new Promise((r) => setTimeout(r, 2500))
await page.screenshot({ path: `${OUT}/dash-home.png` })

await page.evaluate(() => window.scrollTo({ top: 9999, behavior: 'instant' }))
await new Promise((r) => setTimeout(r, 1200))
await page.screenshot({ path: `${OUT}/dash-home-bottom.png` })

for (const [name, path] of [
  ['dash-children', '/children'],
  ['dash-checks', '/checks'],
]) {
  await page.goto(`${URL}${path}`, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 2000))
  await page.screenshot({ path: `${OUT}/${name}.png` })
}

// 검사 상세 (첫 카드 클릭)
await page.goto(`${URL}/checks`, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 1500))
await page.evaluate(() => document.querySelector('.check-card')?.click())
await new Promise((r) => setTimeout(r, 2000))
await page.screenshot({ path: `${OUT}/dash-check-detail.png` })

await browser.close()
console.log('done')
