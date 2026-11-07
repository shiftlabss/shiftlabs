import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const fallbackSiteUrl = "https://shiftlabs.sh";

const publicDir = path.resolve(process.cwd(), "public");
const rawSiteUrl = process.env.VITE_SITE_URL ?? process.env.SITE_URL ?? fallbackSiteUrl;
const siteUrl = rawSiteUrl.trim().replace(/\/+$/, "");
const nowDate = new Date().toISOString().slice(0, 10);

function buildSitemapUrl(loc, priority) {
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    `    <xhtml:link rel="alternate" hreflang="pt-BR" href="${siteUrl}/" />`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />`,
    `    <lastmod>${nowDate}</lastmod>`,
    "    <changefreq>weekly</changefreq>",
    `    <priority>${priority}</priority>`,
    "  </url>",
  ];
}

function buildSitemapXml() {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...buildSitemapUrl(`${siteUrl}/`, "1.0"),
    ...buildSitemapUrl(`${siteUrl}/en`, "0.9"),
    "</urlset>",
    "",
  ].join("\n");
}

function buildRobotsTxt() {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${siteUrl}/sitemap.xml`, ""].join("\n");
}

async function run() {
  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, "sitemap.xml"), buildSitemapXml(), "utf8");
  await writeFile(path.join(publicDir, "robots.txt"), buildRobotsTxt(), "utf8");
  console.log("[seo] sitemap.xml e robots.txt atualizados.");
}

run().catch((error) => {
  console.error("[seo] Falha ao gerar arquivos de SEO:", error);
  process.exit(1);
});
