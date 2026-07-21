import "dotenv/config";
import { google } from "googleapis";
import { googleConfig } from "../config/partum.config.js";
import { writeJson, nowIso } from "../src/utils.js";

/**
 * Requiere GOOGLE_APPLICATION_CREDENTIALS apuntando a un service account
 * con acceso de lectura al sitio en Search Console (ver README para pasos).
 * Sin credenciales, reporta el dato como no disponible en vez de fallar en silencio.
 */
async function main() {
  if (!googleConfig.applicationCredentials) {
    console.log("GOOGLE_APPLICATION_CREDENTIALS no configurado. Dato no disponible.");
    await writeJson("output/search-console.json", {
      generatedAt: nowIso(),
      status: "unavailable",
      reason: "Sin credenciales configuradas (GOOGLE_APPLICATION_CREDENTIALS)",
    });
    return;
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: googleConfig.applicationCredentials,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
  const webmasters = google.webmasters({ version: "v3", auth });

  const siteUrl = googleConfig.searchConsoleSiteUrl;
  const endDate = new Date().toISOString().slice(0, 10);
  const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const res = await webmasters.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["page", "query"],
      rowLimit: 1000,
    },
  });

  await writeJson("output/search-console.json", {
    generatedAt: nowIso(),
    status: "confirmed",
    siteUrl,
    startDate,
    endDate,
    rows: res.data.rows ?? [],
  });
  console.log(`Search Console: ${res.data.rows?.length ?? 0} filas obtenidas.`);
}

main().catch(async (err) => {
  console.error("Error consultando Search Console:", err.message);
  await writeJson("output/search-console.json", {
    generatedAt: nowIso(),
    status: "unavailable",
    reason: err.message,
  });
});
