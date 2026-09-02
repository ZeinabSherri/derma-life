import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const consoleErrors = [];
page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message));

await page.goto('http://localhost:3457', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(15000);
await page.screenshot({ path: '/tmp/screenshots/hero-final.png' });

console.log('ERRORS:', consoleErrors.length);
for (const e of consoleErrors.slice(0, 10)) console.log('ERR:', e);
await browser.close();
