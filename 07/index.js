const path = require("path");
const puppeteer = require("puppeteer");
const pageUrl = "https://github.com";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.chatpdf.com", { waitUntil: "networkidle0" });

  const elementHandle = await page.$(
    "input[type=file]"
  );
  console.log('elementHandle: ', elementHandle);
  await elementHandle.uploadFile(__dirname + '/test.pdf');

  // await page.close();
  // await browser.close();
})();
