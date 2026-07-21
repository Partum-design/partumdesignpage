import "dotenv/config";
import { partumConfig, googleConfig } from "../config/partum.config.js";

async function checkFetch(): Promise<string> {
  try {
    const res = await fetch("https://example.com", { method: "HEAD" });
    return `OK (status ${res.status})`;
  } catch (err) {
    return `FAIL (${(err as Error).message})`;
  }
}

async function main() {
  console.log("=== Partum SEO Toolkit — doctor ===\n");

  console.log("Config activa:");
  console.log(`  startUrl: ${partumConfig.startUrl}`);
  console.log(`  maxPages: ${partumConfig.maxPages}`);
  console.log(`  maxDepth: ${partumConfig.maxDepth}`);
  console.log(`  concurrency: ${partumConfig.concurrency}`);
  console.log(`  delayMs: ${partumConfig.delayMs}`);
  console.log(`  userAgent: ${partumConfig.userAgent}`);
  console.log(`  device: ${partumConfig.device}`);
  console.log(`  outputDir: ${partumConfig.outputDir}\n`);

  console.log("Conectividad saliente (HEAD https://example.com):");
  console.log(`  ${await checkFetch()}\n`);

  console.log("Credenciales opcionales (no se validan contra la API, solo presencia):");
  console.log(`  GOOGLE_APPLICATION_CREDENTIALS: ${googleConfig.applicationCredentials ? "presente" : "ausente"}`);
  console.log(`  GA4_PROPERTY_ID: ${googleConfig.ga4PropertyId ? "presente" : "ausente"}`);
  console.log(`  PAGESPEED_API_KEY: ${googleConfig.pagespeedApiKey ? "presente" : "ausente"}`);
  console.log(`  CRUX_API_KEY: ${googleConfig.cruxApiKey ? "presente" : "ausente"}\n`);

  console.log("Node:", process.version);
  console.log("Plataforma:", process.platform, process.arch);
  console.log("\nDoctor completo. Ningun dato del sitio fue modificado.");
}

main();
