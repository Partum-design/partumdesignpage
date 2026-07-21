import "dotenv/config";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import { chromium } from "playwright";
import { partumConfig } from "../config/partum.config.js";
import { writeJson, nowIso } from "../src/utils.js";

/**
 * chrome-launcher needs CHROME_PATH when no system Chrome/Chromium is installed.
 * Fall back to Playwright's managed Chromium binary (installed via `npx playwright install chromium`).
 */
if (!process.env.CHROME_PATH) {
  process.env.CHROME_PATH = chromium.executablePath();
}

/** Usage: tsx scripts/lighthouse.ts <url> [mobile|desktop] */
async function main() {
  const url = process.argv[2] ?? partumConfig.startUrl;
  const device = (process.argv[3] as "mobile" | "desktop") ?? partumConfig.device;

  const chrome = await launch({ chromeFlags: ["--headless=new", "--no-sandbox"] });
  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: "json",
      formFactor: device,
      screenEmulation:
        device === "mobile"
          ? { mobile: true, width: 390, height: 844, deviceScaleFactor: 3, disabled: false }
          : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
    });

    if (!result) throw new Error("Lighthouse no devolvio resultado");

    const { categories, audits } = result.lhr;
    const summary = {
      url,
      device,
      generatedAt: nowIso(),
      scores: Object.fromEntries(Object.entries(categories).map(([k, v]) => [k, v.score])),
      metrics: {
        LCP: audits["largest-contentful-paint"]?.displayValue,
        CLS: audits["cumulative-layout-shift"]?.displayValue,
        TBT: audits["total-blocking-time"]?.displayValue,
        FCP: audits["first-contentful-paint"]?.displayValue,
        TTFB: audits["server-response-time"]?.displayValue,
        INP: audits["interaction-to-next-paint"]?.displayValue,
      },
    };

    console.log(JSON.stringify(summary, null, 2));
    const safeName = url.replace(/https?:\/\//, "").replace(/[^a-z0-9]/gi, "_");
    await writeJson(`${partumConfig.outputDir}/lighthouse-${safeName}-${device}.json`, result.lhr);
    await writeJson(`${partumConfig.outputDir}/lighthouse-${safeName}-${device}-summary.json`, summary);
  } finally {
    await chrome.kill();
  }
}

main();
