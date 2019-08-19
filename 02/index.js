/**
 * 打开指定的网址，并保存为 PDF 文件
 */
const puppeteer = require('puppeteer');
const path = require('path');

const URL = 'https://reactjs.org/docs/getting-started.html';

async function savePDF(url) {
  // Note: 保存为 PDF 的功能需要在 headless 模式下运行，否则会报错
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.pdf({ 
    path: path.join(process.cwd(), '02/react-docs.pdf'), 
    format: 'A4'
  });

  await browser.close();
}

savePDF(URL);
