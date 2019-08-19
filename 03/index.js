/**
 * 模拟不同的设备来打开同一个网站
 */

const puppeteer = require('puppeteer');
const path = require('path');

const iPhoneX = puppeteer.devices['iPhone X'];
const iPad = puppeteer.devices['iPad']

const URL = 'https://zhihu.com';

async function openPage(url) {
  const browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();

  // 默认模式下使用桌面浏览器打开网站
  await page.goto(url);
  await page.screenshot({
    path: path.join(__dirname, 'desktop.png'),
    fullPage: true,
  });
  await page.waitFor(5000);

  // 模拟 iPhoneX 打开网站
  page = await browser.newPage();
  await page.emulate(iPhoneX);
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.screenshot({
    path: path.join(__dirname, 'iphonx.png'),
    fullPage: true,
  });

  // 模拟 iPad 打开网站
  page = await browser.newPage();
  await page.emulate(iPad);
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.screenshot({
    path: path.join(__dirname, 'ipad.png'),
    fullPage: true,
  });

  await browser.close();
}

openPage(URL);
