import "dotenv/config";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { googleConfig } from "../config/partum.config.js";
import { writeJson, nowIso } from "../src/utils.js";

/**
 * Requiere GOOGLE_APPLICATION_CREDENTIALS + GA4_PROPERTY_ID.
 * Sin credenciales, reporta el dato como no disponible.
 */
async function main() {
  if (!googleConfig.applicationCredentials || !googleConfig.ga4PropertyId) {
    console.log("GA4_PROPERTY_ID o GOOGLE_APPLICATION_CREDENTIALS no configurados. Dato no disponible.");
    await writeJson("output/analytics.json", {
      generatedAt: nowIso(),
      status: "unavailable",
      reason: "Faltan GA4_PROPERTY_ID y/o GOOGLE_APPLICATION_CREDENTIALS",
    });
    return;
  }

  const client = new BetaAnalyticsDataClient({ keyFilename: googleConfig.applicationCredentials });
  const [response] = await client.runReport({
    property: `properties/${googleConfig.ga4PropertyId}`,
    dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
    dimensions: [{ name: "pagePath" }],
    metrics: [
      { name: "sessions" },
      { name: "engagementRate" },
      { name: "averageSessionDuration" },
      { name: "bounceRate" },
    ],
    limit: 1000,
  });

  await writeJson("output/analytics.json", {
    generatedAt: nowIso(),
    status: "confirmed",
    propertyId: googleConfig.ga4PropertyId,
    rows: response.rows ?? [],
  });
  console.log(`GA4: ${response.rows?.length ?? 0} filas obtenidas.`);
}

main().catch(async (err) => {
  console.error("Error consultando GA4:", err.message);
  await writeJson("output/analytics.json", {
    generatedAt: nowIso(),
    status: "unavailable",
    reason: err.message,
  });
});
