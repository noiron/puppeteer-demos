/**
 * 打开 Google 网站，并截图保存
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function getPic() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://google.com');
  await page.setViewport({ width: 1000, height: 500 });
  await page.screenshot({
    path: path.join(__dirname, 'google.png')
  });

  await browser.close();
}

getPic();
