/**
 * 抓取豆瓣电影 Top250 的相关信息
 */


const puppeteer = require('puppeteer');
const path = require('path');
const jsonfile = require('jsonfile')

async function run() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://movie.douban.com/top250');
  page.setViewport({ width: 1200, height: 1000 });


  const result = await scrapeData(page);
  const allData = [];
  allData.push(...result);

  for (let currentPage = 1; currentPage < 4; currentPage++) {
    await page.waitFor(5000);
    await autoScroll(page);
    await page.click(`#content > div > div.article > div.paginator > a:nth-child(${currentPage+2})`);
    await page.waitFor(5000);
    const result = await scrapeData(page);
    allData.push(...result);
  }

  console.log(`共抓取了 ${allData.length} 部电影的信息`);

  // 将数据保存到 json 文件中去
  const file = 'data.json'
  jsonfile.writeFileSync(file, allData, { spaces: 2 });

  // await page.screenshot({
  //   path: path.join(__dirname, `douban.png`),
  //   fullPage: true
  // });

  await page.waitFor(3000);
  await browser.close();
}


async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight + 300) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

// 保存电影名称，地址，以及海报地址
async function scrapeData(page) {
  return await page.evaluate(() => {
    const $list = document.querySelector('ol.grid_view');

    const arr = $list.getElementsByTagName('li');

    const data = [];

    for (let i = 0; i < arr.length; i++) {
      const $item = arr[i].querySelector('.item');
      const $titleLink = $item.querySelector('.info > .hd > a');
      const title = $titleLink.querySelector('.title').innerText;
      const link = $titleLink.getAttribute('href');

      const $pic = $item.querySelector('.pic > a > img');
      const picSrc = $pic.getAttribute('src');

      data.push({
        title,
        link,
        pic: picSrc
      })
    }

    return data;
  });
}



run();