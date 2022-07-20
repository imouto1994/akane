const puppeteer = require("puppeteer");
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");

const { hideHeadless } = require("./stealth");

// Get config data
const configJSON = fs.readFileSync(path.join(process.cwd(), "./config.json"));
const config = JSON.parse(configJSON);

// Get URLs of titles
const urlsJSON = fs.readFileSync(path.join(process.cwd(), "./urls.json"));
const urls = JSON.parse(urlsJSON);

// Get executable path to Chromium
let chromiumPath;
if (process.platform === "win32") {
  chromiumPath = path.join(
    process.cwd(),
    "./chromium-win/win64-1011831/chrome-win/chrome.exe"
  );
} else {
  chromiumPath = path.join(
    process.cwd(),
    "./chromium-mac/mac-1011831/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
  );
}
console.log("CHROMIUM PATH", chromiumPath);

function parseDataUrl(dataUrl) {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (matches.length !== 3) {
    throw new Error("Could not parse data URL.");
  }
  return { mime: matches[1], buffer: Buffer.from(matches[2], "base64") };
}

async function saveImage(page, folderPath, index) {
  const canvasSelector = `canvas.page`;

  await page.waitForSelector(canvasSelector);
  const canvasDataUrl = await page.evaluate((selector) => {
    const canvasElement = document.querySelector(selector);
    return canvasElement.toDataURL2();
  }, canvasSelector);
  const { buffer } = parseDataUrl(canvasDataUrl);
  await fsPromises.writeFile(
    `${folderPath}/image_${String(index).padStart(2, "0")}.png`,
    buffer,
    "base64"
  );
}

const VIEWPORT_WIDTH = 5000;
const VIEWPORT_HEIGHT = 3000;

async function scrape(url) {
  const browser = await puppeteer.launch({
    args: [
      "--disable-web-security",
      "--disable-features=IsolateOrigins",
      " --disable-site-isolation-trials",
    ],
    executablePath: chromiumPath,
  });
  const page = await browser.newPage();

  await hideHeadless(page);

  await page.setViewport({
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT,
    deviceScaleFactor: 1,
  });

  await page.evaluateOnNewDocument(() => {
    HTMLCanvasElement.prototype.toDataURL2 =
      HTMLCanvasElement.prototype.toDataURL;
  });

  await page.goto(url);

  await page.setCookie(
    {
      name: "fakku_sid",
      value: config.S_ID,
      domain: ".fakku.net",
    },
    {
      name: "fakku_zid",
      value: config.Z_ID,
      domain: ".fakku.net",
    }
  );

  await page.evaluate(() => {
    localStorage.setItem("fakku-backgroundColor", "#000000");
    localStorage.setItem("fakku-pageScalingMode", "none");
    localStorage.setItem("fakku-twoPageMode", "1");
    localStorage.setItem("fakku-uiFirstPageControlDirectionFlip", "false");
    localStorage.setItem("fakku-uiControlDirection", "rtl");
    localStorage.setItem("fakku-fitIfOverWidth", "false");
  });

  await page.goto(url);

  let count = 0;
  page.on("response", async (response) => {
    const url = response.url();
    if (url.startsWith("https://books.fakku.net/images/")) {
      count++;
    }
  });

  let numImages = 0;
  let folderPath = "";
  await (function () {
    return new Promise((resolve) => {
      page.on("response", async (response) => {
        const url = response.url();
        if (url.startsWith("https://books.fakku.net/hentai/")) {
          const json = await response.json();
          numImages = json.content.content_pages;
          folderPath = path.join(
            process.cwd(),
            `./dist/${json.content.content_name.replace(/[/\\?%*:|"<>]/g, "-")}`
          );
          await fsPromises.mkdir(folderPath, { recursive: true });
          resolve();
        }
      });
    });
  })();

  let index = 0;
  while (index < numImages) {
    await page.waitForTimeout(500);
    if (index < count) {
      try {
        console.log(`Downloading page ${index} for ${url} ...`);
        await saveImage(page, folderPath, index);
        index++;
        await page.keyboard.press("ArrowLeft");
      } catch (err) {
        console.log(`Failed to save image at index ${index}`, err);
      }
    }
  }

  await browser.close();
}

(async () => {
  for (const url of urls) {
    console.log(`Scraping ${url} ...`);
    await scrape(`${url}/read/page/1`);
  }
})();
