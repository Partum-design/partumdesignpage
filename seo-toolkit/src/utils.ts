import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function normalizeUrl(url: string, base?: string): string | null {
  try {
    const u = new URL(url, base);
    u.hash = "";
    return u.toString();
  } catch {
    return null;
  }
}

export function isSameSite(url: string, siteUrl: string, includeSubdomains: boolean): boolean {
  try {
    const target = new URL(url);
    const site = new URL(siteUrl);
    if (includeSubdomains) {
      return target.hostname === site.hostname || target.hostname.endsWith(`.${site.hostname}`);
    }
    return target.hostname === site.hostname;
  } catch {
    return false;
  }
}

export async function writeJson(path: string, data: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2), "utf-8");
}

export async function writeCsv(path: string, rows: Record<string, unknown>[]): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  if (rows.length === 0) {
    await writeFile(path, "", "utf-8");
    return;
  }
  const headers = Object.keys(rows[0]);
  const escape = (val: unknown) => {
    const s = String(val ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ];
  await writeFile(path, lines.join("\n"), "utf-8");
}
