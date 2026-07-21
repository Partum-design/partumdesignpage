import "dotenv/config";
import { partumConfig } from "../config/partum.config.js";
import { crawlSite } from "../src/crawler.js";
import { writeJson, writeCsv, nowIso } from "../src/utils.js";

async function main() {
  console.log(`Crawling ${partumConfig.startUrl} (maxPages=${partumConfig.maxPages}, maxDepth=${partumConfig.maxDepth})`);
  const pages = await crawlSite(partumConfig);
  const outFile = `${partumConfig.outputDir}/crawl`;
  await writeJson(`${outFile}.json`, { generatedAt: nowIso(), config: partumConfig, pages });
  await writeCsv(`${outFile}.csv`, pages as unknown as Record<string, unknown>[]);
  console.log(`Paginas visitadas: ${pages.length}`);
  console.log(`Resultado: ${outFile}.json / .csv`);
}

main();
