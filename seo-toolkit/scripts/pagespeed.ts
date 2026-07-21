import "dotenv/config";
import { partumConfig, googleConfig } from "../config/partum.config.js";
import { writeJson, nowIso } from "../src/utils.js";

/** Usage: tsx scripts/pagespeed.ts <url> [mobile|desktop] — requiere PAGESPEED_API_KEY */
async function main() {
  const url = process.argv[2] ?? partumConfig.startUrl;
  const strategy = process.argv[3] ?? partumConfig.device;

  if (!googleConfig.pagespeedApiKey) {
    console.log("PAGESPEED_API_KEY no configurado. Dato no disponible.");
    await writeJson("output/pagespeed.json", {
      generatedAt: nowIso(),
      status: "unavailable",
      reason: "Falta PAGESPEED_API_KEY",
    });
    return;
  }

  const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  apiUrl.searchParams.set("url", url);
  apiUrl.searchParams.set("strategy", strategy);
  apiUrl.searchParams.set("key", googleConfig.pagespeedApiKey);
  ["performance", "accessibility", "best-practices", "seo"].forEach((c) =>
    apiUrl.searchParams.append("category", c)
  );

  const res = await fetch(apiUrl.toString());
  if (!res.ok) {
    const text = await res.text();
    await writeJson("output/pagespeed.json", {
      generatedAt: nowIso(),
      status: "unavailable",
      reason: `HTTP ${res.status}: ${text.slice(0, 300)}`,
    });
    console.error(`PageSpeed API fallo: HTTP ${res.status}`);
    return;
  }

  const data = await res.json();
  await writeJson("output/pagespeed.json", { generatedAt: nowIso(), status: "confirmed", url, strategy, data });
  console.log(`PageSpeed Insights obtenido para ${url} (${strategy}).`);
}

main();
