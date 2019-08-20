/**
 * 打开 Google 网站并进行搜索
 */
const puppeteer = require('puppeteer');
const path = require('path');

async function googleSearch(text) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://google.com');
  page.setViewport({ width: 1200, height: 900 });

  // 定位至输入框
  await page.focus('#tsf > div:nth-child(2) > div > div.RNNXgb > div > div.a4bIc > input')
  // 输入文字
  await page.keyboard.type(text);
  await page.waitFor(5000);

  // 模拟按下 Enter 键，开始搜索
  await page.keyboard.press('Enter');
  // Google 速度比较慢，所以多等待一会
  await page.waitFor(10000);

  // 点击第一个搜索结果
  await page.click('#rso > div:nth-child(1) > div > div > div > div > div.r > a');
  await page.waitFor(5000);

  await page.screenshot({
    path: path.join(__dirname, `${text}.png`),
    fullPage: true
  });

  await browser.close();
}

googleSearch('puppeteer');
