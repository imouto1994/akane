const puppeteer = require("puppeteer");

const browserFetcher = puppeteer.createBrowserFetcher({ platform: "win64" });

(async () => {
  try {
    console.log("Downloading Chromium for Windows...");
    const revisionInfo = await browserFetcher.download("1011831");
    console.log(revisionInfo);
    console.log("Successfully downloaded Chromium for Windows!");
  } catch (err) {
    console.log("Download error", err);
  }
})();
