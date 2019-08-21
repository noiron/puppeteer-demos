/**
 * 打开淘宝的注册账号页面，并输入手机号，通过滑块验证码并进入下一步
 */
const puppeteer = require('puppeteer');
const path = require('path');

async function run() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // navigator.webdriver 是一个只读属性，标记了当前浏览器是否受到自动控制
  // 为了防止被网站检查出来，需要利用 defineProperty 将其值设为 false
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false
    })
  });

  // 打开淘宝注册页面
  await page.goto('https://reg.taobao.com/member/reg/fill_mobile.htm');
  page.setViewport({ width: 1400, height: 900 });

  // 点击同意协议按钮
  await page.waitFor(5000);
  await page.click('#J_AgreementBtn');

  // 输入手机号
  await page.waitFor(1000);
  // 选择手机号前缀为中国大陆的 +86
  await page.click('#J_MobileForm > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1)');
  await page.waitFor(1000);
  await page.click('.tb-option.tb-menuitem > span[title="中国大陆"]');
  await page.focus('#J_Mobile');
  await page.keyboard.type('15011111111');  // a fake phone number
  await page.waitFor(1500);

  // 使用 page.$ 方法来寻找元素，返回值是一个 ElementHandle
  // 这里找到的是滑块所在的整个滑动区域
  const sliderElement = await page.$('#nc_1_wrapper');
  const slider = await sliderElement.boundingBox();

  // 寻找滑块按钮元素
  const buttonElement = await page.$('.nc_iconfont.btn_slide');
  const button = await buttonElement.boundingBox();

  // 将滑块从左侧移至右侧
  await page.mouse.move(button.x + button.width / 2, button.y + button.height / 2);
  await page.mouse.down();
  await page.mouse.move(button.x + slider.width, button.y + button.height / 2, { steps: 10 });
  await page.mouse.up();

  await page.waitFor(5000);

  await page.screenshot({
    path: path.join(__dirname, `taobao.png`),
    fullPage: true
  });

  // 点击下一步
  // await page.click('#J_BtnMobileForm');
  // await page.waitFor(5000);

  await browser.close();
}

run();
