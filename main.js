const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const path = require("path");

const { hideHeadless } = require("./stealth");

const VIEWPORT_WIDTH = 5000;
const VIEWPORT_HEIGHT = 3000;
const URLs = [
  "https://www.fakku.net/hentai/fuyumi-san-iijima-kun-english",
  "https://www.fakku.net/hentai/dreamy-romantic-english",
  "https://www.fakku.net/hentai/dreamy-sentimentality-english",
  "https://www.fakku.net/hentai/when-you-sleep-english",
  "https://www.fakku.net/hentai/goodbye-dreams-english",
  "https://www.fakku.net/hentai/night-patrol-se-english",
  "https://www.fakku.net/hentai/airhead-ride-on-english",
  "https://www.fakku.net/hentai/tropical-escape-english",
  "https://www.fakku.net/hentai/summer-mist-english",
  "https://www.fakku.net/hentai/a-rosy-remnant-english",
  "https://www.fakku.net/hentai/their-alone-time-english",
  "https://www.fakku.net/hentai/incentive-english",
  "https://www.fakku.net/hentai/my-lovely-neighbor-english",
  "https://www.fakku.net/hentai/step-up-english-1607566985",
  "https://www.fakku.net/hentai/donbgbt-call-me-a-slave-driver-english",
  "https://www.fakku.net/hentai/steamy-magic-english",
  "https://www.fakku.net/hentai/sase-san-is-very-popular-english",
  "https://www.fakku.net/hentai/after-the-rain-english-1552023803",
  "https://www.fakku.net/hentai/models-inside-erotic-english",
  "https://www.fakku.net/hentai/if-youbgbre-going-to-eat-always-finish-your-plate-english",
  "https://www.fakku.net/hentai/her-other-faces-english",
  "https://www.fakku.net/hentai/adult-responsibilities-english",
  "https://www.fakku.net/hentai/sucre-coeur-english",
  "https://www.fakku.net/hentai/casual-lovers-english",
  "https://www.fakku.net/hentai/ember-english",
  "https://www.fakku.net/hentai/eager-english",
  "https://www.fakku.net/hentai/new-lifestyle-english-1600379283",
  "https://www.fakku.net/hentai/everyones-a-winner-english",
  "https://www.fakku.net/hentai/shelter-english-1590743251",
  "https://www.fakku.net/hentai/expected-english",
  "https://www.fakku.net/hentai/special-english",
  "https://www.fakku.net/hentai/observation-implementation-english",
  "https://www.fakku.net/hentai/folklore-english",
  "https://www.fakku.net/hentai/speechless-english",
  "https://www.fakku.net/hentai/the-beauty-in-my-life-english",
  "https://www.fakku.net/hentai/order-maid-english",
  "https://www.fakku.net/hentai/rainy-heart-english",
  "https://www.fakku.net/hentai/neighbor-warning-english",
  "https://www.fakku.net/hentai/negative-control-english",
  "https://www.fakku.net/hentai/genius-game-english",
  "https://www.fakku.net/hentai/heart-guidance-english",
  "https://www.fakku.net/hentai/gal-sexual-english",
  "https://www.fakku.net/hentai/silhouette-3-english",
  "https://www.fakku.net/hentai/intoxication-gravity-english",
  "https://www.fakku.net/hentai/dolls-after-story-english",
  "https://www.fakku.net/hentai/because-its-work-part-2-english",
  "https://www.fakku.net/hentai/because-its-work-part-1-english",
  "https://www.fakku.net/hentai/dolls-3-english",
  "https://www.fakku.net/hentai/dolls-2-english",
  "https://www.fakku.net/hentai/silhouette-2x2-english",
  "https://www.fakku.net/hentai/dolls-english",
  "https://www.fakku.net/hentai/silhouette-english",
  "https://www.fakku.net/hentai/sultry-night-english",
  "https://www.fakku.net/hentai/over-drive-english",
  "https://www.fakku.net/hentai/over-summer-english",
  "https://www.fakku.net/hentai/over-charge-english",
  "https://www.fakku.net/hentai/barren-flower-english",
  "https://www.fakku.net/hentai/forget-me-not-english-1595059331",
  "https://www.fakku.net/hentai/memory-lapse-english",
  "https://www.fakku.net/hentai/real-nature-english",
  "https://www.fakku.net/hentai/ambiguous-love-english",
  "https://www.fakku.net/hentai/sexual-entrapment-english",
  "https://www.fakku.net/hentai/aroma-trip-english",
  "https://www.fakku.net/hentai/youve-broken-me-english",
  "https://www.fakku.net/hentai/shoplifting-schoolgirl-the-unrivaled-old-man-english",
  "https://www.fakku.net/hentai/smooth-sailing-english",
  "https://www.fakku.net/hentai/dragnet-english",
  "https://www.fakku.net/hentai/maldivian-flight-english",
  "https://www.fakku.net/hentai/memories-and-regret-english",
  "https://www.fakku.net/hentai/money-money-money-second-english",
  "https://www.fakku.net/hentai/rookie-ol-morifuji-ririko-english",
  "https://www.fakku.net/hentai/stepdaughter-wolf-english",
  "https://www.fakku.net/hentai/money-money-money-english",
  "https://www.fakku.net/hentai/tomorrow-english",
  "https://www.fakku.net/hentai/please-bzb-lapu-chan-english",
  "https://www.fakku.net/hentai/please-bzb-lapu-chan-chapter-2-english",
  "https://www.fakku.net/hentai/a-night-of-body-swapping-english",
  "https://www.fakku.net/hentai/a-night-of-body-swapping-night-2-english",
  "https://www.fakku.net/hentai/a-night-of-body-swapping-night-3-english",
  "https://www.fakku.net/hentai/late-night-companion-english",
  "https://www.fakku.net/hentai/a-friend-in-heat-english",
  "https://www.fakku.net/hentai/my-master-is-a-naughty-brat-english",
  "https://www.fakku.net/hentai/you-dont-know-do-you-english",
  "https://www.fakku.net/hentai/young-masters-struggle-english",
  "https://www.fakku.net/hentai/desire-english-1538509808",
  "https://www.fakku.net/hentai/lookout-english",
  "https://www.fakku.net/hentai/bright-sex-english",
  "https://www.fakku.net/hentai/kotatsu-english",
  "https://www.fakku.net/hentai/the-day-after-that-summer-day-english",
  "https://www.fakku.net/hentai/strawberry-cake-mont-blanc-english",
  "https://www.fakku.net/hentai/youre-clueless-about-my-intentions-english",
  "https://www.fakku.net/hentai/being-toyed-with-english",
  "https://www.fakku.net/hentai/hungry-for-more-english",
  "https://www.fakku.net/hentai/soft-and-fluffy-landlady-english",
  "https://www.fakku.net/hentai/summer-blues-english",
  "https://www.fakku.net/hentai/dreaming-of-your-butt-english",
  "https://www.fakku.net/hentai/family-english",
];
const S_ID = "86cc8497d47db61f981e4bff56571624";
const Z_ID = "9df35f1d35cd08d5a24cc1c45f3f435c3d3755f1c8bab20baca85ba0e8dca8c2";

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
  await fs.writeFile(
    `${folderPath}/image_${String(index).padStart(2, "0")}.png`,
    buffer,
    "base64"
  );
}

async function scrape(url, publisher) {
  const browser = await puppeteer.launch({
    args: [
      "--disable-web-security",
      "--disable-features=IsolateOrigins",
      " --disable-site-isolation-trials",
    ],
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
      value: S_ID,
      domain: ".fakku.net",
    },
    {
      name: "fakku_zid",
      value: Z_ID,
      domain: ".fakku.net",
    }
  );

  await page.evaluate(() => {
    localStorage.setItem("fakku-backgroundColor", "#000000");
    localStorage.setItem("fakku-pageScalingMode", "none");
    localStorage.setItem("fakku-keyboardSpeed", "2");
    localStorage.setItem("fakku-twoPageMode", "0");
    localStorage.setItem("fakku-uiFirstPageControlDirectionFlip", "false");
    localStorage.setItem("fakku-uiControlDirection", "rtl");
    localStorage.setItem("fakku-dimImages", "0");
    localStorage.setItem("fakku-autoplaySpeed", "4");
    localStorage.setItem("fakku-smoothScrolling", "true");
    localStorage.setItem("fakku-fitIfOverWidth", "true");
    localStorage.setItem("fakku-overrideBackground", "true");
    localStorage.setItem("fakku-scalingQuality", "medium");
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
          folderPath = path.resolve(
            __dirname,
            `./dist/[${
              json.content.content_artists[0].attribute
            } (${publisher})] ${json.content.content_name} {${getPublisherDate(
              publisher
            )}}/[en] [uncensored]`
          );
          await fs.mkdir(folderPath, { recursive: true });
          resolve();
        }
      });
    });
  })();

  await page.screenshot({ path: "final.png" });

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

function getPublisherDate(publisher) {
  const dateRegex = new RegExp(".* (\\d*)-(\\d*).*");
  const dateMatch = publisher.match(dateRegex);

  if (dateMatch != null) {
    const year = dateMatch[1];
    const month = dateMatch[2];

    let yearNumber = parseInt(year, 10);
    let monthNumber = parseInt(month, 10);

    if (publisher.indexOf("Comic Kairakuten BEAST") !== -1) {
      if (monthNumber <= 1) {
        yearNumber -= 1;
      }
      if (monthNumber === 1) {
        monthNumber = 12;
      } else {
        monthNumber = (monthNumber - 1 + 12) % 12;
      }
      return `${yearNumber}-${String(monthNumber).padStart(2, "0")}-14`;
    } else if (publisher.indexOf("Comic Kairakuten") !== -1) {
      if (monthNumber <= 2) {
        yearNumber -= 1;
      }
      if (monthNumber === 2) {
        monthNumber = 12;
      } else {
        monthNumber = (monthNumber - 2 + 12) % 12;
      }
      return `${yearNumber}-${String(monthNumber).padStart(2, "0")}-28`;
    } else if (publisher.indexOf("Weekly Kairakuten") !== -1) {
      return `${yearNumber}-${String(monthNumber).padStart(2, "0")}-15`;
    } else if (publisher.indexOf("Comic Shitsurakuten") !== -1) {
      if (monthNumber <= 1) {
        yearNumber -= 1;
      }
      if (monthNumber === 1) {
        monthNumber = 12;
      } else {
        monthNumber = (monthNumber - 1 + 12) % 12;
      }
      return `${yearNumber}-${String(monthNumber).padStart(2, "0")}-19`;
    } else if (publisher.indexOf("Comic Bavel") !== -1) {
      if (monthNumber <= 2) {
        yearNumber -= 1;
      }
      if (monthNumber === 2) {
        monthNumber = 12;
      } else {
        monthNumber = (monthNumber - 2 + 12) % 12;
      }
      return `${yearNumber}-${String(monthNumber).padStart(2, "0")}-22`;
    }
  }

  const issueRegex = new RegExp(".* #(\\d*)");
  const issueMatch = publisher.match(issueRegex);
  if (issueMatch != null) {
    const issue = issueMatch[1];

    if (publisher.indexOf("Comic X-Eros") !== -1) {
      return "";
    }
  }

  return "";
}

async function getPublisher(url) {
  const browser = await puppeteer.launch({
    args: [
      "--disable-web-security",
      "--disable-features=IsolateOrigins",
      " --disable-site-isolation-trials",
    ],
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
      value: S_ID,
      domain: ".fakku.net",
    },
    {
      name: "fakku_zid",
      value: Z_ID,
      domain: ".fakku.net",
    }
  );

  await page.goto(url);

  await page.waitForSelector(".table-cell.link\\:text-blue-700 a");
  const infoElements = await page.$$(".table-cell.link\\:text-blue-700 a");
  const publisher = await infoElements[2].evaluate((el) => el.textContent);

  await browser.close();

  return publisher.trim();
}

(async () => {
  for (const url of URLs) {
    console.log(`Extracting publisher...`);
    const publisher = await getPublisher(url);
    const publisherDate = getPublisherDate(publisher);
    if (publisherDate == null) {
      console.log("URL with no recognized publisher", url);
      continue;
    }
    console.log(`Scraping ${url} ...`);
    await scrape(`${url}/read/page/1`, publisher);
  }
})();
